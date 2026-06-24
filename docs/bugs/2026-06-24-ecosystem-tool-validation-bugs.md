# 生态工具验收 bug 简表

用于记录生态工具接入验收中发现的待排查问题。每个问题保持简洁，详细复现过程可另建单独文档。

## BUG-001: 部分模型直接调用返回 403 用户已被封禁

- 状态: 待排查
- 环境: `https://baze-api.powerbuyin.top`
- 接口: `POST /v1/chat/completions`
- 现象: 多个文本模型直接请求返回 HTTP `403`，响应体为 `用户已被封禁`
- 响应体形态:

```json
{
  "error": {
    "code": "",
    "message": "用户已被封禁 (request id: ...)",
    "type": "api_error"
  }
}
```

| 模型 | HTTP | request id | 摘要 |
| --- | --- | --- | --- |
| `glm-5.2` | `403` | `20260623121829709737314pQQOlcaN` | 用户已被封禁 |
| `MiniMax-M3` | `403` | `202606231218359689465864tQ63GJk` | 用户已被封禁 |
| `qwen3-coder-plus` | `403` | `20260623121842575052736bBruD4cl` | 用户已被封禁 |
| `seed-2-0-pro-260328` | `403` | `20260623121849295675541NM57Pp7Z` | 用户已被封禁 |

- 初步判断: 不是 API Key 全局失效；同一环境后续低频请求可返回 `200`。更像上游渠道或网关风控/临时封禁。
- 建议排查: 按 request id 查询网关和上游日志，确认封禁来源、触发规则、是否与请求频率或 prompt 模式有关。
- 临时规避: 对 403 结果保留 request id，不直接判定模型不可用。

## BUG-002: `deepseek-v3.2` 流式响应空文本

- 状态: 待修复
- 现象: 非流式返回正常；OpenAI Chat Completions 流式 `stream:true` 只有 usage 和 `[DONE]`，没有 `delta.content`；Anthropic Messages 流式只有 `message_start`、`message_delta`、`message_stop`，没有 text content
- 影响: opencode 等依赖 streaming 输出的工具显示空响应
- 相关 request id:
  - Chat Completions stream: `20260624015202175178308IUvpZHgW`
  - Messages stream: `20260624020225592971820eHDlOWPF`
- 详情: [deepseek-v3.2 流式响应空文本问题](./2026-06-24-deepseek-v3.2-stream-empty-content.md)

## BUG-003: opencode Anthropic provider 下部分模型返回 `tool_choice.type` 参数错误

- 状态: 待排查
- 环境: `https://baze-api.powerbuyin.top`
- 工具: opencode `1.17.9`
- provider: `@ai-sdk/anthropic`
- 接口: `POST /v1/messages`
- 现象: 模型发现中声明 `anthropic` 的部分 BytePlus、Seed、gpt-oss 模型，在 opencode Anthropic provider 的工具链请求中返回 HTTP `400`
- 错误摘要: `The parameter tool_choice.type specified in the request are not valid: expected 'function', but got auto instead`

| 模型 | 结果 | request id | 摘要 |
| --- | --- | --- | --- |
| `deepseek-v3-2-251201` | 失败 | `202606240201058418738483ulk5fSW` | `tool_choice.type=auto` 不被接受 |
| `gpt-oss-120b-250805` | 失败 | `20260624020115690685410EooQMCmQ` | `tool_choice.type=auto` 不被接受 |
| `seed-1-6-250915` | 失败 | `20260624020132796985325VODbs1nW` | `tool_choice.type=auto` 不被接受 |
| `seed-1-6-flash-250715` | 失败 | `20260624020133333740116ZnkFEts8` | `tool_choice.type=auto` 不被接受 |
| `seed-1-8-251228` | 失败 | `20260624020133893275057or6XYRbw` | `tool_choice.type=auto` 不被接受 |
| `seed-2-0-lite-260228` | 失败 | `202606240201351000340210efil6Pz` | `tool_choice.type=auto` 不被接受 |
| `seed-2-0-mini-260215` | 失败 | `20260624020135779865502iPytQbuH` | `tool_choice.type=auto` 不被接受 |
| `seed-2-0-pro-260328` | 失败 | `20260624020135891896210g5FxbXeP` | `tool_choice.type=auto` 不被接受 |

- 对照: 这些模型中至少 `deepseek-v3-2-251201`、`gpt-oss-120b-250805`、`seed-1-6-250915` 在无工具的直接 `/v1/messages` 非流式请求中可以返回 `OK`
- 初步判断: 不是单纯的模型不可用，而是工具链请求参数转换兼容性问题。opencode Anthropic provider 会携带工具参数，当前部分上游路径不接受 `tool_choice.type=auto`
- 建议排查:
  1. 按 request id 查询网关实际转发 payload 和上游响应
  2. 确认平台是否需要把 Anthropic `tool_choice: {"type":"auto"}` 转换为目标上游可接受的格式
  3. 如短期无法兼容，在模型发现或生态工具文档中标记这些模型不适合 Anthropic 工具链
- 临时规避: 这些模型优先走 OpenAI-compatible provider；Anthropic provider 默认推荐智谱、MiniMax、Qwen 路径
