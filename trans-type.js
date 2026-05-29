// 文档归类，按推断函数归类，完善函数 与 文档operationId编写规范

const ALL_TYPES = [
  'chat', // 文字聊天
  'text_to_speech', // 文本转语音

  'text_to_image', // 文生图
  'text_to_video', // 文生视频

  'image_to_image', // 图生图
  'image_to_video', // 图生视频
  'start&end_frame_to_video', // 首尾帧生视频

  'reference_to_video', // 参考生视频
  'video_continuation', // 视频续写
];

// 收集归类已知的operationId字符串
function getFormatGenType(operationId) {
  const val = operationId.toLowerCase();
  if (val.includes('videocontinuation')) return 'video_continuation';
  if (val.includes('referencetovideo') || val.includes('r2v')) return 'reference_to_video';
  if (val.includes('imagetoimage') || val.includes('imageedit') || val.includes('i2i')) return 'image_to_image';
  if (val.includes('imagetovideo') || val.includes('i2v')) return 'image_to_video';
  if (val.includes('startendtovideo') || val.includes('firstlast')) return 'start&end_frame_to_video';
  if (val.includes('texttoimage') || val.includes('t2i')) return 'text_to_image';
  if (val.includes('texttovideo') || val.includes('t2v')) return 'text_to_video';
  if (val.includes('chat')) return 'chat';
  if (val.includes('speech')) return 'text_to_speech';
}
