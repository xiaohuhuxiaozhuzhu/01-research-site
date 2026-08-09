"""Validate the provenance contract for the bounded public arXiv sample."""
from __future__ import annotations

import argparse
import json
from pathlib import Path


REQUIRED = (
    "data_status",
    "source_url",
    "collected_at",
    "region",
    "schema_version",
    "field_definitions",
    "license_or_consent",
    "sample_size",
    "calculation",
    "verification_owner",
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("output/public_arxiv_metadata.json"))
    args = parser.parse_args()
    payload = json.loads(args.input.read_text(encoding="utf-8"))
    missing = [field for field in REQUIRED if not str(payload.get(field, "")).strip()]
    errors = []
    if missing:
        errors.append("missing: " + ", ".join(missing))
    if payload.get("data_status") != "PUBLIC REFERENCE DATA / TODO HUMAN REVIEW":
        errors.append("data_status must keep the human-review boundary")
    if not str(payload.get("source_url", "")).startswith("https://"):
        errors.append("source_url must be HTTPS")
    records = payload.get("records", [])
    if not isinstance(records, list):
        errors.append("records must be a list")
    for index, record in enumerate(records, start=1):
        for field in ("id", "title", "published", "source_url"):
            if not str(record.get(field, "")).strip():
                errors.append(f"record {index}: missing {field}")
    if errors:
        print("\n".join(errors))
        raise SystemExit(1)
    print(f"public arXiv provenance valid: records={len(records)}; request_status={payload.get('request_status')}")


if __name__ == "__main__":
    main()
