# Content Release Readiness

The research site contains source-linked editorial demonstrations, not an
automatically publishable content farm. This report joins the 28 brief records
with the future GSC and GEO measurement templates so a product manager can
explain exactly what blocks release and what evidence is needed next.

## Run

```powershell
py -3 scripts/render_content_release_readiness.py --input src/data/digests.json --gsc data/sample/gsc_export_template.csv --geo data/sample/geo_observations_template.csv --output output/content_release_readiness.md
```

All current briefs remain `PUBLIC SOURCE / EDITORIAL DEMO`, `SYNTHETIC DEMO
DATA`, and `HUMAN REVIEW REQUIRED`. The command does not publish, query Search
Console, run GEO prompts, or create indexing/click/citation claims.
