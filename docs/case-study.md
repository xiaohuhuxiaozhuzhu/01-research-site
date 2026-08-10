# Case Study: Evidence-first Research Site

## Problem

Researchers need a short answer, but a short answer without a source or limitation is difficult to trust and reuse.

## Product decision

Make question, method, finding, limitation, source status, and next action first-class fields. Add an explorer for research tasks and a comparison view for choosing between two briefs.

## Trade-off

The interface is more explicit than a typical summary feed. It takes more editorial space, but it makes verification and bilingual review visible.

## Evidence

- 19 static routes with structured metadata and SEO checks, including portfolio evidence, PM interview, and overseas operations pages.
- 28 local source-linked editorial records with author/date/evidence/next-action metadata, including six AI-and-politics reading-room briefs.
- 20-row GEO observation template, 15 long-form topics, 30 programmatic page candidates, and editorial principles.
- GSC/GEO measurement input templates with a validator that blocks incomplete verified rows.
- Compare, Explorer, and case-study pages are runnable locally.

The records and route count are local MVP evidence, not traffic or ranking results.

## Decision log

- **Observation:** A researcher can read a summary quickly, but the sample card
  does not make source status, limitation, or the next action equally visible.
- **Hypothesis:** If the entry point starts with a research task and keeps the
  evidence fields visible, a reader can compare briefs without treating a fluent
  paragraph as proof.
- **Decision:** Build task-path filters and a side-by-side comparison contract
  before adding more editorial automation.
- **Trade-off:** Explicit evidence fields consume more screen space and require
  editorial discipline, but the product decision is easier to audit and translate.

## Artifact flow

`src/data/digests.json` -> content validator -> static build -> SEO/schema checks
-> Explorer/Compare/detail routes. The measurement workspace accepts future GSC
and GEO exports as a separate intake; it cannot promote a TODO row to a verified
observation.

## Failure and fallback

An incomplete source URL, limitation, or data-status field blocks the content
check. A network failure in the public metadata smoke test is retained as an
error state rather than filled with a guessed citation. The fallback is a
human-reviewed draft with a visible `VERIFY BEFORE CLAIM` marker.

## Interview-safe framing

I can defend the information architecture, evidence contract, and local
validation path. I cannot claim SEO traffic, indexing, click-through, or GEO
citation results until the site has a real domain, dated exports, and a human
review of the evidence ledger.

## Next experiment

Moderate five research tasks. Measure time to identify the source and limitation, then revise the card and detail layout.
