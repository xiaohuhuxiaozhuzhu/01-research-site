# SEO And GEO Measurement Inputs

The two CSV files in `data/sample/` are import templates for future Search
Console and manual GEO observations. They are not measured traffic, ranking,
AI citation, or brand-visibility results.

## Search Console

Fill `gsc_export_template.csv` from an authorized property export. Keep the
property, date range, country, language, query, source, and metric definitions.
Do not combine different date ranges or countries without recording the change.

## GEO Observations

Fill `geo_observations_template.csv` by archiving the exact answer and cited
URLs for each query. `citation_position`, `claim_accuracy`, and
`caveat_preserved` require human review; a brand mention is not an endorsement
or a ranking result.

Run the read-only contract check:

```powershell
py -3 scripts/validate_measurement_inputs.py --gsc data/sample/gsc_export_template.csv --geo data/sample/geo_observations_template.csv --output output/measurement_input_report.md
```

Rows become `VERIFIED` only when the raw export/answer, source, date, reviewer,
and data-status fields are complete. Until then, keep `TODO: replace with
verified data` and do not use the values in a resume.
