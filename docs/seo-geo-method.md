# SEO / GEO Method (MVP)

This project implements the information architecture and release checks from the 12-week manual without claiming search volume, ranking, traffic, or AI-answer visibility.

## Keyword research

`src/data/keywords.csv` is a seed list, not a measured keyword database. Expand it toward the manual's 500-1000 keyword target only after collecting verified data from Search Console, a licensed keyword tool, or a documented public source. Record source, date, country, language, intent, and confidence for each row.

## Content architecture

`src/data/content-clusters.csv` defines one pillar and satellite pages. Each satellite should link back to the pillar, a related brief, and the methodology page. Programmatic pages must be generated from source-backed records and labeled when data is synthetic.

## SEO release checks

Run `npm run build` followed by `npm run seo:check`. The checker validates one H1, canonical, meta description, JSON-LD, sitemap coverage, and explicit GPTBot/Google-Extended rules. It is a structural check, not evidence of rankings.

## GEO monitoring protocol

Create a dated prompt set for each cluster (for example: "What are reliable AI research tools for literature review?"). Run the same prompts monthly across the chosen public answer engines, capture the exact answer and cited URLs, and code: mention, citation, claim accuracy, and missing caveat. Store results in a versioned CSV. Do not infer platform reach from a single observation.

## Publishing gate

No brief is distributed when its source is missing, its limitation is omitted, or its status is not one of `PUBLIC_SOURCE`, `PUBLIC_SAMPLE`, `SYNTHETIC_DEMO_DATA`, or `TODO: replace with verified data`.
