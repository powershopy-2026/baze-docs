const fs = require('fs');
const path = require('path');

const ZH_DIR = path.join(__dirname, '..', 'api-reference', 'zh-Hans', 'zmodelVideo', 'byteplus');
const EN_DIR = path.join(__dirname, '..', 'api-reference', 'en', 'zmodelVideo', 'byteplus');

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

// ============================================================
// ENGLISH TRANSLATIONS FOR ALL CHINESE STRINGS
// ============================================================

const ZH_TO_EN = new Map();

// --- seedance-video.json top description ---
ZH_TO_EN.set('本文介绍创建视频生成任务 API 的输入输出参数，供您使用接口时查阅字段含义。模型会依据传入的图片及文本信息生成视频，待生成完成后，您可以按条件查询任务并获取生成的视频。\n\n## 模型能力\n\n* **Doubao Seedance 2.0 系列（有声视频/无声视频）**\n   * **多模态参考生视频**：输入<ins>参考图片（0\\~9）+参考视频（0\\~3）+ 参考音频（0\\\\~3）+ 文本提示词（可选）</ins>生成 1 个目标视频。注意不可单独输入音频，应至少包含 1 个参考视频或图片。支持生成全新视频、编辑视频、延长视频。\n   * **图生视频-首尾帧**：输入<ins>首帧图片+尾帧图片+文本提示词（可选）</ins>生成 1 个目标视频。\n   * **图生视频-首帧**：输入<ins>首帧图片+文本提示词（可选）</ins>生成 1 个目标视频。\n   * **文生视频**：输入<ins>文本提示词</ins>生成 1 个目标视频。\n\n* **Doubao Seedance 1.5 pro（有声视频/无声视频）**\n   【图生视频-首尾帧】【图生视频-首帧】【文生视频】\n\n* **Doubao Seedance 1.0 pro**\n   【图生视频-首尾帧】【图生视频-首帧】【文生视频】\n\n* **Doubao Seedance 1.0 pro fast**\n   【图生视频-首帧】【文生视频】',
'This document describes the input and output parameters of the Create Video Generation Task API for your reference. The model generates videos based on input images and text. After generation, you can query tasks and retrieve the generated videos.\n\n## Model Capabilities\n\n* **Doubao Seedance 2.0 series (Audio Video / Silent Video)**\n   * **Multimodal Reference-to-Video**: Input <ins>reference images (0~9) + reference videos (0~3) + reference audio (0~3) + text prompt (optional)</ins> to generate 1 target video. Note: Audio cannot be input alone; at least 1 reference video or image is required. Supports creating new videos, editing videos, and extending videos.\n   * **Image-to-Video (First & Last Frame)**: Input <ins>first frame image + last frame image + text prompt (optional)</ins> to generate 1 target video.\n   * **Image-to-Video (First Frame)**: Input <ins>first frame image + text prompt (optional)</ins> to generate 1 target video.\n   * **Text-to-Video**: Input <ins>text prompt</ins> to generate 1 target video.\n\n* **Doubao Seedance 1.5 pro (Audio Video / Silent Video)**\n   [Image-to-Video (First & Last Frame)] [Image-to-Video (First Frame)] [Text-to-Video]\n\n* **Doubao Seedance 1.0 pro**\n   [Image-to-Video (First & Last Frame)] [Image-to-Video (First Frame)] [Text-to-Video]\n\n* **Doubao Seedance 1.0 pro fast**\n   [Image-to-Video (First Frame)] [Text-to-Video]');

// --- Example names ---
ZH_TO_EN.set('多模态参考生视频', 'Multimodal Reference-to-Video');
ZH_TO_EN.set('有声视频-首帧', 'Audio Video - First Frame');
ZH_TO_EN.set('有声视频-首尾帧', 'Audio Video - First & Last Frame');
ZH_TO_EN.set('图生视频-base64编码', 'Image-to-Video - Base64');
ZH_TO_EN.set('文生视频', 'Text-to-Video');

// --- Example prompts ---
ZH_TO_EN.set('全程使用视频1的第一视角构图，全程使用音频1作为背景音乐。第一人称视角果茶宣传广告，seedance牌「苹苹安安」苹果果茶限定款；首帧为图片1，你的手摘下一颗带晨露的阿克苏红苹果，轻脆的苹果碰撞声；2-4 秒：快速切镜，你的手将苹果块投入雪克杯，加入冰块与茶底，用力摇晃，冰块碰撞声与摇晃声卡点轻快鼓点，背景音：「鲜切现摇」；4-6 秒：第一人称成品特写，分层果茶倒入透明杯，你的手轻挤奶盖在顶部铺展，在杯身贴上粉红包标，镜头拉近看奶盖与果茶的分层纹理；6-8 秒：第一人称手持举杯，你将图片2中的果茶举到镜头前（模拟递到观众面前的视角），杯身标签清晰可见，背景音「来一口鲜爽」，尾帧定格为图片2。背景声音统一为女生音色。',
'Use the first-person composition of video 1 throughout, with audio 1 as background music throughout. First-person fruit tea promotional ad, seedance brand "Peace & Sweet" Apple Fruit Tea Limited Edition; First frame is image 1, your hand picks an Aksu red apple with morning dew, crisp apple crunch sound; 2-4s: Quick cut, your hand throws apple chunks into a shaker, adds ice and tea base, shakes vigorously, ice clinking and shaking sounds sync with upbeat drum beats, background audio: "Freshly Cut, Freshly Shaken"; 4-6s: First-person product close-up, layered fruit tea poured into a clear cup, your hand gently spreads cream cheese topping, sticks a pink-gold label on the cup, camera zooms in on the layered texture of cream and fruit tea; 6-8s: First-person hand holding the cup, you raise the fruit tea from image 2 to the camera (simulating handing it to the viewer), cup label clearly visible, background audio "Take a Fresh Sip", final frame frozen on image 2. All background audio uses a female voice.');

ZH_TO_EN.set('女孩抱着狐狸，女孩睁开眼，温柔地看向镜头，狐狸友善地抱着，镜头缓缓拉出，女孩的头发被风吹动，可以听到风声',
'A girl holding a fox, the girl opens her eyes and looks gently at the camera, the fox holds her affectionately, the camera slowly pulls out, the girl\'s hair blows in the wind, wind sounds can be heard');

ZH_TO_EN.set('图中女孩对着镜头说"茄子"，360度环绕运镜',
'The girl in the image says "cheese" to the camera, 360-degree orbit shot');

ZH_TO_EN.set('女孩抱着狐狸，女孩睁开眼，温柔地看向镜头，狐狸友善地抱着，镜头缓缓拉出，女孩的头发被风吹动',
'A girl holding a fox, the girl opens her eyes and looks gently at the camera, the fox holds her affectionately, the camera slowly pulls out, the girl\'s hair blows in the wind');

ZH_TO_EN.set('写实风格，晴朗的蓝天之下，一大片白色的雏菊花田，镜头逐渐拉近，最终定格在一朵雏菊花的特写上，花瓣上有几颗晶莹的露珠',
'Realistic style, under a clear blue sky, a large field of white daisies, the camera gradually zooms in, finally focused on a close-up of a daisy, with crystal clear dewdrops on the petals');

// --- content field descriptions ---
ZH_TO_EN.set('输入给模型，生成视频的信息，支持文本、图片、音频、视频、样片任务 ID。\n\n注意：Seedance 2.0 系列模型不支持直接上传含有真人人脸的参考图/视频。为了便利创作者对肖像的使用，平台推出了以下解决方案。\n\n* 支持使用部分模型的含人脸原始产物作为输入素材\n* 支持使用预置虚拟人像作为输入素材\n* 支持使用已授权真人素材作为输入\n\n支持以下几种组合：\n* 文本\n* 文本（可选）+ 图片\n* 文本（可选）+ 视频\n* 文本（可选）+ 图片 + 音频\n* 文本（可选）+ 图片 + 视频\n* 文本（可选）+ 视频 + 音频\n* 文本（可选）+ 图片 + 视频 + 音频\n* 样片任务 ID：样片指使用 Seedance 模型成功生成的样片视频，模型可基于样片生成高质量正式视频。\n\n---',
'Input information for the model to generate videos. Supports text, images, audio, video, and draft task IDs.\n\nNote: Seedance 2.0 series models do not support directly uploading reference images/videos containing real human faces. To facilitate creators\' use of portraits, the platform provides the following solutions:\n\n* Supports using face-containing raw outputs from certain models as input materials\n* Supports using preset virtual avatars as input materials\n* Supports using authorized real-person materials as input\n\nSupports the following combinations:\n* Text\n* Text (optional) + Image\n* Text (optional) + Video\n* Text (optional) + Image + Audio\n* Text (optional) + Image + Video\n* Text (optional) + Video + Audio\n* Text (optional) + Image + Video + Audio\n* Draft task ID: A draft refers to a sample video successfully generated using the Seedance model. The model can generate high-quality final videos based on the draft.\n\n---');

// --- callback_url ---
ZH_TO_EN.set('填写本次生成任务结果的回调通知地址。当视频生成任务有状态变化时，方舟将向此地址推送 POST 请求。\n\n回调请求内容结构与查询任务API的返回体一致。\n\n回调返回的 status 包括以下状态：\n* queued：排队中。\n* running：任务运行中。\n* succeeded：任务成功。（如发送失败，即5秒内没有接收到成功发送的信息，回调三次）\n* failed：任务失败。（如发送失败，即5秒内没有接收到成功发送的信息，回调三次）\n* expired：任务超时，即任务处于运行中或排队中状态超过过期时间。可通过 execution_expires_after 字段设置过期时间。',
'The callback notification URL for the generation task results. When the video generation task status changes, the platform will send a POST request to this URL.\n\nThe callback request body structure is the same as the query task API response.\n\nThe callback status includes the following states:\n* queued: In queue.\n* running: Task running.\n* succeeded: Task successful. (If sending fails, i.e., no successful delivery within 5 seconds, retry up to 3 times)\n* failed: Task failed. (If sending fails, i.e., no successful delivery within 5 seconds, retry up to 3 times)\n* expired: Task timed out, meaning the task has been in running or queued state beyond the expiration time. Can be configured via the execution_expires_after field.');

// --- return_last_frame ---
ZH_TO_EN.set('true：返回生成视频的尾帧图像。设置为 true 后，可通过查询视频生成任务接口获取视频的尾帧图像。尾帧图像的格式为 png，宽高像素值与生成的视频保持一致，无水印。\n\n使用该参数可实现生成多个连续视频：以上一个生成视频的尾帧作为下一个视频任务的首帧，快速生成多个连续视频。\n\nfalse：不返回生成视频的尾帧图像。',
'true: Return the last frame image of the generated video. When set to true, you can obtain the last frame image through the query video generation task API. The last frame image is in PNG format with the same pixel dimensions as the generated video, without watermarks.\n\nUse this parameter to generate multiple consecutive videos: use the last frame of one video as the first frame of the next video task to quickly generate a sequence of consecutive videos.\n\nfalse: Do not return the last frame image of the generated video.');

// --- service_tier ---
ZH_TO_EN.set('> 不支持修改已提交任务的服务等级\n> Seedance 2.0 系列仅支持在线推理模式，不支持配置该参数\n目前我们还未接入离线推理\n\n指定处理本次请求的服务等级类型，枚举值：\n\n* default：在线推理模式，RPM 和并发数配额较低，适合对推理时效性要求较高的场景。\n* flex：离线推理模式，TPD 配额更高，价格为在线推理的 50%，适合对推理时延要求不高的场景。',
'> The service tier of a submitted task cannot be modified\n> Seedance 2.0 series only supports online inference mode and does not support this parameter\nCurrently offline inference is not yet supported\n\nSpecifies the service tier for processing this request. Enum values:\n\n* default: Online inference mode, lower RPM and concurrency quotas, suitable for scenarios requiring low-latency inference.\n* flex: Offline inference mode, higher TPD quotas, priced at 50% of online inference, suitable for scenarios with less stringent latency requirements.');

// --- execution_expires_after ---
ZH_TO_EN.set('任务超时阈值。指定任务提交后的过期时间（单位：秒），从 created at 时间戳开始计算。默认值 172800 秒，即 48 小时。取值范围：[3600，259200]。\n\n不论使用哪种 service_tier，都建议根据业务场景设置合适的超时时间。超过该时间后任务会被自动终止，并标记为 expired 状态。',
'Task timeout threshold. Specifies the expiration time after task submission (in seconds), calculated from the created_at timestamp. Default: 172800 seconds (48 hours). Range: [3600, 259200].\n\nRegardless of the service_tier used, it is recommended to set an appropriate timeout based on your business scenario. After this time, the task will be automatically terminated and marked as expired.');

// --- generate_audio ---
ZH_TO_EN.set('> 仅 Seedance 2.0 系列、Seedance 1.5 pro 支持\n\n控制生成的视频是否包含与画面同步的声音。\n\n* true：模型输出的视频包含同步音频。模型会基于文本提示词与视觉内容，自动生成与之匹配的人声、音效及背景音乐。建议将对话部分置于双引号内，以优化音频生成效果。例如：男人叫住女人说："你记住，以后不可以用手指指月亮。"\n* false：模型输出的视频为无声视频。\n\n注意：生成的有声视频均为单声道，和传入的音频声道数无关。',
'> Only supported by Seedance 2.0 series and Seedance 1.5 pro\n\nControls whether the generated video contains synchronized audio.\n\n* true: The model outputs video with synchronized audio. The model automatically generates matching voice, sound effects, and background music based on the text prompt and visual content. It is recommended to place dialogue in double quotes for better audio generation. For example: The man stops the woman and says, "Remember, never point your finger at the moon."\n* false: The model outputs video without audio.\n\nNote: Generated audio videos are all mono, regardless of the input audio channel count.');

// --- draft ---
ZH_TO_EN.set('> 仅 Seedance 1.5 pro 支持\n\n控制是否开启样片模式。\n\n* true：开启样片模式，生成一段预览视频，快速验证场景结构、镜头调度、主体动作与 prompt 意图是否符合预期。消耗 token 数较正常视频更少，使用成本更低。\n* false：关闭样片模式，正常生成一段视频。\n\n说明：开启样片模式后，将使用 480p 分辨率生成 Draft 视频（使用其他分辨率会报错），不支持返回尾帧功能，不支持离线推理功能。',
'> Only supported by Seedance 1.5 pro\n\nControls whether to enable draft mode.\n\n* true: Enable draft mode to generate a preview video, quickly verifying whether the scene structure, camera movement, subject actions, and prompt intent meet expectations. Consumes fewer tokens than normal video, reducing cost.\n* false: Disable draft mode and generate a normal video.\n\nNote: When draft mode is enabled, Draft videos are generated at 480p resolution (using other resolutions will cause an error). The last frame return feature is not supported, and offline inference is not supported.');

// --- tools ---
ZH_TO_EN.set('> 仅 Seedance 2.0 系列支持\n\n配置模型要调用的工具。(海外节点目前不支持web_search)',
'> Only supported by Seedance 2.0 series\n\nConfigure the tools for the model to call. (Web search is currently not supported on overseas nodes)');

// --- priority ---
ZH_TO_EN.set('> 仅 Seedance 2.0 系列支持。(每个用户可使用的最高priority请联系销售获取)\n\n设置当前请求的执行优先级，决定其在队列中的排序位置。取值范围：0\\~9，数值越大，优先级越高。\n\n默认情况下，请求按 FIFO（First In, First Out，先进先出）顺序执行。设置较高优先级后，该请求将插队到同 Endpoint（推理接入点）下所有低优先级请求之前。\n\n说明：\n* 相同优先级的请求之间仍按 FIFO 排序。\n* 优先级仅影响排队顺序，不会中断正在执行中（status=running）的任务。\n* 优先级仅在同一 Endpoint 内生效，不影响其他 Endpoint。\n* 离线推理模式（service_tier=flex）不支持配置优先级。\n\n**示例**：\n\n某 Endpoint 当前队列中有 3 个排队中（status=queued）任务，优先级均为 0（默认）。\n\n队列：[任务A: priority=0] → [任务B: priority=0] → [任务C: priority=0]\n\n此时提交一个 priority=5 的新请求，该请求将直接排到队首：\n\n队列：[新请求: priority=5] → [任务A: priority=0] → [任务B: priority=0] → [任务C: priority=0]',
'> Only supported by Seedance 2.0 series. (Please contact sales for the maximum priority available per user)\n\nSets the execution priority of the current request, determining its position in the queue. Range: 0~9, higher values indicate higher priority.\n\nBy default, requests are executed in FIFO (First In, First Out) order. When a higher priority is set, the request will jump ahead of all lower-priority requests under the same Endpoint.\n\nNotes:\n* Requests with the same priority are still ordered by FIFO.\n* Priority only affects queue order and does not interrupt currently running (status=running) tasks.\n* Priority only takes effect within the same Endpoint and does not affect other Endpoints.\n* Offline inference mode (service_tier=flex) does not support priority configuration.\n\n**Example**:\n\nAn Endpoint currently has 3 queued (status=queued) tasks in the queue, all with priority 0 (default).\n\nQueue: [Task A: priority=0] → [Task B: priority=0] → [Task C: priority=0]\n\nWhen a new request with priority=5 is submitted, it goes directly to the front of the queue:\n\nQueue: [New Request: priority=5] → [Task A: priority=0] → [Task B: priority=0] → [Task C: priority=0]');

// --- resolution ---
ZH_TO_EN.set('> Seedance 2.0 系列、Seedance 1.5 pro 默认值：`720p`\n> Seedance 1.0 pro & pro-fast 默认值：`1080p`\n\n视频分辨率，枚举值：\n\n* 480p\n* 720p\n* 1080p：Seedance 2.0 fast 不支持',
'> Seedance 2.0 series and Seedance 1.5 pro default: `720p`\n> Seedance 1.0 pro & pro-fast default: `1080p`\n\nVideo resolution. Enum values:\n\n* 480p\n* 720p\n* 1080p: Not supported by Seedance 2.0 fast');

// --- ratio ---
ZH_TO_EN.set('> Seedance 2.0 系列、Seedance 1.5 pro 默认值为 `adaptive`\n> 其他模型：文生视频默认值 `16:9`，图生视频默认值 `adaptive`\n\n生成视频的宽高比例。不同宽高比对应的宽高像素值见下方表格。\n\n* 16:9\n* 4:3\n* 1:1\n* 3:4\n* 9:16\n* 21:9\n* adaptive：根据输入自动选择最合适的宽高比（详见下文说明）\n\n**adaptive 适配规则**\n\n当配置 ratio 为 adaptive 时，模型会根据生成场景自动适配宽高比；实际生成的视频宽高比可通过查询视频生成任务 API 返回的 ratio 字段获取。\n\n**支持模型：**\n* Seedance 2.0 系列、Seedance 1.5 Pro 支持\n* 其他模型仅图生视频场景支持\n\n**取值规则：**\n* 文生视频：根据输入的提示词，智能选择最合适的宽高比。\n* 首帧 / 首尾帧生视频：根据上传的首帧图片比例，自动选择最接近的宽高比。\n* 多模态参考生视频：根据用户提示词意图判断，如果是首帧生视频/编辑视频/延长视频，以该图片/视频为准选择最接近的宽高比；否则，以传入的第一个媒体文件为准（优先级：视频＞图片）选择最接近的宽高比。\n\n不同宽高比对应的宽高像素值\n\n注意：图生视频，选择的宽高比与您上传的图片宽高比不一致时，方舟会对您的图片进行裁剪，裁剪时会居中裁剪。\n\n| 分辨率 | 宽高比 | 宽高像素值 Seedance 1.0 系列 | 宽高像素值 Seedance 1.5 pro / 2.0 系列 |\n|---|---|---|---|\n| 480p | 16:9 | 864×480 | 864×496 |\n| | 4:3 | 736×544 | 752×560 |\n| | 1:1 | 640×640 | 640×640 |\n| | 3:4 | 544×736 | 560×752 |\n| | 9:16 | 480×864 | 496×864 |\n| | 21:9 | 960×416 | 992×432 |\n| 720p | 16:9 | 1248×704 | 1280×720 |\n| | 4:3 | 1120×832 | 1112×834 |\n| | 1:1 | 960×960 | 960×960 |\n| | 3:4 | 832×1120 | 834×1112 |\n| | 9:16 | 704×1248 | 720×1280 |\n| | 21:9 | 1504×640 | 1470×630 |\n| 1080p | 16:9 | 1920×1088 | 1920×1080 |\n| | 4:3 | 1664×1248 | 1664×1248 |\n| | 1:1 | 1440×1440 | 1440×1440 |\n| | 3:4 | 1248×1664 | 1248×1664 |\n| | 9:16 | 1088×1920 | 1080×1920 |\n| | 21:9 | 2176×928 | 2206×946 |',
'> Seedance 2.0 series and Seedance 1.5 pro default: `adaptive`\n> Other models: Text-to-Video default `16:9`, Image-to-Video default `adaptive`\n\nThe aspect ratio of the generated video. See the table below for pixel dimensions for different aspect ratios.\n\n* 16:9\n* 4:3\n* 1:1\n* 3:4\n* 9:16\n* 21:9\n* adaptive: Automatically selects the most suitable aspect ratio based on input\n\n**adaptive Rules**\n\nWhen ratio is set to adaptive, the model automatically adjusts the aspect ratio based on the generation scenario. The actual video aspect ratio can be obtained from the ratio field returned by the query video generation task API.\n\n**Supported Models:**\n* Seedance 2.0 series and Seedance 1.5 Pro\n* Other models only support this in Image-to-Video scenarios\n\n**Selection Rules:**\n* Text-to-Video: Intelligently selects the most suitable aspect ratio based on the input prompt.\n* First Frame / First & Last Frame: Automatically selects the closest aspect ratio based on the uploaded first frame image ratio.\n* Multimodal Reference-to-Video: Determines based on user prompt intent. If it is first-frame video/editing video/extending video, selects the closest aspect ratio based on that image/video; otherwise, selects the closest aspect ratio based on the first media file (priority: video > image).\n\nPixel dimensions for different aspect ratios\n\nNote: For Image-to-Video, if the selected aspect ratio does not match the uploaded image ratio, the platform will crop your image from the center.\n\n| Resolution | Aspect Ratio | Pixel Dimensions Seedance 1.0 Series | Pixel Dimensions Seedance 1.5 pro / 2.0 Series |\n|---|---|---|---|\n| 480p | 16:9 | 864×480 | 864×496 |\n| | 4:3 | 736×544 | 752×560 |\n| | 1:1 | 640×640 | 640×640 |\n| | 3:4 | 544×736 | 560×752 |\n| | 9:16 | 480×864 | 496×864 |\n| | 21:9 | 960×416 | 992×432 |\n| 720p | 16:9 | 1248×704 | 1280×720 |\n| | 4:3 | 1120×832 | 1112×834 |\n| | 1:1 | 960×960 | 960×960 |\n| | 3:4 | 832×1120 | 834×1112 |\n| | 9:16 | 704×1248 | 720×1280 |\n| | 21:9 | 1504×640 | 1470×630 |\n| 1080p | 16:9 | 1920×1088 | 1920×1080 |\n| | 4:3 | 1664×1248 | 1664×1248 |\n| | 1:1 | 1440×1440 | 1440×1440 |\n| | 3:4 | 1248×1664 | 1248×1664 |\n| | 9:16 | 1088×1920 | 1080×1920 |\n| | 21:9 | 2176×928 | 2206×946 |');

// --- duration ---
ZH_TO_EN.set('生成视频时长，仅支持整数，单位：秒。\n\n* Seedance 1.0 pro、Seedance 1.0 pro fast: [2, 12] s。\n* Seedance 1.5 pro: [4,12] 或设置为 -1\n* Seedance 2.0 系列: [4,15] 或设置为 -1\n\n**注意**\n\nSeedance 2.0 系列、Seedance 1.5 pro 支持两种配置方法\n* 指定具体时长：支持有效范围内的任一整数。\n* 智能指定：设置为 -1，表示由模型在有效范围内自主选择合适的视频长度（整数秒）。实际生成视频的时长可通过查询视频生成任务 API 返回的 duration 字段获取。注意视频时长与计费相关，请谨慎设置。',
'Video duration, integer only, in seconds.\n\n* Seedance 1.0 pro, Seedance 1.0 pro fast: [2, 12] s.\n* Seedance 1.5 pro: [4, 12] or set to -1\n* Seedance 2.0 series: [4, 15] or set to -1\n\n**Note**\n\nSeedance 2.0 series and Seedance 1.5 pro support two configuration methods:\n* Specify exact duration: Any integer within the valid range.\n* Smart mode: Set to -1 to let the model choose the appropriate video length (in whole seconds) within the valid range. The actual generated video duration can be obtained from the duration field returned by the query video generation task API. Note that video duration is related to billing, so set it carefully.');

// --- frames ---
ZH_TO_EN.set('> Seedance 2.0 系列、Seedance 1.5 pro 暂不支持\n> duration 和 frames 二选一即可，frames 的优先级高于 duration。如果您希望生成小数秒的视频，建议指定 frames。\n\n生成视频的帧数。通过指定帧数，可以灵活控制生成视频的长度，生成小数秒的视频。\n\n由于 frames 的取值限制，仅能支持有限小数秒，您需要根据公式推算最接近的帧数。\n\n* 计算公式：帧数 = 时长 × 帧率（24）。\n* 取值范围：支持 [29, 289] 区间内所有满足 25 + 4n 格式的整数值，其中 n 为正整数。\n\n例如：假设需要生成 2.4 秒的视频，帧数=2.4×24=57.6。由于 frames 不支持 57.6，此时您只能选择一个最接近的值。根据 25+4n 计算出最接近的帧数为 57，实际生成的视频为 57/24=2.375 秒。',
'> Temporarily not supported by Seedance 2.0 series and Seedance 1.5 pro\n> Choose either duration or frames; frames takes priority over duration. If you want to generate videos with fractional seconds, it is recommended to specify frames.\n\nThe number of frames for the generated video. By specifying the frame count, you can flexibly control the video length and generate videos with fractional seconds.\n\nDue to frames value constraints, only limited fractional seconds are supported. You need to calculate the closest frame count using the formula.\n\n* Formula: frames = duration x frame rate (24).\n* Range: Supports all integer values in the [29, 289] range that satisfy the format 25 + 4n, where n is a positive integer.\n\nExample: To generate a 2.4-second video, frames = 2.4 x 24 = 57.6. Since frames does not support 57.6, you can only choose the closest value. According to 25+4n, the closest frame count is 57, and the actual generated video is 57/24 = 2.375 seconds.');

// --- seed ---
ZH_TO_EN.set('> Seedance 2.0系列暂不支持\n\n 种子整数，用于控制生成内容的随机性。取值范围：[-1, 2^32-1]之间的整数。\n\n注意：\n* 相同的请求下，模型收到不同的seed值，如：不指定seed值或令seed取值为-1（会使用随机数替代）、或手动变更seed值，将生成不同的结果。\n* 相同的请求下，模型收到相同的seed值，会生成类似的结果，但不保证完全一致。',
'> Temporarily not supported by Seedance 2.0 series\n\nSeed integer for controlling the randomness of generated content. Range: integer in [-1, 2^32-1].\n\nNotes:\n* With the same request, if the model receives different seed values (e.g., not specifying a seed, setting seed to -1 which uses a random number, or manually changing the seed value), different results will be generated.\n* With the same request, if the model receives the same seed value, similar results will be generated, but exact consistency is not guaranteed.');

// --- camera_fixed ---
ZH_TO_EN.set('> 参考图场景不支持，Seedance 2.0 系列 暂不支持\n\n是否固定摄像头。\n\n* true：固定摄像头。平台会在用户提示词中追加固定摄像头，实际效果不保证。\n* false：不固定摄像头。',
'> Not supported in reference image scenarios, temporarily not supported by Seedance 2.0 series\n\nWhether to fix the camera.\n\n* true: Fix the camera. The platform will append fixed camera instructions to the user prompt, but the actual effect is not guaranteed.\n* false: Do not fix the camera.');

// --- watermark ---
ZH_TO_EN.set('生成视频是否包含水印。\n\n* false：生成视频不含水印。\n* true：生成视频右下角会展示 AI 生成 水印。',
'Whether the generated video contains a watermark.\n\n* false: The generated video does not contain a watermark.\n* true: The generated video displays an "AI Generated" watermark in the bottom-right corner.');

// --- TextContent.text description ---
ZH_TO_EN.set('输入给模型的文本提示词，描述期望生成的视频。\n\n说明：\n* 提示词语言支持：所有模型均支持中英文提示词；seedance 2.0 及 seedance 2.0 fast 额外支持日语、印尼语、西班牙语、葡萄牙语。\n* 提示词字数建议：中文提示词不超过500字，英文提示词不超过1000词。字数过多易导致信息分散，模型可能忽略细节、仅关注重点，进而造成视频缺失部分元素。',
'Text prompt input to the model, describing the expected video content.\n\nNotes:\n* Prompt language support: All models support Chinese and English prompts; seedance 2.0 and seedance 2.0 fast additionally support Japanese, Indonesian, Spanish, and Portuguese.\n* Prompt length recommendations: Chinese prompts should not exceed 500 characters, English prompts should not exceed 1000 words. Excessively long prompts may cause information dispersion, and the model may ignore details and only focus on key points, resulting in missing elements in the video.');

// --- ImageContent.url description ---
ZH_TO_EN.set('图片 URL 、图片 Base64 编码、素材 ID。\n\n* 图片 URL：填入图片的公网 URL。\n* Base64 编码：将本地文件转换为 Base64 编码字符串，然后提交给大模型。遵循格式：data:image/<图片格式>;base64,<Base64编码>，注意 <图片格式> 需小写，如 data:image/png;base64,{base64_image}。\n* 素材 ID：用于视频生成的预置素材及虚拟人像的 ID，遵循格式：asset://<ASSET_ID>。可从素材&虚拟人像库获取。\n\n传入单张图片要求：\n* 格式：jpeg、png、webp、bmp、tiff、gif。其中，Seedance 1.5 pro 和 Seedance 2.0 系列模型新增支持 heic 和 heif。\n* 宽高比（宽/高）： (0.4, 2.5)\n* 宽高长度（px）：(300, 6000)\n* 大小：单张图片小于 30 MB。请求体大小不超过 64 MB。大文件请勿使用Base64编码。\n* 图片数量：\n   * 图生视频-首帧：1 张\n   * 图生视频-首尾帧：2 张\n   * Seedance 2.0 系列 多模态参考生视频：1\\~9 张',
'Image URL, Image Base64 encoding, or Asset ID.\n\n* Image URL: Enter the public URL of the image.\n* Base64 encoding: Convert a local file to a Base64-encoded string and submit it to the model. Format: data:image/<image_format>;base64,<Base64_encoding>. Note that <image_format> must be lowercase, e.g., data:image/png;base64,{base64_image}.\n* Asset ID: ID for preset assets and virtual avatars used in video generation, format: asset://<ASSET_ID>. Can be obtained from the Assets & Virtual Avatars Library.\n\nSingle image requirements:\n* Formats: jpeg, png, webp, bmp, tiff, gif. Seedance 1.5 pro and Seedance 2.0 series additionally support heic and heif.\n* Aspect ratio (width/height): (0.4, 2.5)\n* Dimensions (px): (300, 6000)\n* Size: Single image under 30 MB. Request body size must not exceed 64 MB. Do not use Base64 encoding for large files.\n* Image count:\n   * Image-to-Video (First Frame): 1 image\n   * Image-to-Video (First & Last Frame): 2 images\n   * Seedance 2.0 series Multimodal Reference-to-Video: 1~9 images');

// --- ImageContent.role ---
ZH_TO_EN.set('图片的位置或用途。条件必填。\n\n注意：\n* 图生视频-首帧、图生视频-首尾帧、多模态参考生视频（包括参考图、视频、音频）为 3 种互斥场景，不可混用。\n* 多模态参考生视频可通过提示词指定参考图片作为首帧/尾帧，间接实现"首尾帧+多模态参考"效果。若需严格保障首尾帧和指定图片一致，优先使用图生视频-首尾帧（配置 role 为 first_frame/last_frame）。\n\n图生视频-首帧：\n* 支持模型：所有模型\n* 字段role取值：需要传入1个 image_url 对象，字段 role 为 first_frame 或不填。\n\n图生视频-首尾帧：\n* 支持模型：Seedance 2.0 系列，Seedance 1.5 pro、Seedance 1.0 pro\n* 字段role取值：需要传入2个image_url对象，且字段 role 必填。\n\n   * 首帧图片对应的字段 role 为：first_frame\n\n   * 尾帧图片对应的字段 role 为：last_frame\n\n说明：传入的首尾帧图片可相同。首尾帧图片的宽高比不一致时，以首帧图片为主，尾帧图片会自动裁剪适配。\n\n图生视频-参考图：\n* 支持模型：Seedance 2.0 系列（1\\~9 张图片）\n* 字段role取值：必填，每张参考图对应的字段 role 均为：reference_image',
'The position or purpose of the image. Required under certain conditions.\n\nNotes:\n* Image-to-Video (First Frame), Image-to-Video (First & Last Frame), and Multimodal Reference-to-Video (including reference images, videos, audio) are 3 mutually exclusive scenarios and cannot be mixed.\n* Multimodal Reference-to-Video can indirectly achieve the "First & Last Frame + Multimodal Reference" effect by specifying reference images as first/last frame via prompt. If strict consistency between the first/last frame and specified images is required, prefer using Image-to-Video (First & Last Frame) with role set to first_frame/last_frame.\n\nImage-to-Video (First Frame):\n* Supported models: All models\n* role field value: Requires 1 image_url object with role set to first_frame or left empty.\n\nImage-to-Video (First & Last Frame):\n* Supported models: Seedance 2.0 series, Seedance 1.5 pro, Seedance 1.0 pro\n* role field value: Requires 2 image_url objects with the role field required.\n   * First frame image: role = first_frame\n   * Last frame image: role = last_frame\n\nNote: The first and last frame images can be the same. If the aspect ratios of the first and last frame images differ, the first frame image takes precedence, and the last frame image will be automatically cropped to fit.\n\nImage-to-Video (Reference Image):\n* Supported models: Seedance 2.0 series (1~9 images)\n* role field value: Required. Each reference image must have role = reference_image');

// --- VideoContent.url ---
ZH_TO_EN.set('视频URL、素材 ID。\n\n* 视频 URL：填入视频的公网 URL。\n* 素材 ID：用于视频生成的预置素材及虚拟人像视频的 ID，遵循格式：asset://<ASSET_ID>。可从素材&虚拟人像库获取。\n\n传入单个视频要求：\n* 视频格式：mp4、mov，支持编码格式见下表。\n* 分辨率：480p，720p，1080p\n* 时长：单个视频时长 [2, 15] s，最多传入 3 个参考视频，所有视频总时长不超过 15s。\n* 尺寸：\n   * 宽高比（宽/高）：[0.4, 2.5]\n   * 宽高长度（px）：[300, 6000]\n   * 总像素数：[640×640=409600, 2206×946=2086876]，即宽和高的乘积符合 [409600, 2086876] 的区间要求。\n* 大小：单个视频不超过 50 MB。\n* 帧率 (FPS)：[24, 60]\n\n支持编码格式：\n| 容器格式 | 常用文件扩展名 | MIME | 支持编码 |\n|---|---|---|---|\n| MP4 | .mp4 | video/mp4 | 视频：H.264/AVC、H.265/HEVC；音频：AAC、MP3 |\n| QuickTime | .mov | video/quicktime | 视频：H.264/AVC、H.265/HEVC；音频：AAC、MP3 |',
'Video URL or Asset ID.\n\n* Video URL: Enter the public URL of the video.\n* Asset ID: ID for preset assets and virtual avatar videos used in video generation, format: asset://<ASSET_ID>. Can be obtained from the Assets & Virtual Avatars Library.\n\nSingle video requirements:\n* Formats: mp4, mov. Supported codecs are listed below.\n* Resolution: 480p, 720p, 1080p\n* Duration: Single video [2, 15] s, up to 3 reference videos, total duration must not exceed 15s.\n* Dimensions:\n   * Aspect ratio (width/height): [0.4, 2.5]\n   * Width/height (px): [300, 6000]\n   * Total pixels: [640x640=409600, 2206x946=2086876], i.e., width x height must be within [409600, 2086876].\n* Size: Single video must not exceed 50 MB.\n* Frame rate (FPS): [24, 60]\n\nSupported codecs:\n| Container | Common Extensions | MIME | Supported Codecs |\n|---|---|---|---|\n| MP4 | .mp4 | video/mp4 | Video: H.264/AVC, H.265/HEVC; Audio: AAC, MP3 |\n| QuickTime | .mov | video/quicktime | Video: H.264/AVC, H.265/HEVC; Audio: AAC, MP3 |');

// --- AudioContent.url ---
ZH_TO_EN.set('音频 URL 、音频 Base64 编码、素材 ID。\n\n* 音频 URL：填入音频的公网 URL。\n* Base64 编码：将本地文件转换为 Base64 编码字符串，然后提交给大模型。遵循格式：data:audio/<音频格式>;base64,<Base64编码>，注意 <音频格式> 需小写，如 data:audio/wav;base64,{base64_audio}。\n* 素材 ID：用于视频生成的虚拟人的音频素材 ID，遵循格式：asset://<ASSET_ID>。可从素材&虚拟人像库获取。\n\n传入单个音频要求：\n* 格式：wav、mp3\n* 时长：单个音频时长 [2, 15] s，最多传入 3 段参考音频，所有音频总时长不超过 15 s。\n* 大小：单个音频不超过 15 MB，请求体大小不超过 64 MB。大文件请勿使用Base64编码。',
'Audio URL, Audio Base64 encoding, or Asset ID.\n\n* Audio URL: Enter the public URL of the audio.\n* Base64 encoding: Convert a local file to a Base64-encoded string and submit it to the model. Format: data:audio/<audio_format>;base64,<Base64_encoding>. Note that <audio_format> must be lowercase, e.g., data:audio/wav;base64,{base64_audio}.\n* Asset ID: ID for virtual avatar audio assets used in video generation, format: asset://<ASSET_ID>. Can be obtained from the Assets & Virtual Avatars Library.\n\nSingle audio requirements:\n* Formats: wav, mp3\n* Duration: Single audio [2, 15] s, up to 3 reference audio segments, total duration must not exceed 15s.\n* Size: Single audio must not exceed 15 MB, request body size must not exceed 64 MB. Do not use Base64 encoding for large files.');

// --- DraftTaskContent.id ---
ZH_TO_EN.set('样片任务 ID。平台将自动复用 Draft 视频使用的用户输入（model、content.text、content.image_url、generate_audio、seed、ratio、duration、camera_fixed），生成正式视频。其余参数支持指定，不指定将使用本模型的默认值。\n\n使用分为两步：Step1: 调用本接口生成 Draft 视频。Step2: 如果确认 Draft 视频符合预期，可基于 Step1 返回的 Draft 视频任务 ID，调用本接口生成最终视频。',
'Draft task ID. The platform will automatically reuse the user input from the Draft video (model, content.text, content.image_url, generate_audio, seed, ratio, duration, camera_fixed) to generate the final video. Other parameters can be specified; if not specified, the model defaults will be used.\n\nUsage is a two-step process: Step 1: Call this endpoint to generate a Draft video. Step 2: If the Draft video meets expectations, call this endpoint again with the Draft video task ID from Step 1 to generate the final video.');

// --- Tool.type ---
ZH_TO_EN.set('指定使用的工具类型。\n\n* web_search：联网搜索工具。\n\n说明：\n* 开启联网搜索后，模型会根据用户的提示词自主判断是否搜索互联网内容（如商品、天气等）。可提升生成视频的时效性，但也会增加一定的时延。\n* 实际搜索次数可通过查询视频生成任务 API 返回的 usage.tool_usage.web_search 字段获取，如果为 0 表示未搜索。',
'Specifies the type of tool to use.\n\n* web_search: Web search tool.\n\nNotes:\n* When web search is enabled, the model autonomously determines whether to search internet content (e.g., products, weather) based on the user prompt. This can improve the timeliness of generated videos but may increase latency.\n* The actual number of searches can be obtained from the usage.tool_usage.web_search field in the query video generation task API response. A value of 0 indicates no search was performed.');

// ============================================================
// SHORT PATTERNS FOR COMMON DESCRIPTIONS
// ============================================================

const SHORT_PATTERNS = new Map();

// query description
SHORT_PATTERNS.set('通过传入筛选参数，查询符合条件的视频生成任务。仅支持查询最近 7 天的任务记录，时间区间为 [T-7天, T)，其中 T 为请求发起时刻的 UTC 时间戳（精确到秒）。',
'Filter parameters to query matching video generation tasks. Only supports the last 7 days of task records, time range [T-7 days, T), where T is the UTC timestamp (seconds) of the request.');

// query success response - mixed Chinese/English
SHORT_PATTERNS.set('Query successful，返回符合筛选条件的视频生成任务列表。',
'Query successful, returns a list of video generation tasks matching the filter criteria.');

SHORT_PATTERNS.set('查询成功，返回符合筛选条件的视频生成任务列表。',
'Query successful, returns a list of video generation tasks matching the filter criteria.');

// query task ID description
SHORT_PATTERNS.set('您需要查询的视频生成任务的 ID 。\n\n> 说明：上面参数为Query String Parameters，在URL String中传入。',
'The ID of the video generation task you need to query.\n\n> Note: The above parameters are Query String Parameters, passed in the URL string.');

// end user identifier
SHORT_PATTERNS.set('终端用户的唯一标识符。若 创建视频生成任务 时设置了该参数，接口会原样返回此信息。',
'Unique identifier of the end user. If this parameter was set when creating the video generation task, the API returns it as-is.');

// task status short
SHORT_PATTERNS.set('任务状态。\n\n- queued：排队中。\n- running：任务运行中。\n- cancelled：取消任务（只支持排队中状态的任务被取消）。\n- succeeded：任务成功。\n- failed：任务失败。\n- expired：任务超时。',
'Task status.\n\n- queued: In queue.\n- running: Task running.\n- cancelled: Task cancelled (only queued tasks can be cancelled).\n- succeeded: Task successful.\n- failed: Task failed.\n- expired: Task timed out.');

SHORT_PATTERNS.set('任务状态，以及相关的信息：\n\n* `queued`：排队中。\n* `running`：任务运行中。\n* `cancelled`：取消任务，取消状态24h自动删除（只支持排队中状态的任务被取消）。\n* `succeeded`： 任务成功。\n* `failed`：任务失败。\n* `expired`：任务超时。',
'Task status and related information:\n\n* `queued`: In queue.\n* `running`: Task running.\n* `cancelled`: Task cancelled, automatically deleted after 24h (only queued tasks can be cancelled).\n* `succeeded`: Task successful.\n* `failed`: Task failed.\n* `expired`: Task timed out.');

// Multimodal input array descriptions
SHORT_PATTERNS.set('多模态输入数组。2.0 支持 `text`、`first_frame`、`last_frame`、`reference_image`、`reference_video`、`reference_audio`。',
'Multimodal input array. 2.0 supports `text`, `first_frame`, `last_frame`, `reference_image`, `reference_video`, and `reference_audio`.');

SHORT_PATTERNS.set('多模态输入数组。2.0 Mini 支持 `text`、`first_frame`、`last_frame`、`reference_image`、`reference_video`、`reference_audio`。',
'Multimodal input array. 2.0 Mini supports `text`, `first_frame`, `last_frame`, `reference_image`, `reference_video`, and `reference_audio`.');

SHORT_PATTERNS.set('多模态输入数组。图生视频需包含 `type: "first_frame"` 和 `type: "text"`。',
'Multimodal input array. Image-to-Video requires `type: "first_frame"` and `type: "text"`.');

SHORT_PATTERNS.set('多模态输入数组。首尾帧生视频需包含 `first_frame`、`last_frame` 和 `text`。',
'Multimodal input array. First & Last Frame video requires `first_frame`, `last_frame`, and `text`.');

SHORT_PATTERNS.set('多模态输入数组。1.0 Pro 支持 `text`、`first_frame`、`last_frame`。',
'Multimodal input array. 1.0 Pro supports `text`, `first_frame`, and `last_frame`.');

SHORT_PATTERNS.set('多模态输入数组。1.5 Pro 支持 `text`、`first_frame`、`last_frame`。',
'Multimodal input array. 1.5 Pro supports `text`, `first_frame`, and `last_frame`.');

SHORT_PATTERNS.set('多模态输入数组。1.0 Pro Fast 支持 `text`、`first_frame`、`last_frame`。',
'Multimodal input array. 1.0 Pro Fast supports `text`, `first_frame`, and `last_frame`.');

SHORT_PATTERNS.set('多模态输入数组。图生视频需包含 `first_frame` 和 `text`。',
'Multimodal input array. Image-to-Video requires `first_frame` and `text`.');

// Query task status description
SHORT_PATTERNS.set('查询视频生成任务的状态。\n\n> 仅支持查询最近 7 天的任务记录，时间区间为 [T-7天, T)，其中 T 为请求发起时刻的 UTC 时间戳（精确到秒）。注意：视频 URL 有效期为 14 天，请及时下载或转存。',
'Query the status of a video generation task.\n\n> Only supports the last 7 days of task records, time range [T-7 days, T), where T is the UTC timestamp (seconds) of the request. Note: Video URLs are valid for 14 days; please download or save them promptly.');

SHORT_PATTERNS.set('查询视频生成任务的状态。\n\n> 仅支持查询最近 7 天的任务记录，时间区间为 [T-7天, T)，其中 T 为请求发起时刻的 UTC 时间戳（精确到秒）。注意：视频 URL 有效期为 14 天，请及时下载或转存。\n\n## 鉴权\n\n本接口支持 API Key 鉴权。',
'Query the status of a video generation task.\n\n> Only supports the last 7 days of task records, time range [T-7 days, T), where T is the UTC timestamp (seconds) of the request. Note: Video URLs are valid for 14 days; please download or save them promptly.\n\n## Authentication\n\nThis endpoint supports API Key authentication.');

// Cancel Delete task
SHORT_PATTERNS.set('需要取消或者删除的视频生成任务 ID。\n\n任务状态不同，调用 DELETE 接口执行的操作有所不同，具体说明如下：\n\n| 当前任务状态 | 是否支持 DELETE 操作 | 操作含义 | DELETE 操作后任务状态 |\n|---|---|---|---|\n| `queued` | 支持 | 取消任务\n（释放配额） | `cancelled` |\n| `running` | 支持 | 停止任务\n（不释放配额） | `cancelled` |\n| `succeeded` | 支持 | 删除任务\n（释放配额，删除 URL） | 自动清除 |\n| `failed` | 支持 | 删除任务\n（释放配额） | 自动清除 |\n| `cancelled` | 不支持 | 已取消的任务无法再次取消 | - |',
'The ID of the video generation task to cancel or delete.\n\nThe behavior of the DELETE endpoint varies by task status:\n\n| Current Status | DELETE Supported | Behavior | Status After DELETE |\n|---|---|---|---|\n| `queued` | Yes | Cancel task (release quota) | `cancelled` |\n| `running` | Yes | Stop task (quota not released) | `cancelled` |\n| `succeeded` | Yes | Delete task (release quota, delete URL) | Auto-clean |\n| `failed` | Yes | Delete task (release quota) | Auto-clean |\n| `cancelled` | No | Already cancelled task cannot be cancelled again | - |');

// Video query task title
SHORT_PATTERNS.set('Seedance 查询视频生成任务',
'Seedance Query Video Generation Task');

// Supplementary prompt
SHORT_PATTERNS.set('补充的提示词', 'Supplementary prompt');

// ============================================================
// MAIN PROCESSING LOGIC
// ============================================================

function hasChinese(str) {
  return /[\u4e00-\u9fff\u3000-\u303f]/.test(str);
}

function processFile(enFile) {
  const content = fs.readFileSync(enFile, 'utf-8');
  
  if (!hasChinese(content)) {
    return false;
  }
  
  let result = content;
  
  // First pass: try exact ZH_TO_EN map matches (longest first for priority)
  const sortedEntries = [...ZH_TO_EN.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [zh, en] of sortedEntries) {
    if (result.includes(zh)) {
      result = result.split(zh).join(en);
    }
  }
  
  // Second pass: try short patterns
  const sortedShort = [...SHORT_PATTERNS.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [zh, en] of sortedShort) {
    if (result.includes(zh)) {
      result = result.split(zh).join(en);
    }
  }
  
  if (result !== content) {
    fs.writeFileSync(enFile, result, 'utf-8');
    return true;
  }
  
  return false;
}

function main() {
  const zhFiles = findJsonFiles(ZH_DIR);
  let fixedCount = 0;
  let remainingFiles = [];
  
  for (const zhFile of zhFiles) {
    const relativePath = path.relative(ZH_DIR, zhFile);
    const enFile = path.join(EN_DIR, relativePath);
    
    if (!fs.existsSync(enFile)) {
      console.log('  x Missing: ' + relativePath);
      continue;
    }
    
    try {
      const wasFixed = processFile(enFile);
      if (wasFixed) {
        console.log('  v Fixed: ' + relativePath);
        fixedCount++;
      } else {
        // Check if still has Chinese
        const content = fs.readFileSync(enFile, 'utf-8');
        if (hasChinese(content)) {
          remainingFiles.push(relativePath);
        }
      }
    } catch (e) {
      console.error('  x Error processing ' + relativePath + ': ' + e.message);
    }
  }
  
  console.log('\nFixed ' + fixedCount + ' files.');
  
  if (remainingFiles.length > 0) {
    console.log('\nFiles still with Chinese content:');
    for (const f of remainingFiles) {
      console.log('  - ' + f);
    }
  }
}

main();