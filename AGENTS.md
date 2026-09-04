# shreya.codes

Personal portfolio for Shreya Chourasia. Next.js 16 App Router, React 19, TypeScript
strict, Tailwind CSS v4 (CSS-first, no config file), `motion` for animation.

**Read `docs/PORTFOLIO.md` before editing.** It holds the layout invariants — measured
pixel widths, the row sums the hero heading depends on, the card-height rule the work
grid relies on — that are not obvious from the code and that break silently.

## Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- `npm run check` runs all three

## Rules that matter here
- The breakpoint is **810px**. Use `max-[809px]:` / `min-[810px]:`. Tailwind's `md`/`lg`
  do not match this design.
- Words go in `src/content/shreya.ts`, artwork in `src/assets/packs/`. Never hardcode
  copy or an image path in a component.
- `/` and `/original` must stay geometrically identical. Geometry lives in the layout
  components; an asset pack only supplies `src` plus that image's own dimensions.
- No `any`. Named exports, PascalCase components, 2-space indent, mobile-first.
- Comments explain a non-obvious *why* in at most two lines. Long-form reasoning goes in
  `docs/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
