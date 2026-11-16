// AI 资源导航 · 数据文件
// 新增条目时按下面格式往 DATA 里加一行即可（字段说明见 README.md）。
// 注意：不要在这里放任何 API Key、Token、密码、邮箱等隐私信息。

const DATA = [
  // ============ A. 免费 AI 资源（2026 年 11 月人工核实） ============
  {
    n: "100milionseek DeepSeek API",
    u: "https://100milionseek.top",
    d: "免费 DeepSeek 中继 API，模型 deepseek-v4.1-flash-free，198K 上下文；每天 300M token（2026-11-17 14:28 UTC 后降为 100M/天），仅限文字任务，速度较慢。",
    c: "免费资源", t: ["API", "DeepSeek", "文本"],
    p: "免费", v: true,
    note: "2026-11-16 实测可用；重要信息不要走该接口。"
  },
  {
    n: "EXAONE",
    u: "https://api.exaone.ai",
    d: "LG 的 K-EXAONE 2.5 模型，512K 上下文，免费 API Key，2026-12-09 到期。",
    c: "免费资源", t: ["API", "大模型"],
    p: "免费", v: true,
    note: "每账号仅一把 Key；从部分机房 IP 请求会挂起。"
  },
  {
    n: "AMD Token Lab",
    u: "https://api.tokenlab.amd.com/v1",
    d: "AMD 免费推理 API，12 个免费模型（含 DeepSeek-V4、Qwen3.8-27B、Gemma-4-31B-IT），10 点免费额度，2026-12-09 到期。",
    c: "免费资源", t: ["API", "大模型"],
    p: "免费", v: true,
    note: "限速 20 请求/分钟；OpenAI 兼容接口。"
  },
  {
    n: "NVIDIA NIM",
    u: "https://build.nvidia.com",
    d: "NVIDIA 免费推理 API，免费 Key 可用至 2027-11-11，覆盖多种开源模型，OpenAI 兼容接口。",
    c: "免费资源", t: ["API", "GPU", "大模型"],
    p: "免费", v: true,
    note: "API 地址：integrate.api.nvidia.com/v1。"
  },
  {
    n: "SambaNova Cloud",
    u: "https://www.sambanova.ai",
    d: "免费层推理 API，提供 Llama 3.3 70B、DeepSeek V3.1/V3.2、gpt-oss-120b 等模型。",
    c: "免费资源", t: ["API", "大模型"],
    p: "免费", v: true,
    note: "API 地址：api.sambanova.ai/v1。"
  },
  {
    n: "DeepSeek 官方平台",
    u: "https://platform.deepseek.com",
    d: "官方平台账号可免费注册，但账单余额 $0.00、未赠送任何免费额度，需充值后使用。",
    c: "免费资源", t: ["API", "DeepSeek"],
    p: "付费", v: true,
    note: "2026-11-16 核实：Granted 栏为空，网传赠金未兑现。"
  },
  {
    n: "Google Colab",
    u: "https://colab.research.google.com",
    d: "免费云端 Jupyter，Tesla T4 GPU（15GB 显存），适合跑小模型与生图实验。",
    c: "免费资源", t: ["GPU", "生图", "编程"],
    p: "免费", v: true,
    note: "免费档只有 CPU、T4、v5e-1 TPU。"
  },
  {
    n: "Kaggle",
    u: "https://www.kaggle.com",
    d: "免费 T4×2 GPU，每周 30 GPU 小时，适合跑 Ollama 与生图实验。",
    c: "免费资源", t: ["GPU", "大模型", "生图"],
    p: "免费", v: true,
    note: "单次会话最多 12 小时；/kaggle/working 需手动保存版本才会持久化。"
  },
  {
    n: "Google Antigravity",
    u: "https://antigravity.google",
    d: "谷歌的 AI 编程工具（CLI），每周免费 Gemini 3.8 Flash 额度；Claude 模型需 Pro 订阅。",
    c: "免费资源", t: ["编程", "CLI"],
    p: "免费", v: true,
    note: "CLI（agy）已实测可用；桌面版手动授权码登录曾失败。"
  },
  {
    n: "DeepAI",
    u: "https://deepai.org",
    d: "Claude Fable 5.2 仅在桌面 App「DeepAI Code」里免费，每天 250 Theos，约 12 次请求；网页版无此模型。",
    c: "免费资源", t: ["编程", "对话"],
    p: "免费", v: true,
    note: "另有 11 个模型不限量（0 Theos）。"
  },
  {
    n: "Mistral AI",
    u: "https://mistral.ai",
    d: "Experiment 计划免费，每模型每月 10 亿 token，适合做评估与实验。",
    c: "免费资源", t: ["API", "大模型"],
    p: "免费", v: false,
    note: "据公开资料，未经本站实测。"
  },
  {
    n: "Cohere",
    u: "https://cohere.com",
    d: "试用 Key 每月 1000 次调用，适合轻量体验 Command 系列模型。",
    c: "免费资源", t: ["API", "大模型"],
    p: "免费", v: false,
    note: "据公开资料，未经本站实测。"
  },
  {
    n: "Tavily",
    u: "https://tavily.com",
    d: "专为 AI Agent 设计的搜索 API，免费 Researcher 计划每月 1000 积分，无需绑卡。",
    c: "免费资源", t: ["API", "搜索"],
    p: "免费", v: true,
    note: "账号已建；额度据公开资料。"
  },

  // ============ B. 热门 AI 工具 · 写作 / 对话 ============
  { n: "ChatGPT", u: "https://chatgpt.com", d: "OpenAI 的对话 AI，写文案、编程、分析样样行。", c: "写作对话", t: ["对话", "写作", "编程"], p: "免费试用", v: false },
  { n: "Claude", u: "https://claude.ai", d: "Anthropic 的对话 AI，擅长长文写作与代码。", c: "写作对话", t: ["对话", "写作", "编程"], p: "免费试用", v: false },
  { n: "Gemini", u: "https://gemini.google.com", d: "谷歌的多模态 AI，与搜索和生产力工具深度整合。", c: "写作对话", t: ["对话", "多模态"], p: "免费试用", v: false },
  { n: "Grok", u: "https://grok.com", d: "xAI 的对话 AI，实时联网，风格直接。", c: "写作对话", t: ["对话", "实时搜索"], p: "免费试用", v: false },
  { n: "DeepSeek", u: "https://chat.deepseek.com", d: "深度求索的推理模型，性价比极高，中文表现出色。", c: "写作对话", t: ["对话", "推理"], p: "免费", v: false },
  { n: "Kimi", u: "https://www.kimi.com", d: "月之暗面的长文本对话 AI，支持超长上下文。", c: "写作对话", t: ["对话", "长文本"], p: "免费", v: false },
  { n: "通义千问", u: "https://qianwen.com", d: "阿里的通义大模型，中文能力强，生态丰富。", c: "写作对话", t: ["对话", "中文"], p: "免费", v: false },
  { n: "智谱清言", u: "https://chatglm.cn", d: "智谱的对话 AI，GLM 系列模型。", c: "写作对话", t: ["对话", "中文"], p: "免费", v: false },
  { n: "豆包", u: "https://www.doubao.com", d: "字节的 AI 助手，写作、聊天、图片样样有。", c: "写作对话", t: ["对话", "中文"], p: "免费", v: false },
  { n: "腾讯元宝", u: "https://yuanbao.tencent.com", d: "腾讯的 AI 助手，基于混元大模型。", c: "写作对话", t: ["对话", "中文"], p: "免费", v: false },
  { n: "文心一言", u: "https://yiyan.baidu.com", d: "百度的对话 AI，中文与搜索结合。", c: "写作对话", t: ["对话", "中文"], p: "免费", v: false },
  { n: "讯飞星火", u: "https://xinghuo.xfyun.cn", d: "科大讯飞的认知大模型，语音能力突出。", c: "写作对话", t: ["对话", "语音"], p: "免费", v: false },
  { n: "Meta AI", u: "https://www.meta.ai", d: "Meta 的免费 AI 助手，基于 Llama 模型。", c: "写作对话", t: ["对话"], p: "免费", v: false },
  { n: "Poe", u: "https://poe.com", d: "Quora 的多模型聚合聊天平台，一处用多家模型。", c: "写作对话", t: ["对话", "聚合"], p: "免费试用", v: false },
  { n: "Character.AI", u: "https://character.ai", d: "和 AI 角色聊天的平台，角色扮演与陪伴。", c: "写作对话", t: ["对话", "角色扮演"], p: "免费", v: false },
  { n: "Microsoft Copilot", u: "https://copilot.microsoft.com", d: "微软的 AI 助手，集成 Office 与 Windows。", c: "写作对话", t: ["对话", "办公"], p: "免费", v: false },

  // ============ B. 热门 AI 工具 · 生图 ============
  { n: "Midjourney", u: "https://www.midjourney.com", d: "最出圈的 AI 绘画工具，艺术感拉满。", c: "生图", t: ["绘画", "艺术"], p: "付费", v: false },
  { n: "Stable Diffusion", u: "https://stability.ai", d: "开源生图模型鼻祖，可本地部署、自由微调。", c: "生图", t: ["绘画", "本地部署"], p: "开源", v: false },
  { n: "Flux", u: "https://blackforestlabs.ai", d: "Black Forest Labs 的生图模型，画质顶级，权重开源。", c: "生图", t: ["绘画"], p: "开源", v: false },
  { n: "DALL-E", u: "https://openai.com/index/dall-e-3/", d: "OpenAI 的图像生成模型，现已集成进 ChatGPT。", c: "生图", t: ["绘画"], p: "付费", v: false },
  { n: "Leonardo Ai", u: "https://leonardo.ai", d: "游戏与插画风格的 AI 绘画平台。", c: "生图", t: ["绘画", "插画"], p: "免费试用", v: false },
  { n: "Ideogram", u: "https://ideogram.ai", d: "最擅长在图里写对文字的生图工具。", c: "生图", t: ["绘画", "文字"], p: "免费试用", v: false },
  { n: "Adobe Firefly", u: "https://firefly.adobe.com", d: "Adobe 的商用安全生图工具，版权风险低。", c: "生图", t: ["绘画", "商用"], p: "免费试用", v: false },
  { n: "Playground", u: "https://playground.com", d: "免费额度慷慨的在线生图与设计工具。", c: "生图", t: ["绘画", "设计"], p: "免费试用", v: false },
  { n: "Recraft", u: "https://www.recraft.ai", d: "矢量风与品牌风生图，支持图层与精细控制。", c: "生图", t: ["绘画", "矢量"], p: "免费试用", v: false },
  { n: "Canva", u: "https://www.canva.com", d: "在线设计平台，内置 AI 生图与魔术功能。", c: "生图", t: ["设计", "绘画"], p: "免费试用", v: false },

  // ============ B. 热门 AI 工具 · 生视频 ============
  { n: "Runway", u: "https://runwayml.com", d: "AI 视频创作平台，Gen-4 模型。", c: "生视频", t: ["视频", "创作"], p: "免费试用", v: false },
  { n: "Kling 可灵", u: "https://klingai.com", d: "快手可灵，视频生成质量国产第一梯队。", c: "生视频", t: ["视频", "中文"], p: "免费试用", v: false },
  { n: "Sora", u: "https://sora.com", d: "OpenAI 的文生视频模型，电影感拉满。", c: "生视频", t: ["视频"], p: "付费", v: false },
  { n: "Pika", u: "https://pika.art", d: "轻量好用的 AI 视频生成工具。", c: "生视频", t: ["视频"], p: "免费试用", v: false },
  { n: "Luma Dream Machine", u: "https://lumalabs.ai", d: "Luma 的文生视频，镜头运动自然。", c: "生视频", t: ["视频"], p: "免费试用", v: false },
  { n: "Hailuo 海螺", u: "https://hailuoai.com", d: "MiniMax 海螺 AI 视频，中文支持好。", c: "生视频", t: ["视频", "中文"], p: "免费试用", v: false },
  { n: "Veo", u: "https://deepmind.google/technologies/veo/", d: "谷歌 DeepMind 的视频生成模型，画质顶尖。", c: "生视频", t: ["视频"], p: "付费", v: false },
  { n: "HeyGen", u: "https://www.heygen.com", d: "AI 数字人视频，口播与翻译神器。", c: "生视频", t: ["数字人", "口播"], p: "免费试用", v: false },
  { n: "Synthesia", u: "https://www.synthesia.io", d: "AI 数字人讲解视频，企业培训常用。", c: "生视频", t: ["数字人", "培训"], p: "免费试用", v: false },
  { n: "CapCut", u: "https://www.capcut.com", d: "剪映国际版，AI 剪辑、字幕与模板一键出。", c: "生视频", t: ["剪辑", "字幕"], p: "免费", v: false },

  // ============ B. 热门 AI 工具 · 编程 ============
  { n: "Cursor", u: "https://cursor.com", d: "AI 原生代码编辑器，程序员标配。", c: "编程", t: ["编辑器", "代码"], p: "免费试用", v: false },
  { n: "GitHub Copilot", u: "https://github.com/features/copilot", d: "GitHub 官方 AI 编程助手。", c: "编程", t: ["代码补全"], p: "付费", v: false },
  { n: "Codex", u: "https://github.com/openai/codex", d: "OpenAI 的开源终端编程助手。", c: "编程", t: ["终端", "Agent"], p: "开源", v: false },
  { n: "Windsurf", u: "https://windsurf.com", d: "Codeium 出品的 AI 编程 IDE。", c: "编程", t: ["编辑器", "代码"], p: "免费试用", v: false },
  { n: "v0", u: "https://v0.app", d: "Vercel 的一句话生成网站与界面工具。", c: "编程", t: ["建站", "前端"], p: "免费试用", v: false },
  { n: "Bolt.new", u: "https://bolt.new", d: "浏览器里一句话生成全栈应用。", c: "编程", t: ["建站", "全栈"], p: "免费试用", v: false },
  { n: "Tabnine", u: "https://www.tabnine.com", d: "代码补全 AI 助手，支持私有部署。", c: "编程", t: ["代码补全"], p: "免费试用", v: false },
  { n: "Replit", u: "https://replit.com", d: "在线编程平台，AI Agent 直接帮你写应用。", c: "编程", t: ["在线 IDE", "Agent"], p: "免费试用", v: false },
  { n: "Trae", u: "https://www.trae.ai", d: "字节的 AI 编程工具，中文友好。", c: "编程", t: ["编辑器", "中文"], p: "免费", v: false },
  { n: "MarsCode", u: "https://www.marscode.cn", d: "字节的免费 AI 编程助手。", c: "编程", t: ["代码", "中文"], p: "免费", v: false },

  // ============ B. 热门 AI 工具 · 音频 / 音乐 ============
  { n: "Suno", u: "https://suno.com", d: "一句话生成完整歌曲，AI 音乐天花板。", c: "音频音乐", t: ["音乐", "歌曲"], p: "免费试用", v: false },
  { n: "Udio", u: "https://www.udio.com", d: "AI 音乐生成，风格多样。", c: "音频音乐", t: ["音乐"], p: "免费试用", v: false },
  { n: "ElevenLabs", u: "https://elevenlabs.io", d: "最自然的 AI 配音与语音克隆。", c: "音频音乐", t: ["配音", "语音克隆"], p: "免费试用", v: false },
  { n: "Stable Audio", u: "https://www.stableaudio.com", d: "Stability AI 的音乐生成工具。", c: "音频音乐", t: ["音乐"], p: "免费试用", v: false },
  { n: "Mubert", u: "https://mubert.com", d: "AI 生成背景音乐，商用授权友好。", c: "音频音乐", t: ["音乐", "商用"], p: "免费试用", v: false },
  { n: "AIVA", u: "https://www.aiva.ai", d: "AI 作曲助手，古典与影视配乐。", c: "音频音乐", t: ["作曲"], p: "免费试用", v: false },

  // ============ B. 热门 AI 工具 · 搜索 / 办公 ============
  { n: "Perplexity", u: "https://www.perplexity.ai", d: "AI 搜索引擎，带引用来源的答案。", c: "搜索办公", t: ["搜索", "问答"], p: "免费试用", v: false },
  { n: "You.com", u: "https://you.com", d: "AI 搜索与助手，支持多模型切换。", c: "搜索办公", t: ["搜索"], p: "免费", v: false },
  { n: "Genspark", u: "https://www.genspark.ai", d: "AI 搜索与 Sparkpage 一键生成页面。", c: "搜索办公", t: ["搜索", "页面生成"], p: "免费试用", v: false },
  { n: "Felo", u: "https://felo.ai", d: "AI 搜索与文档工具，适合研究整理。", c: "搜索办公", t: ["搜索", "文档"], p: "免费试用", v: false },
  { n: "秘塔AI搜索", u: "https://metaso.cn", d: "无广告的 AI 搜索，中文学术搜索好用。", c: "搜索办公", t: ["搜索", "中文", "学术"], p: "免费", v: false },
  { n: "Notion AI", u: "https://www.notion.com/product/ai", d: "笔记软件里的 AI 写作与整理助手。", c: "搜索办公", t: ["笔记", "写作"], p: "付费", v: false },
  { n: "Monica", u: "https://monica.im", d: "浏览器侧边栏 AI 助手，划词翻译总结。", c: "搜索办公", t: ["浏览器插件", "翻译"], p: "免费试用", v: false },
  { n: "WPS AI", u: "https://ai.wps.cn", d: "WPS 的 AI 写作、表格与演示助手。", c: "搜索办公", t: ["办公", "文档"], p: "免费试用", v: false },

  // ============ B. 热门 AI 工具 · 设计 ============
  { n: "Gamma", u: "https://gamma.app", d: "AI 一键生成演示文稿与网页。", c: "设计", t: ["演示", "PPT"], p: "免费试用", v: false },
  { n: "Figma", u: "https://www.figma.com", d: "设计工具标配，内置 AI 生成功能。", c: "设计", t: ["UI", "协作"], p: "免费试用", v: false },
  { n: "Uizard", u: "https://uizard.io", d: "截图或文字一句话生成 APP 界面设计。", c: "设计", t: ["UI", "原型"], p: "免费试用", v: false },
  { n: "Looka", u: "https://looka.com", d: "AI 生成 Logo 与品牌视觉。", c: "设计", t: ["Logo", "品牌"], p: "免费试用", v: false },
  { n: "Khroma", u: "https://www.khroma.co", d: "AI 配色工具，输入喜好生成配色方案。", c: "设计", t: ["配色"], p: "免费", v: false },
  { n: "Framer", u: "https://www.framer.com", d: "AI 建站工具，设计与发布一体。", c: "设计", t: ["建站", "UI"], p: "免费试用", v: false },

  // ============ B. 热门 AI 工具 · 效率 ============
  { n: "Raycast", u: "https://www.raycast.com", d: "Mac 效率启动器，内置 AI 命令。", c: "效率", t: ["Mac", "启动器"], p: "免费", v: false },
  { n: "Otter.ai", u: "https://otter.ai", d: "AI 会议记录与转写。", c: "效率", t: ["会议", "转写"], p: "免费试用", v: false },
  { n: "Fireflies", u: "https://fireflies.ai", d: "AI 会议助手，自动记录与总结。", c: "效率", t: ["会议", "总结"], p: "免费试用", v: false },
  { n: "Granola", u: "https://www.granola.ai", d: "AI 会议笔记，边开会边整理。", c: "效率", t: ["会议", "笔记"], p: "免费试用", v: false },
  { n: "Lindy", u: "https://www.lindy.ai", d: "AI 助手代理，自动处理邮件与杂事。", c: "效率", t: ["Agent", "自动化"], p: "免费试用", v: false },
  { n: "Consensus", u: "https://consensus.app", d: "AI 学术搜索，从论文里找答案。", c: "效率", t: ["搜索", "学术"], p: "免费试用", v: false },
];

// 分类顺序（与筛选按钮一致）
const CATEGORIES = ["全部", "免费资源", "生图", "生视频", "写作对话", "编程", "音频音乐", "搜索办公", "设计", "效率"];
