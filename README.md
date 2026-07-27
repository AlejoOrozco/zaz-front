# zaz frontend

Marketing site for **zaz**   bespoke software, automations, and AI agents.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- GSAP (ScrollTrigger)

## Develop

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm lint
pnpm build
```

## Structure

- `app/`   layout, page, global styles
- `components/sections/`   landing sections
- `components/shell/`   header, footer, locale/theme provider
- `components/ui/`   StarButton, Entropy, feature icons
- `components/motion/`   GSAP setup + helpers
- `public/images/what-we-build/`   feature previews
- `docs/brand-brief.md`   brand brief for logo / favicon work
- `plans/`   design notes (some older specs are historical)

## Brand

See [`docs/brand-brief.md`](docs/brand-brief.md).
