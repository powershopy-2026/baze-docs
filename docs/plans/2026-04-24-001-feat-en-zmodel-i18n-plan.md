---
title: "feat: Add English zmodel API documentation"
type: feat
status: active
date: 2026-04-24
origin: docs/brainstorms/2026-04-23-en-i18n-requirements.md
---

# feat: Add English zmodel API documentation

## Overview

Create 50 English mdx pages and 50 English OpenAPI JSON files for the zmodel API documentation, then update `docs.json` to wire the English navigation to mirror the Chinese structure. This completes the dual-language support for the Mintlify docs site.

## Problem Frame

The site already has a `cn/` + `en/` framework with Mintlify's `navigation.languages` configured. The Chinese side uses the new zmodel structure (Image/Video/Chat/Audio Models) but the English side still references old-style pages. The EN navigation has empty Image Models, Video Models, and Chat Models groups but is missing an Audio Models group entirely. (see origin: docs/brainstorms/2026-04-23-en-i18n-requirements.md)

## Requirements Trace

- R1. Create 50 EN mdx pages mirroring CN zmodel structure (Image 10, Video 12, Chat 21, Audio 7)
- R2. Create 50 EN OpenAPI JSON files with all Chinese text translated to English
- R3. Update docs.json EN navigation: remove old-style groups, populate zmodel groups, create Audio Models group
- R4. Mintlify openapi frontmatter: change `cn/` prefix to `en/`, preserve method+endpoint
- R5. Use AGENTS.md terminology: "baze platform", "platform API", "unified API", "upstream provider"
- R6. English mdx titles in descriptive English
- R7. Canonical provider names: MiniMax, Alibaba, BytePlus, Zhipu

## Scope Boundaries

- Exclude `en/zmodelChat/ali/qwen3.5-flash.mdx` and `api-reference/en/zmodelChat/ali/qwen3.5-flash.json` — CN source is an orphan not present in CN navigation
- Old-style `en/` and `api-reference/en/` files remain on disk, not deleted
- No changes to Chinese content

## Context & Research

### Relevant Code and Patterns

Each CN mdx file is ~4 lines of frontmatter:
```
---
title: "模型名 中文描述"
openapi: "/api-reference/cn/zmodel*/<provider>/<model>.json <METHOD> <path>"
---
```

EN mdx files follow the same pattern with `en/` prefix and English title.

OpenAPI JSON files are 200-500 lines with Chinese descriptions, summaries, examples, and error messages that need translation. Technical identifiers (model names, URLs, field names) stay unchanged.

### Title Translation Patterns

| CN Pattern | EN Pattern |
|---|---|
| `"模型名 对话补全"` | `"model-name Chat Completions"` |
| `"模型名 文生图"` | `"model-name Text to Image"` |
| `"模型名 图生图"` | `"model-name Image to Image"` |
| `"模型名 文生视频"` | `"model-name Text to Video"` |
| `"模型名 图生视频"` | `"model-name Image to Video"` |
| `"模型名 首尾帧图生视频"` | `"model-name First-Last Frame to Video"` |
| `"模型名 参考生视频"` | `"model-name Reference to Video"` |
| `"模型名 图像编辑"` | `"model-name Image Edit"` |
| `"模型名 图像生成"` | `"model-name Image Generation"` |
| `"语音合成"` | `"Text to Speech"` |
| `"下载视频文件"` | `"Download Video File"` |
| `"查询视频任务状态"` | `"Query Video Task Status"` |
| Model-name-only titles (e.g., `"glm-5"`) | Keep as-is |

## Key Technical Decisions

- **Parallel execution by model type**: The four zmodel categories (Image, Video, Chat, Audio) are independent and can be created in parallel
- **JSON translation scope**: Any string containing Chinese characters gets translated, including mixed strings. Technical identifiers unchanged
- **Navigation update last**: Create files first, update docs.json after all files exist to avoid broken references

## Implementation Units

- [x] **Unit 1: Create EN OpenAPI JSON files (50 files)**

**Goal:** Translate all 50 CN OpenAPI JSON specs to English

**Requirements:** R2, R5, R7

**Dependencies:** None

**Files:**
- Create: `api-reference/en/zmodelImage/ali/*.json` (4 files)
- Create: `api-reference/en/zmodelImage/byteplus/*.json` (3 files)
- Create: `api-reference/en/zmodelImage/minimax/*.json` (3 files)
- Create: `api-reference/en/zmodelVideo/ali/*.json` (4 files)
- Create: `api-reference/en/zmodelVideo/byteplus/*.json` (3 files)
- Create: `api-reference/en/zmodelVideo/minimax/*.json` (5 files)
- Create: `api-reference/en/zmodelChat/ali/*.json` (4 files, excluding qwen3.5-flash)
- Create: `api-reference/en/zmodelChat/byteplus/*.json` (8 files)
- Create: `api-reference/en/zmodelChat/minimax/*.json` (4 files)
- Create: `api-reference/en/zmodelChat/zhipu/*.json` (5 files)
- Create: `api-reference/en/zmodelAudio/ali/*.json` (1 file)
- Create: `api-reference/en/zmodelAudio/minimax/*.json` (6 files)

**Approach:**
- Read each CN JSON, translate all Chinese strings to English
- Keep all technical fields unchanged (model names, URLs, field names, enum values that are code identifiers)
- Use AGENTS.md terminology for platform references
- Server description: "Baze API 服务地址" → "Baze API server endpoint"

**Patterns to follow:**
- Existing `api-reference/en/minimax/chat.json` for English OpenAPI style

**Test expectation:** none — static JSON files, verified by Mintlify build

**Verification:**
- All 50 JSON files exist under `api-reference/en/zmodel*/`
- No Chinese characters remain in any translated JSON file (except in model name identifiers)

- [x] **Unit 2: Create EN mdx pages (50 files)**

**Goal:** Create English mdx frontmatter pages pointing to the EN OpenAPI JSON files

**Requirements:** R1, R4, R6

**Dependencies:** Unit 1 (JSON files must exist for openapi references)

**Files:**
- Create: `en/zmodelImage/{ali,byteplus,minimax}/*.mdx` (10 files)
- Create: `en/zmodelVideo/{ali,byteplus,minimax}/*.mdx` (12 files)
- Create: `en/zmodelChat/{ali,byteplus,minimax,zhipu}/*.mdx` (21 files, excluding qwen3.5-flash)
- Create: `en/zmodelAudio/{ali,minimax}/*.mdx` (7 files)

**Approach:**
- Each file is ~4 lines: YAML frontmatter with English title and openapi path
- Title: translate CN title to English using the title translation patterns table
- openapi path: copy from CN, change `/api-reference/cn/` to `/api-reference/en/`, preserve METHOD and endpoint

**Patterns to follow:**
- Existing `en/minimax/chat.mdx` for English mdx style

**Test expectation:** none — static frontmatter files, verified by Mintlify build

**Verification:**
- All 50 mdx files exist under `en/zmodel*/`
- Each file has valid YAML frontmatter with English title and correct openapi path
- Each openapi frontmatter value resolves to an existing JSON file under `api-reference/en/`

- [x] **Unit 3: Update docs.json EN navigation**

**Goal:** Wire the English navigation to use the new zmodel structure

**Requirements:** R3, R7

**Dependencies:** Unit 2 (mdx pages must exist)

**Files:**
- Modify: `docs.json`

**Approach:**
- Remove the four old-style provider groups (MiniMax with 9 pages, Alibaba with 10 pages, BytePlus with 4 pages, Zhipu with 1 page) from the EN `tabs[0].pages[0]` (Model APIs group)
- Populate the existing empty Image Models group with 3 sub-groups: MiniMax (3), Alibaba (4), BytePlus (3)
- Populate the existing empty Video Models group with 3 sub-groups: MiniMax (3), Alibaba (4), BytePlus (3), plus 2 top-level pages (download-video-file, query-video-status)
- Populate the existing empty Chat Models group with 4 sub-groups: MiniMax (4), Alibaba (4), BytePlus (8), Zhipu (5) — fix "ZhiPu" to "Zhipu"
- Create new Audio Models group after Chat Models with 2 sub-groups: MiniMax (6), Alibaba (1)
- All page references use `en/zmodel*/` paths

**Patterns to follow:**
- CN navigation structure in `docs.json` lines 12-158

**Test expectation:** none — JSON config, verified by Mintlify build

**Verification:**
- `docs.json` EN navigation has no old-style provider groups
- All four zmodel groups populated with correct page counts
- `mint broken-links` reports no broken links for EN pages

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Translation quality of technical API descriptions | Follow existing EN patterns in `api-reference/en/minimax/chat.json`; use consistent terminology from AGENTS.md |
| Mintlify build failure from broken references | Create JSON files (Unit 1) before mdx files (Unit 2) before nav update (Unit 3) |

## Sources & References

- **Origin document:** [docs/brainstorms/2026-04-23-en-i18n-requirements.md](docs/brainstorms/2026-04-23-en-i18n-requirements.md)
- CN navigation pattern: `docs.json` lines 12-158
- EN OpenAPI pattern: `api-reference/en/minimax/chat.json`
- EN mdx pattern: `en/minimax/chat.mdx`
- Terminology guide: `AGENTS.md`
