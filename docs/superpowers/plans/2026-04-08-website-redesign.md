# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hugo blog at jeevanmr.com with an immersive Astro-based narrative scroll portfolio with adaptive color palette.

**Architecture:** Astro static site with GSAP ScrollTrigger for homepage scroll animations. Content lives in Astro content collections (markdown). Homepage is a single-page cinematic scroll; inner pages are clean editorial layouts. GitHub Pages deployment via GitHub Actions.

**Tech Stack:** Astro 5, GSAP 3 + ScrollTrigger, @fontsource fonts (Space Grotesk, Inter, Source Serif 4, JetBrains Mono), Shiki (syntax highlighting), Giscus (comments)

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro` (placeholder)
- Create: `.gitignore` (replace existing)
- Remove: `hugo.toml`, `go.mod`, `go.sum`, `archetypes/`, `themes/`, `layouts/`, `.gitmodules`

- [ ] **Step 1: Initialize Astro project in a clean branch**

```bash
cd /Users/jrajarama/me/projects/jee1mr.github.io
git checkout -b redesign
```

- [ ] **Step 2: Install Astro and dependencies**

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
npm install
npm install gsap @astrojs/sitemap @astrojs/rss
npm install @fontsource/space-grotesk @fontsource/inter @fontsource-variable/source-serif-4 @fontsource/jetbrains-mono
```

- [ ] **Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jeevanmr.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
```

- [ ] **Step 4: Update .gitignore**

Replace `.gitignore` with:

```
node_modules/
dist/
.astro/
.DS_Store
.superpowers/
```

- [ ] **Step 5: Create placeholder index page**

Write `src/pages/index.astro`:

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Jeevan M R</title>
  </head>
  <body>
    <h1>Jeevan M R</h1>
    <p>Refactoring life, one commit at a time.</p>
  </body>
</html>
```

- [ ] **Step 6: Verify dev server runs**

```bash
npm run dev
```

Expected: Server starts at localhost:4321, placeholder page renders.

- [ ] **Step 7: Remove Hugo files**

```bash
rm -f hugo.toml go.mod go.sum
rm -rf archetypes/ themes/ layouts/ .gitmodules
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project, remove Hugo"
```

---

## Task 2: Global Styles, Fonts, and Design Tokens

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/chapters.css`

- [ ] **Step 1: Create global.css with reset, typography, and base tokens**

Write `src/styles/global.css`:

```css
/* Fonts */
@import '@fontsource/space-grotesk/500.css';
@import '@fontsource/space-grotesk/700.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource-variable/source-serif-4';
@import '@fontsource/jetbrains-mono/400.css';

/* Reset */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.7;
  color: var(--text);
  background-color: var(--bg);
  transition: color 0.1s, background-color 0.1s;
}

/* Fluid type scale */
h1 {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
  font-size: clamp(2.5rem, 2rem + 2.5vw, 5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

h2 {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
  font-size: clamp(1.8rem, 1.5rem + 1.5vw, 3rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

h3 {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 500;
  font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  line-height: 1.3;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
}

/* Essay body text */
.prose {
  font-family: 'Source Serif 4 Variable', Georgia, serif;
  font-size: clamp(1.05rem, 1rem + 0.25vw, 1.2rem);
  line-height: 1.8;
  max-width: 680px;
  margin: 0 auto;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose h2,
.prose h3 {
  margin-top: 2em;
  margin-bottom: 0.75em;
}

.prose blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1.25em;
  margin: 1.5em 0;
  font-style: italic;
  color: var(--text-muted, #666);
}

.prose pre {
  border-radius: 8px;
  padding: 1.25em;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose img {
  max-width: 100%;
  border-radius: 8px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Create chapters.css with per-chapter color tokens**

Write `src/styles/chapters.css`:

```css
/* Default (Hero) */
:root {
  --bg: #faf8f1;
  --text: #2a2a2a;
  --text-muted: #777;
  --accent: #b8860b;
}

/* Chapter token sets — applied via GSAP interpolation, defined here for reference */
[data-chapter="hero"] {
  --bg: #faf8f1;
  --text: #2a2a2a;
  --text-muted: #777;
  --accent: #b8860b;
}

[data-chapter="why-i-code"] {
  --bg: #e8f0e0;
  --text: #1a2e1a;
  --text-muted: #5b7a4a;
  --accent: #5b8a3c;
}

[data-chapter="projects"] {
  --bg: #dbe8f4;
  --text: #1a2a3e;
  --text-muted: #4a6a8a;
  --accent: #2563eb;
}

[data-chapter="essays"] {
  --bg: #d8d0e8;
  --text: #2a1a3e;
  --text-muted: #6a5a8a;
  --accent: #7c3aed;
}

[data-chapter="future"] {
  --bg: #1a1a2e;
  --text: #e0e0e0;
  --text-muted: #999;
  --accent: #f59e0b;
}
```

- [ ] **Step 3: Verify fonts load by updating placeholder index**

Update `src/pages/index.astro`:

```astro
---
import '../styles/global.css';
import '../styles/chapters.css';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Jeevan M R</title>
  </head>
  <body>
    <h1>Jeevan M R</h1>
    <p>Refactoring life, one commit at a time.</p>
    <h2 style="margin-top:2rem;">Space Grotesk heading</h2>
    <p class="prose">Source Serif body text for essays.</p>
    <code>JetBrains Mono code</code>
  </body>
</html>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Each text element renders in its correct font. Check DevTools → Computed → font-family.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/styles/chapters.css src/pages/index.astro
git commit -m "feat: add global styles, typography, and chapter color tokens"
```

---

## Task 3: Base Layouts

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/ScrollLayout.astro`

- [ ] **Step 1: Create BaseLayout with head, meta, fonts**

Write `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import '../styles/chapters.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = 'Jeevan M R — Philosopher-Engineer. Refactoring life, one commit at a time.',
  ogImage = '/og-image.png',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />

    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, Astro.site)} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL(ogImage, Astro.site)} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Create ScrollLayout (homepage — no header, includes GSAP)**

Write `src/layouts/ScrollLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <main id="scroll-container">
    <slot />
  </main>
  <script>
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    gsap.registerPlugin(ScrollTrigger);

    // Make available globally for component scripts
    window.__gsap = gsap;
    window.__ScrollTrigger = ScrollTrigger;
  </script>
</BaseLayout>
```

- [ ] **Step 3: Update index.astro to use ScrollLayout**

Replace `src/pages/index.astro`:

```astro
---
import ScrollLayout from '../layouts/ScrollLayout.astro';
---
<ScrollLayout title="Jeevan M R — Philosopher-Engineer">
  <section style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div>
      <h1>Jeevan M R</h1>
      <p>Refactoring life, one commit at a time.</p>
    </div>
  </section>
</ScrollLayout>
```

- [ ] **Step 4: Verify dev server**

```bash
npm run dev
```

Expected: Page renders with correct meta tags (check View Source). No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/ src/pages/index.astro
git commit -m "feat: add BaseLayout and ScrollLayout with SEO meta tags"
```

---

## Task 4: Chapter Component and Color Interpolation

**Files:**
- Create: `src/components/scroll/Chapter.astro`
- Create: `src/scripts/scroll-animations.ts`

- [ ] **Step 1: Create Chapter wrapper component**

Write `src/components/scroll/Chapter.astro`:

```astro
---
interface Props {
  id: string;
  chapter: 'hero' | 'why-i-code' | 'projects' | 'essays' | 'future';
  class?: string;
}

const { id, chapter, class: className = '' } = Astro.props;
---
<section
  id={id}
  data-chapter={chapter}
  class:list={['chapter', className]}
>
  <div class="chapter-inner">
    <slot />
  </div>
</section>

<style>
  .chapter {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 4rem 2rem;
  }

  .chapter-inner {
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 2: Create scroll animation script with color interpolation**

Write `src/scripts/scroll-animations.ts`:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ChapterColors {
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
}

const chapterColors: Record<string, ChapterColors> = {
  hero: { bg: '#faf8f1', text: '#2a2a2a', textMuted: '#777', accent: '#b8860b' },
  'why-i-code': { bg: '#e8f0e0', text: '#1a2e1a', textMuted: '#5b7a4a', accent: '#5b8a3c' },
  projects: { bg: '#dbe8f4', text: '#1a2a3e', textMuted: '#4a6a8a', accent: '#2563eb' },
  essays: { bg: '#d8d0e8', text: '#2a1a3e', textMuted: '#6a5a8a', accent: '#7c3aed' },
  future: { bg: '#1a1a2e', text: '#e0e0e0', textMuted: '#999', accent: '#f59e0b' },
};

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function interpolateColor(color1: string, color2: string, progress: number): string {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  return rgbToHex(
    r1 + (r2 - r1) * progress,
    g1 + (g2 - g1) * progress,
    b1 + (b2 - b1) * progress,
  );
}

export function initColorTransitions() {
  const chapters = document.querySelectorAll<HTMLElement>('[data-chapter]');
  const chapterList = Array.from(chapters);

  chapterList.forEach((chapter, index) => {
    if (index === 0) return; // Hero starts with default colors

    const currentName = chapter.dataset.chapter!;
    const prevName = chapterList[index - 1].dataset.chapter!;
    const from = chapterColors[prevName];
    const to = chapterColors[currentName];

    if (!from || !to) return;

    ScrollTrigger.create({
      trigger: chapter,
      start: 'top bottom',
      end: 'top center',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        document.documentElement.style.setProperty('--bg', interpolateColor(from.bg, to.bg, p));
        document.documentElement.style.setProperty('--text', interpolateColor(from.text, to.text, p));
        document.documentElement.style.setProperty('--text-muted', interpolateColor(from.textMuted, to.textMuted, p));
        document.documentElement.style.setProperty('--accent', interpolateColor(from.accent, to.accent, p));
      },
    });
  });
}

export function initFadeIns() {
  gsap.utils.toArray<HTMLElement>('.fade-in').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}
```

- [ ] **Step 3: Build test page with multiple chapters**

Replace `src/pages/index.astro`:

```astro
---
import ScrollLayout from '../layouts/ScrollLayout.astro';
import Chapter from '../components/scroll/Chapter.astro';
---
<ScrollLayout title="Jeevan M R — Philosopher-Engineer">
  <Chapter id="hero" chapter="hero">
    <h1>Jeevan M R</h1>
    <p>Refactoring life, one commit at a time.</p>
  </Chapter>

  <Chapter id="why-i-code" chapter="why-i-code">
    <h2 class="fade-in">Why I Code</h2>
    <p class="fade-in">The feedback loop that hooked me.</p>
  </Chapter>

  <Chapter id="projects" chapter="projects">
    <h2 class="fade-in">What I've Built</h2>
    <p class="fade-in">Systems, tools, experiments.</p>
  </Chapter>

  <Chapter id="essays" chapter="essays">
    <h2 class="fade-in">How I Think</h2>
    <p class="fade-in">The philosopher side.</p>
  </Chapter>

  <Chapter id="future" chapter="future">
    <h2 class="fade-in">What's Next</h2>
    <p class="fade-in">Let's build something together.</p>
  </Chapter>
</ScrollLayout>

<script>
  import { initColorTransitions, initFadeIns } from '../scripts/scroll-animations';
  initColorTransitions();
  initFadeIns();
</script>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Scrolling through sections causes smooth background/text color transitions. Elements with `fade-in` class animate in when they enter the viewport.

- [ ] **Step 5: Commit**

```bash
git add src/components/scroll/Chapter.astro src/scripts/scroll-animations.ts src/pages/index.astro
git commit -m "feat: add Chapter component with GSAP scroll-driven color interpolation"
```

---

## Task 5: Hero Section

**Files:**
- Create: `src/components/scroll/Hero.astro`
- Modify: `src/scripts/scroll-animations.ts` (add hero animation)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Hero component**

Write `src/components/scroll/Hero.astro`:

```astro
---
---
<section id="hero" data-chapter="hero" class="hero">
  <div class="hero-content">
    <h1 class="hero-name" aria-label="Jeevan M R">
      <span class="hero-name-line">Jeevan</span>
      <span class="hero-name-line">M R</span>
    </h1>
    <p class="hero-tagline">Refactoring life, one commit at a time.</p>
  </div>
  <div class="scroll-cue" aria-hidden="true">
    <span class="scroll-cue-text">scroll</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </div>
  <div class="grain" aria-hidden="true"></div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 2rem;
  }

  .hero-content {
    text-align: center;
  }

  .hero-name {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
  }

  .hero-name-line {
    display: block;
    opacity: 0;
  }

  .hero-tagline {
    margin-top: 1.5rem;
    font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
    color: var(--text-muted);
    opacity: 0;
    font-style: italic;
  }

  .scroll-cue {
    position: absolute;
    bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
    opacity: 0;
  }

  .scroll-cue-text {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  /* Film grain overlay */
  .grain {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
```

- [ ] **Step 2: Add hero animation to scroll-animations.ts**

Add this function to the end of `src/scripts/scroll-animations.ts`:

```ts
export function initHeroAnimation() {
  const nameLines = document.querySelectorAll('.hero-name-line');
  const tagline = document.querySelector('.hero-tagline');
  const scrollCue = document.querySelector('.scroll-cue');

  if (!nameLines.length) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(nameLines, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
  })
  .to(tagline, {
    opacity: 1,
    duration: 0.6,
  }, '-=0.2')
  .to(scrollCue, {
    opacity: 1,
    duration: 0.4,
  }, '+=0.5');

  // Set initial state
  gsap.set(nameLines, { opacity: 0, y: 20 });
  gsap.set(tagline, { opacity: 0 });
  gsap.set(scrollCue, { opacity: 0 });

  // Fade scroll cue on scroll
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: '20% top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set(scrollCue, { opacity: 1 - self.progress });
    },
  });
}
```

- [ ] **Step 3: Update index.astro to use Hero component**

Replace the hero Chapter in `src/pages/index.astro`:

```astro
---
import ScrollLayout from '../layouts/ScrollLayout.astro';
import Hero from '../components/scroll/Hero.astro';
import Chapter from '../components/scroll/Chapter.astro';
---
<ScrollLayout title="Jeevan M R — Philosopher-Engineer">
  <Hero />

  <Chapter id="why-i-code" chapter="why-i-code">
    <h2 class="fade-in">Why I Code</h2>
    <p class="fade-in">The feedback loop that hooked me.</p>
  </Chapter>

  <Chapter id="projects" chapter="projects">
    <h2 class="fade-in">What I've Built</h2>
    <p class="fade-in">Systems, tools, experiments.</p>
  </Chapter>

  <Chapter id="essays" chapter="essays">
    <h2 class="fade-in">How I Think</h2>
    <p class="fade-in">The philosopher side.</p>
  </Chapter>

  <Chapter id="future" chapter="future">
    <h2 class="fade-in">What's Next</h2>
    <p class="fade-in">Let's build something together.</p>
  </Chapter>
</ScrollLayout>

<script>
  import { initColorTransitions, initFadeIns, initHeroAnimation } from '../scripts/scroll-animations';
  initHeroAnimation();
  initColorTransitions();
  initFadeIns();
</script>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Hero loads with staggered name animation, tagline fades in, scroll cue appears then fades on scroll. Grain texture visible. Colors transition on scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/scroll/Hero.astro src/scripts/scroll-animations.ts src/pages/index.astro
git commit -m "feat: add Hero section with staggered text animation and scroll cue"
```

---

## Task 6: Chapter 1 — Why I Code

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace Chapter 1 placeholder with real content**

Replace the `why-i-code` Chapter block in `src/pages/index.astro`:

```astro
  <Chapter id="why-i-code" chapter="why-i-code">
    <div class="ch1-label fade-in">Chapter 01</div>
    <h2 class="fade-in">Why I Code</h2>
    <div class="ch1-content">
      <p class="fade-in">
        To many, a computer is a tool. To me, it feels more like a companion.
      </p>
      <p class="fade-in">
        Code is the one place where logic always prevails. If a system breaks, it's not because the universe is unfair — it's because the logic is flawed. And logic can be fixed.
      </p>
      <p class="fade-in">
        When I'm deep in a problem — building a system, refactoring a messy component, debugging a production issue — time dilates. The external world fades away, and I'm left with a pure feedback loop of <em>Hypothesis → Action → Result.</em>
      </p>
      <div class="ch1-terminal fade-in">
        <div class="terminal-bar">
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
        </div>
        <pre><code><span class="term-prompt">$</span> echo "Why do I code?"
<span class="term-output">Because the feedback loop is instant,</span>
<span class="term-output">the rules are fair,</span>
<span class="term-output">and the cursor always blinks back.</span></code></pre>
      </div>
      <a href="/essays/why-i-code" class="ch1-link fade-in">Read the full essay →</a>
    </div>
  </Chapter>
```

- [ ] **Step 2: Add Chapter 1 scoped styles**

Add to `src/pages/index.astro` (in a `<style>` block at the bottom):

```astro
<style>
  .ch1-label {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .ch1-content {
    max-width: 640px;
    margin-top: 2rem;
  }

  .ch1-content p {
    font-family: 'Source Serif 4 Variable', Georgia, serif;
    font-size: clamp(1.05rem, 1rem + 0.25vw, 1.2rem);
    line-height: 1.8;
    margin-bottom: 1.5em;
  }

  .ch1-terminal {
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
    margin: 2rem 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    line-height: 1.7;
  }

  .terminal-bar {
    background: #2a2a2a;
    padding: 8px 12px;
    display: flex;
    gap: 6px;
  }

  .terminal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #555;
  }

  .terminal-dot:first-child { background: #ff5f57; }
  .terminal-dot:nth-child(2) { background: #ffbd2e; }
  .terminal-dot:nth-child(3) { background: #28c840; }

  .ch1-terminal pre {
    padding: 1rem 1.25rem;
    margin: 0;
  }

  .ch1-terminal code {
    color: #ccc;
  }

  .term-prompt { color: #5b8a3c; }
  .term-output { color: #aaa; }

  .ch1-link {
    display: inline-block;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--accent);
    border-bottom: 1px solid var(--accent);
    padding-bottom: 2px;
  }

  .ch1-link:hover {
    text-decoration: none;
    opacity: 0.8;
  }
</style>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Expected: Chapter 1 shows with the label, heading, prose text, styled terminal block, and essay link. Elements fade in on scroll.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add Chapter 1 — Why I Code with terminal block"
```

---

## Task 7: Chapter 2 — Project Carousel (Horizontal Scroll)

**Files:**
- Create: `src/components/scroll/ProjectCarousel.astro`
- Modify: `src/scripts/scroll-animations.ts` (add horizontal scroll)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create ProjectCarousel component**

Write `src/components/scroll/ProjectCarousel.astro`:

```astro
---
interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  accent: string;
}

const projects: Project[] = [
  {
    title: 'Captive Portal',
    description: 'Built a fully functional captive portal on a Raspberry Pi from scratch — DHCP, DNS, iptables, the works. Wanted to understand how public Wi-Fi networks hijack your connection.',
    tags: ['Raspberry Pi', 'Networking', 'Linux', 'Python'],
    link: '/projects/captive-portal',
    accent: '#2563eb',
  },
  {
    title: 'AI Co-Pilot',
    description: 'Agentic AI interface for operations teams. Reducing manual work across Ops, Sales, Marketing, and Payroll through intelligent automation.',
    tags: ['AI', 'Mastra', 'Agents', 'TypeScript'],
    link: '/projects/ai-copilot',
    accent: '#059669',
  },
  {
    title: 'Review Reviewer',
    description: 'Mines 11,000+ PR review comments to discover coding standards, then generates AI-enforced rules. Data-driven standards, not memory-driven.',
    tags: ['AI', 'Code Review', 'Python', 'NLP'],
    link: '/projects/review-reviewer',
    accent: '#dc2626',
  },
];
---
<div class="carousel-wrapper">
  <div class="carousel-label">Chapter 02</div>
  <h2 class="carousel-title">What I've Built</h2>
  <div class="carousel-track">
    {projects.map((project) => (
      <article class="project-card">
        <div class="project-accent" style={`background: ${project.accent};`}></div>
        <h3 class="project-title">{project.title}</h3>
        <p class="project-desc">{project.description}</p>
        <div class="project-tags">
          {project.tags.map((tag) => (
            <span class="project-tag">{tag}</span>
          ))}
        </div>
        <a href={project.link} class="project-link">Read more →</a>
      </article>
    ))}
  </div>
</div>

<style>
  .carousel-wrapper {
    width: 100%;
  }

  .carousel-label {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .carousel-title {
    margin-bottom: 2.5rem;
  }

  .carousel-track {
    display: flex;
    gap: 2rem;
    width: max-content;
  }

  .project-card {
    width: clamp(300px, 40vw, 420px);
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 2rem;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .project-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .project-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .project-desc {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .project-tag {
    font-size: 0.75rem;
    font-family: 'JetBrains Mono', monospace;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--accent);
    border-radius: 100px;
    color: var(--accent);
  }

  .project-link {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Add horizontal scroll animation to scroll-animations.ts**

Add this function to `src/scripts/scroll-animations.ts`:

```ts
export function initProjectCarousel() {
  const wrapper = document.querySelector('#projects .carousel-track');
  const section = document.querySelector('#projects');
  if (!wrapper || !section) return;

  const scrollWidth = (wrapper as HTMLElement).scrollWidth - window.innerWidth + 200;

  gsap.to(wrapper, {
    x: -scrollWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });
}
```

- [ ] **Step 3: Update index.astro with ProjectCarousel**

Replace the `projects` Chapter in `src/pages/index.astro`:

```astro
  <Chapter id="projects" chapter="projects">
    <ProjectCarousel />
  </Chapter>
```

Add import at top:

```astro
import ProjectCarousel from '../components/scroll/ProjectCarousel.astro';
```

Add to the `<script>` block:

```ts
import { initProjectCarousel } from '../scripts/scroll-animations';
initProjectCarousel();
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Projects section pins to viewport. Scrolling moves project cards horizontally from right to left. Section unpins after all cards have scrolled through.

- [ ] **Step 5: Commit**

```bash
git add src/components/scroll/ProjectCarousel.astro src/scripts/scroll-animations.ts src/pages/index.astro
git commit -m "feat: add Chapter 2 — horizontal scroll project carousel"
```

---

## Task 8: Chapter 3 — How I Think (Quote Reveals)

**Files:**
- Create: `src/components/scroll/QuoteReveal.astro`
- Modify: `src/scripts/scroll-animations.ts` (add line reveal)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create QuoteReveal component**

Write `src/components/scroll/QuoteReveal.astro`:

```astro
---
interface EssayTeaser {
  title: string;
  quote: string;
  link: string;
}

const essays: EssayTeaser[] = [
  {
    title: 'The Quiet Transition to Homo Deus',
    quote: 'We often talk about the "future" of human evolution as something distant. But I feel that we have already quietly transitioned into Homo Deus.',
    link: '/essays/homo-deus',
  },
  {
    title: 'On Flow',
    quote: "I don't code just to build products. I code because the text editor is one of the few places in the world where the feedback loop is instantaneous and fair.",
    link: '/essays/on-flow',
  },
];
---
<div class="essays-section">
  <div class="essays-label fade-in">Chapter 03</div>
  <h2 class="fade-in">How I Think</h2>
  <div class="essays-grid">
    {essays.map((essay) => (
      <article class="essay-teaser">
        <blockquote class="quote-reveal">
          <span class="quote-mark" aria-hidden="true">"</span>
          {essay.quote.split('. ').map((sentence, i) => (
            <span class="quote-line" style={`--delay: ${i * 0.1}s`}>
              {sentence}{i < essay.quote.split('. ').length - 1 ? '. ' : ''}
            </span>
          ))}
        </blockquote>
        <div class="essay-meta fade-in">
          <h3>{essay.title}</h3>
          <a href={essay.link}>Read essay →</a>
        </div>
      </article>
    ))}
  </div>
</div>

<style>
  .essays-section {
    width: 100%;
  }

  .essays-label {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .essays-grid {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  .essay-teaser {
    max-width: 700px;
  }

  .quote-reveal {
    position: relative;
    font-family: 'Source Serif 4 Variable', Georgia, serif;
    font-size: clamp(1.2rem, 1.1rem + 0.5vw, 1.6rem);
    line-height: 1.8;
    border: none;
    padding: 0;
    margin: 0 0 1.5rem;
    font-style: normal;
  }

  .quote-mark {
    position: absolute;
    top: -0.5em;
    left: -0.6em;
    font-size: 4em;
    color: var(--accent);
    opacity: 0.15;
    font-family: Georgia, serif;
    line-height: 1;
  }

  .quote-line {
    display: inline;
    opacity: 0;
  }

  .essay-meta h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .essay-meta a {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Add quote line reveal animation to scroll-animations.ts**

Add this function to `src/scripts/scroll-animations.ts`:

```ts
export function initQuoteReveals() {
  document.querySelectorAll('.quote-reveal').forEach((quote) => {
    const lines = quote.querySelectorAll('.quote-line');
    const mark = quote.querySelector('.quote-mark');

    gsap.to(lines, {
      opacity: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: quote,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    if (mark) {
      gsap.from(mark, {
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }
  });
}
```

- [ ] **Step 3: Update index.astro**

Replace the `essays` Chapter:

```astro
  <Chapter id="essays" chapter="essays">
    <QuoteReveal />
  </Chapter>
```

Add import: `import QuoteReveal from '../components/scroll/QuoteReveal.astro';`

Add to script: `initQuoteReveals();` (import it from scroll-animations)

- [ ] **Step 4: Verify in browser**

Expected: Quotes reveal sentence-by-sentence with stagger. Decorative quote mark has subtle parallax. Essay links visible below each quote.

- [ ] **Step 5: Commit**

```bash
git add src/components/scroll/QuoteReveal.astro src/scripts/scroll-animations.ts src/pages/index.astro
git commit -m "feat: add Chapter 3 — essay teasers with line-by-line quote reveal"
```

---

## Task 9: Chapter 4 — What's Next (CTA + Particles)

**Files:**
- Create: `src/components/scroll/ParticleField.astro`
- Modify: `src/scripts/scroll-animations.ts` (add CTA stagger)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create ParticleField component (CSS-only)**

Write `src/components/scroll/ParticleField.astro`:

```astro
---
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 1 + Math.random() * 2,
  duration: 15 + Math.random() * 20,
  delay: Math.random() * -20,
  opacity: 0.1 + Math.random() * 0.3,
}));
---
<div class="particle-field" aria-hidden="true">
  {particles.map((p) => (
    <span
      class="particle"
      style={`left:${p.left}%;top:${p.top}%;width:${p.size}px;height:${p.size}px;animation-duration:${p.duration}s;animation-delay:${p.delay}s;opacity:${p.opacity};`}
    />
  ))}
</div>

<style>
  .particle-field {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    background: var(--accent);
    border-radius: 50%;
    animation: drift linear infinite;
  }

  @keyframes drift {
    0% { transform: translate(0, 0); }
    25% { transform: translate(10px, -20px); }
    50% { transform: translate(-5px, -10px); }
    75% { transform: translate(15px, 5px); }
    100% { transform: translate(0, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .particle { animation: none; }
  }
</style>
```

- [ ] **Step 2: Add Chapter 4 content to index.astro**

Replace the `future` Chapter:

```astro
  <Chapter id="future" chapter="future" class="future-chapter">
    <ParticleField />
    <div class="future-content">
      <div class="future-label fade-in">Chapter 04</div>
      <h2 class="fade-in">What's Next</h2>
      <p class="future-text fade-in">
        I'm building agentic AI tooling — systems that don't just assist, but act.
        Reducing manual work across entire organizations through intelligent automation.
      </p>
      <p class="future-text fade-in">
        I believe the best engineers are philosophers first. If that resonates, let's talk.
      </p>
      <div class="cta-links">
        <a href="https://github.com/jee1mr" class="cta-link cta-primary" target="_blank" rel="noopener">GitHub</a>
        <a href="https://linkedin.com/in/jee1mr" class="cta-link cta-primary" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:14.jeevan@gmail.com" class="cta-link cta-primary">Email</a>
        <a href="/resume.pdf" class="cta-link cta-secondary">Resume ↓</a>
      </div>
    </div>
  </Chapter>
```

Add import: `import ParticleField from '../components/scroll/ParticleField.astro';`

- [ ] **Step 3: Add Chapter 4 styles**

Add to the `<style>` block in `src/pages/index.astro`:

```css
  .future-chapter {
    position: relative;
  }

  .future-content {
    position: relative;
    z-index: 1;
    max-width: 640px;
  }

  .future-label {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .future-text {
    font-family: 'Source Serif 4 Variable', Georgia, serif;
    font-size: clamp(1.05rem, 1rem + 0.25vw, 1.2rem);
    line-height: 1.8;
    margin-bottom: 1.5em;
  }

  .cta-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
  }

  .cta-link {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .cta-link:hover {
    text-decoration: none;
    opacity: 0.85;
  }

  .cta-primary {
    background: var(--accent);
    color: var(--bg);
  }

  .cta-secondary {
    border: 1px solid var(--accent);
    color: var(--accent);
    background: transparent;
  }
```

- [ ] **Step 4: Add CTA stagger animation to scroll-animations.ts**

Add to `src/scripts/scroll-animations.ts`:

```ts
export function initCtaStagger() {
  const links = document.querySelectorAll('.cta-link');
  if (!links.length) return;

  gsap.set(links, { opacity: 0, y: 15 });

  gsap.to(links, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-links',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}
```

Add `initCtaStagger();` to the script block in index.astro.

- [ ] **Step 5: Verify in browser**

Expected: Chapter 4 has dark background with floating gold particles. CTA buttons stagger in. Particle animation is subtle.

- [ ] **Step 6: Commit**

```bash
git add src/components/scroll/ParticleField.astro src/scripts/scroll-animations.ts src/pages/index.astro
git commit -m "feat: add Chapter 4 — CTA section with particle field and staggered links"
```

---

## Task 10: Scroll Progress Indicator

**Files:**
- Create: `src/components/scroll/ScrollProgress.astro`
- Modify: `src/scripts/scroll-animations.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create ScrollProgress component**

Write `src/components/scroll/ScrollProgress.astro`:

```astro
---
const chapters = [
  { id: 'hero', label: 'Top' },
  { id: 'why-i-code', label: 'Why I Code' },
  { id: 'projects', label: 'Projects' },
  { id: 'essays', label: 'Essays' },
  { id: 'future', label: 'Contact' },
];
---
<nav class="scroll-progress" aria-label="Page sections" role="navigation">
  {chapters.map((ch) => (
    <a
      href={`#${ch.id}`}
      class="progress-dot"
      data-section={ch.id}
      aria-label={ch.label}
      title={ch.label}
    >
      <span class="dot"></span>
    </a>
  ))}
</nav>

<style>
  .scroll-progress {
    position: fixed;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .scroll-progress.visible {
    opacity: 1;
  }

  .progress-dot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    text-decoration: none;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-muted);
    opacity: 0.4;
    transition: all 0.3s;
  }

  .progress-dot.active .dot {
    opacity: 1;
    background: var(--accent);
    transform: scale(1.4);
  }

  @media (max-width: 768px) {
    .scroll-progress {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Add progress indicator logic to scroll-animations.ts**

Add to `src/scripts/scroll-animations.ts`:

```ts
export function initScrollProgress() {
  const nav = document.querySelector('.scroll-progress');
  const dots = document.querySelectorAll<HTMLAnchorElement>('.progress-dot');
  if (!nav || !dots.length) return;

  // Show/hide based on hero scroll
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 80%',
    onEnter: () => nav.classList.add('visible'),
    onLeaveBack: () => nav.classList.remove('visible'),
  });

  // Track active section
  dots.forEach((dot) => {
    const sectionId = dot.dataset.section!;
    const section = document.getElementById(sectionId);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: ({ isActive }) => {
        if (isActive) {
          dots.forEach((d) => d.classList.remove('active'));
          dot.classList.add('active');
        }
      },
    });
  });

  // Smooth scroll on click
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(dot.dataset.section!);
      if (target) {
        gsap.to(window, { scrollTo: target, duration: 1, ease: 'power2.inOut' });
      }
    });
  });
}
```

- [ ] **Step 3: Install GSAP ScrollTo plugin**

Add to the top of `src/scripts/scroll-animations.ts`:

```ts
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
```

Remove the duplicate `gsap.registerPlugin(ScrollTrigger);` line.

- [ ] **Step 4: Add ScrollProgress to index.astro**

Add import: `import ScrollProgress from '../components/scroll/ScrollProgress.astro';`

Add just after `<ScrollLayout>` opening tag, before `<Hero />`:

```astro
  <ScrollProgress />
```

Add to script: `initScrollProgress();`

- [ ] **Step 5: Verify in browser**

Expected: Dots appear on right side after scrolling past hero. Active dot highlights based on which section is in view. Clicking a dot scrolls smoothly to that section.

- [ ] **Step 6: Commit**

```bash
git add src/components/scroll/ScrollProgress.astro src/scripts/scroll-animations.ts src/pages/index.astro
git commit -m "feat: add floating scroll progress indicator with smooth scroll navigation"
```

---

## Task 11: Content Migration — Essays and Projects

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/essays/why-i-code.md`
- Create: `src/content/essays/homo-deus.md`
- Create: `src/content/essays/on-flow.md`
- Create: `src/content/projects/captive-portal.md`
- Move: `static/resume.pdf` → `public/resume.pdf`
- Move: `static/favicon.ico` → `public/favicon.ico`
- Move: `data/quotes.yaml` → `src/data/quotes.yaml`

- [ ] **Step 1: Create content collection config**

Write `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    categories: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
  }),
});

export const collections = { essays, projects };
```

- [ ] **Step 2: Migrate essay files**

Copy and convert frontmatter from TOML to YAML. Write `src/content/essays/why-i-code.md`:

```md
---
title: "Why I Code"
date: 2025-11-28
draft: false
tags: ["philosophy", "coding", "flow"]
---

To many, a computer is a tool. To me, it feels more like a companion.

[... rest of content copied verbatim from content/engineering/why-i-code.md ...]
```

Write `src/content/essays/homo-deus.md`:

```md
---
title: "The Quiet Transition to Homo Deus"
date: 2025-12-01
draft: false
tags: ["AI", "Philosophy", "Homo Deus", "Cyborg", "Future of Work"]
categories: ["Technology", "Essays"]
---

We often talk about the "future" of human evolution as something distant...

[... rest of content copied verbatim from content/essays/homo-deus.md, remove <!--more--> tag ...]
```

Write `src/content/essays/on-flow.md`:

```md
---
title: "On Flow"
date: 2025-11-28
draft: true
tags: ["philosophy", "psychology", "deep-work"]
summary: "Why the terminal is the only place where the world makes sense."
---

[... content copied verbatim from content/essays/on-flow.md ...]
```

- [ ] **Step 3: Migrate project files**

Write `src/content/projects/captive-portal.md`:

```md
---
title: "Captive Portal on Raspberry Pi"
date: 2025-11-28
draft: false
tags: ["Networking", "Raspberry Pi", "Linux", "Security"]
description: "Built a fully functional captive portal from scratch to understand how public Wi-Fi networks control access."
---

[... content copied verbatim from content/projects/captive-portal.md ...]
```

- [ ] **Step 4: Move static files and data**

```bash
mkdir -p public src/data
cp static/resume.pdf public/resume.pdf
cp static/favicon.ico public/favicon.ico
cp data/quotes.yaml src/data/quotes.yaml
```

- [ ] **Step 5: Verify content collections load**

```bash
npm run dev
```

Expected: No content collection errors in terminal. Site still builds.

- [ ] **Step 6: Commit**

```bash
git add src/content/ src/data/ public/resume.pdf public/favicon.ico
git commit -m "feat: migrate essays, projects, and static assets to Astro content collections"
```

---

## Task 12: Inner Page Layouts — Reading Layout, Header, Footer

**Files:**
- Create: `src/components/layout/Header.astro`
- Create: `src/components/layout/Footer.astro`
- Create: `src/components/layout/ReadingLayout.astro`

- [ ] **Step 1: Create Header component**

Write `src/components/layout/Header.astro`:

```astro
---
const navItems = [
  { label: 'Essays', href: '/essays' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Quotes', href: '/quotes' },
];
---
<header class="site-header">
  <a href="/" class="site-logo">Jeevan M R</a>
  <nav aria-label="Main navigation">
    {navItems.map((item) => (
      <a href={item.href} class="nav-link">{item.label}</a>
    ))}
  </nav>
</header>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .site-logo {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text);
    text-decoration: none;
  }

  nav {
    display: flex;
    gap: 1.5rem;
  }

  .nav-link {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
  }

  .nav-link:hover {
    color: var(--text);
    text-decoration: none;
  }

  @media (max-width: 600px) {
    .site-header {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
```

- [ ] **Step 2: Create Footer component**

Write `src/components/layout/Footer.astro`:

```astro
---
---
<footer class="site-footer">
  <div class="footer-links">
    <a href="https://github.com/jee1mr" target="_blank" rel="noopener">GitHub</a>
    <a href="https://linkedin.com/in/jee1mr" target="_blank" rel="noopener">LinkedIn</a>
    <a href="mailto:14.jeevan@gmail.com">Email</a>
    <a href="/rss.xml">RSS</a>
  </div>
  <p class="footer-copy">&copy; {new Date().getFullYear()} Jeevan M R</p>
</footer>

<style>
  .site-footer {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 2rem;
    text-align: center;
    border-top: 1px solid rgba(128, 128, 128, 0.15);
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .footer-links a {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.85rem;
    color: var(--text-muted);
    text-decoration: none;
  }

  .footer-links a:hover {
    color: var(--text);
  }

  .footer-copy {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 3: Create ReadingLayout**

Write `src/components/layout/ReadingLayout.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from './Header.astro';
import Footer from './Footer.astro';

interface Props {
  title: string;
  description?: string;
  date?: Date;
  tags?: string[];
}

const { title, description, date, tags = [] } = Astro.props;
---
<BaseLayout title={`${title} — Jeevan M R`} description={description}>
  <a href="#main-content" class="skip-link">Skip to content</a>
  <Header />
  <main id="main-content" class="reading-container">
    <article>
      <header class="article-header">
        <h1>{title}</h1>
        {date && (
          <time datetime={date.toISOString()}>
            {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        )}
        {tags.length > 0 && (
          <div class="article-tags">
            {tags.map((tag) => <span class="tag">{tag}</span>)}
          </div>
        )}
      </header>
      <div class="prose">
        <slot />
      </div>
    </article>
  </main>
  <Footer />
</BaseLayout>

<style>
  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    padding: 0.5rem 1rem;
    background: var(--accent);
    color: var(--bg);
    z-index: 1000;
    border-radius: 0 0 4px 4px;
  }

  .skip-link:focus {
    top: 0;
  }

  .reading-container {
    max-width: 780px;
    margin: 0 auto;
    padding: 2rem;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .article-header {
    margin-bottom: 3rem;
  }

  .article-header h1 {
    margin-bottom: 0.75rem;
  }

  .article-header time {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--accent);
    border-radius: 100px;
    color: var(--accent);
  }
</style>
```

- [ ] **Step 4: Verify build**

```bash
npm run dev
```

Expected: No errors. Components created but not yet wired to pages.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Header, Footer, and ReadingLayout for inner pages"
```

---

## Task 13: Essay and Project Pages (Dynamic Routes)

**Files:**
- Create: `src/pages/essays/index.astro`
- Create: `src/pages/essays/[...slug].astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Create essay listing page**

Write `src/pages/essays/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import ReadingLayout from '../../components/layout/ReadingLayout.astro';

const essays = (await getCollection('essays', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<ReadingLayout title="Essays" description="Thoughts on engineering, philosophy, and everything in between.">
  <h2 style="margin-bottom: 2rem;">Essays</h2>
  <ul class="essay-list">
    {essays.map((essay) => (
      <li>
        <a href={`/essays/${essay.slug}`}>
          <span class="essay-title">{essay.data.title}</span>
          <time datetime={essay.data.date.toISOString()}>
            {essay.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          </time>
        </a>
      </li>
    ))}
  </ul>
</ReadingLayout>

<style>
  .essay-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .essay-list a {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(128, 128, 128, 0.1);
    text-decoration: none;
    color: var(--text);
  }

  .essay-list a:hover {
    text-decoration: none;
    color: var(--accent);
  }

  .essay-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 500;
  }

  time {
    font-size: 0.85rem;
    color: var(--text-muted);
    flex-shrink: 0;
    margin-left: 1rem;
  }
</style>
```

- [ ] **Step 2: Create dynamic essay page**

Write `src/pages/essays/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ReadingLayout from '../../components/layout/ReadingLayout.astro';

export async function getStaticPaths() {
  const essays = await getCollection('essays');
  return essays.map((essay) => ({
    params: { slug: essay.slug },
    props: { essay },
  }));
}

const { essay } = Astro.props;
const { Content } = await essay.render();
---
<ReadingLayout
  title={essay.data.title}
  description={essay.data.summary}
  date={essay.data.date}
  tags={essay.data.tags}
>
  <Content />
</ReadingLayout>
```

- [ ] **Step 3: Create project listing page**

Write `src/pages/projects/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import ReadingLayout from '../../components/layout/ReadingLayout.astro';

const projects = (await getCollection('projects', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<ReadingLayout title="Projects" description="Systems, tools, and experiments I've built.">
  <h2 style="margin-bottom: 2rem;">Projects</h2>
  <ul class="project-list">
    {projects.map((project) => (
      <li>
        <a href={`/projects/${project.slug}`}>
          <div>
            <span class="project-title">{project.data.title}</span>
            {project.data.description && (
              <p class="project-desc">{project.data.description}</p>
            )}
          </div>
          <div class="project-tags">
            {project.data.tags.map((tag) => <span class="tag">{tag}</span>)}
          </div>
        </a>
      </li>
    ))}
  </ul>
</ReadingLayout>

<style>
  .project-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .project-list a {
    display: block;
    padding: 1.25rem;
    border: 1px solid rgba(128, 128, 128, 0.15);
    border-radius: 8px;
    text-decoration: none;
    color: var(--text);
    transition: border-color 0.2s;
  }

  .project-list a:hover {
    text-decoration: none;
    border-color: var(--accent);
  }

  .project-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.15rem;
  }

  .project-desc {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--accent);
    border-radius: 100px;
    color: var(--accent);
  }
</style>
```

- [ ] **Step 4: Create dynamic project page**

Write `src/pages/projects/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ReadingLayout from '../../components/layout/ReadingLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---
<ReadingLayout
  title={project.data.title}
  description={project.data.description}
  date={project.data.date}
  tags={project.data.tags}
>
  <Content />
</ReadingLayout>
```

- [ ] **Step 5: Verify all pages render**

```bash
npm run dev
```

Navigate to:
- `localhost:4321/essays` — should list Homo Deus and Why I Code
- `localhost:4321/essays/homo-deus` — should render full essay
- `localhost:4321/projects` — should list Captive Portal
- `localhost:4321/projects/captive-portal` — should render full project

- [ ] **Step 6: Commit**

```bash
git add src/pages/essays/ src/pages/projects/
git commit -m "feat: add essay and project listing + dynamic pages with content collections"
```

---

## Task 14: About and Quotes Pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/quotes.astro`

- [ ] **Step 1: Create About page**

Write `src/pages/about.astro`:

```astro
---
import ReadingLayout from '../components/layout/ReadingLayout.astro';
---
<ReadingLayout title="About" description="Jeevan M R — Software Engineer, philosopher, builder.">
  <div class="prose">
    <h2>Hi, I'm Jeevan.</h2>

    <p>I am a Software Engineer by trade and a curious human by nature.</p>

    <p>I view life through the same lens I view software: as an infinite loop of learning, building, and optimizing. Just as a codebase requires maintenance, my understanding of the world requires constant refactoring.</p>

    <h3>What I Work On</h3>

    <p>I build agentic AI tooling — systems that don't just assist, but act. Currently at Justworks, reducing manual work across Ops, Sales, Marketing, and Payroll through intelligent automation.</p>

    <h3>Tech Stack</h3>

    <ul>
      <li><strong>Languages:</strong> JavaScript/TypeScript, Python, Go</li>
      <li><strong>Frontend:</strong> React, Next.js, Vue.js</li>
      <li><strong>Backend:</strong> Node.js, Django, FastAPI, Postgres, Docker</li>
      <li><strong>AI/ML:</strong> LLMs, LangChain, Mastra</li>
    </ul>

    <h3>Connect</h3>

    <p>
      <a href="https://github.com/jee1mr" target="_blank" rel="noopener">GitHub</a> ·
      <a href="https://linkedin.com/in/jee1mr" target="_blank" rel="noopener">LinkedIn</a> ·
      <a href="mailto:14.jeevan@gmail.com">Email</a> ·
      <a href="/resume.pdf">Resume (PDF)</a>
    </p>
  </div>
</ReadingLayout>
```

- [ ] **Step 2: Create Quotes page**

Write `src/pages/quotes.astro`:

```astro
---
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import ReadingLayout from '../components/layout/ReadingLayout.astro';

const quotesFile = readFileSync('src/data/quotes.yaml', 'utf-8');
const quotes: { text: string; author: string }[] = parse(quotesFile);
---
<ReadingLayout title="Favourite Quotes" description="A collection of quotes I find inspiring.">
  <h2 style="margin-bottom: 2rem;">Favourite Quotes</h2>
  <div class="quotes-list">
    {quotes.map((q) => (
      <blockquote class="quote-card">
        <p>"{q.text}"</p>
        <cite>— {q.author}</cite>
      </blockquote>
    ))}
  </div>
</ReadingLayout>

<style>
  .quotes-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .quote-card {
    border-left: 3px solid var(--accent);
    padding: 1rem 1.5rem;
    margin: 0;
  }

  .quote-card p {
    font-family: 'Source Serif 4 Variable', Georgia, serif;
    font-size: 1.15rem;
    font-style: italic;
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }

  .quote-card cite {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-style: normal;
  }
</style>
```

- [ ] **Step 3: Install yaml parser**

```bash
npm install yaml
```

- [ ] **Step 4: Verify both pages**

```bash
npm run dev
```

Navigate to `localhost:4321/about` and `localhost:4321/quotes`. Both should render correctly with proper fonts and styling.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/pages/quotes.astro package.json package-lock.json
git commit -m "feat: add About and Quotes pages"
```

---

## Task 15: RSS Feed and Sitemap

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create RSS feed**

Write `src/pages/rss.xml.ts`:

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => !data.draft);

  return rss({
    title: 'Jeevan M R',
    description: 'Philosopher-Engineer. Refactoring life, one commit at a time.',
    site: context.site!,
    items: essays
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((essay) => ({
        title: essay.data.title,
        pubDate: essay.data.date,
        link: `/essays/${essay.slug}/`,
      })),
  });
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Navigate to `localhost:4321/rss.xml`. Expected: Valid RSS XML with essay entries.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed"
```

---

## Task 16: GitHub Actions Workflow for Astro

**Files:**
- Modify: `.github/workflows/hugo.yaml` → rename and rewrite

- [ ] **Step 1: Replace workflow**

Delete old and write `.github/workflows/deploy.yaml`:

```yaml
name: Build and deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Remove old workflow**

```bash
rm .github/workflows/hugo.yaml
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yaml
git rm .github/workflows/hugo.yaml
git commit -m "feat: replace Hugo workflow with Astro build and deploy"
```

---

## Task 17: Clean Up Old Hugo Files

**Files:**
- Remove: `content/` (old Hugo content — migrated)
- Remove: `data/` (old Hugo data — migrated)
- Remove: `static/` (old Hugo static — migrated)

- [ ] **Step 1: Remove old Hugo directories**

```bash
rm -rf content/ data/ static/
```

- [ ] **Step 2: Verify build still works**

```bash
npm run build
```

Expected: Clean build with no errors. All pages generated in `dist/`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old Hugo content, data, and static directories"
```

---

## Task 18: Final Build Verification and Production Test

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: All pages generated, no warnings or errors.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Navigate to `localhost:4321`. Test:
- Homepage scroll: all 5 chapters render, colors transition, animations fire
- Scroll progress dots: appear after hero, highlight correctly, click-to-navigate works
- Hero: name staggers in, scroll cue fades
- Ch 2: project carousel horizontal scroll works
- Ch 3: quote lines reveal on scroll
- Ch 4: particles drift, CTA links stagger in
- Essay page: `/essays/homo-deus` renders with prose styling
- Project page: `/projects/captive-portal` renders with Mermaid diagram (note: Mermaid may need an Astro integration — if it doesn't render, add `astro-mermaid` or render client-side)
- About page: renders correctly
- Quotes page: all 3 quotes display
- RSS: `/rss.xml` returns valid XML
- Navigation: header links work on inner pages, logo links home
- Mobile: resize to 375px — layout responsive, no horizontal overflow, progress dots hidden

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: final build verification fixes"
```

- [ ] **Step 4: Verify .gitignore includes .superpowers/**

Check `.gitignore` contains `.superpowers/`. If not, add it.

- [ ] **Step 5: Final commit**

```bash
git add .gitignore
git commit -m "chore: ensure .superpowers in gitignore"
```

---

## Summary

| Task | What | Files |
|---|---|---|
| 1 | Scaffold Astro, remove Hugo | package.json, astro.config.mjs, index.astro |
| 2 | Global styles + design tokens | global.css, chapters.css |
| 3 | Base layouts (BaseLayout, ScrollLayout) | 2 layout files |
| 4 | Chapter component + color interpolation | Chapter.astro, scroll-animations.ts |
| 5 | Hero section | Hero.astro |
| 6 | Chapter 1 — Why I Code | index.astro content + styles |
| 7 | Chapter 2 — Project carousel | ProjectCarousel.astro |
| 8 | Chapter 3 — Quote reveals | QuoteReveal.astro |
| 9 | Chapter 4 — CTA + particles | ParticleField.astro |
| 10 | Scroll progress indicator | ScrollProgress.astro |
| 11 | Content migration | content collections + static assets |
| 12 | Inner page layouts | Header, Footer, ReadingLayout |
| 13 | Essay + project dynamic routes | 4 page files |
| 14 | About + Quotes pages | 2 page files |
| 15 | RSS feed | rss.xml.ts |
| 16 | GitHub Actions workflow | deploy.yaml |
| 17 | Clean up old Hugo files | remove content/, data/, static/ |
| 18 | Final build verification | end-to-end testing |
