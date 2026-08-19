# OpenAPI 扩展字段 (`x-`) 规范与编写指南

本文档旨在为 AI 工具、代码助手及开发人员在生成或更新 `api-reference/` 目录下的 OpenAPI JSON 文档时提供规范指引。当解析模型接口文档与参数描述时，应根据业务逻辑与描述特征按需添加相应的 `x-` 扩展字段。

---

## 1. 核心扩展字段总览

| 扩展字段名 | 作用对象 | 主要用途 | 触发依据（描述特征） |
| :--- | :--- | :--- | :--- |
| **`x-capability`** | Operation 对象 (`paths[path][method]`) | 标注接口归属的生成能力分类 | 文档标题/接口描述代表模型的核心生成能力 |
| **`x-linkage`** | 字段 Schema (`properties.<field>`) | 参数间的动态选项联动/限制规则 | “当配置了 A 时，B 仅支持 X、Y” |
| **`x-valid-when`** | 字段 Schema (`properties.<field>`) | 字段生效的前提依赖条件 | “仅在 A=true 时生效 / 仅当 A 为某值时可用” |
| **`x-options`** | 字段 Schema (`properties.<field>`) | 为枚举/输入项提供 UI 友好的标签与分组 | 包含复杂枚举（如音色列表、风格、分辨率等） |

---

## 2. 字段详细规范与示例

### 2.1 `x-capability`（生成能力标识）

#### 作用位置
置于核心接口的 **Operation 对象** 中，紧随 `operationId` 字段之后。每个文件仅保留一处（创建/生成操作）。任务查询、轮询、取消等辅助操作不添加。

#### 取值规范（严格匹配以下枚举值）
- `chat`：文本对话 / 聊天模型
- `text_to_image`：文生图
- `image_to_image`：图生图 / 图像编辑
- `text_to_video`：文生视频
- `image_to_video`：图生视频
- `end_frame_to_video`：尾帧生视频
- `start&end_frame_to_video`：首尾帧生视频
- `reference_to_video`：多模态/参考生视频
- `video_continuation`：视频续写
- `motion_control`：运镜控制
- `text_to_speech`：文本转语音 (TTS)
- `text_to_audio`：文本生音效 / 音频
- `timing_to_audio`：对齐生音效
- `image_generation`：通用图像生成
- `video_generation`：通用视频生成
- `reference_to_image`：参考生图
- `layer_decomposition`：图层拆解

#### JSON 示例
```json
{
  "paths": {
    "/v1/images/generations": {
      "post": {
        "summary": "Seedream 4.5 Text-to-Image",
        "operationId": "byteplusTextToImage45",
        "x-capability": "text_to_image",
        "tags": [
          "Seedream Image"
        ],
        "requestBody": { ... }
      }
    }
  }
}
```

---

### 2.2 `x-linkage`（动态参数联动）

#### 作用位置
置于受影响字段的 Schema 定义内（`properties.<field>.x-linkage`）。

#### 适用场景
当接口说明中出现**参数联动约束**。例如：
- “当开启草稿模式 `draft: true` 时，分辨率 `size` 仅支持 `480p`”
- “当传入参考底图 `image` 时，生成分辨率 `resolution` 仅支持 `1k`”

#### 结构规范
```json
"x-linkage": {
  "rules": [
    {
      "when": {
        "field": "<依赖的字段名>",
        "operator": "eq" | "has_value" | "in",
        "value": <期望值>
      },
      "set_options": [
        "<联动后的可用选项列表>"
      ]
    }
  ]
}
```

#### JSON 示例
```json
"size": {
  "type": "string",
  "enum": ["480p", "720p", "1080p"],
  "default": "720p",
  "description": "视频分辨率。",
  "x-linkage": {
    "rules": [
      {
        "when": {
          "field": "draft",
          "operator": "eq",
          "value": true
        },
        "set_options": [
          "480p"
        ]
      }
    ]
  }
}
```

---

### 2.3 `x-valid-when`（参数生效前置条件）

#### 作用位置
置于条件生效字段的 Schema 定义内（`properties.<field>.x-valid-when`）。

#### 适用场景
当某字段**并非随时可用**，只有在另一个参数满足特定条件时才有意义或允许传递。例如：
- “`top_logprobs` 仅在 `logprobs=true` 时生效”
- “`audio_setting` 仅在 `with_audio=true` 时有效”

#### 结构规范
```json
"x-valid-when": {
  "<依赖字段名>": [
    <允许触发的有效值列表>
  ]
}
```

#### JSON 示例
```json
"top_logprobs": {
  "type": "integer",
  "minimum": 0,
  "maximum": 20,
  "description": "当 `logprobs=true` 时，指定每个位置返回的最佳候选 token 对数概率数量。",
  "x-valid-when": {
    "logprobs": [
      true
    ]
  }
}
```

---

### 2.4 `x-options`（UI 增强选项列表）

#### 作用位置
置于枚举或复杂选项字段的 Schema 定义内（`properties.<field>.x-options`）。

#### 适用场景
字段包含一系列预设枚举值，且每个选项具有展示名称（`label`）、实际传参值（`value`）或分类分组（`group`）。常用于音色选择、预设风格、艺术滤镜等。

#### 结构规范
```json
"x-options": [
  {
    "label": "<展示名称>",
    "value": "<实际传参值>",
    "group": "<分组名称（可选）>"
  }
]
```

#### JSON 示例
```json
"voice": {
  "type": "string",
  "description": "合成使用的音色 ID。",
  "enum": [
    "male-qn-qingse",
    "female-shaonv"
  ],
  "x-options": [
    {
      "label": "青涩青年 (Green Youth)",
      "value": "male-qn-qingse",
      "group": "中文普通话"
    },
    {
      "label": "元气少女 (Energetic Girl)",
      "value": "female-shaonv",
      "group": "中文普通话"
    }
  ]
}
```

---

## 3. 新增扩展字段原则

若业务或前端调用器确有新的交互/元数据需求，可按需定义新的 `x-` 字段，并遵循以下准则：

1. **命名规范**：
   - 必须以 `x-` 为前缀，完全遵循 OpenAPI 扩展规范。
   - 使用小写中划线命名（kebab-case），如 `x-code-samples`、`x-display-priority`，禁止驼峰或下划线混用。
2. **作用域明确**：
   - 接口级属性放入 Operation 对象（如 `paths[path][method]`）。
   - 字段级属性放入对应的 Schema 属性对象中（如 `properties.<field>`）。
3. **结构统一与自解释**：
   - 字段结构应尽量精简自解释，多采用基础类型、明确的对象或对象数组。
4. **双语同步**：
   - 新增或修改 `api-reference/` 目录下的 OpenAPI 文件时，必须保证 `en` 和 `zh-Hans` 对应的 JSON 文件同步保持一致。
5. **格式验证**：
   - 修改后需确保 JSON 文件格式合法（可通过 `JSON.parse` 或 `swagger-cli validate` 验证）。
