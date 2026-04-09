# OpenAPI navigation cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the chat completions docs entry, convert provider landing pages into menu-only groups, and make visible endpoint pages render from OpenAPI JSON with minimal MDX wrappers.

**Architecture:** Keep Mintlify routing simple by changing only `docs.json` navigation and endpoint wrapper MDX files. Preserve existing overview pages in the repository, but remove them from navigation and rely on each page's `openapi` frontmatter to render operation content from JSON.

**Tech Stack:** Mintlify docs config, MDX frontmatter, OpenAPI JSON, git worktree workflow

---

### Task 1: Create isolated workspace

**Files:**
- Modify: `.gitignore` only if the chosen worktree directory is not ignored
- Verify: `git status`, `git worktree list`

- [ ] **Step 1: Check worktree location inputs**

Run:

```bash
ls -d .worktrees worktrees 2>/dev/null
rg -n "worktree" AGENTS.md CLAUDE.md 2>/dev/null
```

Expected: no existing worktree directory preference is found, so ask the user where to create the worktree.

- [ ] **Step 2: Verify the chosen directory is ignored if it is project-local**

Run:

```bash
git check-ignore -q .worktrees || git check-ignore -q worktrees
```

Expected: exit `0` for the chosen local directory. If not ignored, add the directory to `.gitignore` before creating the worktree.

- [ ] **Step 3: Create the feature branch worktree**

Run:

```bash
git worktree add .worktrees/openapi-nav-cleanup -b docs/openapi-nav-cleanup
git worktree list
```

Expected: a new worktree exists at `.worktrees/openapi-nav-cleanup` on branch `docs/openapi-nav-cleanup`.

### Task 2: Restructure Mintlify navigation

**Files:**
- Modify: `docs.json`
- Verify: `docs.json`

- [ ] **Step 1: Replace overview-page navigation with provider groups**

Edit `docs.json` so the Chinese `模型接口` group contains nested provider groups:

```json
{
  "group": "模型接口",
  "expanded": true,
  "pages": [
    {
      "group": "MiniMax",
      "pages": [
        "cn/minimax/text-to-image",
        "cn/minimax/image-to-image",
        "cn/minimax/text-to-video",
        "cn/minimax/image-to-video",
        "cn/minimax/start-end-to-video",
        "cn/minimax/subject-reference-to-video",
        "cn/minimax/query-video-status",
        "cn/minimax/download-video-file"
      ]
    },
    {
      "group": "Ali",
      "pages": [
        "cn/ali/chat",
        "cn/ali/text-to-image",
        "cn/ali/image-to-image",
        "cn/ali/video-first-frame",
        "cn/ali/video-first-last-frame"
      ]
    },
    {
      "group": "BytePlus",
      "pages": [
        "cn/byteplus/image",
        "cn/byteplus/video",
        "cn/byteplus/video-status"
      ]
    }
  ]
}
```

Also update the English `Model APIs` group to remove `en/Google`, remove `en/minimax/overview`, and add nested groups for `MiniMax`, `Ali`, and `BytePlus`.

- [ ] **Step 2: Ensure hidden pages are removed from navigation**

Inspect `docs.json` and confirm these paths are absent:

```text
cn/Google
en/Google
cn/minimax/overview
cn/ali/overview
cn/byteplus/overview
en/minimax/overview
```

Expected: none of those paths remain in navigation.

### Task 3: Convert endpoint pages to minimal OpenAPI wrappers

**Files:**
- Create: `en/ali/chat.mdx`
- Create: `en/ali/text-to-image.mdx`
- Create: `en/ali/image-to-image.mdx`
- Create: `en/ali/video-first-frame.mdx`
- Create: `en/ali/video-first-last-frame.mdx`
- Create: `en/byteplus/image.mdx`
- Create: `en/byteplus/video.mdx`
- Create: `en/byteplus/video-status.mdx`
- Modify: `cn/minimax/text-to-image.mdx`
- Modify: `cn/minimax/image-to-image.mdx`
- Modify: `cn/minimax/text-to-video.mdx`
- Modify: `cn/minimax/image-to-video.mdx`
- Modify: `cn/minimax/start-end-to-video.mdx`
- Modify: `cn/minimax/subject-reference-to-video.mdx`
- Modify: `cn/minimax/query-video-status.mdx`
- Modify: `cn/minimax/download-video-file.mdx`
- Modify: `cn/ali/chat.mdx`
- Modify: `cn/ali/text-to-image.mdx`
- Modify: `cn/ali/image-to-image.mdx`
- Modify: `cn/ali/video-first-frame.mdx`
- Modify: `cn/ali/video-first-last-frame.mdx`
- Modify: `cn/byteplus/image.mdx`
- Modify: `cn/byteplus/video.mdx`
- Modify: `cn/byteplus/video-status.mdx`
- Modify: `en/minimax/text-to-image.mdx`
- Modify: `en/minimax/image-to-image.mdx`
- Modify: `en/minimax/text-to-video.mdx`
- Modify: `en/minimax/image-to-video.mdx`
- Modify: `en/minimax/start-end-to-video.mdx`
- Modify: `en/minimax/subject-reference-to-video.mdx`
- Modify: `en/minimax/query-video-status.mdx`
- Modify: `en/minimax/download-video-file.mdx`

- [ ] **Step 1: Trim existing visible endpoint pages to frontmatter only**

For every existing endpoint wrapper above, keep only the minimal structure:

```mdx
---
title: "文生图"
openapi: "../api-reference/cn/minimax/text-to-image.json POST /v1/images/generations"
---
```

Apply the same pattern to each file using its existing page title and `openapi` reference. Remove `description` and all body content.

- [ ] **Step 2: Add missing English Ali wrappers**

Create these files with minimal frontmatter:

```mdx
---
title: "Chat completions"
openapi: "../api-reference/en/ali/chat.json POST /v1/chat/completions"
---
```

```mdx
---
title: "Text to image"
openapi: "../api-reference/en/ali/text-to-image.json POST /v1/images/generations"
---
```

```mdx
---
title: "Image to image"
openapi: "../api-reference/en/ali/image-to-image.json POST /v1/images/edits"
---
```

```mdx
---
title: "First-frame image to video"
openapi: "../api-reference/en/ali/video-first-frame.json POST /v1/videos"
---
```

```mdx
---
title: "First-last-frame video"
openapi: "../api-reference/en/ali/video-first-last-frame.json POST /v1/videos"
---
```

- [ ] **Step 3: Add missing English BytePlus wrappers**

Create these files with minimal frontmatter:

```mdx
---
title: "Image generation"
openapi: "../api-reference/en/byteplus/image.json POST /v1/images/generations"
---
```

```mdx
---
title: "Video generation"
openapi: "../api-reference/en/byteplus/video.json POST /v1/videos"
---
```

```mdx
---
title: "Query video status"
openapi: "../api-reference/en/byteplus/video-status.json GET /v1/videos/{task_id}"
---
```

### Task 4: Verify docs integrity

**Files:**
- Verify: `docs.json`
- Verify: visible endpoint `.mdx` files

- [ ] **Step 1: Check the planned file set**

Run:

```bash
git status --short
rg -n 'description:|^## |^```|^这个接口|^This endpoint|^Use this endpoint' cn en -g '*.mdx'
```

Expected: only the intended docs files are changed, and visible endpoint wrappers no longer contain custom descriptions or body prose.

- [ ] **Step 2: Run broken-link verification**

Run:

```bash
mint broken-links
```

Expected: exit `0` with no broken links reported.

- [ ] **Step 3: Review navigation diffs**

Run:

```bash
git diff -- docs.json
```

Expected: the diff shows provider groups replacing overview-page entries and no `Google` chat docs entries in navigation.
