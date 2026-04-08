import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

export function initHeroAnimation() {
  const nameLines = document.querySelectorAll('.hero-name-line');
  const tagline = document.querySelector('.hero-tagline');
  const scrollCue = document.querySelector('.scroll-cue');

  if (!nameLines.length) return;

  // Set initial state
  gsap.set(nameLines, { opacity: 0, y: 20 });
  gsap.set(tagline, { opacity: 0 });
  gsap.set(scrollCue, { opacity: 0 });

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
