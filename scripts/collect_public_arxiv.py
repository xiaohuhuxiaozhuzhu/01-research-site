"""Collect a bounded arXiv metadata sample without authentication or full text."""
from __future__ import annotations

import argparse
import datetime as dt
import json
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


ATOM = "http://www.w3.org/2005/Atom"
ARXIV = "http://arxiv.org/schemas/atom"


def build_url(query: str, limit: int) -> str:
    params = urllib.parse.urlencode({"search_query": f"all:{query}", "start": 0, "max_results": limit})
    return "https://export.arxiv.org/api/query?" + params


def collect(url: str, limit: int) -> tuple[list[dict], str, str]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "AIResearchDigest-public-metadata-demo/0.1 (contact: TODO)"},
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            body = response.read()
        root = ET.fromstring(body)
    except (urllib.error.URLError, TimeoutError, ET.ParseError) as exc:
        return [], "ERROR", str(exc)

    records = []
    for entry in root.findall(f"{{{ATOM}}}entry")[:limit]:
        authors = [
            name.text.strip()
            for name in entry.findall(f"{{{ATOM}}}author/{{{ATOM}}}name")
            if name.text and name.text.strip()
        ]
        links = [
            link.attrib.get("href", "")
            for link in entry.findall(f"{{{ATOM}}}link")
            if link.attrib.get("rel") in {None, "alternate"} and link.attrib.get("href")
        ]
        category = entry.find(f"{{{ARXIV}}}primary_category")
        records.append(
            {
                "id": entry.findtext(f"{{{ATOM}}}id", "").strip(),
                "title": " ".join(entry.findtext(f"{{{ATOM}}}title", "").split()),
                "authors": authors,
                "published": entry.findtext(f"{{{ATOM}}}published", "").strip(),
                "updated": entry.findtext(f"{{{ATOM}}}updated", "").strip(),
                "primary_category": category.attrib.get("term", "TODO") if category is not None else "TODO",
                "source_url": links[0] if links else entry.findtext(f"{{{ATOM}}}id", "").strip(),
            }
        )
    return records, "OK", ""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", default="AI governance")
    parser.add_argument("--limit", type=int, default=6)
    parser.add_argument("--output", type=Path, default=Path("output/public_arxiv_metadata.json"))
    parser.add_argument("--live", action="store_true", help="Make one bounded read-only request")
    args = parser.parse_args()
    limit = max(1, min(args.limit, 6))
    url = build_url(args.query, limit)
    collected_at = dt.datetime.now(dt.timezone.utc).isoformat()
    records: list[dict] = []
    request_status = "DRY_RUN"
    error = ""
    if args.live:
        records, request_status, error = collect(url, limit)

    payload = {
        "data_status": "PUBLIC REFERENCE DATA / TODO HUMAN REVIEW",
        "source": "arXiv public API metadata only",
        "source_url": url,
        "query": args.query,
        "collected_at": collected_at,
        "region": "global",
        "schema_version": "arxiv-metadata-v1",
        "field_definitions": "docs/public_metadata_collection.md",
        "license_or_consent": "Public API response; verify arXiv terms and each source license before reuse",
        "sample_size": f"up to {limit} records; first page only",
        "calculation": "No performance or research metric calculated; metadata is an editorial discovery input",
        "verification_owner": "TODO: human editor",
        "live_request": bool(args.live),
        "request_status": request_status,
        "error": error,
        "records": records,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(records)} public arXiv metadata records; live={args.live}; status={request_status}")


if __name__ == "__main__":
    main()
