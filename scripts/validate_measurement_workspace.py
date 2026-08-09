"""Validate the local SEO/GEO measurement intake UI boundary."""
from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path


SECRET_PATTERN = re.compile(
    r"(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY)",
    re.I,
)


def rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the measurement intake workspace")
    parser.add_argument("--html", type=Path, default=Path("app/measurement_workspace.html"))
    parser.add_argument("--gsc", type=Path, default=Path("data/sample/gsc_export_template.csv"))
    parser.add_argument("--geo", type=Path, default=Path("data/sample/geo_observations_template.csv"))
    parser.add_argument("--output", type=Path, default=Path("output/measurement_workspace_report.md"))
    args = parser.parse_args()
    errors: list[str] = []
    page = args.html.read_text(encoding="utf-8") if args.html.exists() else ""
    markers = (
        "SEO + GEO Measurement Intake",
        "TEMPLATE / TODO: replace with verified data",
        "localStorage",
        "GSC",
        "GEO",
        "cannot promote a row to VERIFIED",
    )
    for marker in markers:
        if marker not in page:
            errors.append(f"missing workspace marker: {marker}")
    if "innerHTML" in page:
        errors.append("workspace should use text-safe DOM updates")
    if re.search(r"fetch\(|XMLHttpRequest|/v1/|https?://api\.", page, re.I):
        errors.append("workspace must not call external APIs")
    if re.search(r"<option[^>]*>\s*VERIFIED\s*</option>", page, re.I):
        errors.append("workspace must not offer an automatic VERIFIED control")
    if SECRET_PATTERN.search(page):
        errors.append("secret-like material detected")
    try:
        gsc = rows(args.gsc)
        geo = rows(args.geo)
    except (OSError, csv.Error) as exc:
        gsc, geo = [], []
        errors.append(f"template input error: {exc}")
    expected = len(gsc) + len(geo)
    cards = len(re.findall(r'class="row" data-kind="(?:GSC|GEO)"', page))
    if cards != expected:
        errors.append(f"workspace cards={cards} but templates contain {expected} rows")
    if any(row.get("data_status", "").startswith("TODO") is False for row in gsc + geo):
        errors.append("template rows must retain TODO data_status")
    lines = [
        "# Measurement Workspace Report",
        "",
        "> OFFLINE UI CONTRACT. Local drafts are preparation only; CSV validator and source evidence control verification.",
        "",
        f"- GSC rows: {len(gsc)}",
        f"- GEO rows: {len(geo)}",
        f"- Workspace cards: {cards}",
        f"- Validation errors: {len(errors)}",
        "- VERIFIED promotion: external evidence and Python validator required",
        "",
    ]
    if errors:
        lines += ["## Errors", ""] + [f"- {error}" for error in errors]
    else:
        lines.append("No workspace boundary errors found.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {args.output}: cards={cards} errors={len(errors)}")
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
