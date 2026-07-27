# zaz   Section 08: Footer

> Obra negra: structure. Monochrome, light theme. Reads against `00-master-design-plan.md`.
> **Spec only, no code.**

---

## 1. Purpose
Quiet, useful, on-brand close: nav, contact, language, legal, and a last small brand moment.

## 2. Structure
- **Brand:** `zaz` wordmark + one-line tagline ("Your ideas into software." / "Tus ideas en software.").
- **Navigate:** How it works · What we build · Why zaz · Founder · Book a call (EN/ES).
- **Contact:** email (mailto), WhatsApp (optional), Calendly link.
- **Language:** EN | ES toggle (mirrors header).
- **Social:** only real, active links (no dead icons).
- **Bottom bar:** `© {year} zaz   Founded by Alejandro Gómez Orozco.` + legal links (only if real).
- Optional: oversized low-opacity `zaz` watermark behind the footer.

### Layout: desktop = brand block left + link columns; bottom bar full-width. Mobile = stacked.

## 3. Visual language (monochrome)
- `--paper-2`/`--paper-3` background with top hairline. Muted text (`--ink-2`/`--ink-3`); hover → `--ink`.
- Watermark (if used) at very low opacity.

## 4. Animation
- Links: ink underline-wipe on hover. Watermark subtle scroll parallax. Optional "back to top".
- Reduced-motion: static; hover states only.

## 5. Assets
- Wordmark SVG + social icon set (monochrome). No new visual assets.

## 6. Components
- `Footer` → `FooterBrand` · `FooterNav` · `FooterContact` · `FooterSocial` · `LanguageToggle`
  (shared) · `FooterBottomBar` · optional `FooterWatermark`
- Links/copy from `en`/`es`; social/legal arrays include only real entries.

## 7. Acceptance checklist
- [ ] Brand + tagline, nav, contact, real social links, language toggle, bottom bar (dynamic year + founder credit).
- [ ] Hover underline-wipes + focus rings; language toggle persists.
- [ ] EN|ES swaps labels/tagline/copyright.
- [ ] Reduced-motion static; AA contrast; full keyboard nav.
