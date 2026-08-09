"""Render a local SEO/GEO measurement intake workspace from CSV templates."""
from __future__ import annotations

import argparse
import csv
import html
import json
from pathlib import Path


def read_rows(path: Path, kind: str) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    for row in rows:
        row["measurement_type"] = kind
    return rows


def esc(value: object) -> str:
    return html.escape(str(value or ""), quote=True)


def card(row: dict[str, str], index: int) -> str:
    kind = row["measurement_type"]
    rid = f"{kind.lower()}-{index}"
    if kind == "GSC":
        fields = [
            ("country", "Country"), ("language", "Language"), ("date", "Export date"),
            ("impressions", "Impressions"), ("clicks", "Clicks"), ("position", "Position"),
            ("notes", "Notes"),
        ]
    else:
        fields = [
            ("platform", "Platform"), ("observed_at", "Observed at"), ("country", "Country"),
            ("language", "Language"), ("raw_answer_path", "Raw answer path"), ("cited_urls", "Cited URLs"),
            ("citation_position", "Citation position"), ("brand_mentioned", "Brand mentioned"),
            ("claim_accuracy", "Claim accuracy"), ("caveat_preserved", "Caveat preserved"),
            ("reviewer", "Reviewer"),
        ]
    controls = "".join(
        f'<label>{esc(label)}<input data-field="{esc(field)}" data-row="{esc(rid)}" value="{esc(row.get(field, ""))}"></label>'
        for field, label in fields
    )
    return f'''<article class="row" data-kind="{esc(kind)}" data-row="{esc(rid)}" data-query="{esc(row.get("query", ""))}">
<header><span class="type">{esc(kind)}</span><h2>{esc(row.get("query", ""))}</h2><span class="status">{esc(row.get("data_status", "TODO"))}</span></header>
<p class="boundary">{esc(row.get("data_status", "TODO"))}</p><div class="fields">{controls}</div>
<button type="button" data-save="{esc(rid)}">Save local draft</button><p class="saved" data-saved="{esc(rid)}" aria-live="polite"></p></article>'''


def render(rows: list[dict[str, str]]) -> str:
    cards = "\n".join(card(row, index) for index, row in enumerate(rows, start=1))
    payload = json.dumps(rows, ensure_ascii=False).replace("</", "<\\/")
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SEO + GEO Measurement Intake</title><style>
:root{{--ink:#17202a;--muted:#64727f;--line:#d7dee5;--paper:#f7f8fa;--accent:#1d4ed8;--warn:#8a4b08}}*{{box-sizing:border-box}}body{{margin:0;color:var(--ink);background:var(--paper);font:14px/1.5 system-ui,sans-serif}}main{{max-width:1280px;margin:auto;padding:30px 5vw 70px}}.eyebrow{{margin:0;color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}}h1{{margin:8px 0;font-size:clamp(28px,4vw,48px);line-height:1.1}}.lede{{max-width:820px;color:var(--muted)}}.notice{{margin:20px 0;padding:12px 14px;background:#fff4e5;border-left:3px solid #d9912b;color:var(--warn);font-size:12px;font-weight:700}}.toolbar{{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:22px 0}}.toolbar input,.toolbar select{{min-height:40px;padding:8px 10px;border:1px solid var(--line);background:#fff;color:var(--ink)}}.toolbar input{{flex:1 1 260px}}.summary{{color:var(--muted);font-size:12px}}.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,500px),1fr));gap:15px}}.row{{padding:18px;background:#fff;border:1px solid var(--line);border-radius:7px}}.row[hidden]{{display:none}}.row header{{display:flex;gap:8px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:10px}}.row header h2{{margin:0;font-size:18px;flex:1;min-width:0;overflow-wrap:anywhere}}.type{{color:var(--accent);font-size:11px;font-weight:800}}.status{{max-width:45%;color:var(--warn);font-size:11px;text-align:right;overflow-wrap:anywhere}}.boundary{{color:var(--warn);font-size:11px;margin:10px 0}}.fields{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}}label{{display:flex;flex-direction:column;gap:4px;color:var(--muted);font-size:11px;font-weight:700}}label input{{width:100%;padding:8px;border:1px solid var(--line);background:#fff;color:var(--ink)}}button{{margin-top:12px;padding:9px 12px;border:1px solid var(--accent);border-radius:5px;background:var(--accent);color:#fff;cursor:pointer}}.saved{{min-height:18px;color:var(--accent);font-size:11px}}@media(max-width:560px){{main{{padding-inline:14px}}.fields{{grid-template-columns:1fr}}}}
</style></head><body><main><p class="eyebrow">AI RESEARCH DIGEST / MEASUREMENT CONTRACT</p><h1>SEO + GEO Measurement Intake</h1><p class="lede">A local handoff board for Search Console exports and manually observed AI answers. Fill only from an authorized export or archived public answer, then update the CSV and run the Python validator.</p><div class="notice">TEMPLATE / TODO: replace with verified data. This page does not show traffic, ranking, citation, or conversion outcomes and cannot promote a row to VERIFIED.</div><div class="toolbar"><input id="search" type="search" placeholder="Search query, platform, or country"><select id="kind"><option value="all">All inputs</option><option>GSC</option><option>GEO</option></select><span id="summary" class="summary"></span></div><section id="grid" class="grid">{cards}</section></main>
<script>const ROWS={payload};const draftKey='measurement-intake-drafts';const drafts=JSON.parse(localStorage.getItem(draftKey)||'{{}}');const save=(id)=>{{const row=document.querySelector(`[data-row="${{id}}"]`);const data={{}};row.querySelectorAll('[data-field]').forEach((input)=>data[input.dataset.field]=input.value);drafts[id]=data;localStorage.setItem(draftKey,JSON.stringify(drafts));row.querySelector('[data-saved]').textContent='Saved locally; source and status remain unchanged.'}};document.querySelectorAll('[data-row]').forEach((row)=>{{const id=row.dataset.row;const d=drafts[id]||{{}};row.querySelectorAll('[data-field]').forEach((input)=>{{if(d[input.dataset.field]!==undefined)input.value=d[input.dataset.field]}});row.querySelector('[data-save]').onclick=()=>save(id)}});const filter=()=>{{const q=document.getElementById('search').value.toLowerCase(),k=document.getElementById('kind').value;let shown=0;document.querySelectorAll('.row').forEach((row)=>{{const okText=!q||(row.textContent+' '+row.dataset.query).toLowerCase().includes(q);const okKind=k==='all'||row.dataset.kind===k;row.hidden=!(okText&&okKind);if(okText&&okKind)shown++}});document.getElementById('summary').textContent=`${{shown}} / ${{ROWS.length}} inputs shown · local drafts only`}};search.oninput=filter;kind.onchange=filter;filter();</script></body></html>'''


def main() -> int:
    parser = argparse.ArgumentParser(description="Render the SEO/GEO measurement workspace")
    parser.add_argument("--gsc", type=Path, default=Path("data/sample/gsc_export_template.csv"))
    parser.add_argument("--geo", type=Path, default=Path("data/sample/geo_observations_template.csv"))
    parser.add_argument("--output", type=Path, default=Path("app/measurement_workspace.html"))
    args = parser.parse_args()
    rows = read_rows(args.gsc, "GSC") + read_rows(args.geo, "GEO")
    if not rows:
        raise SystemExit("measurement templates contain no rows")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render(rows), encoding="utf-8")
    print(f"wrote {args.output}: inputs={len(rows)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
