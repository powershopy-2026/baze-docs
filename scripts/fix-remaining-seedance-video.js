const fs = require('fs');

const files = [
  'api-reference/en/zmodelVideo/byteplus/seedance-video.json',
  'api-reference/en/zmodelVideo/byteplus/seedance/seedance-video.json'
];

function hasChinese(str) {
  return /[\u4e00-\u9fff]/.test(str);
}

for (const filePath of files) {
  console.log('=== Processing: ' + filePath + ' ===');
  let content = fs.readFileSync(filePath, 'utf-8');
  const origLen = content.length;
  
  // Replacement 1: Full Multimodal Reference-to-Video description (version with 0\\\\~3 - 4 backslashes)
  // Raw: 输入<ins>参考图片（0\\~9）+参考视频（0\\~3）+ 参考音频（0\\\\~3）+ 文本提示词（可选）</ins>生成 1 个目标视频。注意不可单独输入音频，应至少包含 1 个参考视频或图片。支持生成全新视频、编辑视频、延长视频。
  const multimodalRefV1 = '输入<ins>参考图片（0\\~9）+参考视频（0\\~3）+ 参考音频（0\\\\~3）+ 文本提示词（可选）</ins>生成 1 个目标视频。注意不可单独输入音频，应至少包含 1 个参考视频或图片。支持生成全新视频、编辑视频、延长视频。';
  const multimodalRefEnV1 = 'Input <ins>reference images (0~9) + reference videos (0~3) + reference audio (0~3) + text prompt (optional)</ins> to generate 1 target video. Note that audio cannot be input alone; at least 1 reference video or image must be included. Supports generating new videos, editing videos, and extending videos.';
  
  // Replacement 2: Full Multimodal Reference-to-Video description (version with 0\\~3 - 2 backslashes)
  const multimodalRefV2 = '输入<ins>参考图片（0\\~9）+参考视频（0\\~3）+ 参考音频（0\\~3）+ 文本提示词（可选）</ins>生成 1 个目标视频。注意不可单独输入音频，应至少包含 1 个参考视频或图片。支持生成全新视频、编辑视频、延长视频。';
  const multimodalRefEnV2 = 'Input <ins>reference images (0~9) + reference videos (0~3) + reference audio (0~3) + text prompt (optional)</ins> to generate 1 target video. Note that audio cannot be input alone; at least 1 reference video or image must be included. Supports generating new videos, editing videos, and extending videos.';
  
  // Replacement 3: Seedance 2.0 系列 Multimodal Reference-to-Video：1\\~9 张
  const seriesCount = 'Seedance 2.0 系列 Multimodal Reference-to-Video：1\\~9 张';
  const seriesCountEn = 'Seedance 2.0 series Multimodal Reference-to-Video: 1~9 images';
  
  // Replacement 4: 注意： at start of role description
  const noteZh = '注意：\\n';
  const noteEn = 'Note:\\n';
  
  // Replacement 5: 支持模型：Seedance 2.0 系列（1\\~9 张图片）
  const supportedModelsZh = '支持模型：Seedance 2.0 系列（1\\~9 张图片）';
  const supportedModelsEn = 'Supported models: Seedance 2.0 series (1~9 images)';
  
  let replaceCount = 0;
  
  if (hasChinese(content)) {
    // Apply replacements
    let newContent = content;
    
    // Replace exact Chinese substrings in raw content
    const before1 = newContent.length;
    newContent = newContent.split(multimodalRefV1).join(multimodalRefEnV1);
    newContent = newContent.split(multimodalRefV2).join(multimodalRefEnV2);
    newContent = newContent.split(seriesCount).join(seriesCountEn);
    newContent = newContent.split(noteZh).join(noteEn);
    newContent = newContent.split(supportedModelsZh).join(supportedModelsEn);
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log('  ✅ Fixed successfully');
    }
  }
  
  // Verify
  const finalContent = fs.readFileSync(filePath, 'utf-8');
  if (!hasChinese(finalContent)) {
    console.log('  ✅ Verified: No Chinese remaining');
  } else {
    console.log('  ⚠️  STILL HAS CHINESE!');
    // Find what remains
    const lines = finalContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/[\u4e00-\u9fff]/.test(lines[i])) {
        console.log('  Line ' + (i+1) + ': ' + lines[i].trim());
      }
    }
  }
}