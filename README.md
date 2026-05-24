# Mateus Cavalcanti

A static blog for notes on behavioral psychology, philosophy, attention, narcissism, and the exchanges underneath ordinary life.

## Write

Posts live in `posts/` as Markdown files. Create a new file like:

```md
---
title: "The Title"
subtitle: "Optional subtitle."
date: "2026-05-23"
category: "recursive doubt"
tags:
  - behavioral psychology
  - philosophy
excerpt: "A short summary for archive pages."
featured: false
---

Your post starts here.
```

Use `YYYY-MM-DD-title.md` filenames. The date is displayed as `YYYY — MM — DD` on the site.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

The static site is generated into `out/`.

## Publish On GitHub Pages

Push to `main`. The GitHub Actions workflow in `.github/workflows/pages.yml` builds the static export and deploys `out/` to GitHub Pages.

In the GitHub repository settings, set **Pages** to use **GitHub Actions** as the source. Project Pages are supported automatically; the workflow and `next.config.ts` infer the repository subpath during CI.
