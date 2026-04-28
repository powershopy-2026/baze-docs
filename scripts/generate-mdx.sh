#!/bin/bash
# 从 api-reference JSON 自动生成对应的 MDX 平台指南文件
# 用法: bash scripts/generate-mdx.sh

set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

generate_mdx() {
  local json_path="$1"   # e.g. api-reference/zh-Hans/ali/chat.json
  local vendor="$2"       # e.g. ali / byteplus
  local lang="$3"         # e.g. zh-Hans

  local filename
  filename="$(basename "$json_path" .json)"

  local title description
  title="$(jq -r '.info.title' "$BASE_DIR/$json_path")"
  description="$(jq -r '.info.description' "$BASE_DIR/$json_path")"

  # 提取第一个 path 和对应的 HTTP method
  local endpoint method
  endpoint="$(jq -r '.paths | keys[0]' "$BASE_DIR/$json_path")"
  method="$(jq -r ".paths[\"$endpoint\"] | keys[0]" "$BASE_DIR/$json_path")"
  method="$(echo "$method" | tr '[:lower:]' '[:upper:]')"

  local openapi_ref="../$json_path $method $endpoint"

  local out_dir="$BASE_DIR/$lang/$vendor"
  mkdir -p "$out_dir"

  local out_file="$out_dir/$filename.mdx"

  # 构建简介：从 description 取第一句
  local intro
  intro="$(echo "$description" | head -1)"

  cat > "$out_file" <<EOF
---
title: "$title"
description: "通过 baze平台 接入${title}能力。"
openapi: "$openapi_ref"
---

这个接口是 \`baze平台\` 的统一入口之一，适用于${title}。${intro}
EOF

  echo "  ✓ $out_file"
}

# 对每个 vendor 目录下的 JSON 生成 MDX
for vendor_dir in "$BASE_DIR"/api-reference/zh-Hans/ali "$BASE_DIR"/api-reference/zh-Hans/byteplus; do
  vendor="$(basename "$vendor_dir")"
  echo "=== $vendor ==="

  for json_file in "$vendor_dir"/*.json; do
    rel_path="${json_file#$BASE_DIR/}"
    generate_mdx "$rel_path" "$vendor" "zh-Hans"
  done
done

echo ""
echo "Done. 请检查生成的 MDX 文件并按需调整内容。"
