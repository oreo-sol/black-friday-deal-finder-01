// FridayFinder — a Black Friday deal finder for make.fun's
// black-friday-deal-finder-01 bounty (program/v1).
//
// The site is plain static files in app/: index.html opens it, main.js renders
// it, data.js holds the 36 deals the agent found and checked on 27 Nov 2026,
// views.js builds the pages, verdict.js scores each deal. Nothing it runs,
// styles or shows loads over the network — every store link is just an <a href>
// out to the store, and the deals are data in the site's own files.
//
// This program hands the site in: it copies app/ and screenshots/ from beside
// this file into /output and writes /output/dossier.json with the kit's vendored
// buildDossier, exactly as the scorer rebuilds it. Outside the grader,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), {
    recursive: true,
  });
}

// The scorer's own caps: at most 4 screenshots, each at most 256 KiB; app/ at
// most 993 files and directories and 16 MiB in all; the dossier text at most
// 160 KiB. FridayFinder is far inside all of them.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
