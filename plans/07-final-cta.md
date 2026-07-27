# zaz   Section 07: Final CTA

> Obra negra: structure + animation. Monochrome, light theme. Reads against
> `00-master-design-plan.md`. **Spec only, no code.**

---

## 1. Purpose
The conversion moment. Everything funnels here: Book a call. The page's clearest, most confident beat.
Recommend an **inverted (near-black) full-viewport block** for contrast   the one dark moment that
makes the CTA pop against the otherwise light page.

## 2. Structure
- Centered stack: eyebrow (optional) → big headline → short sub → primary CTA → reassurance line →
  alt contact (email/WhatsApp).
- Headline (real-ish): **Have an idea? Let's build it.** / **¿Tienes una idea? Construyámosla.**
- Sub + reassurance: placeholder (e.g. "No commitment · Money-back guarantee").

## 3. Visual language (monochrome)
- Inverted block: `--invert-bg` background, `--invert-fg` text; CTA = light fill + dark text.
- Optional: the morph graphic (inverted) large + dimmed behind the headline (loop closes with the hero).
- Largest type on the page for a crescendo.

## 4. Animation
- On enter: background block wipes/fades in; headline mask-reveal; sub + CTA + reassurance stagger.
- Optional morph graphic resolves to its grid state as the section settles.
- Idle: subtle graphic drift. Reduced-motion: fades only.

## 5. Micro-interactions & conversion
- Primary CTA: strong magnetic pull + lift; click → **Calendly inline popup**; track click.
- Alt contact (email/WhatsApp) → hover underline.

## 6. Assets
- Background/graphic = code (CSS + SVG morph, inverted). No video, no asset required.
- Calendly account + event link (from you); brand colors set inside Calendly to match (monochrome).

## 7. Components
- `FinalCta` (wrapper; inverted block + entrance)
  - `SectionEyebrow` (optional) · headline + sub · `MagneticButton` (→ Calendly) · reassurance · `AltContact`
- Copy from `en`/`es`.

## 8. Acceptance checklist
- [ ] Full-viewport inverted block; big headline + CTA; the crescendo.
- [ ] Optional inverted morph graphic reprise (loop closes).
- [ ] Magnetic CTA opens Calendly; click tracked; alt contact present.
- [ ] EN|ES swaps copy; reduced-motion fades only.
- [ ] AA contrast (light on near-black); focus rings.
