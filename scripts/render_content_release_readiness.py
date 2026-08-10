"""Render a release-readiness report for source-linked editorial briefs."""
from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path


REQUIRED = ("id", "title", "titleZh", "question", "questionZh", "method", "methodZh", "finding", "findingZh", "limitation", "limitationZh", "source", "sourceStatus", "author", "authorStatus", "evidenceLevel", "nextAction", "contentStatus")
SECRET_PATTERN = re.compile(r"(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY)", re.I)


def read_csv(path: Path, label: str) -> tuple[list[dict[str, str]], list[str]]:
    try:
        with path.open(encoding="utf-8", newline="") as handle:
            return list(csv.DictReader(handle)), []
    except (OSError, csv.Error) as exc:
        return [], [f"{label} input error: {exc}"]


def main() -> int:
    parser = argparse.ArgumentParser(description="Render content release readiness")
    parser.add_argument("--input", type=Path, default=Path("src/data/digests.json"))
    parser.add_argument("--gsc", type=Path, default=Path("data/sample/gsc_export_template.csv"))
    parser.add_argument("--geo", type=Path, default=Path("data/sample/geo_observations_template.csv"))
    parser.add_argument("--output", type=Path, default=Path("output/content_release_readiness.md"))
    args = parser.parse_args()
    errors: list[str] = []
    try:
        records = json.loads(args.input.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        records = []
        errors.append(f"brief input error: {exc}")
    if not isinstance(records, list):
        records = []
        errors.append("brief input must be a JSON array")
    if len(records) != 28:
        errors.append(f"expected 28 brief records, found {len(records)}")
    readiness_rows: list[tuple[str, str, str, str, str]] = []
    for index, record in enumerate(records, start=1):
        if not isinstance(record, dict):
            errors.append(f"record {index}: must be an object")
            continue
        missing = [field for field in REQUIRED if not str(record.get(field, "")).strip()]
        if missing:
            errors.append(f"{record.get('id', index)}: missing {', '.join(missing)}")
        source_status = str(record.get("sourceStatus", ""))
        author_status = str(record.get("authorStatus", ""))
        content_status = str(record.get("contentStatus", ""))
        if not source_status.startswith("PUBLIC SOURCE"):
            errors.append(f"{record.get('id', index)}: sourceStatus must retain PUBLIC SOURCE")
        if "SYNTHETIC" not in author_status:
            errors.append(f"{record.get('id', index)}: authorStatus must retain SYNTHETIC")
        if "HUMAN REVIEW REQUIRED" not in content_status:
            errors.append(f"{record.get('id', index)}: contentStatus must retain HUMAN REVIEW REQUIRED")
        if not str(record.get("source", "")).startswith("https://"):
            errors.append(f"{record.get('id', index)}: source must be HTTPS")
        if SECRET_PATTERN.search(json.dumps(record, ensure_ascii=False)):
            errors.append(f"{record.get('id', index)}: secret-like content detected")
        readiness_rows.append((str(record.get("id", "")), str(record.get("topic", "")), source_status, author_status, "BLOCKED / EDITOR REVIEW"))
    gsc_rows, gsc_errors = read_csv(args.gsc, "GSC")
    geo_rows, geo_errors = read_csv(args.geo, "GEO")
    errors.extend(gsc_errors + geo_errors)
    for label, rows in (("GSC", gsc_rows), ("GEO", geo_rows)):
        for row in rows:
            status = row.get("data_status", "")
            if not status.startswith("TODO") and "VERIFIED" not in status:
                errors.append(f"{label}: unknown data_status {status}")
    lines = [
        "# Content Release Readiness Report", "",
        "> OFFLINE EDITORIAL AND SEO/GEO GATE. This report checks packaging fields and future measurement templates; it does not prove publication, indexing, citations, clicks, or brand visibility.", "",
        f"- Brief records: {len(records)}/28", f"- GSC template rows: {len(gsc_rows)}", f"- GEO template rows: {len(geo_rows)}", "- Briefs ready for external publication: 0 (human editor review required)", "- Search / GEO outcomes: 0 asserted (templates remain TODO)", f"- Validation errors: {len(errors)}", "- Data status: PUBLIC SOURCE / EDITORIAL DEMO; SYNTHETIC DEMO DATA; VERIFY BEFORE CLAIM", "",
        "## Brief Queue", "", "| Brief | Topic | Source status | Author status | Readiness |", "| --- | --- | --- | --- | --- |",
    ]
    lines.extend(f"| {brief_id} | {topic} | {source_status} | {author_status} | {status} |" for brief_id, topic, source_status, author_status, status in readiness_rows)
    lines += ["", "## Promotion Rule", "", "A human editor must verify the source, limitation, audience fit, bilingual parity, author/edit history, and next action before publication. Real GSC or GEO evidence must preserve query, country/language, date, raw answer, cited URLs, reviewer, and collection boundary before any SEO/GEO claim enters a resume.", ""]
    if errors:
        lines += ["## Errors", ""] + [f"- {error}" for error in errors]
    else:
        lines.append("All 28 records and measurement templates preserve editorial, source, author, and human-review gates.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {args.output}: briefs={len(records)} gsc={len(gsc_rows)} geo={len(geo_rows)} errors={len(errors)}")
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
