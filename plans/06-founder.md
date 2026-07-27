# zaz   Section 06: Founder

> Obra negra: structure + animation. Monochrome, light theme. Copy = placeholder. Reads against
> `00-master-design-plan.md`. **Spec only, no code.**

---

## 1. Purpose
Human trust anchor: a real, named founder (Alejandro Gómez Orozco) instead of fake logos/metrics.
First-person, personal, "you work with me, not a queue."

## 2. Structure
- Eyebrow (mono) + first-person statement (placeholder) + short body (placeholder) + signature line
  + inline CTA (Book a call → Calendly).
- Optional hidden slot for a future real testimonial/credential (kept empty until real).

### Desktop: two columns   portrait one side, text the other.
### Mobile: portrait on top, text below.

## 3. Visual language (monochrome)
- Portrait in a `14px` frame with hairline border + soft neutral shadow; grayscale or neutral grade
  to match the palette.
- Name emphasized in `--ink`; signature in mono or a tasteful distinct style.

## 4. Animation
- Portrait reveals with soft scale-in + fade; statement mask-up; signature draws in L→R; CTA fades.
- Idle: portrait frame subtle float. Reduced-motion: fades only, no signature draw.

## 5. Micro-interactions
- Hover portrait → subtle parallax tilt toward cursor. Inline CTA → magnetic + Calendly.

## 6. Assets
- Founder portrait (real photo preferred), monochrome/neutral grade → `public/founder/portrait.jpg` (+2x).
- Optional signature SVG. No video.

## 7. Components
- `Founder` (wrapper) → `SectionEyebrow` · `FounderPortrait` (frame, tilt, float) · `FounderStatement`
  (statement, body, `Signature`, inline CTA) · `MagneticButton`
- Copy from `en`/`es` (placeholder now).

## 8. Acceptance checklist
- [ ] Named founder, first-person, signed feel; placeholder copy via i18n.
- [ ] Portrait framed + graded to palette; statement + signature + inline Calendly CTA.
- [ ] Idle float; reduced-motion fades only.
- [ ] Optional proof slot hidden until real (no fabricated data).
- [ ] AA contrast; portrait alt text; focus rings.
