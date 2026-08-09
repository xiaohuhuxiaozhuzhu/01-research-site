# Public Metadata Collection

The collector uses one bounded, read-only request to the arXiv public API. It
retrieves metadata only; it does not download full text, infer research quality,
or publish a digest.

```powershell
py -3 scripts/collect_public_arxiv.py --query "AI governance" --limit 6 --output output/public_arxiv_metadata.json --live
py -3 scripts/validate_public_arxiv.py --input output/public_arxiv_metadata.json
```

Every output carries `collected_at`, query, request URL, region, schema version,
license/terms TODO, sample rule, and a human verification owner. A reachable API
response proves only that metadata was returned at that time. Before using a
record in the site, an editor must verify the source URL, title, publication
status, scope, license, and whether the source supports the planned claim.

The live mode is intentionally bounded to at most six records and one HTTPS GET.
The default mode is dry-run and writes the same provenance shape with no records.
