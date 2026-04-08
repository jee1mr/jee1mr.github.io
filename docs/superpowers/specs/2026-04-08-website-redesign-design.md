# Website Redesign: Narrative Scroll Portfolio

**Date:** 2026-04-08
**Domain:** jeevanmr.com
**Repo:** github.com/jee1mr/jee1mr.github.io

## Overview

Redesign jeevanmr.com from a generic Hugo blog into an immersive, narrative storytelling scroll site. The homepage tells Jeevan's story chronologically — from why he codes to where he's headed — with an adaptive color palette that shifts as the visitor scrolls. Inner pages (essays, projects) remain clean editorial layouts.

The site conveys a **philosopher-engineer** personality to a **broad audience** (recruiters, peers, collaborators, anyone who Googles the name).

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro** | Static-first, ships zero JS by default, islands of interactivity where needed |
| Animation | **GSAP + ScrollTrigger** | Industry standard for scroll-driven animations, battle-tested, performant |
| Content | **Astro Content Collections** | Markdown-based essays and projects, type-safe frontmatter |
| Styling | **CSS custom properties + scoped styles** | Design tokens per chapter, no CSS framework needed |
| Hosting | **GitHub Pages** (or Vercel) | Free, custom domain already configured |
| Fonts | Google Fonts (self-hosted via `@fontsource`) | No external requests, better performance |

### Migration from Hugo

- Hugo is replaced entirely by Astro
- Existing markdown content (essays, projects, quotes) migrates to Astro content collections
- GitHub Actions workflow updated for Astro build (`astro build` → `dist/`)
- Hugo theme (paper) is removed; all styling is custom

## Homepage: Narrative Scroll

### Structure

The homepage is a single-page scroll experience divided into 5 sections ("chapters"). Each chapter has its own color palette. GSAP ScrollTrigger interpolates between palettes as the user scrolls, creating a continuous color journey.

#### Chapter 0 — Hero / The Hook

- **Content:** Full-viewport. Name ("Jeevan M R"), tagline ("Refactoring life, one commit at a time."), scroll cue.
- **Palette:** Warm cream (`#faf8f1` background, `#2a2a2a` text)
- **Animation:** Text staggers in letter-by-letter on load. Subtle grain/noise texture in background. Scroll cue (downward arrow) fades out on first scroll.
- **Navigation:** None visible. The scroll IS the navigation.

#### Chapter 1 — Why I Code

- **Content:** What drew him to engineering. The curiosity, the feedback loop, the moment code clicked. Draws from the "Why I Code" essay. A few punchy paragraphs + a personal code/terminal snippet.
- **Palette:** Transitions from cream → soft sage green (`#e8f0e0` bg, `#5b8a3c` accent)
- **Animation:** Section fades in. Code snippets float in from sides. Chapter title pins briefly then releases.

#### Chapter 2 — What I've Built

- **Content:** Projects showcase as narrative walkthrough. Each project gets: what it is, why it matters, what was learned. Not a grid — a sequential scroll-through.
- **Projects (initial):** Captive Portal (Raspberry Pi networking), AI Co-Pilot (agentic tooling), Review Reviewer (AI code review standards)
- **Palette:** Sage → steel blue (`#dbe8f4` bg, `#2563eb` accent)
- **Animation:** Horizontal scroll-within-scroll — pinned section where projects slide in from the right as user scrolls down. Each project card has a visual (screenshot, diagram, or illustration).

#### Chapter 3 — How I Think

- **Content:** The philosopher side. Featured essay teasers — Homo Deus, On Flow — with pull quotes and key ideas. 2-3 essay previews with the most provocative paragraph from each. Links to full essays.
- **Palette:** Blue → indigo (`#d8d0e8` bg, `#7c3aed` accent)
- **Animation:** Big typography pull quotes reveal line-by-line on scroll. Slight parallax on decorative quote marks.

#### Chapter 4 — What's Next

- **Content:** Forward-looking. AI team work, agentic tooling vision, what excites him. Ends with CTA: contact links (GitHub, LinkedIn, email) + resume download.
- **Palette:** Indigo → dark charcoal + gold (`#1a1a2e` bg, `#f59e0b` accent, `#e0e0e0` text)
- **Animation:** Subtle particle drift in background (small dots with slow random movement, CSS-only or lightweight canvas). Contact links fade in with stagger. Feels like arriving somewhere.

### Color Journey

```
Hero        Ch 1        Ch 2        Ch 3        Ch 4
#faf8f1 → #e8f0e0 → #dbe8f4 → #d8d0e8 → #1a1a2e
cream      sage       steel blue  indigo     dark+gold
```

Each chapter defines CSS custom properties (`--bg`, `--text`, `--accent`). GSAP ScrollTrigger interpolates between them based on scroll position.

### Navigation

- **No traditional navbar on homepage.** The scroll experience is uninterrupted.
- **Floating progress indicator** appears after scrolling past the hero: minimal dots or a thin progress bar showing which chapter you're in. Clicking a dot scrolls to that chapter.
- **Inner pages** get a standard minimal header with: logo/name (links home), essay/project nav, and a theme-appropriate color scheme.

## Inner Pages

### Essay Pages (`/essays/:slug`)

- Clean editorial layout, max-width 680px
- Source Serif 4 for body text (long-form readability)
- Syntax highlighting for code blocks (Shiki, built into Astro)
- No scroll animations — content-focused, fast
- Footer: links to other essays, back to home
- Giscus comments preserved (GitHub Discussions)

### Project Pages (`/projects/:slug`)

- Same editorial base as essays
- Can include diagrams (Mermaid support via Astro integration), screenshots, architecture visuals
- Structured sections: Overview, Problem, Approach, Results/Learnings, Links

### Listing Pages (`/essays/`, `/projects/`)

- Simple list with title, date, one-line description
- Sorted by date descending
- Minimal — the homepage scroll is the main showcase

### About Page (`/about`)

- Extended bio for people who want more than the scroll provides
- Tech stack, background, interests, contact info
- Resume download link

### Quotes Page (`/quotes`)

- Migrated from current site
- Styled quote cards with attribution
- Data-driven from YAML (same as current `data/quotes.yaml`)

## Typography

| Element | Font | Weight | Notes |
|---|---|---|---|
| Headings | Space Grotesk | 500, 700 | Geometric, modern, distinctive |
| Body (UI) | Inter | 400, 500 | Clean, readable for UI text |
| Body (essays) | Source Serif 4 | 400, 400i | Long-form readability |
| Code | JetBrains Mono | 400 | Ligatures enabled |
| Font scale | Fluid via `clamp()` | — | No breakpoint jumps |

All fonts self-hosted via `@fontsource` packages — no external Google Fonts requests.

## Animation Spec

| Trigger | Effect | Library |
|---|---|---|
| Page load (hero) | Name + tagline letter-stagger | GSAP |
| Scroll: chapter transition | Background/text/accent color interpolation | GSAP ScrollTrigger |
| Scroll: chapter title | Pin briefly, then release | GSAP ScrollTrigger |
| Scroll: Ch 2 projects | Horizontal scroll (pinned container) | GSAP ScrollTrigger |
| Scroll: Ch 3 quotes | Line-by-line text reveal | GSAP ScrollTrigger |
| Scroll: Ch 4 CTA | Staggered fade-in of contact links | GSAP ScrollTrigger |
| Inner page load | Simple fade-in | CSS animation |

### Performance Guardrails

- `will-change` applied only to actively animating elements, removed after animation completes
- `prefers-reduced-motion` media query: all animations disabled, static layout shown instead
- Animations use CSS transforms only (no layout-triggering properties like `top`, `left`, `width`)
- GSAP + ScrollTrigger loaded only on homepage (not on inner pages) via Astro's client directive
- Target: Lighthouse performance score > 90 on inner pages, > 80 on homepage

## Content Migration

| Current (Hugo) | New (Astro) |
|---|---|
| `content/essays/*.md` | `src/content/essays/*.md` |
| `content/engineering/*.md` | `src/content/essays/*.md` (merged into essays) |
| `content/projects/*.md` | `src/content/projects/*.md` |
| `content/about.md` | `src/pages/about.astro` |
| `content/quotes.md` + `data/quotes.yaml` | `src/pages/quotes.astro` + `src/data/quotes.yaml` |
| `static/resume.pdf` | `public/resume.pdf` |
| `static/favicon.ico` | `public/favicon.ico` |

Frontmatter schema defined via Astro content collection config (`src/content/config.ts`).

## File Structure (Astro)

```
src/
├── components/
│   ├── scroll/
│   │   ├── Hero.astro
│   │   ├── Chapter.astro         (reusable chapter wrapper with color tokens)
│   │   ├── ProjectCarousel.astro (horizontal scroll projects)
│   │   ├── QuoteReveal.astro     (line-by-line text reveal)
│   │   ├── ScrollProgress.astro  (floating progress dots)
│   │   └── ParticleField.astro   (Ch 4 background effect)
│   ├── layout/
│   │   ├── Header.astro          (inner pages only)
│   │   ├── Footer.astro
│   │   └── ReadingLayout.astro   (essay/project page wrapper)
│   └── ui/
│       ├── EssayCard.astro
│       ├── ProjectCard.astro
│       └── QuoteCard.astro
├── content/
│   ├── config.ts                 (collection schemas)
│   ├── essays/
│   └── projects/
├── data/
│   └── quotes.yaml
├── layouts/
│   ├── BaseLayout.astro          (html head, meta, fonts)
│   └── ScrollLayout.astro        (homepage-specific, no header)
├── pages/
│   ├── index.astro               (narrative scroll homepage)
│   ├── about.astro
│   ├── quotes.astro
│   ├── essays/
│   │   ├── index.astro           (listing)
│   │   └── [...slug].astro       (dynamic essay pages)
│   └── projects/
│       ├── index.astro           (listing)
│       └── [...slug].astro       (dynamic project pages)
├── scripts/
│   └── scroll-animations.ts      (GSAP ScrollTrigger setup)
├── styles/
│   ├── global.css                (reset, tokens, typography)
│   └── chapters.css              (per-chapter color definitions)
└── public/
    ├── favicon.ico
    ├── resume.pdf
    └── og-image.png              (social sharing image)
```

## SEO & Meta

- Open Graph + Twitter Card meta tags on every page
- Custom OG image for homepage (designed to match the site aesthetic)
- Per-essay OG images (auto-generated or manual)
- Sitemap via `@astrojs/sitemap`
- RSS feed preserved via `@astrojs/rss`
- Canonical URL: `https://jeevanmr.com`

## Accessibility

- All animations respect `prefers-reduced-motion`
- Semantic HTML throughout (sections, articles, nav, headings hierarchy)
- Color contrast ratios meet WCAG AA in all chapter palettes (including dark Ch 4)
- Keyboard navigation: Tab through sections, Enter to follow links
- Skip-to-content link on inner pages
- Alt text on all images

## Out of Scope (for now)

- Blog/CMS functionality (no post creation UI — markdown files committed to git)
- Search functionality
- Analytics (can add later with Plausible or similar)
- Dark/light mode toggle (the adaptive palette IS the design — forcing a toggle breaks the narrative)
- i18n / multi-language support
- Contact form (links to email/LinkedIn instead)
