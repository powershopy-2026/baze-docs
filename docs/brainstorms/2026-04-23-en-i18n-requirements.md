# English i18n for zmodel API docs

**Status:** Draft
**Date:** 2026-04-23

## Problem

The Mintlify docs site has a dual-language framework (`cn/` + `en/`) but the English side is incomplete. The `cn/` navigation uses the new `zmodel*` structure (Image Models, Video Models, Chat Models, Audio Models) while `en/` still references old-style pages and has empty zmodel groups.

## Requirements

### File creation

- **R1:** Create English mdx pages under `en/zmodelImage/`, `en/zmodelVideo/`, `en/zmodelChat/`, `en/zmodelAudio/` mirroring the 50 CN navigation pages. Exclude `cn/zmodelChat/ali/qwen3.5-flash.mdx` (exists on disk but absent from CN navigation). Breakdown: zmodelImage 10, zmodelVideo 12, zmodelChat 21, zmodelAudio 7.
- **R2:** Create English OpenAPI JSON files under `api-reference/en/zmodelImage/`, `api-reference/en/zmodelVideo/`, `api-reference/en/zmodelChat/`, `api-reference/en/zmodelAudio/` — translate any string containing Chinese characters to English, including mixed-language strings (e.g., "Baze API 服务地址" → "Baze API server address"). Covers: titles, descriptions, summaries, examples including user message examples, error messages, enum labels, and nested schema property descriptions. Technical identifiers (model names, field names, paths, URLs) remain unchanged.

### Navigation and configuration

- **R3:** Update `docs.json` English navigation to mirror the Chinese zmodel structure:
  - Remove the four old-style provider groups (MiniMax, Alibaba, BytePlus, Zhipu) and their page references from `docs.json` entirely (filesystem files are not deleted in this phase; see Scope)
  - Populate the existing empty Image Models, Video Models, and Chat Models groups with the corresponding EN page references
  - Create a new Audio Models group after Chat Models with sub-groups MiniMax (6 pages) and Alibaba (1 page)
  - In Video Models, place `download-video-file` and `query-video-status` as top-level pages within the group (not nested under MiniMax), matching the CN structure
  - Fix existing "ZhiPu" casing to "Zhipu" per R7
- **R4:** Keep mdx frontmatter `openapi` in the full Mintlify format: `"/api-reference/en/zmodel*/<provider>/<model>.json <METHOD> <path>"` — only the directory prefix changes from `cn/` to `en/`, the HTTP method and endpoint path are preserved from the CN source

### Content standards

- **R5:** Follow AGENTS.md terminology: use "baze platform", "platform API", "unified API", "upstream provider" in English content
- **R6:** English mdx titles should be descriptive English (e.g., "qwen3-max Chat Completions" not "qwen3-max 对话补全")
- **R7:** Canonical English provider names: MiniMax, Alibaba, BytePlus, Zhipu

## Scope

### In scope
- 50 English mdx pages (zmodelImage 10, zmodelVideo 12, zmodelChat 21, zmodelAudio 7)
- 50 English OpenAPI JSON files with translated descriptions
- `docs.json` English navigation update

### Out of scope
- `cn/zmodelChat/ali/qwen3.5-flash.mdx` (orphan, not in CN navigation)
- Deleting old-style `en/` files from filesystem (can be cleaned up later)
- Deleting old-style `api-reference/en/` files
- Changes to Chinese content
- New content not present in Chinese version

## File mapping

Each `cn/zmodelImage/<provider>/<model>.mdx` maps to `en/zmodelImage/<provider>/<model>.mdx`.
Each `cn/zmodelVideo/<provider>/<model>.mdx` maps to `en/zmodelVideo/<provider>/<model>.mdx`.
Each `cn/zmodelChat/<provider>/<model>.mdx` maps to `en/zmodelChat/<provider>/<model>.mdx` (excluding qwen3.5-flash).
Each `cn/zmodelAudio/<provider>/<model>.mdx` maps to `en/zmodelAudio/<provider>/<model>.mdx`.

Same pattern applies to `api-reference/cn/zmodel*/<provider>/<model>.json` → `api-reference/en/zmodel*/<provider>/<model>.json`.
