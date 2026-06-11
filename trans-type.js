// 文档归类，按推断函数归类，完善函数 与 文档operationId编写规范

// PlaygroundType
const ALL_TYPES = [
  'chat', // 文字聊天
  'text_to_speech', // 文本转语音
  'text_to_audio', // 文生音频
  'timing_to_audio', // 可控文生音效

  'text_to_image', // 文生图
  'text_to_video', // 文生视频

  'image_to_image', // 图生图
  'image_to_video', // 图生视频
  'start&end_frame_to_video', // 首尾帧生视频

  'reference_to_image', // 参考生图
  'reference_to_video', // 参考生视频

  'video_continuation', // 视频续写
  'motion_control', // 动作控制

  'image_generation', // 图像生成
  'video_generation', // 视频生成
];

// 收集归类已知的operationId 字符串 Record<PlaygroundType, string[]>
const keywordsForTypes = {
  chat                 : ['chat'],
  text_to_speech       : ['speech', 'tts'],

  video_continuation   : ['videocontinuation'],
  motion_control       : ['motioncontrol', 'motion'],

  'start&end_frame_to_video': ['startendtovideo', 'startend2video', 'firstlast'],
  reference_to_video : ['referencetovideo', 'reference2video', 'r2v'],
  reference_to_image : ['referencetoimage', 'reference2image', 'r2i'],

  image_to_image       : ['imagetoimage', 'image2image', 'imageedit', 'i2i'],
  image_to_video       : ['imagetovideo', 'image2video', 'i2v'],

  text_to_image        : ['texttoimage', 'text2image', 't2i'],
  text_to_video        : ['texttovideo', 'text2video', 't2v'],

  image_generation     : ['imagegeneration'],
  video_generation     : ['videogeneration'],

  timing_to_audio      : ['timingtoaudio', 'timing2audio'],
  text_to_audio        : ['texttoaudio', 'text2audio', 'tta', 't2a'],
}

// Playground 忽略的key
const PLAYGROUDND_HIDDEN_KEYS = [
  'safety_identifier',
  'tools',
  'tool_choice',
  'response_format.', // 仅复杂结构的response_format
  'stream_format',
  'stream_options',

  'auto_subjects',
  'is_rec',
  'off_peak',
  'server_id',
  'meta_data',
  'callback_url',
  'external_task_id',
  'payload',
];
