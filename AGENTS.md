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
