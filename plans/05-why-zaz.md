# zaz   Section 05: Why zaz

> Obra negra: structure + animation. Monochrome, light theme. Copy = placeholder (keep the 4-pillar
> shape). Reads against `00-master-design-plan.md`. **Spec only, no code.**

---

## 1. Purpose
Four differentiators, stated plainly. The rational close before Founder + Final CTA. Slots (fill later):
budget-based · no-risk/money-back · never resold (100% yours) · gives you your time back.

## 2. Structure
- Eyebrow (mono) + headline (placeholder). Suggested later: "Built different, on purpose."
- **Four pillars**   recommend alternating full-width rows (editorial, spacious):
  index `01–04` + title + body (placeholder) + small monochrome graphic; alternate text/graphic side.
- Optional pull-quote (large) between pillars and the next section.

### Mobile: single stacked column; graphic above text per pillar.

## 3. Visual language (monochrome)
- Calm, high-whitespace. Emphasis via near-black weight + hairline dividers with a small node.
- One pillar (money-back) can sit in an inverted (dark) row for emphasis.

## 4. Animation
- Per-row reveal on scroll: number fills, title mask-up, body fade, graphic scale-in; divider wipes L→R.
- Idle: graphics float subtly. Reduced-motion: fades only, numbers pre-filled.

## 5. Micro-interactions
- Hover pillar → title brightens, graphic nudges, index emphasis.

## 6. Assets
- 4 monochrome geometric graphics/glyphs (`public/brand/icons/`). No video.

## 7. Components
- `WhyZaz` (wrapper; per-row ScrollTriggers)
  - `SectionEyebrow` (shared) · `PillarRow` ×4 (index, title, body, graphic, side) · optional `PullQuote`
- Pillar data as typed array; copy from `en`/`es` (placeholder now).

## 8. Acceptance checklist
- [ ] Four pillars, editorial rows; placeholder copy via i18n.
- [ ] Per-row reveal (number/title/body/graphic + divider wipe).
- [ ] Idle float; reduced-motion fades only.
- [ ] AA contrast; keyboard focus rings.
