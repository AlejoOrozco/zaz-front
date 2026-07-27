# zaz   Section 03: How it works

> Obra negra: structure + animation. Monochrome, light theme. Copy = placeholder (keep the 3-step
> shape). Reads against `00-master-design-plan.md`. **Spec only, no code.**

---

## 1. Purpose
Make the process feel effortless and safe: three steps. Slots (fill later):
1. Tell us your idea & budget → 2. We tell you what's possible → 3. We build it (or money back).

## 2. Structure
- Eyebrow (mono) + section headline (placeholder).
- **Vertical spine** with 3 step nodes down it (reads as a journey; animates well on scroll).
  - Left: large step number `01/02/03` (outline → filled on activation).
  - Right: step card (title, body   placeholder   + small geometric graphic).
- Closing line + inline CTA (Book a call → Calendly).

### Mobile: same vertical spine, single column, nodes left / cards right.

## 3. Visual language (monochrome)
- Numbers: PP Neue Montreal, large, outline (stroke) at rest → solid `--ink` when active.
- Spine: hairline track with a **near-black progress fill** that follows scroll.
- Nodes: hollow gray → solid `--ink` when reached. Step graphics = simple monochrome geometry.

## 4. Animation
- Scroll-scrubbed: spine draws down; a small marker travels node→node; each node fills, its number
  fills, and the step card reveals (fade + rise) in sequence. (Monochrome marker replaces the old red spark.)
- Idle: step graphics float subtly; active nodes have a soft neutral pulse.
- Reduced-motion: spine fully drawn, numbers filled, steps fade in.

## 5. Micro-interactions
- Hover step card → lift, hairline darkens, body text brightens.
- Inline CTA → magnetic + Calendly popup.

## 6. Assets
- Spine + marker = code (SVG/CSS). Optional 3 monochrome step glyphs (`public/brand/icons/`). No video.

## 7. Components
- `HowItWorks` (wrapper; spine ScrollTrigger)
  - `SectionEyebrow` (shared) · `ProcessSpine` (line + nodes + marker) · `ProcessStep` ×3 · `MagneticButton`
- Steps as typed array (index, titleKey, bodyKey, glyph); copy from `en`/`es` (placeholder now).

## 8. Acceptance checklist
- [ ] Vertical spine draws on scroll; marker travels node→node; nodes/numbers fill in sequence.
- [ ] 3 step cards reveal; closing line + inline Calendly CTA.
- [ ] Placeholder copy via i18n, easy to replace.
- [ ] Idle float; reduced-motion static spine + fades.
- [ ] AA contrast; keyboard focus rings.
