# Chat provider OpenAPI integration design

## Goal

Integrate the newly added `deepseek`, `moonshot`, and `zhipu` OpenAPI documents into this Mintlify docs site using the same pattern already used for existing providers.

## Scope

This change covers both Chinese and English docs where applicable.

- Add Chinese and English endpoint wrapper pages for the new chat providers.
- Update `docs.json` so the three providers appear in both language navigation trees.
- Keep the page structure aligned with the current minimal OpenAPI wrapper format.

## Non-goals

- Do not add provider overview pages.
- Do not rewrite the OpenAPI JSON files.
- Do not add examples, prose sections, or custom MDX body content to the new endpoint pages.
- Do not change public API behavior or document unsupported provider features.

## Information architecture

Add one endpoint page per provider per language.

### Chinese pages

- `zh-Hans/deepseek/chat.mdx`
- `zh-Hans/moonshot/chat.mdx`
- `zh-Hans/zhipu/chat.mdx`

### English pages

- `en/deepseek/chat.mdx`
- `en/moonshot/chat.mdx`
- `en/zhipu/chat.mdx`

## Page design

Each new page follows the current project convention for OpenAPI-backed endpoint pages.

- Keep only frontmatter.
- Keep `title` so the docs repo controls the navigation label.
- Keep `openapi` so Mintlify renders the referenced operation from the JSON file.
- Use root-relative OpenAPI paths, matching the recent navigation cleanup work.

Expected frontmatter shape:

```mdx
---
title: "..."
openapi: "/api-reference/<lang>/<provider>/chat.json POST /v1/chat/completions"
---
```

## Navigation design

Update `docs.json` so both language trees stay aligned.

### Chinese navigation

- Under `指南` -> `模型接口`, add provider groups `DeepSeek`, `Moonshot`, and `Zhipu`.
- Each group contains only its `chat` endpoint page.

### English navigation

- Under `Guides` -> `Model APIs`, add matching provider groups `DeepSeek`, `Moonshot`, and `Zhipu`.
- Each group contains only its `chat` endpoint page.

## Naming and consistency

- Preserve existing provider display names in Pascal case for navigation groups.
- Keep filenames lowercase and stable.
- Keep Chinese and English structures mirrored.
- Follow the repository convention where chat wrapper pages are minimal and do not add body copy.

## Verification

- Run `mint broken-links`.
- Check that all six new MDX files resolve to existing OpenAPI JSON files.
- Check that `docs.json` stays structurally aligned between Chinese and English sections.
- Spot check one Chinese and one English page to confirm they use only minimal frontmatter.
