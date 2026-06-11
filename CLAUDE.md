# 项目规范

## 交流语言

使用中文进行交流。

## 文件修改

- 除新增文件外，不允许全量生成/覆盖文件，只允许增量变动（使用 Edit 工具进行局部修改）。
- 除非得到明确指令，否则不允许使用 `git checkout` 还原文件。
- 每次变更 OpenAPI JSON 文档（`api-reference/` 目录下的 `.json` 文件）后，必须使用 `swagger-cli validate` 校验文档合规性。

---

# Documentation project instructions

## About this project

- This repository contains the Mintlify documentation site for `baze平台`
- Pages are written in MDX with YAML frontmatter
- Navigation and site configuration live in `docs.json`
- OpenAPI reference files live under `api-reference/`
- Run `mint dev` to preview the docs locally
- Run `mint broken-links` before you claim the docs are complete

## Terminology

- In Chinese docs, use `baze平台` as the platform name
- In English docs, use `baze platform` when a platform noun is needed
- Use `https://baze-api.powerbuyin.top` as the canonical API base URL
- Prefer `平台接口`, `统一接口`, and `上游渠道` in Chinese docs
- Prefer `platform API`, `unified API`, and `upstream provider` in English docs
- Describe MiniMax as an upstream capability exposed through the platform, not as a direct official integration guide

## Style preferences

- Use active voice and second person
- Keep sentences concise and direct
- Use sentence case for headings
- Start from the developer task on the platform, then explain any upstream mapping
- Explain capability boundaries and unsupported fields explicitly when they affect integration
- Bold UI labels, such as **Settings**
- Use code formatting for commands, paths, endpoint paths, models, fields, and config keys
- Do not paste raw OpenAPI descriptions into MDX without adding platform context
- Keep Chinese and English page structures aligned

## Content boundaries

- Document only fields and behaviors that `baze平台` already supports publicly
- Do not promise unsupported MiniMax fields or compatibility modes
- Do not document internal admin features, internal storage details, or internal gateway implementation details
- If a page is a channel-specific view, state that it does not represent the full upstream capability set
- Prefer examples that match the actual public contract exposed by the platform
