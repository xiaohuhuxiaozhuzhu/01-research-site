"""Validate future GSC and manual GEO imports without claiming results."""
from __future__ import annotations

import argparse
import csv
from pathlib import Path


GSC_COLUMNS = {"query", "country", "language", "date", "source", "impressions", "clicks", "position", "notes", "data_status"}
GEO_COLUMNS = {"query", "platform", "observed_at", "country", "language", "raw_answer_path", "cited_urls", "citation_position", "brand_mentioned", "claim_accuracy", "caveat_preserved", "reviewer", "observation_status", "data_status"}
TODO = "TODO"
VERIFIED = "VERIFIED"
VERIFIED_DATA = ("PUBLIC VERIFIED DATA", "VERIFIED REAL DATA")


def read_rows(path: Path, required: set[str], label: str) -> tuple[list[dict[str, str]], list[str]]:
    errors: list[str] = []
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        columns = set(reader.fieldnames or [])
        errors.extend(f"{label}: missing column {column}" for column in sorted(required - columns))
        rows = list(reader)
    for line_number, row in enumerate(rows, start=2):
        for column in required:
            if not row.get(column, "").strip():
                errors.append(f"{label} line {line_number}: empty {column}")
    return rows, errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--gsc", type=Path, default=Path("data/sample/gsc_export_template.csv"))
    parser.add_argument("--geo", type=Path, default=Path("data/sample/geo_observations_template.csv"))
    parser.add_argument("--output", type=Path, default=Path("output/measurement_input_report.md"))
    args = parser.parse_args()
    errors: list[str] = []
    gsc_rows, gsc_errors = read_rows(args.gsc, GSC_COLUMNS, "GSC")
    geo_rows, geo_errors = read_rows(args.geo, GEO_COLUMNS, "GEO")
    errors.extend(gsc_errors + geo_errors)

    for line_number, row in enumerate(gsc_rows, start=2):
        status = row.get("data_status", "").strip()
        if status == VERIFIED:
            if not any(marker in row.get("data_status", "") for marker in VERIFIED_DATA):
                errors.append(f"GSC line {line_number}: VERIFIED requires a verified data-status marker")
            if any(row.get(field, "").strip() == TODO for field in ("date", "impressions", "clicks", "position")):
                errors.append(f"GSC line {line_number}: VERIFIED row still contains TODO measurement fields")
        elif not status.startswith("TODO") and not any(marker in status for marker in VERIFIED_DATA):
            errors.append(f"GSC line {line_number}: unknown data_status {status!r}")

    for line_number, row in enumerate(geo_rows, start=2):
        observation_status = row.get("observation_status", "").strip()
        data_status = row.get("data_status", "").strip()
        if observation_status not in {TODO, VERIFIED, "BLOCKED"}:
            errors.append(f"GEO line {line_number}: invalid observation_status {observation_status!r}")
        if observation_status == VERIFIED:
            if not any(marker in data_status for marker in VERIFIED_DATA):
                errors.append(f"GEO line {line_number}: VERIFIED requires a verified data-status marker")
            for field in ("observed_at", "raw_answer_path", "cited_urls", "reviewer", "claim_accuracy", "caveat_preserved"):
                if row.get(field, "").strip() == TODO:
                    errors.append(f"GEO line {line_number}: VERIFIED row still contains TODO {field}")
        elif not data_status.startswith("TODO") and not any(marker in data_status for marker in VERIFIED_DATA):
            errors.append(f"GEO line {line_number}: unknown data_status {data_status!r}")

    lines = [
        "# Measurement Input Report",
        "",
        "> OFFLINE INPUT CONTRACT. This report validates future imports only; it does not claim GSC performance, rankings, AI citations, or brand visibility.",
        "",
        f"- GSC template rows: {len(gsc_rows)}",
        f"- GEO template rows: {len(geo_rows)}",
        f"- Validation errors: {len(errors)}",
        "",
        "| Input | Rows | Status |",
        "| --- | ---: | --- |",
        f"| GSC | {len(gsc_rows)} | {'PASS' if not gsc_errors else 'SEE ERRORS'} |",
        f"| GEO | {len(geo_rows)} | {'PASS' if not geo_errors else 'SEE ERRORS'} |",
    ]
    if errors:
        lines += ["", "## Errors", ""]
        lines.extend(f"- {error}" for error in errors)
    else:
        lines += ["", "No schema or verification-gate errors found. Template rows remain TODO until real exports and human review are attached."]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {args.output}: gsc={len(gsc_rows)} geo={len(geo_rows)} errors={len(errors)}")
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
