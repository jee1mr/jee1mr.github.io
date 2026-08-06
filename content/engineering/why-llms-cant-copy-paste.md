+++
date = 2026-08-06
draft = false
title = "Why Your LLM Agent Can't Copy-Paste (And How to Fix It)"
tags = ['LLM', 'Claude Code', 'MCP', 'Agents', 'Performance']
+++

I use Claude Code extensively to automate the boring and repetitive admin tasks in my life. On one such adventure last week, I built something that might be of use to others.

I was using CC to generate a PDF invoice based on some rules I have in my `CLAUDE.md`. I used to then attach this PDF to an email and send it over. I wanted to take it a step further and asked it to create the draft email with the PDF already attached. Since I was already connected and authorised with the Google Workspace MCP server, I thought it would be straightforward — but it took almost 10–15 minutes and it wasn't even done yet.

I got suspicious, cancelled the tool call, and asked it why it had been *Flibbertigibbeting* for so long.

> Fair question — and the honest answer is that Gmail isn't the slow part. I hadn't actually made the Gmail call yet.
>
> What ate the time was me preparing the attachment: `create_draft` only accepts attachments as inline base64 (no file path), so I encoded the PDF, then read all 19,473 characters of base64 into context — and to actually create the draft I'd have to re-type that entire blob back out in the tool call. That's ~7K tokens of output, generated one token at a time. Slow, and one slipped character corrupts the PDF.
>
> Reading the base64 into context was the wasteful step — I didn't need to see it to pass it, and there's no way to hand the tool a path.

There you go.

### 🐌 What was actually slow

The Gmail MCP tool doesn't support a file path as an attachment. It expects the attachment as a base64-encoded string:

```
create_draft({
  to:          ["client@example.com"],
  subject:     "July 2026 Invoice",
  attachments: [{ content: "JVBERi0xLjQKMSAwIG9iago8PA..." }]
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
                              the entire file, as text
})
```

A PDF is binary and JSON only holds text, so the bytes get re-encoded into safe printable characters. That's a 33% size tax right away:

```
invoice.pdf ──base64──▶ "JVBERi0xLjQKMSAwIG9iago8..."
 14,604 bytes                 19,472 characters
```

19,472 characters isn't a lot of data. So why did it take minutes?

Because of the way an LLM works. **A tool call is just text the model generates.** And when an LLM generates text, it has to do it one token at a time — every new token needs a full pass over what it has produced so far. Base64 is high-entropy, random-looking mixed case and digits, so it tokenizes badly: roughly 3 characters per token.

```
19,472 chars ÷ 3 ≈ 6,500 tokens ──▶ generated strictly one after another
```

That's minutes of typing. And base64 has zero redundancy — every single character matters. One slipped token gives you a corrupt PDF that still *looks* attached. Nobody notices until the client clicks it.

### 🔁 Tool calls are just text

This is the bit worth internalising, because it explains everything else. The model runs on a server. Your agent is a thin shell around it:

```
   YOUR MACHINE                 MODEL SERVER
   ────────────                 ────────────

   Claude Code ─── context ───▶  the model
                                     │
                                     │  generate response
                                     ▼
   Claude Code ◀──── text ─────  "create_draft({...})"
        │
        │ parse the text, find the tool call
        ▼
     run the tool
```

There is no separate binary channel for attachments. To attach that PDF, the model has to **type all 19,472 characters itself**, as ordinary output, over the network.

And you can't be clever about it. I tried running `base64` on the file first and reading the result into context — that does nothing. A model has no copy primitive. Having text in context doesn't let you *move* it to the output; every output token still goes through a full forward pass. "Copy this verbatim" and "write something new" are the same operation as far as the architecture is concerned.

That didn't sit right with me. There had to be a better way — something like an actual copy-paste, happening on my Mac, instead of the model retyping the file on a server somewhere.

The obvious fix was to cut the LLM out of this entirely with a script. But that meant skipping the MCP and going with the Gmail API + OAuth, or IMAP + an app password. I ain't got time for that, and I didn't want to give up on the MCP either.

### 💡 Move references, not contents

Here's what I landed on:

1. Instead of passing the full base64 content, the model passes a **reference** — the file path.
2. A `PreToolUse` hook — a script that runs locally *after* the model writes the tool call but *before* the tool executes — swaps that reference for the real base64.

Claude Code hooks can rewrite tool arguments by returning an `updatedInput` field. That's the hinge the whole thing turns on.

```
BEFORE ─────────────────────────────────────────────────────────

  me ──▶ "content": "JVBERi0xLjQKMSAwIG9iag...(19,472 chars)" ──▶ Gmail
         └────────── ~6,500 tokens, minutes, corruptible ─────────┘


AFTER ──────────────────────────────────────────────────────────

  me ──▶ "content": "{{file:/Users/.../INV-2026-07.pdf}}"
                     └───────── 70 chars, instant ─────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │  hook, on YOUR MAC    │
                         │                       │
  INV-2026-07.pdf ──────▶│  read bytes           │
     (from disk)         │  encode to base64     │
                         │  infer filename+mime  │
                         └───────────┬───────────┘
                                     │ updatedInput
                                     ▼
                     "content":  "JVBERi0xLjQKMSAwIG9iag..."
                     "filename": "INV-2026-07.pdf"
                     "mimeType": "application/pdf"
                                     │
                                     ▼
                                   Gmail
```

The 19,472 characters still exist. They just never touch the model — they go disk → hook → Gmail, entirely on my machine.

### 🪝 The hook

Register it in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__.*",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/scripts/expand-file-refs.py"
          }
        ]
      }
    ]
  }
}
```

The matcher is `mcp__.*` and not `.*` on purpose — it skips the file and shell tools you're calling constantly, so there's no overhead on the hot path.

The script reads the hook payload on stdin and writes a decision on stdout. The core of it:

```python
PLACEHOLDER = re.compile(r"\{\{file:(.+?)\}\}")
MAX_BYTES = 20 * 1024 * 1024

def encode(path):
    path = os.path.expanduser(path.strip())
    if not os.path.isfile(path):
        raise FileNotFoundError(path)
    if os.path.getsize(path) > MAX_BYTES:
        raise ValueError(f"{path} is too large to inline")

    with open(path, "rb") as fh:
        blob = base64.b64encode(fh.read()).decode("ascii")

    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    return blob, os.path.basename(path), mime
```

Then walk the tool input, expand any placeholder you find, and hand back the rewritten arguments:

```python
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "allow",
        "updatedInput": updated,
    }
}))
```

Three things here matter more than the happy path:

- **Missing or oversized file** → return `permissionDecision: "deny"`. Never let a broken placeholder reach the server dressed up as real data.
- **No placeholder present** → return `{}` and get out of the way. A hook that fires on every MCP call has to be harmless on every MCP call.
- **Log every expansion.** A hook that silently rewrites arguments is invisible when it works and baffling when it doesn't. The log is how you prove it fired:

```
2026-07-31T11:22:17  OK  mcp__..._create_draft  invoice.pdf -> 19472 chars base64
```

That last one earned its keep immediately. When the draft finally showed up, that log line was the difference between "it worked" and "it appears to have worked".

The full script is [here as a gist](https://gist.github.com/jee1mr/c01139bfe87459b789aba31f8e160d39) — about 140 lines of Python, no dependencies.

### 📊 What changed

```
                        before          after
  characters emitted    19,472          70
  tokens                ~6,500          ~25
  wall time             minutes         instant
  corruption risk       real            zero
  bytes sent to server  14,604          none
```

And because the hook matches all MCP tools, any other connector with the same inline-content limitation is already covered by the same placeholder.

### 🔒 The privacy part

That last row deserves more than a mention: **the invoice never leaves my machine now.** Before, the file was being generated on my disk, encoded, and then retyped by a model running on someone else's server. Now the bytes go disk → hook → Gmail, and nothing in the middle ever sees them.

For an invoice that's a nice-to-have. For medical records, contracts, or customer data, it's the difference between a workable design and a non-starter. If you'd rather a file didn't hit Anthropic's servers at all, this is one way to do it.

### 🧠 Bonus: why reading is fast but writing is slow

There's a fact hiding in all this that's worth knowing on its own, because it'll make you a better-informed LLM user: handing a model 19,472 characters is fast, and making it produce the same 19,472 characters is slow. Same data, same model, two orders of magnitude apart.

It comes down to one question: **does this piece need the previous piece to exist first?**

When you hand a model text that already exists, every character is known. Nothing waits on anything:

```
READING (prefill)  —  all positions computed at once

  "J"  "V"  "B"  "E"  "R"  "i"  "0"  "x"  ...  19,472 chars
   │    │    │    │    │    │    │    │
   ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼
  ████████████████████████████████████   ONE pass over everything
```

That's a matrix multiply across the whole sequence — exactly the shape GPUs are built for. Thousands of cores busy at once.

Generating is the opposite. Token 2 is picked based on token 1, so token 1 has to exist before token 2 can be computed. Nothing can run ahead:

```
WRITING (decode)  —  strictly one at a time

  pass 1: ████  ──▶ "J"
  pass 2: ████  ──▶ "V"     (needs "J" first)
  pass 3: ████  ──▶ "B"     (needs "JV" first)
  pass 4: ████  ──▶ "E"     (needs "JVB" first)
   ...
  pass 6,500: ████ ──▶ done
```

Each pass runs the entire model to emit **one token**. It's wasteful in a specific way: the GPU pulls every model weight out of memory just to produce one character's worth of output. The hardware spends most of its time waiting on memory, not doing math.

To be precise, those passes aren't re-reading the whole context each time — every token's keys and values are computed once and kept in the KV cache, so token 6,500 attends against stored state instead of recomputing 6,499 predecessors. Without that, generation would be quadratic and hopeless. The cost isn't "re-read everything", it's "run the full model weights once, to produce one token". Still one pass each, still strictly serial.

The everyday version: reading a page of text is a glance, copying that same page out by hand is a chore. Identical information, completely different cost — because your eyes parallelize and your hand doesn't.

### 🎯 The takeaway

The specific fix is a 60-line script. The general lesson is worth more than the script:

> **Move references, not contents.**
>
> Any tool that takes file *contents* as a parameter puts the model in the data path. Any tool that takes a *path*, an ID, or a URL does not.

If you're designing a tool for an agent, ask whether the model actually needs to be in the data path. Almost always it doesn't — it needs to decide *which* file, not carry the file. Take a path. Take an ID. Take a URL. Anything but the bytes.

And when you're stuck with a tool that got this wrong, you don't have to just accept it. Hooks let you fix the interface from the outside — rewrite the call on its way out, keep the heavy data local, and let the model do what it's actually good for: deciding what should happen, not shuttling bytes around.

Hope that helped!
