/**
 * Fix all remaining Chinese content in api-reference/en/zmodelVideo/byteplus
 * 
 * This script works on PARSED JSON values (after unescaping), making regex matching
 * much more reliable than working on raw file content.
 */

const fs = require('fs');
const path = require('path');

const TARGET_DIR = 'api-reference/en/zmodelVideo/byteplus';

function hasChinese(str) {
  return /[\u4e00-\u9fff]/.test(str);
}

// Build replacement map - these work on PARSED (unescaped) string values
const zhToEn = {
  // ===== Common short strings (appear in many files) =====
  '支持模型：**': '**Supported models:',
  '系列、Seedance 1.5 Pro 支持': 'series, Seedance 1.5 Pro supported',
  '系列（有声视频/无声视频）**': 'series (audio/silent videos)**',
  '其他模型仅图生视频场景支持': 'Other models only supported in Image-to-Video scenarios',
  '取值规则：**': '**Rules:',
  '根据输入的提示词，智能选择最合适的宽高比。': 'Based on the input prompt, intelligently selects the most suitable aspect ratio.',
  '不同宽高比对应的宽高像素值': 'Pixel dimensions corresponding to different aspect ratios',

  // ===== seedance-tasks-query.json =====
  '本接口支持 API Key 鉴权，详见鉴权认证方式。': 'This interface supports API Key authentication. See Authentication methods for details.',
  '您需要查询的视频生成任务的 ID 。': 'The ID of the video generation task you need to query.',
  '您需要查询的视频生成任务的 ID 。': 'The ID of the video generation task you need to query.',

  // ===== seedance-video.json main description =====
  '本文介绍创建视频生成任务 API 的输入输出参数，供您使用接口时查阅字段含义。模型会依据传入的图片及文本信息生成视频，待生成完成后，您可以按条件查询任务并获取生成的视频。': 
    'This document describes the input and output parameters of the Create Video Generation Task API for your reference when using the interface. The model generates videos based on the input images and text information. After generation is complete, you can query the task by conditions and obtain the generated video.',

  // ===== image_url description =====
  '图片 URL 、图片 Base64 编码、素材 ID。': 'Image URL, Base64-encoded image, or asset ID.',
  '图片 URL：填入图片的公网 URL。': 'Image URL: Provide the public URL of the image.',
  '素材 ID：用于视频生成的预置素材及虚拟人像的 ID，遵循格式：asset://<ASSET_ID>。可从素材&虚拟人像库获取。':
    'Asset ID: The ID of preset assets and virtual avatars for video generation. Format: asset://<ASSET_ID>. Can be obtained from the Assets & Virtual Avatars library.',
  '传入单张图片要求：': 'Single image requirements:',
  '宽高比（宽/高）： (0.4, 2.5)': 'Aspect ratio (width/height): (0.4, 2.5)',
  '宽高长度（px）：(300, 6000)': 'Dimensions (px): (300, 6000)',
  '大小：单张图片小于 30 MB。请求体大小不超过 64 MB。大文件请勿使用Base64编码。':
    'Size: Single image under 30 MB. Request body size does not exceed 64 MB. Do not use Base64 encoding for large files.',
  '图片数量：': 'Image count:',
  '图生视频-首帧：1 张': 'Image-to-Video (First Frame): 1 image',
  '图生视频-首尾帧：2 张': 'Image-to-Video (First & Last Frame): 2 images',

  // ===== image_url role field =====
  '图片的位置或用途。条件必填。': 'The position or purpose of the image. Conditionally required.',
  '图生视频-首帧：': 'Image-to-Video (First Frame):',
  '支持模型：所有模型': 'Supported models: All models',
  '图生视频-首尾帧：': 'Image-to-Video (First & Last Frame):',
  '图生视频-参考图：': 'Image-to-Video (Reference Image):',

  // ===== Example text =====  
  '图中女孩对着镜头说"茄子"，360度环绕运镜': 'The girl in the picture says "Cheese" to the camera, with a 360-degree orbiting camera movement',
};

// Regex-based replacements for patterns with special chars or parameters
const regexReplacements = [
  // Models section
  [/图生视频-首尾帧\*\*：输入<ins>首帧图片\+尾帧图片\+文本提示词（可选）<\/ins>生成 1 个目标视频。/g,
    '**Image-to-Video (First & Last Frame)**: Input <ins>first frame image + last frame image + text prompt (optional)</ins> to generate 1 target video.'],
  [/图生视频-首帧\*\*：输入<ins>首帧图片\+文本提示词（可选）<\/ins>生成 1 个目标视频。/g,
    '**Image-to-Video (First Frame)**: Input <ins>first frame image + text prompt (optional)</ins> to generate 1 target video.'],
  [/输入<ins>文本提示词<\/ins>生成 1 个目标视频。/g,
    'Input <ins>text prompt</ins> to generate 1 target video.'],
  [/有声视频\/无声视频）\*\*/g, 'audio/silent videos)**'],
  [/图生视频-首尾帧】【图生视频-首帧】【Text-to-Video】/g, 'Image-to-Video (First & Last Frame), Image-to-Video (First Frame), Text-to-Video'],
  [/图生视频-首帧】【Text-to-Video】/g, 'Image-to-Video (First Frame), Text-to-Video'],

  // image description with formatting
  [/Base64 编码：将本地文件转换为 Base64 编码字符串，然后提交给大模型。遵循格式：data:image\/<图片格式>;base64,<Base64编码>，注意 <图片格式> 需小写，如 data:image\/png;base64,\{base64_image\}。/g,
    'Base64 encoding: Convert local files to a Base64-encoded string and submit it to the model. Format: data:image/<image_format>;base64,<Base64_encoding>. Note that <image_format> must be lowercase, e.g., data:image/png;base64,{base64_image}.'],

  // Format requirements
  [/格式：jpeg、png、webp、bmp、tiff、gif。其中，Seedance 1\.5 pro 和 Seedance 2\.0 系列模型新增支持 heic 和 heif。/g,
    'Formats: jpeg, png, webp, bmp, tiff, gif. Seedance 1.5 pro and Seedance 2.0 series additionally support heic and heif.'],

  // Role descriptions
  [/字段role取值：需要传入1个 image_url 对象，字段 role 为 first_frame 或不填。/g,
    'Field role value: Requires 1 image_url object, with role set to first_frame or left empty.'],
  [/字段role取值：需要传入2个image_url对象，且字段 role 必填。/g,
    'Field role value: Requires 2 image_url objects, and the role field is required.'],
  [/字段role取值：必填，每张参考图对应的字段 role 均为：reference_image/g,
    'Field role value: Required. The role for each reference image is: reference_image'],
  [/首帧图片对应的字段 role 为：first_frame/g, 'The role for the first frame image is: first_frame'],
  [/尾帧图片对应的字段 role 为：last_frame/g, 'The role for the last frame image is: last_frame'],

  // Mutex scenarios
  [/图生视频-首帧、图生视频-首尾帧、Multimodal Reference-to-Video（包括参考图、视频、音频）为 3 种互斥场景，不可混用。/g,
    'Image-to-Video (First Frame), Image-to-Video (First & Last Frame), and Multimodal Reference-to-Video (including reference images, videos, and audio) are 3 mutually exclusive scenarios and cannot be mixed.'],
  [/可通过提示词指定参考图片作为首帧\/尾帧，间接实现"首尾帧\+多模态参考"效果。若需严格保障首尾帧和指定图片一致，优先使用图生视频-首尾帧（配置 role 为 first_frame\/last_frame）。/g,
    'You can specify reference images as first/last frames through prompts to indirectly achieve "First & Last Frame + Multimodal Reference" effects. If you need strict consistency between the first/last frames and specified images, prioritize using Image-to-Video (First & Last Frame) with role set to first_frame/last_frame.'],

  // Supported models
  [/支持模型：Seedance 2\.0 系列，Seedance 1\.5 pro、Seedance 1\.0 pro/g,
    'Supported models: Seedance 2.0 series, Seedance 1.5 pro, Seedance 1.0 pro'],
  [/支持模型：Seedance 2\.0 系列（1\~9 张图片）/g, 'Supported models: Seedance 2.0 series (1~9 images)'],

  // Frame note
  [/说明：传入的首尾帧图片可相同。首尾帧图片的宽高比不一致时，以首帧图片为主，尾帧图片会自动裁剪适配。/g,
    'Note: The first and last frame images can be the same. If the aspect ratios of the first and last frame images differ, the first frame image takes priority, and the last frame image will be automatically cropped to fit.'],

  // ===== Multimodal Reference-to-Video pattern =====
  [/输入<ins>参考图片（0\~9）\+参考视频（0\~3）\+ 参考音频（0\~3）\+ 文本提示词（可选）<\/ins>生成 1 个目标视频。注意不可单独输入音频，应至少包含 1 个参考视频或图片。支持生成全新视频、编辑视频、延长视频。/g,
    'Input <ins>reference images (0~9) + reference videos (0~3) + reference audio (0~3) + text prompt (optional)</ins> to generate 1 target video. Note that audio cannot be input alone; at least 1 reference video or image must be included. Supports generating new videos, editing videos, and extending videos.'],

  // Seedance 2.0 series count
  [/Seedance 2\.0 系列 Multimodal Reference-to-Video：1\~9 张/g, 'Seedance 2.0 series Multimodal Reference-to-Video: 1~9 images'],
];

function walkAndReplace(obj) {
  if (typeof obj === 'string') {
    if (!hasChinese(obj)) return obj;
    let result = obj;
    
    // Apply exact replacements first (safer)
    for (const [zh, en] of Object.entries(zhToEn)) {
      if (result.includes(zh)) {
        result = result.split(zh).join(en);
      }
    }
    
    // Apply regex replacements
    for (const [pattern, replacement] of regexReplacements) {
      result = result.replace(pattern, replacement);
    }
    
    return result;
  } else if (Array.isArray(obj)) {
    return obj.map(v => walkAndReplace(v));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [k, v] of Object.entries(obj)) {
      newObj[k] = walkAndReplace(v);
    }
    return newObj;
  }
  return obj;
}

function processFile(filePath) {
  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    if (!hasChinese(rawContent)) return false;
    
    const data = JSON.parse(rawContent);
    const newData = walkAndReplace(data);
    
    const newContent = JSON.stringify(newData, null, 2);
    
    // Check if Chinese remains
    if (hasChinese(newContent)) {
      console.log(`  ⚠️  "${path.basename(filePath)}" STILL has Chinese after fixes!`);
      const data2 = JSON.parse(newContent);
      findRemainingChinese(data2, '');
    }
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return true;
  } catch (err) {
    console.error(`  ❌ Error processing ${filePath}: ${err.message}`);
    return false;
  }
}

function findRemainingChinese(obj, prefix) {
  if (typeof obj === 'string') {
    if (hasChinese(obj)) {
      const parts = obj.match(/[\u4e00-\u9fff]+[^\n]{0,100}/g) || [];
      for (const p of parts) {
        if (p.replace(/[\u4e00-\u9fff]/g, '').length < 50) {
          console.log(`    "${p.trim()}"`);
        }
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => findRemainingChinese(v, `${prefix}[${i}]`));
  } else if (obj !== null && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      findRemainingChinese(v, `${prefix}.${k}`);
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixedCount += walkDir(fullPath);
    } else if (entry.name.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (hasChinese(content)) {
        console.log(`Fixing: ${path.relative(TARGET_DIR, fullPath)}`);
        if (processFile(fullPath)) {
          fixedCount++;
        }
      }
    }
  }
  return fixedCount;
}

console.log('🔍 Scanning for remaining Chinese in', TARGET_DIR);
const fixed = walkDir(path.resolve(TARGET_DIR));
console.log(`\n📝 Fixed ${fixed} files.`);

// Final verification
console.log('\n=== Final verification ===');
let remaining = 0;
function verify(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      verify(fullPath);
    } else if (entry.name.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (hasChinese(content)) {
        if (remaining === 0) console.log('Still has Chinese:');
        console.log(`  - ${path.relative(TARGET_DIR, fullPath)}`);
        remaining++;
      }
    }
  }
}
verify(path.resolve(TARGET_DIR));

if (remaining === 0) {
  console.log('✅ All files are clean - no Chinese remaining!');
} else {
  console.log(`\n⚠️  ${remaining} files still have Chinese content.`);
}