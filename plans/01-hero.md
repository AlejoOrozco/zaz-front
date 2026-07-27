# zaz   Section 01: Hero

> Architecture (obra negra) + animation behavior. Monochrome, light theme. Reads against
> `00-master-design-plan.md`. **Spec only, no code.**

---

## 1. Goal
One screen: state what zaz does in plain words, show the "idea → software" morph, drive one action
(Book a call). Calm, modern, spacious.

---

## 2. Layout & composition

Full viewport (`min-height: 100svh`), off-white background (`--paper`), generous whitespace.

### Desktop (12-col, max 1200px)
- **Left (cols 1–6):** text block   small mono eyebrow (optional), big headline, sub, CTAs.
- **Right (cols 7–12):** the **morph graphic** (the brand motif), vertically centered.
- Header (sticky) above; hero content vertically centered.
- Alt option: centered single-column with the morph graphic behind/above the headline (decide during design).

### Mobile
- Single column, centered: headline → morph graphic (contained) → sub → CTAs.

### Z-layers (parallax, all code/SVG   no video)
1. **L0 background:** off-white + very subtle texture. Slowest.
2. **L1 Entropy graphic:** live canvas particle field (`components/ui/entropy.tsx`). Medium.
3. **L2 text:** headline/sub/CTAs. Subtle.
4. **L3 accents:** scroll cue (later). Fastest.

### Brand graphic   Entropy (LOCKED)
- Live canvas: left = **chaos** (ideas), right = **order** (software).
- Theme-aware: light → black particles on white; dark → white particles on black.
- Path: `components/ui/entropy.tsx`. Props: `size`, `theme`, `className`.

---

## 3. Content & copy

| Element | EN | ES |
|---|---|---|
| Eyebrow (mono, optional) | `SOFTWARE, BUILT AROUND YOU` | `SOFTWARE, HECHO PARA TI` |
| Headline | Your ideas into software. | Tus ideas en software. |
| Sub | Save time, automate your work, and ease your workflow   all within your budget. | Ahorra tiempo, automatiza tu trabajo y simplifica tu flujo   todo dentro de tu presupuesto. |
| Primary CTA | Book a call | Agenda una llamada |
| Secondary CTA | See how it works | Cómo funciona |
| Scroll cue | SCROLL | DESLIZA |

Styling notes:
- Headline: PP Neue Montreal, `clamp(3rem, 8vw, 7rem)`, line-height ~1.02, tight tracking, `--ink`.
- Consider tying the morph to the words: as the graphic resolves organic→grid, the word **"software"**
  can subtly settle/sharpen (a light shine or weight shift)   the monochrome "signature" moment.
- Sub in `--ink-2`, `Body L`. Primary CTA = black pill; secondary = ghost.

---

## 4. The morph graphic (brand motif)
- An SVG shape that continuously morphs: an **organic blob (idea)** → a **precise grid of squares/dots
  (software)** → back, on a slow loop (~6–10s), eased.
- Monochrome: near-black on off-white (or an inverted variant if placed on a dark block).
- Built in code (SVG path morph / GSAP), lightweight, crisp at any size   no AI render, no "AI look".
- Idle: gentle Y-float + very subtle rotation; a few grid cells can twinkle in/out for life.

---

## 5. Load / entrance timeline (GSAP, once on mount)
Total ~1.4s, eased, staggered:
| t (s) | Element | Motion |
|---|---|---|
| 0.0 | Background + dot-grid | fade in |
| 0.2 | Morph graphic | fade + scale `0.96→1`; begins in "blob" state, resolves toward grid |
| 0.4 | Eyebrow | mask-reveal up |
| 0.5–0.9 | Headline (per line) | line-by-line mask-reveal up, ~0.08s stagger |
| ~0.9 | "software" | subtle settle/shine as the morph resolves to grid |
| 1.1 | Sub | fade + rise |
| 1.25 | CTAs | fade + rise |
| 1.35 | Scroll cue | fade in + begin loop |

Reduced-motion: single fade of the whole hero; morph shown resolved (grid state), no loop.

---

## 6. Scroll behavior (Lenis + ScrollTrigger)
- Parallax: morph graphic moves faster than text as hero exits; background barely moves.
- Morph graphic fades + drifts up slightly on exit.
- Headline drifts up + fades to hand off to section 2.

## 7. Idle micro-motion (always on)
- Morph loop (organic ↔ grid) + gentle float.
- L3 accent dots drift slowly; scroll cue loops (thin line + dot traveling down).
- All staggered so nothing moves in unison.

## 8. Micro-interactions
- Primary CTA: magnetic pull + subtle lift/shadow; click → Calendly inline popup.
- Secondary CTA: border darkens + ink underline wipes in.
- Language toggle: instant swap; headline re-runs a quick mask-reveal.

## 9. Assets
- Morph graphic + dot-grid: **code/SVG, no asset.**
- No video, no photos in hero.

## 10. Component breakdown (describe, don't dictate code)
- `Hero` (wrapper; layout grid + scroll triggers)
  - `HeroBackground` (off-white + dot-grid + optional neutral gradient)
  - `MorphGraphic` (shared brand motif component; organic↔grid morph + float)
  - `HeroContent` (eyebrow, headline, sub, CTAs)
    - `MagneticButton` (shared, primary CTA)
  - `HeroAccents` (L3 dots + scroll cue)
- Copy from `en`/`es` catalogs.

## 11. Acceptance checklist
- [ ] Full-viewport light hero; headline "Your ideas into software." + sub + CTAs.
- [ ] Morph graphic loops organic↔grid, floats, crisp (vector).
- [ ] Entrance timeline runs once; "software" settles as morph resolves.
- [ ] Parallax depth on scroll; graphic + headline hand off to section 2.
- [ ] Magnetic primary CTA opens Calendly; secondary scrolls to "How it works".
- [ ] EN|ES swaps all hero copy.
- [ ] `prefers-reduced-motion`: fades only, morph resolved/static.
- [ ] AA contrast; keyboard focus rings.
