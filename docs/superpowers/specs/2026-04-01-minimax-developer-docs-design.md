# MiniMax developer docs design

## Summary

Build a platform-first MiniMax developer documentation set for the Mintlify site in this repository.

The documentation will present MiniMax as a capability exposed by `baze平台`, not as a direct MiniMax integration guide. The documentation will use `https://api.powertokens.ai` as the base URL everywhere. It will include:

- a Chinese MiniMax overview page
- an English MiniMax overview page
- eight Chinese API reference pages
- eight English API reference pages
- navigation updates in `docs.json`
- project-specific writing guidance in `AGENTS.md`

The existing OpenAPI JSON files in `api-reference/zh-Hans/minimax` remain the source of truth for endpoint structure and schemas.

## Goals

- Make MiniMax documentation readable as a developer guide for `baze平台`
- Keep OpenAPI-backed endpoint references, but add platform context that JSON alone does not provide
- Give developers a clear entry page before they open individual endpoint references
- Keep Chinese and English documentation structures aligned
- Replace the placeholder `AGENTS.md` template with project-specific documentation rules

## Non-goals

- Document MiniMax official APIs outside the fields and behaviors already implemented by the platform
- Expose internal gateway implementation details, persistence details, or internal task models
- Add product marketing content unrelated to API usage
- Change the existing OpenAPI JSON contract unless a documentation bug forces a correction

## Audience

- Developers integrating MiniMax-related image and video capabilities through `baze平台`
- Internal doc contributors maintaining API reference pages in Mintlify

## Platform framing

All MiniMax pages will follow these framing rules:

- The subject is `baze平台`
- MiniMax is described as an upstream capability exposed through the platform
- Each endpoint page explains the platform path first, then the upstream MiniMax mapping
- Only supported public fields and behaviors are documented
- Unsupported or out-of-scope fields are called out explicitly when that prevents misuse

## Information architecture

### Chinese pages

- `zh-Hans/minimax/overview.mdx`
- `zh-Hans/minimax/text-to-image.mdx`
- `zh-Hans/minimax/image-to-image.mdx`
- `zh-Hans/minimax/text-to-video.mdx`
- `zh-Hans/minimax/image-to-video.mdx`
- `zh-Hans/minimax/start-end-to-video.mdx`
- `zh-Hans/minimax/subject-reference-to-video.mdx`
- `zh-Hans/minimax/query-video-status.mdx`
- `zh-Hans/minimax/download-video-file.mdx`

### English pages

- `en/minimax/overview.mdx`
- `en/minimax/text-to-image.mdx`
- `en/minimax/image-to-image.mdx`
- `en/minimax/text-to-video.mdx`
- `en/minimax/image-to-video.mdx`
- `en/minimax/start-end-to-video.mdx`
- `en/minimax/subject-reference-to-video.mdx`
- `en/minimax/query-video-status.mdx`
- `en/minimax/download-video-file.mdx`

## Navigation design

Update `docs.json` so both language trees include MiniMax under the existing model API sections.

Chinese navigation target:

- tab: `指南`
- group: `模型接口`
- pages: existing Google page plus the new MiniMax overview page, with MiniMax child pages nested beneath it if Mintlify navigation supports it cleanly in the current structure

English navigation target:

- tab: `Guides`
- group: `Model APIs`
- pages: existing Google page plus the new MiniMax overview page, with matching child pages

If nested navigation makes the config noisy or brittle, use a flat group with the overview page first and the eight endpoint pages immediately after it.

## Overview page design

Each MiniMax overview page is a platform entry page, not a raw API index.

### Required sections

1. What MiniMax on `baze平台` is
2. Base URL and authentication
3. Unified endpoint model on the platform
4. Mapping principle from platform fields to MiniMax upstream fields
5. Capability matrix by scenario
6. Recommended calling flow
7. Links to all endpoint reference pages

### Chinese overview emphasis

- Explain `baze平台` as the stable interface
- Explain that the platform normalizes fields and request shapes
- Highlight supported capability boundaries for image and video generation
- Explain asynchronous task flow for video endpoints

### English overview emphasis

- Mirror the Chinese structure
- Use natural developer-facing English rather than literal sentence-by-sentence translation
- Keep terminology aligned with the Chinese pages

## Endpoint page template

Every MiniMax endpoint page will use the same structure so the set feels consistent.

### Frontmatter

Each page will include:

- `title`
- `description`
- `openapi` pointing at the matching OpenAPI JSON file and method/path

### Body sections

1. Platform context
   Explain what the endpoint does on `baze平台`, which MiniMax capability it corresponds to, and which upstream endpoint it maps to.

2. Quickstart
   Include a minimal `curl` example with:
   - `Authorization: Bearer <token>`
   - `Content-Type: application/json` where relevant
   - a smallest useful request body
   - a representative success response

3. Field mapping and capability boundaries
   Include a table with:
   - platform field
   - MiniMax upstream field
   - required or optional
   - notes

4. Constraints and behavior notes
   Explain model support, parameter constraints, async behavior, download behavior, and known limitations relevant to the endpoint.

5. Common errors
   Explain the most likely misuse cases that follow from the supported public contract.

### Writing rule for endpoint pages

Do not let the page body collapse into schema duplication. The `openapi` block already provides field detail. The MDX body must explain platform semantics, request mapping, and support boundaries.

## Endpoint coverage

The eight endpoint pages map to the existing JSON files:

- `text-to-image.json`
- `image-to-image.json`
- `text-to-video.json`
- `image-to-video.json`
- `start-end-to-video.json`
- `subject-reference-to-video.json`
- `query-video-status.json`
- `download-video-file.json`

These JSON files stay in place and are referenced by the new MDX pages.

## AGENTS.md changes

Replace the current placeholder template with project-specific rules.

### Terminology

- Use `baze平台` as the platform name in Chinese docs
- Use `baze platform` in English docs where a platform noun is needed
- Use `https://api.powertokens.ai` as the canonical base URL
- Prefer `platform API`, `unified API`, and `upstream provider` wording
- Describe MiniMax as an upstream capability exposed through the platform

### Style rules

- Write in active voice and second person
- Start from the developer task on the platform, not from upstream implementation details
- Keep sentences concise
- Explain constraints and supported boundaries explicitly
- Use bold for UI labels only
- Use code formatting for commands, paths, fields, models, and endpoint paths

### Content boundaries

- Document only fields and behaviors already supported by the platform
- Do not promise unsupported MiniMax fields or unofficial compatibility
- Do not document internal admin features or internal storage details
- Do not present channel-specific subdocuments as the complete upstream capability set

### Bilingual consistency

- Chinese and English pages must share the same structure and ordering
- Navigation labels should be parallel by language
- Examples may be adapted for natural language, but the API behavior described must stay aligned

## Implementation notes

- Reuse the repository's existing Mintlify page pattern shown in `zh-Hans/Google.mdx` and `en/Google.mdx`
- Keep file naming lowercase and path names stable
- Prefer simple Mintlify-compatible MDX over custom components unless needed
- Update navigation only after all linked pages exist

## Risks and mitigations

### Risk: pages become thin wrappers around OpenAPI

Mitigation:
Write platform-specific explanatory sections on every page, especially mapping and boundary notes.

### Risk: English pages drift from Chinese pages

Mitigation:
Use one shared page outline and generate both language sets in the same change.

### Risk: unsupported MiniMax fields appear implied by examples

Mitigation:
Add explicit capability-boundary notes per endpoint and avoid examples that suggest unsupported fields.

## Acceptance criteria

- `AGENTS.md` is project-specific and no longer contains placeholder comments
- Chinese and English MiniMax overview pages exist
- Chinese and English endpoint reference pages exist for all eight supported MiniMax endpoint documents
- `docs.json` includes navigation entries for the new MiniMax docs in both languages
- Each endpoint page includes platform context, quickstart, mapping guidance, and support-boundary notes
- The site builds without broken links caused by the new pages

