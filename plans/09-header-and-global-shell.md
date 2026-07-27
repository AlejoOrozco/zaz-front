# zaz   Section 09: Header & Global Shell

> The structural glue: header/nav, EN|ES toggle, smooth-scroll + motion providers, Calendly, i18n,
> theme tokens, performance, file structure. Monochrome, light theme. Reads against
> `00-master-design-plan.md`. **Spec only, no code.**

---

## 1. Header / navigation
### Content
- Left: `zaz` wordmark (near-black) → scrolls to top.
- Center/right: nav   How it works · What we build · Why zaz · Founder (ES equivalents), smooth-scroll (Lenis).
- Right: **EN | ES toggle** + primary CTA **Book a call** (black pill) → Calendly.
- Mobile: wordmark + hamburger → full-screen light overlay (nav + toggle + CTA).

### Behavior
- Sticky, transparent over the hero; on scroll gains a subtle **white blur** background
  (`backdrop-blur` + `--paper` ~70% + bottom hairline) once past the hero.
- Hide on scroll-down, reveal on scroll-up.
- Active-section indicator: current nav link gets a small underline/dot (observer-driven).

### Animation
- Load: wordmark + links stagger-fade from top.
- Link hover: ink underline wipe. CTA: magnetic + lift.
- Mobile overlay: light bg; links reveal staggered mask-up.
- Reduced-motion: opacity only; instant menu.

### Acceptance
- [ ] Sticky, transparent→white-blur on scroll, hide/reveal on direction.
- [ ] Smooth-scroll nav; active indicator; header CTA opens Calendly.
- [ ] EN|ES toggle (+ mobile overlay); persists.
- [ ] Keyboard nav; focus rings; overlay traps focus + closes on Esc.
- [ ] AA contrast in transparent + blurred states.

---

## 2. Internationalization (EN | ES)
- **`next-intl`**, locales `en` (default) + `es`. All copy in `messages/en.json` / `messages/es.json`,
  one namespace per section (`hero`, `how`, `build`, `why`, `founder`, `cta`, `footer`, `nav`, `common`).
- Toggle persists via cookie; SSR reads cookie/`Accept-Language` for first paint (no layout shift on swap).
- Key headlines re-run a quick mask-reveal on language change.
- Most section copy is **placeholder/lorem** now   structured so real text drops in without layout changes.

## 3. Smooth scroll + motion providers
- **Lenis** at app root; feed its RAF to the GSAP ticker (one shared loop   no double-RAF jank).
- **GSAP + ScrollTrigger** registered once; reusable helpers: `revealUp`, `parallax`, `pinScrub`,
  `drawLine`, `morph`   used across sections (DRY).
- **Framer Motion** for component interactions (magnetic buttons, hover variants, overlay).
- Anchor/nav clicks go through Lenis `scrollTo` (respect sticky header offset).

## 4. Global effects (monochrome)
- **Dot-grid / ambient texture** provider (subtle, code-drawn) reused across sections.
- **MorphGraphic** shared component (the brand motif)   used in hero + final CTA.
- **Reduced-motion master switch** provider: one flag all sections branch off (fades instead of
  transforms; morph shown resolved; no parallax/float).
- Optional thin top **scroll-progress** bar (near-black) tied to Lenis progress.
- (No cursor color glow   monochrome; keep interactions subtle.)

## 5. Calendly integration
- Isolate in one util/provider (`useCalendly` / `<CalendlyPopup>`); every CTA calls it.
- Prefer **inline popup**; set Calendly brand colors to match (monochrome). Track click on open.
- Needs from you: Calendly account + event link → `.env` (never hardcoded).

## 6. Theme tokens (Tailwind v4, CSS-first)
- Define all `00 §3` tokens in the global `@theme` block (colors, fonts, spacing, radius).
- Fonts: PP Neue Montreal (licensed) or free substitute (Geist / General Sans) + Geist Mono; self-host, `swap`.
- Light is the only theme; inverted (dark) blocks use `--invert-bg`/`--invert-fg` tokens.
- Base: off-white bg, `--ink` text, smooth font rendering, neutral selection color.

## 7. Performance & SEO
- **No video.** Brand visuals are SVG/canvas (morph, dot-grid); rasters (founder) ship PNG/WebP 1x/2x
  with explicit dimensions (no CLS), lazy below fold.
- Cap animation work (`will-change` surgical); respect `prefers-reduced-motion`.
- Preload fonts + wordmark; defer the rest.
- Lighthouse: LCP < 2.5s (hero headline as LCP), CLS ~0, good INP. Lean JS (GSAP/Lenis/Motion only).
- Metadata: per-locale title/description, OG image, favicons, `lang` attr, sitemap/robots.
- A11y: AA contrast, focus-visible rings, semantic landmarks, alt text.

## 8. Suggested file structure (guidance)
```
app/
  [locale]/
    layout.tsx            # shell: providers (Lenis, Motion, ReducedMotion, Calendly), header, footer
    page.tsx              # composes sections in order
  globals.css             # @theme tokens, base styles, fonts
components/
  shell/                  # Header, Footer, LanguageToggle, ScrollProgress, providers
  sections/               # Hero, HowItWorks, WhatWeBuild, WhyZaz, Founder, FinalCta
  ui/                     # MagneticButton, SectionEyebrow, MorphGraphic, DotGrid, Card (shared, DRY)
  motion/                 # gsap helpers (revealUp, parallax, pinScrub, drawLine, morph), lenis setup
messages/
  en.json  es.json        # i18n catalogs, one namespace per section (placeholder copy now)
public/
  brand/                  # wordmark.svg, icon.svg, favicons, og.png, icons/*.svg
  founder/                # portrait.jpg (+2x)
```
- Files < 300 lines, one responsibility each; shared UI extracted (no copy-paste   per rules).
- `MorphGraphic`, `MagneticButton`, `SectionEyebrow`, `DotGrid` built once, reused everywhere.

## 9. Global acceptance checklist
- [ ] Lenis + GSAP share one RAF loop; ScrollTrigger works with smooth scroll.
- [ ] Reusable motion helpers + shared UI used across sections (no duplication).
- [ ] Header sticky/white-blur/hide-reveal + active link + Calendly CTA.
- [ ] `next-intl` EN|ES; toggle persists; SSR-safe; placeholder copy easy to replace.
- [ ] Reduced-motion master switch + optional scroll-progress bar.
- [ ] Calendly isolated, monochrome-matched, env-configured, click-tracked.
- [ ] Theme tokens in `@theme`; fonts self-hosted/optimized.
- [ ] Perf/SEO/a11y targets met; SVG/canvas graphics; rasters lazy with explicit dimensions.
