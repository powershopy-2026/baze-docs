# OpenAPI navigation cleanup design

## Goal

Adjust the Mintlify docs navigation so provider names act as menu groups instead of landing pages, and make endpoint pages render from OpenAPI JSON without custom MDX body content.

## Scope

This change covers both Chinese and English docs where applicable.

- Remove the `zh-Hans/Google` and `en/Google` chat completions pages from navigation so `api-reference/openapi.json` no longer appears as a visible docs page.
- Change `MiniMax`, `Ali`, and `BytePlus` from overview pages in navigation to menu-only provider groups.
- Keep the existing provider overview files in the repository for now, but do not link to them from navigation.
- Keep endpoint MDX files, but reduce them to minimal frontmatter so the rendered page content comes from the referenced OpenAPI JSON.

## Navigation design

Update `docs.json` so the language tabs stay aligned and the provider structure is explicit.

- Under `模型接口`, create provider groups for `MiniMax`, `Ali`, and `BytePlus`.
- Under `Model APIs`, create matching provider groups for `MiniMax`, `Ali`, and `BytePlus`.
- Each provider group contains only endpoint pages.
- Do not include `overview` pages in any provider group.
- Do not include `zh-Hans/Google` or `en/Google` anywhere in navigation.

## Page rendering design

Each endpoint MDX page remains as a Mintlify wrapper around one OpenAPI operation.

- Keep minimal frontmatter only.
- Keep `title` so the navigation label stays controlled by the docs repo.
- Keep `openapi` so Mintlify renders the operation from the JSON file.
- Remove custom `description`, prose body content, examples, tables, and notes from endpoint MDX pages.

This intentionally shifts page descriptions and operation details to the OpenAPI source files.

## Non-goals

- Do not rewrite OpenAPI JSON content in this task.
- Do not delete provider overview files in this task.
- Do not add new endpoints or change public API behavior.
- Do not expose hidden chat completions pages through another path.

## Verification

- Run `mint broken-links`.
- Manually inspect `docs.json` for aligned Chinese and English structure.
- Spot check a few endpoint MDX files to confirm they contain only minimal frontmatter.
