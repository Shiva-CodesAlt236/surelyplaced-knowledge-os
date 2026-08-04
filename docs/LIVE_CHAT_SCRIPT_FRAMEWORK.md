# Live Chat Script Framework

**Status:** Design proposal — not yet built
**Applies to:** The proposed future framework for live chat scripts; no scripts exist yet
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document defines a framework only. It does not contain, draft, or imply any actual chat script. Every existing module in `content/docs/` — Discovery, Discussion, Objections, Closing, and the rest — already covers phone- and call-based advisor conversation in depth. This framework proposes how a parallel, chat-specific script layer would eventually be structured, named, and indexed, without writing a single line of that content now.

## Folder Structure

Proposed location: `content/docs/live-chat-scripts/`, a new top-level module — not created by this document — following the exact folder pattern every existing Sales Academy module already uses per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §4: a flat folder of `.mdx` articles plus its own `meta.json`, registered in the root `content/docs/meta.json` the same way every other module is.

Proposed internal grouping, by conversation category rather than a separate subfolder per category, consistent with how existing modules like `objections/` group many articles in one flat folder rather than nesting:

```
content/docs/live-chat-scripts/
  overview.mdx
  <category>-<topic>.mdx      e.g. discovery-initial-outreach.mdx
  live-chat-red-flags.mdx
  live-chat-script-checklist.mdx
  meta.json
```

## Naming Convention

Proposed filenames follow the existing repository-wide convention exactly — lowercase, kebab-case, named for the conversation's category and topic rather than a specific channel or tool — per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5. A proposed pattern: `<sales-stage>-<situation>.mdx`, for example `discovery-initial-outreach.mdx` or `objections-price-pushback.mdx`, so a script's filename immediately signals which existing Sales Academy stage it corresponds to.

## Metadata

Proposed frontmatter extends the standard schema already defined in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3 (`title`, `description`, `slug`, `type`, `category`, `audience`, `funnel_stage`, `countries`, `version`, `last_updated`, `owner`, `status`, `tags`, `related`) with proposed chat-specific fields:

- `channel` — proposed values such as `"web-chat"` or `"sms"`, distinguishing a script from the phone-call content the rest of the repository already covers
- `conversation_stage` — one of the stages defined below
- `script_length` — proposed as `"short"` or `"extended"`, a rough shape indicator rather than a measured statistic

No specific value has been assigned to any of these fields for any actual script, since no script exists yet.

## Conversation Stages

Proposed stages, mapped directly onto the sales-stage modules that already exist so a chat script never introduces a philosophy or voice inconsistent with `content/docs/sales-constitution/`:

- **Opener** — maps to `content/docs/discovery/opening-the-discovery-call.mdx`'s equivalent moment in a chat context
- **Qualifying** — maps to `content/docs/discovery/candidate-qualification.mdx`
- **Objection deflection** — maps to `content/docs/objections/objection-handling-framework.mdx`
- **Hand-off / escalation** — maps to the standing "route rather than resolve" pattern already used throughout the `*-red-flags.mdx` articles across the repository
- **Closing prompt** — maps to `content/docs/closing/`

## Script Categories

Proposed categories mirror the existing module structure directly, rather than inventing a parallel taxonomy:

- Discovery-stage chat scripts
- Discussion-stage chat scripts
- Objection-response chat scripts
- Pricing-conversation chat scripts
- Visa-awareness chat scripts (deferring to `content/docs/visa-playbooks/` for any substantive content, per that module's own non-invention discipline)
- Closing-stage chat scripts

## Future Indexing

Once scripts exist, each would be indexed the same way every other article is — through its `meta.json` registration and its `tags` field, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §17 — and would additionally surface through the `channel` and `conversation_stage` fields proposed above. No new indexing mechanism is required beyond what `docs/SEARCH_EXPERIENCE.md` already proposes.

## Search Behaviour

Once populated, this module would participate in `docs/SEARCH_EXPERIENCE.md`'s Module Search (scoped to `live-chat-scripts/`) and Problem Search (a chat-specific version of an existing situation, like a price objection) facets without requiring any change to the search design itself. This document does not propose a chat-specific search feature distinct from what `docs/SEARCH_EXPERIENCE.md` already defines.

## What This Document Does Not Do

This document does not create the `content/docs/live-chat-scripts/` folder, does not write any script, and does not assign any of the proposed metadata values to any real file. Writing actual scripts is future content-generation work, subject to the same non-invention and duplicate-content discipline every other module already follows — including the standing rule that a chat script must never imply a guarantee, invent a statistic, or state pricing, exactly as `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §11–13 already requires everywhere else.

## Related Documents

- `docs/MODULE_INDEX_STANDARD.md` — the Call Scripts field this framework's eventual output would populate
- `docs/SEARCH_EXPERIENCE.md` — how this module would participate in search once populated
- `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` — the standing content rules any future script must follow
