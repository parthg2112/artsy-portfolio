# artsy-portfolio

A personal portfolio site. Next.js 16 (App Router), React 19, TypeScript strict,
Tailwind CSS v4, `motion` for animation.

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # lint + typecheck + build
```

## Routes

| route | what |
|---|---|
| `/` `/about` `/contact` | the site |
| `/original` `/original/about` `/original/contact` | the same pages rendered with the reference artwork, for comparison - development only |

Content and artwork are separated. Every word lives in a single content module under
`src/content/`; the artwork lives in interchangeable **asset packs** under
`src/assets/packs/`. Both packs feed the same layout components, so the two variants are
geometrically identical and only the pictures change.

## The `/original` route needs artwork you do not have

`public/portfolio/original/images/` is **gitignored**. It holds 26 MB of artwork from
[artofadditti.com](https://www.artofadditti.com/), which belongs to Aditi Kulkarni and is
kept locally as a design reference only. It is not ours to redistribute, so it never
enters the history and never ships. Those routes also return a 404 in production.

A fresh clone therefore renders `/original` with broken images in development. That is
expected. The site itself (`/`, `/about`, `/contact`) is complete and self-contained.

## Docs

`docs/PORTFOLIO.md` is the handoff: where to change words, how the asset packs work, the
photo crop table, and the layout invariants that will bite you if you edit blindly.

`docs/design-references/` (screenshots) is gitignored too; regenerate it with
`node scripts/shoot-references.mjs` while the dev server is running.
