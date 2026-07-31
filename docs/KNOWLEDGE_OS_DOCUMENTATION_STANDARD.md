# Knowledge OS Documentation Standard

**Status:** Canonical reference
**Applies to:** Every file under `content/docs/`
**Established by:** Sprints 1–15
**Owner:** Documentation Architect
**Last updated:** 2026-07-31

This document is the permanent source of truth for how Surely Placed Knowledge OS documentation is written, structured, and validated. It replaces the need to restate these rules inside every sprint prompt. Any future sprint instruction that conflicts with this document should be treated as an error to flag, not a new rule to follow.

## 1. Writing Philosophy

Knowledge OS content exists to make Admissions Advisors more effective and more honest, in that order. Every article should teach a repeatable skill or judgment call, not just describe a process. Content is written for a working advisor reading between calls, not for a training seminar audience — it should be usable under time pressure.

Where the repository does not contain an authoritative answer (a policy, a number, a guarantee, a legal position), the article says so explicitly and points to "the latest approved internal process" or the relevant authoritative source. Silence or invention is never an acceptable substitute for a missing fact.

## 2. Tone

Direct, professional, and calm. Second person when addressing the advisor directly ("you"), third person when describing a candidate or persona. No hype, no urgency language, no motivational filler. Confidence comes from clarity, not enthusiasm. Avoid words and phrases that create false certainty: "guaranteed," "always," "every candidate," "will result in."

## 3. Frontmatter Standard

Every `.mdx` article uses this frontmatter block, in this field order:

```yaml
---
title: "Article Title"
description: "One-sentence summary of what this article covers."
slug: "article-slug"
type: "category-of-article"
category: "Module Name — Sub-collection Name (if applicable)"
audience: "Documentation Engineers, Admissions Advisors"
funnel_stage: "Discovery | Discussion | Objections | Closing | Cross-Stage | etc."
countries: ["US", "Canada", "UK"]
version: "1.0"
last_updated: "YYYY-MM-DD"
owner: "Documentation Architect"
status: "living-example | active | reference"
tags: ["tag-one", "tag-two"]
related: ["related-slug-one", "related-slug-two"]
---
```

`slug` matches the filename (minus extension) exactly. `related` lists bare slugs, not paths, and never self-references the current file. `countries` is only narrowed from the full three-country list when an article is genuinely country-specific (for example, a single Visa Playbook).

Files that are pure engineering/standards documentation (like this one) live outside `content/docs/` and do not require Fumadocs frontmatter, since they are not rendered as site content.

## 4. Folder Structure

```
content/docs/
  <module-name>/          e.g. discovery, discussion, closing, objections,
                           pricing, sales-operations, sales-coaching,
                           sales-constitution, visa-playbooks,
                           industry-playbooks
    *.mdx
    meta.json

  candidate-intelligence/
    README.mdx, PROFILE_SCHEMA.mdx, ROLE_CLASSIFICATION.mdx, ... (framework files, UPPERCASE)
    reference-profile/      single Gold Standard illustrative profile (Layered Model)
    <role-collection>/      e.g. software-engineering, data-and-ai, cybersecurity
    meta.json
```

Every folder that contains `.mdx` files has its own `meta.json`. Every folder is listed in its parent's `meta.json` "pages" array so it appears in navigation.

## 5. Naming Conventions

Module folders and article filenames: lowercase, hyphen-separated (`discount-guidelines.mdx`, `sales-operations/`). Candidate Intelligence Framework files are the sole exception and use UPPERCASE_SNAKE_CASE (`ROLE_CLASSIFICATION.mdx`) to visually distinguish schema/taxonomy documents from narrative articles. Role Collection folders use the role family name in lowercase-hyphenated form (`data-and-ai`, `cybersecurity`).

## 6. Required Article Sections

Standard narrative articles use:

`## Purpose`, `## Scope`, `## Core Content`, `## Cross-Module Alignment` (where relevant), `## Advisor Guidance`, `## Related Articles`, `## Key Takeaways`

Role Collection articles use this same seven-section shape without exception (see `ROLE_COLLECTION_TEMPLATE.md`). The Gold Standard reference profile uses the Layered Model variant (`## Purpose`, Layer 1/2/3, `## Cross-Module Alignment`, `## Related Articles`, `## Key Takeaways`) — that variant is reserved for illustrative candidate profiles only and is not used elsewhere.

## 7. Internal Linking Rules

All internal links use root-relative paths of the form `/docs/<folder>/<slug>` (no `.mdx` extension, no `content/` prefix). Every internal link must resolve to a file that actually exists — validated by the internal-link QA script every sprint. Links should route to the most specific applicable article rather than a parent overview when one exists.

## 8. Related Articles Rules

Every article includes a `## Related Articles` section with a short bulleted list (2–4 items), each with a one-clause note on why it's related — not a bare list of links. Frontmatter `related` should be a subset or superset consistent with this section; the two should not contradict each other.

## 9. Disclaimer Rules

Any article containing a hypothetical example, composite scenario, or illustrative persona must self-identify using one of the three standard labels: **Composite Case Study**, **Anonymized Real Conversation**, or **Training Simulation** — case studies must never be presented as if they could be a real, identifiable person or conversation. Illustrative technical examples (tool names, coaching notes, code snippets) use the **Illustrative Only** marker instead. Articles touching pricing, guarantees, or placement outcomes open with an explicit disclaimer line stating no specific figure or guarantee is stated in that article.

## 10. No AI Filler Policy

Content must not contain generic AI-assistant phrasing: "in today's fast-paced," "it is important to note," "in conclusion," "as an AI," "delve into," "navigate the complex," or similar filler. Every sprint's QA includes a grep scan for these phrases across new files.

## 11. No Invented Pricing

No specific price, discount amount, discount percentage, payment plan structure, or financing term is ever stated. Pricing-adjacent articles defer to "the latest approved Surely Placed pricing policy."

## 12. No Invented Guarantees

No article states or implies a guaranteed outcome (placement, interview, visa approval, timeline). Any mention of "guarantee" in the corpus must be a disclaimer or negation ("no guarantee is stated here"), never an affirmative claim — verified by a contextual grep check every sprint.

## 13. No Invented Statistics

No hiring statistics, placement rates, salary figures, demand figures, or currency amounts are invented. Where real variation exists (e.g., employer expectations, salary ranges), the article states explicitly that it varies and directs the advisor to authoritative or candidate-specific sources rather than supplying a number.

## 14. No Invented Policies

No CRM workflow, approval hierarchy, refund policy, legal position, or immigration rule is invented. Where such a specific isn't documented in the repository, the article uses the standardized **Operational Policy Pending** pattern, paired with an instruction to follow "the latest approved internal process."

## 15. Duplicate Content Rules

No sentence of 10 or more words may appear verbatim in more than one file across the entire `content/docs/` tree, with the exception of a fixed set of standardized boilerplate phrases (disclaimer language, "Operational Policy Pending," case-study self-identification labels, etc.). When two articles cover structurally similar ground (e.g., the same section in two Role Collections), each must be independently phrased from the outset — not copy-pasted and edited after the fact. Every sprint runs a repository-wide duplicate-sentence scan before delivery.

## 16. QA Expectations

Every sprint's delivery must pass, in this order, before it is presented to the user: frontmatter completeness and consistency; required-section presence; internal link resolution (repo-wide); `meta.json` accuracy (repo-wide); duplicate-content scan (repo-wide); AI filler scan; invented-fact scans (pricing, guarantees, statistics, salaries). All scans are repository-wide, not scoped only to the new files, since new content can introduce duplication against older files.

## 17. meta.json Conventions

Each `meta.json` has a `"title"` (human-readable folder name) and a `"pages"` array. The `"pages"` array must, as a set, exactly match the `.mdx` filenames (minus extension) present in that folder, plus any subfolder names that should appear in navigation. Parent folders list child collection folders by folder name. The root `content/docs/meta.json` lists every top-level module folder.

## 18. Repository Structure

```
content/docs/                the Fumadocs content tree (all advisor-facing articles)
docs/                         engineering/standards documentation (this file and its siblings) —
                               not rendered as site content, not part of the advisor-facing corpus
```

## 19. Versioning Philosophy

Articles carry `version: "1.0"` at initial publication and a `last_updated` date. Versions increment only on substantive content change (not typo fixes). This standards document itself should be versioned informally by its "Last updated" date at the top; material changes to any rule in this document should be treated as their own reviewable change, since every future sprint depends on it.

## 20. Relationship to Sprint Prompts

Future sprint prompts should reference this document rather than restate its rules. If a sprint prompt's instructions conflict with this document, the conflict should be raised rather than silently resolved in either direction.
