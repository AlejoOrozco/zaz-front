# zaz   Master Design Plan

> Single source of truth for the zaz landing page. Written to be handed to a coding agent.
> Contains brand, design system, section-by-section architecture, copy, and animation behavior.
> **Spec only   no code.** This is *obra negra*: structure + intent settled, visual decoration comes later.

Status: v2 (monochrome redesign). Direction reset from the earlier red/3D concept.

---

## 0. TL;DR for the builder

- **Stack:** Next.js 16 (App Router), React 19, Tailwind v4, TypeScript strict.
- **Add:** `lenis` (smooth scroll), `gsap` + ScrollTrigger (scroll animation), `framer-motion`
  (micro-interactions), `next-intl` (EN/ES).
- **Look:** **light, white-forward, monochrome.** Off-white canvas, near-black text, grayscale.
  Black is the only "accent" (via max contrast + solid fills). **No red. No color.**
- **Feel:** modern, simple, software-native (Linear / Vercel / Stripe territory). Clean, lots of whitespace.
- **Brand motif:** an "idea → software" **morph** (organic shape resolving into a geometric grid).
  All brand visuals are **vector/SVG + code**, not AI 3D renders (avoids the "AI-made" look).
- **Motion:** smooth scroll, parallax depth, idle float, line-by-line reveals, magnetic buttons,
  and the morph motif as the signature moment. Monochrome only.
- **Conversion:** Book a call (Calendly). **Languages:** EN | ES toggle.

---

## 1. Brand foundation

### 1.1 The idea
`zaz` turns ideas into software. You describe what you need + your budget; we build the automation
that saves you time. Fast, bespoke, no risk (money-back). The name is short, modern, memorable.

### 1.2 Voice & tone
- Simple, direct, modern. Short sentences. Plain language. No corporate filler, no hype.
- Confident and calm. The product is "we make your work easier"   the tone should feel effortless.
- Speaks to both individuals and companies.

### 1.3 Hero copy (LOCKED direction, refine later)
- Headline: **"Your ideas into software."** / **"Tus ideas en software."**
- Subtitle (tentative): **"Save time, automate your work, and ease your workflow   all within your
  budget."** / **"Ahorra tiempo, automatiza tu trabajo y simplifica tu flujo   todo dentro de tu presupuesto."**
- CTA: **Book a call** / **Agenda una llamada**

> All other section copy is **placeholder/lorem ipsum** for now (see §6)   Alejandro fills it in over time.

---

## 2. Branding system

### 2.1 The motif   "idea → software" morph
A single organic/fluid shape (the *idea*) that transforms into a precise geometric grid of squares
or dots (the *software*). This is the core brand figure and appears as:
- the animated hero graphic (loops slowly, morphing back and forth),
- the loading state,
- a favicon/mark (a single frozen frame mid-morph),
- subtle section-transition accents.
It's meaningful (it *is* the tagline), monochrome, and rendered as **SVG/canvas animated in code**  
no external renders needed.

### 2.2 Logo / wordmark
- **Wordmark:** `zaz` lowercase in PP Neue Montreal, tight tracking, near-black on light.
- **Mark:** a compact glyph derived from the morph motif (a shape half-organic / half-grid), OR a
  geometric `z` built from grid modules. Works as favicon + social avatar at small sizes.

### 2.3 Ambient texture
- A subtle **dot-grid** (represents structure/software) used lightly in backgrounds/section dividers.
- Thin hairlines and generous whitespace do most of the structural work.

### 2.4 Icon system
- Simple, consistent, monochrome **geometric line icons** (single weight) for feature categories.
- No skeuomorphism, no color   modern and flat.

> Deliverables to explore later (prompts in §7): wordmark SVG, mark/favicon, icon set. The morph
> graphic itself is built in code (SVG), so it needs no asset.

---

## 3. Design system

### 3.1 Color tokens (monochrome, light, white-forward)
White is prioritized and used in *variations* (layered off-whites) for depth   not one flat white.
| Token | Value | Use |
|---|---|---|
| `--paper` | `#FFFFFF` | Base background (pure white) |
| `--paper-2` | `#F6F6F4` | Alt section background (warm off-white) |
| `--paper-3` | `#EDEDEA` | Nested surfaces / subtle blocks |
| `--surface` | `#FFFFFF` | Cards (with hairline border) |
| `--line` | `rgba(10,10,10,0.10)` | Hairlines, borders, dividers |
| `--ink` | `#0A0A0A` | Primary text + high-contrast elements (the "accent") |
| `--ink-2` | `#52525B` | Secondary text |
| `--ink-3` | `#8A8A93` | Muted text / captions |
| `--invert-bg` | `#0A0A0A` | Background of any inverted (dark) block |
| `--invert-fg` | `#FAFAFA` | Text on inverted blocks |

Rules: contrast *is* the accent. Emphasis = solid near-black fills / inverted blocks. Depth comes
from layered off-whites, hairlines, and soft neutral shadows   never color. Optional very subtle
neutral gradients (`#FFFFFF → #F2F2F0`) are allowed for tonal variety.

### 3.2 Typography
- **Display + Body:** **PP Neue Montreal** (Pangram Pangram   requires a license; free near-substitute:
  **Geist** or **General Sans**). Weights: Book/Medium for headlines, Regular for body.
- **Mono (eyebrows, labels, section numbers):** **Geist Mono** (or PP Fraktion Mono)   uppercase, wide tracking.
- Fluid scale (`clamp`):
| Role | Size |
|---|---|
| Display XL (hero) | `clamp(3rem, 8vw, 7rem)` |
| H1 | `clamp(2.25rem, 5vw, 4rem)` |
| H2 | `clamp(1.75rem, 3.5vw, 2.75rem)` |
| H3 | `clamp(1.25rem, 2vw, 1.75rem)` |
| Body L | `1.25rem` |
| Body | `1.0625rem` |
| Mono label | `0.8125rem`, `letter-spacing 0.14em`, uppercase |
- Headlines tight (line-height `1.02–1.05`), body breathable (`1.6`). Modern = generous whitespace.

### 3.3 Spacing, radius, layout
- Max content width `1200px`; wide/full-bleed allowed for the hero graphic + inverted sections.
- Section rhythm `clamp(6rem, 12vw, 11rem)`.
- Grid: 12-col, `24px` gutter desktop / `16px` mobile.
- Radius: cards `14px`, buttons pill (`999px`) or `10px` (pick one system   recommend pill for CTAs, `10px` for cards).
- Elevation: soft neutral shadows only (e.g. `0 1px 2px rgba(0,0,0,.06)`, `0 8px 30px rgba(0,0,0,.06)`) + hairline borders.

### 3.4 Buttons
- **Primary:** near-black fill (`--ink`) + light text; hover → subtle lift + slight scale + shadow.
- **Secondary/Ghost:** transparent + hairline border + `--ink` text; hover → border darkens, subtle fill.
- **Inverted (on dark blocks):** light fill + dark text.

---

## 4. Motion system

Principle: **calm, precise, modern.** Motion is smooth and minimal   it clarifies, never decorates.
Respect `prefers-reduced-motion` (fades only).

### 4.1 Libraries & roles
- **Lenis**   global smooth/inertia scroll (foundation).
- **GSAP + ScrollTrigger**   scroll reveals, parallax, pinned/scrub sequences, the morph animation.
- **Framer Motion**   hover/tap micro-interactions, magnetic buttons, entrance variants.

### 4.2 Signature behaviors
1. **The morph**   the "idea → software" SVG graphic morphs organic ↔ grid; the brand's signature moment (hero + accents).
2. **Parallax depth**   2–4 layers per section move at different speeds → floating feel.
3. **Idle float**   cards/graphics slow ±6–10px Y drift, staggered.
4. **Scroll reveals**   text by line (mask-up), elements fade + rise + slight scale.
5. **Magnetic buttons**   primary CTA pulls subtly toward cursor.
6. **Ink underline / shine**   key words get a near-black underline wipe or a subtle light sweep (the monochrome replacement for the old red spark).

### 4.3 Assets & performance (NO VIDEO, minimal assets)
- Brand graphics = **SVG/canvas animated in code** (morph, grid, dot-field). No video, no AI renders.
- Any raster (e.g. founder photo) ships as PNG/WebP 1x/2x with explicit dimensions (no CLS), lazy below fold.
- Cap animation work with `will-change` surgically; drive everything off the Lenis/GSAP ticker.
- Reduced-motion: static states, simple fades, morph shown in its resolved "grid" state.

---

## 5. Page structure (section map & narrative)

Same architecture; copy is placeholder except the hero.

| # | Section | Job |
|---|---|---|
| 0 | Header (sticky) | Wordmark, nav, EN\|ES toggle, "Book a call" CTA |
| 1 | Hero | "Your ideas into software." + Entropy graphic + CTA |
| 2 | How it works (3 steps) | Idea+budget → we scope it → we build it / money back (placeholder) |
| 3 | What we build | Categories of automations/software (placeholder) |
| 4 | Why zaz | Differentiators (placeholder) |
| 5 | Founder | Personal trust   Alejandro Gómez Orozco (placeholder) |
| 6 | Final CTA | Calendly conversion moment |
| 7 | Footer | Nav, contact, language, socials |

Detailed per-section architecture lives in `01`–`09`.

---

## 6. Copy deck

### Header / nav (EN / ES)
- How it works / Cómo funciona · What we build / Qué hacemos · Why zaz / Por qué zaz · Contact / Contacto
- CTA: Book a call / Agenda una llamada

### 1. Hero (real)
- Headline: **Your ideas into software.** / **Tus ideas en software.**
- Sub: Save time, automate your work, and ease your workflow   all within your budget. /
  Ahorra tiempo, automatiza tu trabajo y simplifica tu flujo   todo dentro de tu presupuesto.
- CTA: Book a call / Agenda una llamada · Secondary: See how it works / Cómo funciona

### 2–5. Placeholders
> Use lorem ipsum for headlines/body until Alejandro provides copy. Each section file states its
> *purpose* and *structure* so layout/animation can be built now and text dropped in later.

### 6. Final CTA (real-ish)
- Headline: **Have an idea? Let's build it.** / **¿Tienes una idea? Construyámosla.**
- CTA: Book a call / Agenda una llamada

---

## 7. Asset list & prompts (minimal   mostly code)

Most visuals are code/SVG. You only generate a few brand marks.
| Asset | Notes | Delivery |
|---|---|---|
| Morph graphic (hero) | Built in code (SVG/canvas). No asset. |   |
| Dot-grid / ambient texture | Code (SVG/CSS). No asset. |   |
| Wordmark `zaz` | Vector, PP Neue Montreal, near-black + inverted light versions | `public/brand/wordmark.svg` |
| Mark / favicon | Frozen morph frame or grid-`z` | `public/brand/icon.svg` + favicons |
| Icon set (categories) | Monochrome geometric line icons, single weight | `public/brand/icons/*.svg` |
| Founder portrait | Real photo preferred, neutral/monochrome grade | `public/founder/portrait.jpg` (+2x) |
| OG image (1200×630) | Wordmark + "Your ideas into software." on off-white | `public/brand/og.png` |

Prompt (mark/icon exploration, monochrome):
> "Minimal modern monochrome brand mark for a software studio 'zaz'. A single abstract geometric
> figure showing an organic blob transforming into a precise grid of squares (idea becoming
> software). Flat vector, black on white, no gradients, no color, high contrast, simple and
> memorable, tech-brand quality. Also a compact icon version for a favicon."

---

## 8. Implementation notes for the coding agent
- **Tailwind v4:** define tokens (§3) in the `@theme` block (CSS-first). Read `node_modules/next/dist/docs/`   this Next.js has breaking changes vs. training data.
- **Fonts:** PP Neue Montreal (licensed) or free substitute (Geist/General Sans) + Geist Mono; self-host, `font-display: swap`.
- **i18n:** `next-intl`, `en`/`es` catalogs, one namespace per section; toggle persists (cookie); SSR-safe.
- **Structure:** one component per section; shared UI (`MagneticButton`, `SectionEyebrow`, `MorphGraphic`, `DotGrid`) built once (DRY). Files < 300 lines.
- **A11y:** keyboard nav, visible focus rings, `prefers-reduced-motion`, alt text, AA contrast (near-black on off-white passes easily).
- **Conversion:** Calendly inline popup on all CTAs; track clicks; link in `.env` (never hardcoded).

---

## 9. Decisions log
- ✅ **Monochrome, light, white-forward.** No red, no color. Contrast = accent.
- ✅ Font: **PP Neue Montreal** (free fallback: Geist / General Sans) + Geist Mono.
- ✅ Brand motif: **Entropy** (chaos → order particle field)   live canvas component in
  `components/ui/entropy.tsx`. Left = ideas/chaos, right = software/order. Theme-aware.
- ✅ Hero: "Your ideas into software." + save-time/automate sub + Book a call.
- ✅ No video. Brand visuals are SVG/canvas animated in code.
- ✅ Other sections use placeholder/lorem copy for now.
- ✅ EN | ES toggle · Calendly conversion · both audiences · qualitative trust (no fake data).
- ⏳ Calendly account/link. ⏳ Final subtitle wording. ⏳ PP Neue Montreal license vs. free substitute.
