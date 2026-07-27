# zaz   Section 04: What we build

> Spec for the highlight remix (Raycast-style phrase cloud + soft-glow preview).
> Monochrome, light-first. Reads against `00-master-design-plan.md`.

---

## 1. Purpose
Show breadth of what zaz builds as *categories of bespoke work* (not fixed products).
Reinforce "never a reused template." Interactive phrase highlights drive a preview image
and a short detail blurb.

## 2. Structure
- Eyebrow (mono) + headline.
- **Two-column desktop layout**
  - Left: lead-in ("We build" / "Construimos") + inline clickable phrases; below, active
    label + one-liner.
  - Right: soft-glow screenshot preview for the active phrase.
- Mobile: stack   phrases → detail → image.
- Closing line → Final CTA / `#book`.

### Features (5 only   matched to assets)
1. Animated web pages
2. Web pages
3. Landing pages
4. Personalized software
5. AI agents

## 3. Visual language (monochrome)
- Phrase cloud: muted `ink-3` for inactive; full `ink` + soft text bloom for active.
- Detail row: site `font-sans` label (not mono/uppercase) + small stroke icon in a
  circular chip (`components/ui/build-feature-icons.tsx`), then body copy in sans.
- Preview: `public/images/what-we-build/*.webp` inside a rounded frame with soft halo
  shadow + edge vignette (treatment A   glow, not 3D tilt). Theme-aware via CSS vars.
- No bento cards.

## 4. Interaction & animation
- Auto-advance ~4s; soft crossfade on image + phrase highlight.
- Click/tap a phrase → select immediately, pause ~6s, then resume auto-cycle.
- Keyboard: phrases as buttons (`aria-pressed`); Left/Right arrows move selection.
- Entrance: light staggered fade/rise on scroll (once).
- Reduced-motion: no auto-cycle; first item active; click still works; no float/tilt.

## 5. Assets
- `public/images/what-we-build/animated-web-pages.webp`
- `public/images/what-we-build/web-pages.webp`
- `public/images/what-we-build/landing-pages.webp`
- `public/images/what-we-build/personalized-software.webp`
- `public/images/what-we-build/ai-agents.webp`

## 6. Components
- `WhatWeBuild` (section; state + timer + reveal)
  - inline phrase buttons · detail block (sans label + icon) · `GlowPreview`
- Feature data as typed `en` / `es` arrays (`id`, `phrase`, `label`, `description` + image map).

## 7. Acceptance checklist
- [ ] No category cards; phrase cloud + glowing preview.
- [ ] Auto-cycle + manual select with pause/resume.
- [ ] Five images from `public/images/what-we-build/`.
- [ ] EN/ES copy; reduced-motion safe; light and dark theme.
- [ ] AA contrast; keyboard focus rings on phrases.
