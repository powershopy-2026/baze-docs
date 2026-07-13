const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'api-reference', 'zh-Hans', 'zmodelImage', 'byteplus');
const TARGET_DIR = path.join(__dirname, '..', 'api-reference', 'en', 'zmodelImage', 'byteplus');

function getAllFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getAllFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            const relativePath = path.relative(SOURCE_DIR, fullPath);
            files.push({ fullPath, relativePath });
        }
    }
    return files;
}

// Chinese to English text replacements (single-line descriptions only)
const descriptionMap = {
  // Server descriptions
  'Baze API 服务地址': 'Baze API service endpoint',

  // Tag descriptions
  'Seedream 系列图像生成能力': 'Seedream series image generation capabilities',

  // Info descriptions
  'Seedream 系列文生图能力文档。公开统一入口为 `/v1/images/generations`。': 'Seedream series Text-to-Image capability documentation. The public unified endpoint is `/v1/images/generations`.',
  'Seedream 系列图生图与多图参考能力文档。公开统一入口为 `/v1/images/generations`。': 'Seedream series Image-to-Image and multi-image reference capability documentation. The public unified endpoint is `/v1/images/generations`.',

  // Path descriptions (single line in JSON)
  '支持模型包括 `seedream-4-0-250828`。本文档覆盖文生图与组图生成场景。公开字段包括 `model`、`prompt`、`size`、`seed`、`sequential_image_generation`、`sequential_image_generation_options`、`response_format`、`watermark`。': 'Supported models include `seedream-4-0-250828`. This document covers Text-to-Image and Sequential Image Generation scenarios. Public fields include `model`, `prompt`, `size`, `seed`, `sequential_image_generation`, `sequential_image_generation_options`, `response_format`, and `watermark`.',
  '支持模型包括 `seedream-4-5-251128`。本文档覆盖文生图与组图生成场景。公开字段包括 `model`、`prompt`、`size`、`seed`、`sequential_image_generation`、`sequential_image_generation_options`、`response_format`、`watermark`。': 'Supported models include `seedream-4-5-251128`. This document covers Text-to-Image and Sequential Image Generation scenarios. Public fields include `model`, `prompt`, `size`, `seed`, `sequential_image_generation`, `sequential_image_generation_options`, `response_format`, and `watermark`.',
  '支持模型包括 `seedream-5-0-260128`。本文档覆盖文生图与组图生成场景。公开字段包括 `model`、`prompt`、`size`、`seed`、`sequential_image_generation`、`sequential_image_generation_options`、`response_format`、`watermark`。': 'Supported models include `seedream-5-0-260128`. This document covers Text-to-Image and Sequential Image Generation scenarios. Public fields include `model`, `prompt`, `size`, `seed`, `sequential_image_generation`, `sequential_image_generation_options`, `response_format`, and `watermark`.',
  '支持模型包括 `seedream-4-0-250828`。本文档覆盖图生图与多图参考生成场景。公开字段包括 `model`、`prompt`、`image`、`size`、`seed`、`sequential_image_generation`、`sequential_image_generation_options`、`response_format`、`watermark`。': 'Supported models include `seedream-4-0-250828`. This document covers Image-to-Image and Multi-Image Reference Generation scenarios. Public fields include `model`, `prompt`, `image`, `size`, `seed`, `sequential_image_generation`, `sequential_image_generation_options`, `response_format`, and `watermark`.',
  '支持模型包括 `seedream-4-5-251128`。本文档覆盖图生图与多图参考生成场景。公开字段包括 `model`、`prompt`、`image`、`size`、`seed`、`sequential_image_generation`、`sequential_image_generation_options`、`response_format`、`watermark`。': 'Supported models include `seedream-4-5-251128`. This document covers Image-to-Image and multi-image reference generation scenarios. Public fields include `model`, `prompt`, `image`, `size`, `seed`, `sequential_image_generation`, `sequential_image_generation_options`, `response_format`, and `watermark`.',
  '支持模型包括 `seedream-5-0-260128`。本文档覆盖图生图与多图参考生成场景。公开字段包括 `model`、`prompt`、`image`、`size`、`seed`、`sequential_image_generation`、`sequential_image_generation_options`、`response_format`、`watermark`。': 'Supported models include `seedream-5-0-260128`. This document covers Image-to-Image and multi-image reference generation scenarios. Public fields include `model`, `prompt`, `image`, `size`, `seed`, `sequential_image_generation`, `sequential_image_generation_options`, `response_format`, and `watermark`.',

  // Response descriptions
  '调用成功，返回图像生成结果。': 'Success, returns the image generation result.',
  '请求参数不合法。': 'Invalid request parameters.',
  '鉴权失败，例如未提供令牌或令牌无效。': 'Authentication failed, e.g., no token provided or invalid token.',
  '触发速率限制或账户额度不足。': 'Rate limit exceeded or insufficient account quota.',
  '服务端处理请求时发生内部错误。': 'Internal error occurred while processing the request.',

  // Security scheme
  '在请求头中传入 `Authorization: Bearer <token>`。': 'Pass `Authorization: Bearer <token>` in the request header.',

  // Model descriptions
  '图像生成模型名称。支持的模型包括 `seedream-4-0-250828`。': 'The image generation model name. Supported models include `seedream-4-0-250828`.',
  '图像生成模型名称。支持的模型包括 `seedream-4-5-251128`。': 'The image generation model name. Supported models include `seedream-4-5-251128`.',
  '图像生成模型名称。支持的模型包括 `seedream-5-0-260128`。': 'The image generation model name. Supported models include `seedream-5-0-260128`.',

  // Prompt description
  '用于生成图像的提示词，支持中英文。建议不超过 300 个汉字或 600 个英文单词。字数过多信息容易分散，模型可能因此忽略细节，只关注重点，造成图片缺失部分元素。': 'The prompt for generating images. Supports both Chinese and English. It is recommended not to exceed 300 Chinese characters or 600 English words. If the text is too long, information may become diluted, causing the model to ignore details and focus only on key points, resulting in missing elements in the image.',

  // Seed description
  '随机数种子。部分 Seedream 模型支持。取值范围 [-1, 2147483647]。': 'Random seed. Supported by some Seedream models. Value range: [-1, 2147483647].',

  // Created timestamp
  '创建时间的 Unix 时间戳（秒）。': 'Unix timestamp (seconds) of the creation time.',

  // Data description
  '生成的图像列表。组图场景下可能包含多张图片。': 'List of generated images. May contain multiple images in sequential image generation scenarios.',

  // Image data descriptions
  '图片下载链接。有效期 24 小时，请及时保存。': 'Image download link. Valid for 24 hours. Please save it promptly.',
  'Base64 编码的图片数据。': 'Base64-encoded image data.',
  '图像尺寸（宽x高）。仅 seedream-5.0-lite/4.5/4.0 返回。': 'Image dimensions (width x height). Only returned by seedream-5.0-lite/4.5/4.0.',

  // Watermark short descriptions
  '是否在生成的图片中添加水印。': 'Whether to add a watermark to the generated image.',
  '不添加水印。': 'No watermark added.',
  '在图片右下角添加「AI生成」字样的水印标识。': 'Adds an \\"AIGeneration\\" watermark identifier in the bottom right corner of the image.',

  // Image reference
  '输入的图片信息，支持 URL 或 Base64 编码。': 'Input image information. Supports URL or Base64 encoding.',
  '输入的多张图片信息，支持 URL 或 Base64 编码。': 'Multiple input image information. Supports URL or Base64 encoding.',
};

// Multi-line descriptions that need special handling
// These are handled by matching the exact content from the JSON file (with \n escape sequences)
function translateContent(content) {
  // Apply all single-line replacements first
  for (const [zh, en] of Object.entries(descriptionMap)) {
    content = content.split(zh).join(en);
  }
  
  // Now handle multi-line descriptions that contain \n in JSON string values
  // These are matched with the raw text from the JSON file which has literal backslash-n
  
  // size description for seedream-4-0-250828
  const size40Pattern = '"指定生成图像的尺寸信息。不同模型支持的尺寸方式存在差异。\\n\\n**seedream-4-0-250828**：\\n指定生成图像的尺寸信息，支持以下两种方式，不可混用。\\n\\n* 方式 1 | 指定生成图像的宽高像素值：\\n  * 默认值：`2048x2048`\\n  * 总像素取值范围：[`1280x720`（921600）, `4096x4096`（16777216）]\\n  * 宽高比取值范围：[1/16, 16]\\n\\n  > 说明：采用方式 1 时，需同时满足总像素取值范围和宽高比取值范围。其中，总像素是对单张图宽度和高度的像素乘积限制，而不是对宽度或高度的单独值进行限制。\\n  > * 有效示例：`1600x600`\\n    总像素值 1600x600=960000，符合 [921600, 16777216] 的区间要求；宽高比 1600/600=8/3，符合 [1/16, 16] 的区间要求，故该示例值有效。\\n  > * 无效示例：`800x800`\\n    总像素值 800x800=640000，未达到 921600 的最低要求；宽高 800/800=1，虽符合 [1/16, 16] 的区间要求，但因其未同时满足两项限制，故该示例值无效。\\n\\n* 方式 2 | 指定生成图像的分辨率，并在 prompt 中用自然语言描述图片宽高比、图片形状或图片用途，最终由模型判断生成图片的大小。\\n  * 可选值：`1K`、`2K`、`4K`\\n\\n  说明：采用方式 2 并在 prompt 中描述特定宽高比时，模型实际映射的宽高像素参考值：\\n\\n  | 分辨率 | 宽高比 | 宽高像素值 |\\n  |---|---|---|\\n  | 1K | 1:1 | 1024x1024 |\\n  | | 4:3 | 1152x864 |\\n  | | 3:4 | 864x1152 |\\n  | | 16:9 | 1280x720 |\\n  | | 9:16 | 720x1280 |\\n  | | 3:2 | 1248x832 |\\n  | | 2:3 | 832x1248 |\\n  | | 21:9 | 1512x648 |\\n  | 2K | 1:1 | 2048x2048 |\\n  | | 4:3 | 2304x1728 |\\n  | | 3:4 | 1728x2304 |\\n  | | 16:9 | 2848x1600 |\\n  | | 9:16 | 1600x2848 |\\n  | | 3:2 | 2496x1664 |\\n  | | 2:3 | 1664x2496 |\\n  | | 21:9 | 3136x1344 |\\n  | 4K | 1:1 | 4096x4096 |\\n  | | 4:3 | 4704x3520 |\\n  | | 3:4 | 3520x4704 |\\n  | | 16:9 | 5504x3040 |\\n  | | 9:16 | 3040x5504 |\\n  | | 3:2 | 4992x3328 |\\n  | | 2:3 | 3328x4992 |\\n  | | 21:9 | 6240x2656 |"';
  const size40Replacement = '"Specifies the size information of the generated image. Different models support different size configuration methods.\\n\\n**seedream-4-0-250828**:\\nSpecifies the size information of the generated image. Supports the following two methods, which cannot be mixed.\\n\\n* Method 1 | Specify pixel width and height:\\n  * Default: `2048x2048`\\n  * Total pixel range: [`1280x720` (921600), `4096x4096` (16777216)]\\n  * Aspect ratio range: [1/16, 16]\\n\\n  > Note: When using Method 1, both the total pixel range and aspect ratio range must be satisfied simultaneously. The total pixel value is the product of the image width and height pixels, not a restriction on individual width or height values.\\n  > * Valid example: `1600x600`\\n    Total pixel value 1600x600=960000, meets the [921600, 16777216] range; aspect ratio 1600/600=8/3, meets the [1/16, 16] range, so the example value is valid.\\n  > * Invalid example: `800x800`\\n    Total pixel value 800x800=640000, does not meet the minimum 921600; aspect ratio 800/800=1, meets the [1/16, 16] range, but fails to satisfy both restrictions simultaneously, so the example value is invalid.\\n\\n* Method 2 | Specify the resolution and describe the aspect ratio, shape, or purpose in the prompt using natural language, letting the model determine the image size.\\n  * Options: `1K`, `2K`, `4K`\\n\\n  Note: When using Method 2 with a specific aspect ratio in the prompt, the reference pixel dimensions mapped by the model are:\\n\\n  | Resolution | Aspect Ratio | Pixel Dimensions |\\n  |---|---|---|\\n  | 1K | 1:1 | 1024x1024 |\\n  | | 4:3 | 1152x864 |\\n  | | 3:4 | 864x1152 |\\n  | | 16:9 | 1280x720 |\\n  | | 9:16 | 720x1280 |\\n  | | 3:2 | 1248x832 |\\n  | | 2:3 | 832x1248 |\\n  | | 21:9 | 1512x648 |\\n  | 2K | 1:1 | 2048x2048 |\\n  | | 4:3 | 2304x1728 |\\n  | | 3:4 | 1728x2304 |\\n  | | 16:9 | 2848x1600 |\\n  | | 9:16 | 1600x2848 |\\n  | | 3:2 | 2496x1664 |\\n  | | 2:3 | 1664x2496 |\\n  | | 21:9 | 3136x1344 |\\n  | 4K | 1:1 | 4096x4096 |\\n  | | 4:3 | 4704x3520 |\\n  | | 3:4 | 3520x4704 |\\n  | | 16:9 | 5504x3040 |\\n  | | 9:16 | 3040x5504 |\\n  | | 3:2 | 4992x3328 |\\n  | | 2:3 | 3328x4992 |\\n  | | 21:9 | 6240x2656 |"';
  content = content.split(size40Pattern).join(size40Replacement);

  // size description for seedream-4-5-251128
  const size45Pattern = size40Pattern.replace('seedream-4-0-250828', 'seedream-4-5-251128');
  const size45Replacement = size40Replacement.replace('seedream-4-0-250828', 'seedream-4-5-251128');
  content = content.split(size45Pattern).join(size45Replacement);

  // size description for seedream-5-0-260128
  const size50Pattern = size40Pattern.replace('seedream-4-0-250828', 'seedream-5-0-260128');
  const size50Replacement = size40Replacement.replace('seedream-4-0-250828', 'seedream-5-0-260128');
  content = content.split(size50Pattern).join(size50Replacement);

  // response_format description
  const rfPattern = '"指定生成图像的返回格式。支持以下两种返回方式：\\n- `url`：返回图片下载链接；链接在图片生成后 24 小时内有效，请及时下载图片。\\n- `b64_json`：以 Base64 编码字符串的 JSON 格式返回图像数据。"';
  const rfReplacement = '"Specifies the return format of the generated image. Supports the following two return methods:\\n- `url`: Returns an image download link; the link is valid for 24 hours after generation, please download the image promptly.\\n- `b64_json`: Returns image data as a Base64-encoded JSON string."';
  content = content.split(rfPattern).join(rfReplacement);

  // sequential_image_generation description
  const sigPattern = '"控制是否关闭组图功能。\\n- `auto`：自动判断模式，模型会根据用户提供的提示词自主判断是否返回组图以及组图包含的图片数量。\\n- `disabled`：关闭组图功能，模型只会生成一张图。\\n\\n仅 seedream 5.0/4.5/4.0 支持该参数。"';
  const sigReplacement = '"Controls whether to disable the sequential image generation feature.\\n- `auto`: Automatic mode. The model autonomously decides whether to return a set of images and how many based on the user\'s prompt.\\n- `disabled`: Disables sequential image generation. The model will only generate one image.\\n\\nOnly seedream 5.0/4.5/4.0 support this parameter."';
  content = content.split(sigPattern).join(sigReplacement);

  // sequential_image_generation_options description
  const sgoPattern = '"组图功能的配置。仅当 `sequential_image_generation` 为 `auto` 时生效。\\n\\n仅 seedream 5.0/4.5/4.0 支持该参数。"';
  const sgoReplacement = '"Configuration for the sequential image generation feature. Only takes effect when `sequential_image_generation` is set to `auto`.\\n\\nOnly seedream 5.0/4.5/4.0 support this parameter."';
  content = content.split(sgoPattern).join(sgoReplacement);

  // max_images description
  const miPattern = '"指定本次请求，最多可生成的图片数量。\\n- 取值范围：[1, 15]\\n\\n说明：实际可生成的图片数量，除受到 `max_images` 影响外，还受到输入的参考图数量影响。输入的参考图数量 + 最终生成的图片数量 ≤ 15 张。"';
  const miReplacement = '"Specifies the maximum number of images that can be generated in this request.\\n- Value range: [1, 15]\\n\\nNote: The actual number of images that can be generated is affected not only by `max_images` but also by the number of input reference images. Number of input reference images + final generated images ≤ 15."';
  content = content.split(miPattern).join(miReplacement);

  // watermark description
  const wmPattern = '"是否在生成的图片中添加水印。\\n- `false`：不添加水印。\\n- `true`：在图片右下角添加「AI生成」字样的水印标识。"';
  const wmReplacement = '"Whether to add a watermark to the generated image.\\n- `false`: No watermark added.\\n- `true`: Adds a \\"AIGeneration\\" watermark identifier in the bottom right corner of the image."';
  content = content.split(wmPattern).join(wmReplacement);

  return content;
}

// Example prompts (in request body examples) - need title and description translations
const exampleTitleMap = {
  '基础文生图': 'Basic Text-to-Image',
  '基础图生图': 'Basic Image-to-Image',
  '组图生成': 'Sequential Image Generation',
  '限制组图最多张数': 'Limit Max Sequential Images',
  '多图参考生成': 'Multi-Image Reference Generation',
  '参数错误': 'Parameter Error',
  '未授权': 'Unauthorized',
  '额度不足或速率受限': 'Insufficient Quota or Rate Limited',
  '内部处理失败': 'Internal Processing Failure',
};

const examplePromptMap = {
  '一只可爱的柯基犬在草地上奔跑，阳光明媚，写实风格': 'A cute corgi running on the grass on a sunny day, realistic style',
  '将图片转换为宫崎骏动画风格': 'Convert the image to Studio Ghibli animation style',
  '结合这些图片的风格，生成一张新的风景图': 'Combine the styles of these images to generate a new landscape',
  '一套四季风景插画，春夏秋冬': 'A set of four-season landscape illustrations: spring, summer, autumn, winter',
  '充满活力的特写编辑肖像，模特眼神犀利，头戴雕塑感帽子，色彩拼接丰富。': 'Vibrant close-up editorial portrait, model with sharp eyes, wearing a sculptural hat, rich color blocking.',
  '一套包含春夏秋冬的四季风景插画': 'A set of four-season landscape illustrations covering spring, summer, autumn, winter',
  '生成一张新的风景图': 'Generate a new landscape',
  '确保和参考图风格尽量保持一致》：': 'Ensure consistency with the reference image style',
};

const errorMessageMap = {
  '请求体格式错误或字段取值非法': 'Invalid request body format or field value',
  '无效的令牌': 'Invalid token',
  '当前账户额度不足，请稍后重试': 'Insufficient account quota, please try again later',
  '服务内部处理失败，请稍后重试': 'Internal service processing failure, please try again later',
};

const sourceFiles = getAllFiles(SOURCE_DIR);
console.log('Files to process:', sourceFiles.map(f => f.relativePath));

for (const { fullPath, relativePath } of sourceFiles) {
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Apply translations
  content = translateContent(content);
  
  // Apply example title translations
  for (const [zh, en] of Object.entries(exampleTitleMap)) {
    content = content.split(zh).join(en);
  }
  
  // Apply example prompt translations
  for (const [zh, en] of Object.entries(examplePromptMap)) {
    content = content.split(zh).join(en);
  }
  
  // Apply error message translations
  for (const [zh, en] of Object.entries(errorMessageMap)) {
    content = content.split(zh).join(en);
  }
  
  const targetPath = path.join(TARGET_DIR, relativePath);
  const targetDir = path.dirname(targetPath);
  fs.mkdirSync(targetDir, { recursive: true });
  
  fs.writeFileSync(targetPath, content, 'utf-8');
  console.log('Translated: ' + relativePath);
}

console.log('\nDone!');