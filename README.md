# 01 - AI Research Digest Research Site

An English-first, bilingual static site for **AI Research Digest**, a research workflow tool for overseas researchers. The primary SEO line is `AI tools and workflows for researchers`; the pilot editorial collection is `AI and politics`.

## Included

- Home, Digest library, single-record detail, and methodology pages
- Chinese/English toggle, topic filters, search, public source links
- SEO/GEO files: sitemap, robots, JSON data fixtures, and `llms.txt`
- Local visual workflow assets showing paper -> evidence -> brief
- Product routes: Research Question Explorer, Compare Briefs, five-part case study page, Portfolio Evidence, PM Interview Evidence, Overseas Operations Playbook, and the cross-project Decision Readout Index
- Measurement inputs: `data/sample/gsc_export_template.csv`, `data/sample/geo_observations_template.csv`, and `scripts/validate_measurement_inputs.py` keep future Search Console/GEO exports date-, source-, and reviewer-aware.
- Measurement intake workspace: `app/measurement_workspace.html` and `scripts/validate_measurement_workspace.py` provide a local draft surface without promoting rows to `VERIFIED`.

## Truthfulness

Sources are public links and records are editorial demonstrations. GSC impressions, rankings, AI citations, backlinks, conversions, and traffic remain `TODO: replace with verified data`.

## Run

```powershell
npm install
npm run build
npm run preview
```

The preview server is available at `http://127.0.0.1:4173` when running locally.

Public metadata smoke test (read-only, bounded):

```powershell
py -3 scripts/collect_public_arxiv.py --query "AI governance" --limit 6 --output output/public_arxiv_metadata.json --live
py -3 scripts/validate_public_arxiv.py --input output/public_arxiv_metadata.json
```

The output carries collection time, query, schema, terms TODO, and human-owner fields. It is public reference metadata, not verified editorial evidence.

Measurement workspace (template-only):

```powershell
py -3 scripts/render_measurement_workspace.py --gsc data/sample/gsc_export_template.csv --geo data/sample/geo_observations_template.csv --output app/measurement_workspace.html
py -3 scripts/validate_measurement_workspace.py --html app/measurement_workspace.html --gsc data/sample/gsc_export_template.csv --geo data/sample/geo_observations_template.csv --output output/measurement_workspace_report.md
```

Product case study: `docs/case-study.md`.
Research agenda: `docs/research-agenda.md` lists 12 source-linked planning questions; `agenda.html` exposes them as a navigable local route.
Editorial governance: `docs/editorial_principles.md`; outreach drafts: `docs/outreach_templates.md`.
Public metadata handoff: `scripts/collect_public_arxiv.py` and `scripts/validate_public_arxiv.py` create a bounded, provenance-labelled arXiv metadata sample. Live mode is read-only and does not replace editorial verification.
