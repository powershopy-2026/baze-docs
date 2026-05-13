# Chat provider OpenAPI integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the new `deepseek`, `moonshot`, and `zhipu` chat OpenAPI docs to the Mintlify site using the existing bilingual provider-group pattern.

**Architecture:** Keep the change limited to Mintlify navigation and six minimal MDX wrapper pages. The OpenAPI JSON files remain the source of truth, and each new page will only point Mintlify at the matching `chat.json` operation.

**Tech Stack:** Mintlify docs config, MDX frontmatter, OpenAPI JSON, shell verification commands

---

### Task 1: Review the source OpenAPI files and working constraints

**Files:**
- Verify: `api-reference/zh-Hans/deepseek/chat.json`
- Verify: `api-reference/zh-Hans/moonshot/chat.json`
- Verify: `api-reference/zh-Hans/zhipu/chat.json`
- Verify: `api-reference/en/deepseek/chat.json`
- Verify: `api-reference/en/moonshot/chat.json`
- Verify: `api-reference/en/zhipu/chat.json`

- [ ] **Step 1: Confirm the operation path and method for all six files**

Run:

```bash
jq -r '.info.title, (.paths | keys[0]), (.paths[(.paths | keys[0])] | keys[0])' \
  api-reference/zh-Hans/deepseek/chat.json \
  api-reference/zh-Hans/moonshot/chat.json \
  api-reference/zh-Hans/zhipu/chat.json \
  api-reference/en/deepseek/chat.json \
  api-reference/en/moonshot/chat.json \
  api-reference/en/zhipu/chat.json
```

Expected: each file reports a provider-specific title, the path `/v1/chat/completions`, and the method `post`.

- [ ] **Step 2: Confirm execution stays in the current workspace**

Run:

```bash
git status --short
git worktree list
```

Expected: the new provider JSON directories appear as untracked source files in the current workspace, so implementation should stay here instead of moving to a fresh worktree that would not include them.

### Task 2: Add the new MDX wrapper pages

**Files:**
- Create: `zh-Hans/deepseek/chat.mdx`
- Create: `zh-Hans/moonshot/chat.mdx`
- Create: `zh-Hans/zhipu/chat.mdx`
- Create: `en/deepseek/chat.mdx`
- Create: `en/moonshot/chat.mdx`
- Create: `en/zhipu/chat.mdx`

- [ ] **Step 1: Create the Chinese chat wrapper pages**

Add these files:

```mdx
---
title: "DeepSeek 对话补全"
openapi: "/api-reference/zh-Hans/deepseek/chat.json POST /v1/chat/completions"
---
```

```mdx
---
title: "Moonshot 对话补全"
openapi: "/api-reference/zh-Hans/moonshot/chat.json POST /v1/chat/completions"
---
```

```mdx
---
title: "智谱对话补全"
openapi: "/api-reference/zh-Hans/zhipu/chat.json POST /v1/chat/completions"
---
```

- [ ] **Step 2: Create the English chat wrapper pages**

Add these files:

```mdx
---
title: "DeepSeek Chat Completions"
openapi: "/api-reference/en/deepseek/chat.json POST /v1/chat/completions"
---
```

```mdx
---
title: "Moonshot Chat Completions"
openapi: "/api-reference/en/moonshot/chat.json POST /v1/chat/completions"
---
```

```mdx
---
title: "Zhipu Chat Completions"
openapi: "/api-reference/en/zhipu/chat.json POST /v1/chat/completions"
---
```

### Task 3: Update bilingual navigation

**Files:**
- Modify: `docs.json`

- [ ] **Step 1: Add the Chinese provider groups**

Edit the Chinese `指南` -> `模型接口` section in `docs.json` to add these groups after the existing provider groups:

```json
{
  "group": "DeepSeek",
  "pages": [
    "zh-Hans/deepseek/chat"
  ]
},
{
  "group": "Moonshot",
  "pages": [
    "zh-Hans/moonshot/chat"
  ]
},
{
  "group": "Zhipu",
  "pages": [
    "zh-Hans/zhipu/chat"
  ]
}
```

- [ ] **Step 2: Add the English provider groups**

Edit the English `Guides` -> `Model APIs` section in `docs.json` to add the matching groups:

```json
{
  "group": "DeepSeek",
  "pages": [
    "en/deepseek/chat"
  ]
},
{
  "group": "Moonshot",
  "pages": [
    "en/moonshot/chat"
  ]
},
{
  "group": "Zhipu",
  "pages": [
    "en/zhipu/chat"
  ]
}
```

Expected: the Chinese and English navigation trees stay structurally mirrored.

### Task 4: Verify the docs wiring

**Files:**
- Verify: `docs.json`
- Verify: `zh-Hans/deepseek/chat.mdx`
- Verify: `zh-Hans/moonshot/chat.mdx`
- Verify: `zh-Hans/zhipu/chat.mdx`
- Verify: `en/deepseek/chat.mdx`
- Verify: `en/moonshot/chat.mdx`
- Verify: `en/zhipu/chat.mdx`

- [ ] **Step 1: Confirm the wrappers are minimal and referenced in navigation**

Run:

```bash
sed -n '1,20p' zh-Hans/deepseek/chat.mdx zh-Hans/moonshot/chat.mdx zh-Hans/zhipu/chat.mdx \
  en/deepseek/chat.mdx en/moonshot/chat.mdx en/zhipu/chat.mdx
rg -n '"(zh-Hans|en)/(deepseek|moonshot|zhipu)/chat"' docs.json
```

Expected: each wrapper contains only frontmatter with `title` and `openapi`, and `docs.json` includes all six routes.

- [ ] **Step 2: Run broken-link verification**

Run:

```bash
mint broken-links
```

Expected: exit `0` with no broken links reported.

- [ ] **Step 3: Review the final diff**

Run:

```bash
git diff -- docs.json zh-Hans/deepseek/chat.mdx zh-Hans/moonshot/chat.mdx zh-Hans/zhipu/chat.mdx \
  en/deepseek/chat.mdx en/moonshot/chat.mdx en/zhipu/chat.mdx
```

Expected: the diff contains only the six new wrapper pages and the navigation additions for the three providers.
