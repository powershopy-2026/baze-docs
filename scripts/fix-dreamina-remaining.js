const fs = require('fs');
const path = require('path');

const EN_DIR = path.join(__dirname, '..', 'api-reference', 'en', 'zmodelVideo', 'byteplus');

// Translation substrings - these are smaller fragments that can be replaced within larger strings
// Each entry: [zh_fragment, en_fragment]
const replacements = [
  // Size description for Seedance 2.0 with 4k detail
  [
    '> Seedance 2.0 系列、Seedance 1.5 pro 默认值：`720p`\n> Seedance 1.0 pro & pro-fast 默认值：`1080p`',
    '> Seedance 2.0 series and Seedance 1.5 pro default: `720p`\n> Seedance 1.0 pro & pro-fast default: `1080p`'
  ],
  [
    '视频分辨率，枚举值：\n\n* 480p\n* 720p\n* 1080p：Seedance 2.0 Fast 和 Seedance 2.0 Mini 不支持。\n* 4k：仅 Seedance 2.0 支持',
    'Video resolution. Enum values:\n\n* 480p\n* 720p\n* 1080p: Not supported by Seedance 2.0 Fast and Seedance 2.0 Mini.\n* 4k: Only supported by Seedance 2.0'
  ],
  // Size 4k note
  [
    '```说明\n- 相较于一般的 8bit 位深，Seedance 2.0 输出的 4k 视频采用 10bit 位深编码，能够完整保留丰富的色彩层次与平滑的渐变过渡，满足专业影视制作与 HDR 视频内容的要求。\n- 4k 视频采用 H.265 (HEVC) 编码格式输出，部分播放器/浏览器可能无法直接播放。',
    '```Note\n- Compared to typical 8-bit color depth, Seedance 2.0 4k output uses 10-bit encoding, fully preserving rich color gradations and smooth transitions, meeting professional film production and HDR video content requirements.\n- 4k videos are output in H.265 (HEVC) format; some players/browsers may not support direct playback.'
  ],
  // Size note (shorter version, no 4k)
  [
    '```说明\n- 4k 视频采用 H.265 (HEVC) 编码格式输出，部分播放器/浏览器可能无法直接播放。',
    '```Note\n- 4k videos are output in H.265 (HEVC) format; some players/browsers may not support direct playback.'
  ],
  // Size short version (no 4k note)
  [
    '视频分辨率，枚举值：\n\n* 480p\n* 720p\n* 1080p：Seedance 2.0 fast 不支持',
    'Video resolution. Enum values:\n\n* 480p\n* 720p\n* 1080p: Not supported by Seedance 2.0 fast'
  ],
  // Ratio description for Seedance 2.0 series (dreamina version)
  [
    '> Seedance 2.0 系列、Seedance 1.5 pro 默认值为 `adaptive`\n> 其他模型：Text-to-Video默认值 `16:9`，图生视频默认值 `adaptive`',
    '> Seedance 2.0 series and Seedance 1.5 pro default: `adaptive`\n> Other models: Text-to-Video default `16:9`, Image-to-Video default `adaptive`'
  ],
  [
    '生成视频的宽高比例。不同宽高比对应的宽高像素值见下方表格。',
    'The aspect ratio of the generated video. See the table below for pixel dimensions for different aspect ratios.'
  ],
  [
    '* adaptive：根据输入自动选择最合适的宽高比（详见下文说明）',
    '* adaptive: Automatically selects the most suitable aspect ratio based on input (see details below)'
  ],
  [
    '**adaptive 适配规则**',
    '**adaptive Rules**'
  ],
  [
    '* 首帧 / 首尾帧生视频：根据上传的首帧图片比例，自动选择最接近的宽高比。',
    '* First Frame / First & Last Frame: Automatically selects the closest aspect ratio based on the uploaded first frame image ratio.'
  ],
  [
    '当配置 ratio 为 adaptive 时，模型会根据生成场景自动适配宽高比；实际生成的视频宽高比可通过查询视频生成任务 API 返回的 ratio 字段获取。',
    'When ratio is set to adaptive, the model automatically adjusts the aspect ratio based on the generation scenario. The actual video aspect ratio can be obtained from the ratio field returned by the query video generation task API.'
  ],
  [
    '* 文生视频：根据输入的提示词，智能选择最合适的宽高比。',
    '* Text-to-Video: Intelligently selects the most suitable aspect ratio based on the input prompt.'
  ],
  [
    '* 多模态参考生视频：根据用户提示词意图判断，如果是首帧生视频/编辑视频/延长视频，以该图片/视频为准选择最接近的宽高比；否则，以传入的第一个媒体文件为准（优先级：视频＞图片）选择最接近的宽高比。',
    '* Multimodal Reference-to-Video: Determines based on user prompt intent. If it is first-frame video/editing video/extending video, selects the closest aspect ratio based on that image/video; otherwise, selects the closest aspect ratio based on the first media file (priority: video > image).'
  ],
  [
    '* Multimodal Reference-to-Video：根据用户提示词意图判断，如果是首帧生视频/编辑视频/延长视频，以该图片/视频为准选择最接近的宽高比；否则，以传入的第一个媒体文件为准（优先级：视频＞图片）选择最接近的宽高比。',
    '* Multimodal Reference-to-Video: Determines based on user prompt intent. If it is first-frame video/editing video/extending video, selects the closest aspect ratio based on that image/video; otherwise, selects the closest aspect ratio based on the first media file (priority: video > image).'
  ],
  [
    '注意：图生视频，选择的宽高比与您上传的图片宽高比不一致时，方舟会对您的图片进行裁剪，裁剪时会居中裁剪。',
    'Note: For Image-to-Video, if the selected aspect ratio does not match the uploaded image ratio, the platform will crop your image from the center.'
  ],
  // Ratio table headers
  [
    '| 分辨率 | 宽高比 | 宽高像素值 Seedance 2.0 系列 | 宽高像素值 Seedance 1.5 pro | 宽高像素值 Seedance 1.0 系列 |',
    '| Resolution | Aspect Ratio | Pixel Dimensions Seedance 2.0 Series | Pixel Dimensions Seedance 1.5 pro | Pixel Dimensions Seedance 1.0 Series |'
  ],
  [
    '| 分辨率 | 宽高比 | 宽高像素值 Seedance 1.0 系列 | 宽高像素值 Seedance 1.5 pro / 2.0 系列 |',
    '| Resolution | Aspect Ratio | Pixel Dimensions Seedance 1.0 Series | Pixel Dimensions Seedance 1.5 pro / 2.0 Series |'
  ],
  // Table entries with Chinese text
  [
    '1080p（Seedance 2.0 Fast、Seedance 2.0 Mini 不支持）',
    '1080p (Not supported by Seedance 2.0 Fast, Seedance 2.0 Mini)'
  ],
  [
    '4K(仅 Seedance 2.0 支持)',
    '4K (Only supported by Seedance 2.0)'
  ],
  // List-video-generation-tasks descriptions
  [
    '通过传入筛选参数，查询符合条件的视频生成任务。仅支持查询最近 7 天的任务记录，时间区间为 [T-7天, T)，其中 T 为请求发起时刻的 UTC 时间戳（精确到秒）。\n\n## 鉴权\n\n本接口支持 API Key 鉴权。',
    'Filter parameters to query matching video generation tasks. Only supports the last 7 days of task records, time range [T-7 days, T), where T is the UTC timestamp (seconds) of the request.\n\n## Authentication\n\nThis endpoint supports API Key authentication.'
  ],
  [
    '通过传入筛选参数，查询符合条件的视频生成任务。仅支持查询最近 7 天的任务记录，时间区间为 [T-7天, T)，其中 T 为请求发起时刻的 UTC 时间戳（精确到秒）。',
    'Filter parameters to query matching video generation tasks. Only supports the last 7 days of task records, time range [T-7 days, T), where T is the UTC timestamp (seconds) of the request.'
  ],
  [
    'Query successful，返回符合筛选条件的视频生成任务列表。',
    'Query successful, returns a list of video generation tasks matching the filter criteria.'
  ],
  [
    '查询成功，返回符合筛选条件的视频生成任务列表。',
    'Query successful, returns a list of video generation tasks matching the filter criteria.'
  ],
  // seedance-tasks-query descriptions
  [
    '查询视频生成任务的状态。\n\n> 仅支持查询最近 7 天的任务记录，时间区间为 [T-7天, T)，其中 T 为请求发起时刻的 UTC 时间戳（精确到秒）。注意：视频 URL 有效期为 14 天，请及时下载或转存。',
    'Query the status of a video generation task.\n\n> Only supports the last 7 days of task records, time range [T-7 days, T), where T is the UTC timestamp (seconds) of the request. Note: Video URLs are valid for 14 days; please download or save them promptly.'
  ],
  [
    '`：任务失败。\n* `expired`：任务超时。',
    '`: Task failed.\n* `expired`: Task timed out.'
  ],
  // Media descriptions
  [
    '输入给模型，生成视频的信息，支持文本、图片、音频、视频、样片任务 ID。',
    'Input information for the model to generate videos. Supports text, images, audio, video, and draft task IDs.'
  ],
  [
    '多模态输入数组。2.0 Fast 支持 `text`、`first_frame`、`last_frame`、`reference_image`、`reference_video`、`reference_audio`。',
    'Multimodal input array. 2.0 Fast supports `text`, `first_frame`, `last_frame`, `reference_image`, `reference_video`, and `reference_audio`.'
  ],
  [
    '多模态输入数组。2.0 支持 `text`、`first_frame`、`last_frame`、`reference_image`、`reference_video`、`reference_audio`。',
    'Multimodal input array. 2.0 supports `text`, `first_frame`, `last_frame`, `reference_image`, `reference_video`, and `reference_audio`.'
  ],
  [
    '多模态输入数组。2.0 Mini 支持 `text`、`first_frame`、`last_frame`、`reference_image`、`reference_video`、`reference_audio`。',
    'Multimodal input array. 2.0 Mini supports `text`, `first_frame`, `last_frame`, `reference_image`, `reference_video`, and `reference_audio`.'
  ],
  [
    '多模态输入数组。图生视频需包含 `type: "first_frame"` 和 `type: "text"`。',
    'Multimodal input array. Image-to-Video requires `type: "first_frame"` and `type: "text"`.'
  ],
  [
    '多模态输入数组。首尾帧生视频需包含 `first_frame`、`last_frame` 和 `text`。',
    'Multimodal input array. First & Last Frame video requires `first_frame`, `last_frame`, and `text`.'
  ],
  [
    '多模态输入数组。1.0 Pro 支持 `text`、`first_frame`、`last_frame`。',
    'Multimodal input array. 1.0 Pro supports `text`, `first_frame`, and `last_frame`.'
  ],
  [
    '多模态输入数组。1.0 Pro Fast 支持 `text`、`first_frame`。',
    'Multimodal input array. 1.0 Pro Fast supports `text` and `first_frame`.'
  ],
  [
    '多模态输入数组。图生视频需包含 `first_frame` 和 `text`。',
    'Multimodal input array. Image-to-Video requires `first_frame` and `text`.'
  ],
  // Duration
  [
    '生成视频时长，仅支持整数，单位：秒。\n\n* Seedance 1.0 pro、Seedance 1.0 pro fast: [2, 12] s。\n* Seedance 1.5 pro: [4,12] 或设置为 -1\n* Seedance 2.0 系列: [4,15] 或设置为 -1\n\n**注意**\n\nSeedance 2.0 系列、Seedance 1.5 pro 支持两种配置方法\n* 指定具体时长：支持有效范围内的任一整数。\n* 智能指定：设置为 -1，表示由模型在有效范围内自主选择合适的视频长度（整数秒）。实际生成视频的时长可通过查询视频生成任务 API 返回的 duration 字段获取。注意视频时长与计费相关，请谨慎设置。',
    'Video duration, integer only, in seconds.\n\n* Seedance 1.0 pro, Seedance 1.0 pro fast: [2, 12] s.\n* Seedance 1.5 pro: [4, 12] or set to -1\n* Seedance 2.0 series: [4, 15] or set to -1\n\n**Note**\n\nSeedance 2.0 series and Seedance 1.5 pro support two configuration methods:\n* Specify exact duration: Any integer within the valid range.\n* Smart mode: Set to -1 to let the model choose the appropriate video length (in whole seconds) within the valid range. The actual generated video duration can be obtained from the duration field returned by the query video generation task API. Note that video duration is related to billing, so set it carefully.'
  ],
  [
    '生成视频时长，仅支持整数，单位：秒。\n\n* Seedance 1.0 pro、Seedance 1.0 pro fast: [2, 12] s。\n* Seedance 1.5 pro: [4,12] 或设置为 -1\n* Seedance 2.0 系列: [4,15] 或设置为 -1\n\n**注意**\n\nSeedance 2.0 系列、Seedance 1.5 pro 支持两种配置方法：\n* 指定具体时长：支持有效范围内的任一整数。\n* 智能指定：设置为 -1，表示由模型在有效范围内自主选择合适的视频长度（整数秒）。实际生成视频的时长可通过查询视频生成任务 API 返回的 duration 字段获取。注意视频时长与计费相关，请谨慎设置。',
    'Video duration, integer only, in seconds.\n\n* Seedance 1.0 pro, Seedance 1.0 pro fast: [2, 12] s.\n* Seedance 1.5 pro: [4, 12] or set to -1\n* Seedance 2.0 series: [4, 15] or set to -1\n\n**Note**\n\nSeedance 2.0 series and Seedance 1.5 pro support two configuration methods:\n* Specify exact duration: Any integer within the valid range.\n* Smart mode: Set to -1 to let the model choose the appropriate video length (in whole seconds) within the valid range. The actual generated video duration can be obtained from the duration field returned by the query video generation task API. Note that video duration is related to billing, so set it carefully.'
  ],
  // Seconds (shorter version for some files)
  [
    '视频时长，仅支持整数，单位：秒。',
    'Video duration, integer only, in seconds.'
  ],
  // Seed
  [
    '> Seedance 2.0系列暂不支持',
    '> Temporarily not supported by Seedance 2.0 series'
  ],
  [
    '种子整数，用于控制生成内容的随机性。取值范围：[-1, 2^32-1]之间的整数。',
    'Seed integer for controlling the randomness of generated content. Range: integer in [-1, 2^32-1].'
  ],
  // Watermark
  [
    '生成视频是否包含水印。',
    'Whether the generated video contains a watermark.'
  ],
  [
    '* false：生成视频不含水印。',
    '* false: The generated video does not contain a watermark.'
  ],
  [
    '* true：生成视频右下角会展示 AI 生成 水印。',
    '* true: The generated video displays an "AI Generated" watermark in the bottom-right corner.'
  ],
  [
    '* true：生成视频右下角会展示AI生成水印。',
    '* true: The generated video displays an "AI Generated" watermark in the bottom-right corner.'
  ],
  [
    '* false：生成视频不含水印',
    '* false: The generated video does not contain a watermark'
  ],
  [
    '* true：生成视频右下角会展示 AI 生成水印',
    '* true: The generated video displays an "AI Generated" watermark in the bottom-right corner'
  ],
  // Generate audio
  [
    '> 仅 Seedance 2.0 系列、Seedance 1.5 pro 支持',
    '> Only supported by Seedance 2.0 series and Seedance 1.5 pro'
  ],
  [
    '控制生成的视频是否包含与画面同步的声音。',
    'Controls whether the generated video contains synchronized audio.'
  ],
  [
    '* true：模型输出的视频包含同步音频。模型会基于文本提示词与视觉内容，自动生成与之匹配的人声、音效及背景音乐。建议将对话部分置于双引号内，以优化音频生成效果。例如：男人叫住女人说："你记住，以后不可以用手指指月亮。"',
    '* true: The model outputs video with synchronized audio. The model automatically generates matching voice, sound effects, and background music based on the text prompt and visual content. It is recommended to place dialogue in double quotes for better audio generation. For example: The man stops the woman and says, "Remember, never point your finger at the moon."'
  ],
  [
    '* true：模型输出的视频包含同步音频。模型会基于文本提示词与视觉内容，自动生成与之匹配的人声、音效及背景音乐。建议将对话置于双引号内，以优化音频生成效果。例如：男人叫住女人说：你记住，以后不可以用手指指月亮。',
    '* true: The model outputs video with synchronized audio. The model automatically generates matching voice, sound effects, and background music based on the text prompt and visual content. It is recommended to place dialogue in double quotes for better audio generation. For example: The man stops the woman and says, "Remember, never point your finger at the moon."'
  ],
  [
    '* false：模型输出的视频为无声视频。',
    '* false: The model outputs video without audio.'
  ],
  [
    '注意：生成的有声视频均为单声道，和传入的音频声道数无关。',
    'Note: Generated audio videos are all mono, regardless of the input audio channel count.'
  ],
  // camera_fixed
  [
    '是否固定摄像头。',
    'Whether to fix the camera.'
  ],
  [
    '* true：固定摄像头。平台会在用户提示词中追加固定摄像头，实际效果不保证。',
    '* true: Fix the camera. The platform will append fixed camera instructions to the user prompt, but the actual effect is not guaranteed.'
  ],
  [
    '* false：不固定摄像头。',
    '* false: Do not fix the camera.'
  ],
  // Text prompt description
  [
    '输入给模型的文本提示词，描述期望生成的视频。',
    'Text prompt input to the model, describing the expected video content.'
  ],
  [
    '说明：\n* 提示词语言支持：所有模型均支持中英文提示词；seedance 2.0 及 seedance 2.0 fast 额外支持日语、印尼语、西班牙语、葡萄牙语。\n* 提示词字数建议：中文提示词不超过500字，英文提示词不超过1000词。字数过多易导致信息分散，模型可能忽略细节、仅关注重点，进而造成视频缺失部分元素。',
    'Notes:\n* Prompt language support: All models support Chinese and English prompts; seedance 2.0 and seedance 2.0 fast additionally support Japanese, Indonesian, Spanish, and Portuguese.\n* Prompt length recommendations: Chinese prompts should not exceed 500 characters, English prompts should not exceed 1000 words. Excessively long prompts may cause information dispersion, and the model may ignore details and only focus on key points, resulting in missing elements in the video.'
  ],
  // return_last_frame
  [
    'true：返回生成视频的尾帧图像。设置为 true 后，可通过查询视频生成任务接口获取视频的尾帧图像。尾帧图像的格式为 png，宽高像素值与生成的视频保持一致，无水印。\n\n使用该参数可实现生成多个连续视频：以上一个生成视频的尾帧作为下一个视频任务的首帧，快速生成多个连续视频。\n\nfalse：不返回生成视频的尾帧图像。',
    'true: Return the last frame image of the generated video. When set to true, you can obtain the last frame image through the query video generation task API. The last frame image is in PNG format with the same pixel dimensions as the generated video, without watermarks.\n\nUse this parameter to generate multiple consecutive videos: use the last frame of one video as the first frame of the next video task to quickly generate a sequence of consecutive videos.\n\nfalse: Do not return the last frame image of the generated video.'
  ],
  [
    'true：返回生成视频的尾帧图像。设置为 true 后，可通过查询视频生成任务接口获取视频的尾帧图像。尾帧图像的格式为 png，宽高像素值与生成的视频保持一致，无水印。\n\n使用该参数可实现生成多个连续视频：以上一个生成视频的尾帧作为下一个视频任务的首帧，快速生成多个连续视频。\n\nfalse：不返回生成视频的尾帧图像',
    'true: Return the last frame image of the generated video. When set to true, you can obtain the last frame image through the query video generation task API. The last frame image is in PNG format with the same pixel dimensions as the generated video, without watermarks.\n\nUse this parameter to generate multiple consecutive videos: use the last frame of one video as the first frame of the next video task to quickly generate a sequence of consecutive videos.\n\nfalse: Do not return the last frame image of the generated video.'
  ],
  // draft
  [
    '> 仅 Seedance 1.5 pro 支持',
    '> Only supported by Seedance 1.5 pro'
  ],
  [
    '控制是否开启样片模式。',
    'Controls whether to enable draft mode.'
  ],
  [
    '* true：开启样片模式，生成一段预览视频，快速验证场景结构、镜头调度、主体动作与 prompt 意图是否符合预期。消耗 token 数较正常视频更少，使用成本更低。\n* false：关闭样片模式，正常生成一段视频。',
    '* true: Enable draft mode to generate a preview video, quickly verifying whether the scene structure, camera movement, subject actions, and prompt intent meet expectations. Consumes fewer tokens than normal video, reducing cost.\n* false: Disable draft mode and generate a normal video.'
  ],
  [
    '说明：开启样片模式后，将使用 480p 分辨率生成 Draft 视频（使用其他分辨率会报错），不支持返回尾帧功能，不支持离线推理功能。',
    'Note: When draft mode is enabled, Draft videos are generated at 480p resolution (using other resolutions will cause an error). The last frame return feature is not supported, and offline inference is not supported.'
  ],
  // tools
  [
    '> 仅 Seedance 2.0 系列支持',
    '> Only supported by Seedance 2.0 series'
  ],
  [
    '配置模型要调用的工具。(海外节点目前不支持web_search)',
    'Configure the tools for the model to call. (Web search is currently not supported on overseas nodes)'
  ],
  // service_tier
  [
    '> 不支持修改已提交任务的服务等级\n> Seedance 2.0 系列仅支持在线推理模式，不支持配置该参数\n目前我们还未接入离线推理',
    '> The service tier of a submitted task cannot be modified\n> Seedance 2.0 series only supports online inference mode and does not support this parameter\nCurrently offline inference is not yet supported'
  ],
  [
    '指定处理本次请求的服务等级类型，枚举值：',
    'Specifies the service tier for processing this request. Enum values:'
  ],
  [
    '* default：在线推理模式，RPM 和并发数配额较低，适合对推理时效性要求较高的场景。\n* flex：离线推理模式，TPD 配额更高，价格为在线推理的 50%，适合对推理时延要求不高的场景。',
    '* default: Online inference mode, lower RPM and concurrency quotas, suitable for scenarios requiring low-latency inference.\n* flex: Offline inference mode, higher TPD quotas, priced at 50% of online inference, suitable for scenarios with less stringent latency requirements.'
  ],
  // execution_expires_after
  [
    '任务超时阈值。指定任务提交后的过期时间（单位：秒），从 created at 时间戳开始计算。默认值 172800 秒，即 48 小时。取值范围：[3600，259200]。',
    'Task timeout threshold. Specifies the expiration time after task submission (in seconds), calculated from the created_at timestamp. Default: 172800 seconds (48 hours). Range: [3600, 259200].'
  ],
  [
    '不论使用哪种 service_tier，都建议根据业务场景设置合适的超时时间。超过该时间后任务会被自动终止，并标记为 expired 状态。',
    'Regardless of the service_tier used, it is recommended to set an appropriate timeout based on your business scenario. After this time, the task will be automatically terminated and marked as expired.'
  ],
  // callback_url
  [
    '填写本次生成任务结果的回调通知地址。当视频生成任务有状态变化时，方舟将向此地址推送 POST 请求。',
    'The callback notification URL for the generation task results. When the video generation task status changes, the platform will send a POST request to this URL.'
  ],
  [
    '回调请求内容结构与查询任务API的返回体一致。',
    'The callback request body structure is the same as the query task API response.'
  ],
  [
    '回调返回的 status 包括以下状态：\n* queued：排队中。\n* running：任务运行中。\n* succeeded：任务成功。（如发送失败，即5秒内没有接收到成功发送的信息，回调三次）\n* failed：任务失败。（如发送失败，即5秒内没有接收到成功发送的信息，回调三次）\n* expired：任务超时，即任务处于运行中或排队中状态超过过期时间。可通过 execution_expires_after 字段设置过期时间。',
    'The callback status includes the following states:\n* queued: In queue.\n* running: Task running.\n* succeeded: Task successful. (If sending fails, i.e., no successful delivery within 5 seconds, retry up to 3 times)\n* failed: Task failed. (If sending fails, i.e., no successful delivery within 5 seconds, retry up to 3 times)\n* expired: Task timed out, meaning the task has been in running or queued state beyond the expiration time. Can be configured via the execution_expires_after field.'
  ],
  // priority
  [
    '> 仅 Seedance 2.0 系列支持。(每个用户可使用的最高priority请联系销售获取)',
    '> Only supported by Seedance 2.0 series. (Please contact sales for the maximum priority available per user)'
  ],
  [
    '设置当前请求的执行优先级，决定其在队列中的排序位置。取值范围：0~9，数值越大，优先级越高。',
    'Sets the execution priority of the current request, determining its position in the queue. Range: 0~9, higher values indicate higher priority.'
  ],
  [
    '默认情况下，请求按 FIFO（First In, First Out，先进先出）顺序执行。设置较高优先级后，该请求将插队到同 Endpoint（推理接入点）下所有低优先级请求之前。',
    'By default, requests are executed in FIFO (First In, First Out) order. When a higher priority is set, the request will jump ahead of all lower-priority requests under the same Endpoint.'
  ],
  [
    '说明：\n* 相同优先级的请求之间仍按 FIFO 排序。\n* 优先级仅影响排队顺序，不会中断正在执行中（status=running）的任务。\n* 优先级仅在同一 Endpoint 内生效，不影响其他 Endpoint。\n* 离线推理模式（service_tier=flex）不支持配置优先级。',
    'Notes:\n* Requests with the same priority are still ordered by FIFO.\n* Priority only affects queue order and does not interrupt currently running (status=running) tasks.\n* Priority only takes effect within the same Endpoint and does not affect other Endpoints.\n* Offline inference mode (service_tier=flex) does not support priority configuration.'
  ],
  // Tool type
  [
    '指定使用的工具类型。',
    'Specifies the type of tool to use.'
  ],
  [
    '* web_search：联网搜索工具。',
    '* web_search: Web search tool.'
  ],
  [
    '说明：\n* 开启联网搜索后，模型会根据用户的提示词自主判断是否搜索互联网内容（如商品、天气等）。可提升生成视频的时效性，但也会增加一定的时延。\n* 实际搜索次数可通过查询视频生成任务 API 返回的 usage.tool_usage.web_search 字段获取，如果为 0 表示未搜索。',
    'Notes:\n* When web search is enabled, the model autonomously determines whether to search internet content (e.g., products, weather) based on the user prompt. This can improve the timeliness of generated videos but may increase latency.\n* The actual number of searches can be obtained from the usage.tool_usage.web_search field in the query video generation task API response. A value of 0 indicates no search was performed.'
  ],
  // Task status
  [
    '- queued：排队中。\n- running：任务运行中。\n- cancelled：取消任务（只支持排队中状态的任务被取消）。\n- succeeded：任务成功。\n- failed：任务失败。\n- expired：任务超时。',
    '- queued: In queue.\n- running: Task running.\n- cancelled: Task cancelled (only queued tasks can be cancelled).\n- succeeded: Task successful.\n- failed: Task failed.\n- expired: Task timed out.'
  ],
  [
    '* `queued`：排队中。\n* `running`：任务运行中。\n* `cancelled`：取消任务，取消状态24h自动删除（只支持排队中状态的任务被取消）。\n* `succeeded`： 任务成功。\n* `failed`：任务失败。\n* `expired`：任务超时。',
    '* `queued`: In queue.\n* `running`: Task running.\n* `cancelled`: Task cancelled, automatically deleted after 24h (only queued tasks can be cancelled).\n* `succeeded`: Task successful.\n* `failed`: Task failed.\n* `expired`: Task timed out.'
  ],
  // User/safety identifier
  [
    '终端用户的唯一标识符。若 创建视频生成任务 时设置了该参数，接口会原样返回此信息。',
    'Unique identifier of the end user. If this parameter was set when creating the video generation task, the API returns it as-is.'
  ],
  // Video task response
  [
    '视频生成任务 ID。仅保留 7 天（从 created_at 时间戳计算），到期后自动删除。',
    'Video generation task ID. Only stored for 7 days (from the created_at timestamp), then automatically deleted.'
  ],
  [
    '* 当 draft: true 时，为 Draft 视频任务 ID。\n* 当 draft: false 时，为普通视频任务 ID。',
    '* When draft: true, this is the Draft video task ID.\n* When draft: false, this is the normal video task ID.'
  ],
  [
    '视频生成是异步的。获取 ID 后，通过查询视频生成任务接口查看状态，成功时接口返回生成的视频 URL。',
    'Video generation is asynchronous. After obtaining the ID, use the query video generation task API to check the status. When successful, the API returns the generated video URL.'
  ],
  // Duration info (from response)
  [
    '视频时长，单位秒。当 duration 取 -1 时，视频长度为模型自动选择的时长。',
    'Video duration, in seconds. When duration is -1, the video length is automatically selected by the model.'
  ],
  // Seeds in response
  [
    '视频生成使用的种子整数。当 seed 取 -1 时，由系统自动为当前任务分配随机种子。',
    'The seed integer used for video generation. When seed is -1, the system automatically assigns a random seed for the task.'
  ],
  // Finished_at
  [
    '视频生成完成时间，UTC 时间戳（精确到秒）。当 status 为 succeeded 或 failed 或 expired 时，该字段有值。',
    'Video generation completion time, UTC timestamp (in seconds). This field has a value when status is succeeded, failed, or expired.'
  ],
  // Video URL
  [
    '生成的视频文件信息。最多返回 1 个视频。',
    'Generated video file information. Returns up to 1 video.'
  ],
  [
    '生成的视频下载地址，有效期为 14 天。如果开启了在线推理，可通过此地址查看视频；如果开启了离线推理，生成的视频会上传到方舟文件存储系统，可通过此地址下载。',
    'Generated video download URL, valid for 14 days. If online inference is enabled, the video can be viewed at this URL; if offline inference is enabled, the generated video is uploaded to the platform file storage system and can be downloaded at this URL.'
  ],
  [
    '生成的视频文件格式，目前仅支持 mp4。',
    'Generated video file format. Currently only mp4 is supported.'
  ],
  [
    '视频高度，px。在线推理模式返回实际视频高度。离线推理暂不支持此字段。',
    'Video height, in pixels. Online inference mode returns the actual video height. Offline inference does not currently support this field.'
  ],
  [
    '视频宽度，px。在线推理模式返回实际视频宽度。离线推理暂不支持此字段。',
    'Video width, in pixels. Online inference mode returns the actual video width. Offline inference does not currently support this field.'
  ],
  // Model
  [
    '您需要调用的模型 ID（Model ID）',
    'The ID of the model you need to call (Model ID)'
  ],
  [
    '您需要调用的模型ID（Model ID）',
    'The ID of the model you need to call (Model ID)'
  ],
  // Additional short forms
  [
    '样片任务 ID。平台将自动复用 Draft 视频使用的用户输入（model、content.text、content.image_url、generate_audio、seed、ratio、duration、camera_fixed），生成正式视频。其余参数支持指定，不指定将使用本模型的默认值。\n\n使用分为两步：Step1: 调用本接口生成 Draft 视频。Step2: 如果确认 Draft 视频符合预期，可基于 Step1 返回的 Draft 视频任务 ID，调用本接口生成最终视频。',
    'Draft task ID. The platform will automatically reuse the user input from the Draft video (model, content.text, content.image_url, generate_audio, seed, ratio, duration, camera_fixed) to generate the final video. Other parameters can be specified; if not specified, the model defaults will be used.\n\nUsage is a two-step process: Step 1: Call this endpoint to generate a Draft video. Step 2: If the Draft video meets expectations, call this endpoint again with the Draft video task ID from Step 1 to generate the final video.'
  ],
  // Frames
  [
    '> Seedance 2.0 系列、Seedance 1.5 pro 暂不支持\n> duration 和 frames 二选一即可，frames 的优先级高于 duration。如果您希望生成小数秒的视频，建议指定 frames。',
    '> Temporarily not supported by Seedance 2.0 series and Seedance 1.5 pro\n> Choose either duration or frames; frames takes priority over duration. If you want to generate videos with fractional seconds, it is recommended to specify frames.'
  ],
  [
    '生成视频的帧数。通过指定帧数，可以灵活控制生成视频的长度，生成小数秒的视频。',
    'The number of frames for the generated video. By specifying the frame count, you can flexibly control the video length and generate videos with fractional seconds.'
  ],
  [
    '由于 frames 的取值限制，仅能支持有限小数秒，您需要根据公式推算最接近的帧数。\n\n* 计算公式：帧数 = 时长 × 帧率（24）。\n* 取值范围：支持 [29, 289] 区间内所有满足 25 + 4n 格式的整数值，其中 n 为正整数。\n\n例如：假设需要生成 2.4 秒的视频，帧数=2.4×24=57.6。由于 frames 不支持 57.6，此时您只能选择一个最接近的值。根据 25+4n 计算出最接近的帧数为 57，实际生成的视频为 57/24=2.375 秒。',
    'Due to frames value constraints, only limited fractional seconds are supported. You need to calculate the closest frame count using the formula.\n\n* Formula: frames = duration x frame rate (24).\n* Range: Supports all integer values in the [29, 289] range that satisfy the format 25 + 4n, where n is a positive integer.\n\nExample: To generate a 2.4-second video, frames = 2.4 x 24 = 57.6. Since frames does not support 57.6, you can only choose the closest value. According to 25+4n, the closest frame count is 57, and the actual generated video is 57/24 = 2.375 seconds.'
  ],
  // safety_identifier
  [
    '终端用户的唯一标识符，用于帮助平台检测您的应用中的用户是否违反方舟使用政策。该标识符为英文字符串，对于单个用户必须固定且唯一，长度不能超过64个字符。建议传入对用户名、用户ID或邮箱地址进行哈希计算后生成的字符串，避免泄漏用户隐私信息。',
    'Unique identifier of end users, used to help the platform detect users in your application who may violate the ModelArk usage policy. This identifier is an English string, which must be fixed and unique for a single user, and the length cannot exceed 64 characters. It is recommended to pass in a string generated by hashing the username, user ID or email address to avoid leaking user privacy information.'
  ],
  // Note: above parameters are Query String Parameters
  [
    '> 说明：下面参数为Query String Parameters，在URL String中传入。',
    '> Note: The following parameters are Query String Parameters, passed in the URL string.'
  ],
  [
    '> Note: The above parameters are Query String Parameters, passed in the URL string.\n',
    '> Note: The above parameters are Query String Parameters, passed in the URL string.\n'
  ]
];

const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str);

function replaceInStrings(obj) {
  if (typeof obj === 'string') {
    if (!hasChinese(obj)) return obj;
    let result = obj;
    // Sort by length descending for longest match first
    const sortedR = [...replacements].sort((a, b) => b[0].length - a[0].length);
    for (const [zh, en] of sortedR) {
      if (result.includes(zh)) {
        result = result.split(zh).join(en);
      }
    }
    return result;
  } else if (Array.isArray(obj)) {
    return obj.map(item => replaceInStrings(item));
  } else if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceInStrings(value);
    }
    return result;
  }
  return obj;
}

// Find all json files recursively
function findJsonFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(fullPath));
    } else if (entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!hasChinese(content)) {
      return { fixed: false, reason: 'already clean' };
    }
    const data = JSON.parse(content);
    const translated = replaceInStrings(data);
    const result = JSON.stringify(translated, null, 2);
    if (result !== content) {
      fs.writeFileSync(filePath, result, 'utf-8');
      return { fixed: true };
    }
    // Check if Chinese still remains
    if (hasChinese(result)) {
      return { fixed: false, reason: 'still has Chinese after translation' };
    }
    return { fixed: false, reason: 'no change needed' };
  } catch (e) {
    return { fixed: false, reason: e.message };
  }
}

function main() {
  const files = findJsonFiles(EN_DIR);
  let fixedCount = 0;
  let remaining = [];
  
  for (const file of files) {
    const relPath = path.relative(EN_DIR, file);
    const result = processFile(file);
    if (result.fixed) {
      console.log('  v Fixed: ' + relPath);
      fixedCount++;
    } else if (result.reason === 'still has Chinese after translation') {
      console.log('  x STILL HAS CHINESE: ' + relPath);
      remaining.push(relPath);
    }
  }
  
  console.log('\nFixed ' + fixedCount + ' files.');
  
  if (remaining.length > 0) {
    console.log('\nFiles still with Chinese:');
    for (const f of remaining) {
      console.log('  - ' + f);
    }
  } else {
    console.log('All files clean!');
  }
}

main();