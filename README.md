# FridayFinder — Real Black Friday deals, checked today

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/oreo-sol/black-friday-deal-finder-01/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/oreo-sol/black-friday-deal-finder-01/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

A static deal finder for Black Friday 2026 — 36 real deals across 9 categories and 5 stores, each price checked on Friday 27 November 2026 at a named store or in a deals source that names the store.

Every deal carries its product, store, sale price, usual price, discount, a link to the product at the store, and when its price was checked — plus an honest verdict badge: **NEW LOW** (lowest price ever tracked), **STRONG DEAL** (25%+ off or $150+ saved), or **ROUTINE DEAL** (a real cut, but a small one).

Search and filters work in the browser with no network request: search by name, filter by category, store and minimum discount, sort by best deal / biggest discount / biggest saving / price, and a new-lows-only toggle. Each deal also has its own detail page with the full facts and the evidence behind its verdict.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

Open `app/index.html` in any browser, desktop or phone. The site is plain static files — no build step, no network requests at run time.

## Hand-in

`main.ts` copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the kit's vendored `buildDossier`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Entry for the [black-friday-deal-finder-01 bounty on make.fun](https://make.fun/c/black-friday-deal-finder-01).
