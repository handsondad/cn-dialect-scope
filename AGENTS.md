# AGENTS.md：给接手这个仓库的代码助手

## 这是什么

两样东西共用一份方言知识库（`data/`）：

1. **「🗣️ 方言奇遇记」网站**（主要部分）：给 6–12 岁孩子的汉语方言科普，奇遇记系列（bodyverse、chemverse、hanverse）的一员。小念（男孩）听到一句方言，问爸爸；爸爸回答，小念接着爸爸的话追问，5–8 轮一路讲到道理，最后小念用自己的话总结。每个问题配一部讲解动画（示意地图、声调格、方言词、对话气泡），小念和爸爸的配音读出整段问答，动画跟着声音走。另有方言地图页和「猜猜是哪里话」游戏。
2. **Python 方言识别工具**（`app.py` 等，Flask）：输入方言文本，推测地区。网站不依赖它。

网站技术栈：React 18 + TypeScript（strict）+ Vite 5，首页 3D 场景用 three + @react-three/fiber。Hash 路由，没有后端，问答和动画是 `src/data/` 里的 TypeScript 数据，方言知识库在构建时从 `data/` 读进来。

**写问答、写动画、调页面样式之前，先读 `skills/dialectverse-explainer/SKILL.md`**。

## 命令

需要 Node.js 22.18+，测试和脚本直接用 Node 的 TypeScript 类型擦除跑 `.ts` 文件。

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | 全部测试（`node --test tests/*.test.mjs`） |
| `npm run build` | 生产构建 |
| `node tests/dialogue-rules.mjs src/data/questions/<主题>.ts` | 检查问答写法 |
| `node tests/film-rules.mjs [src/data/films/<主题>.ts]` | 检查动画 |
| `npm run voice [-- <问题id>...]` | 给新的或改过的问答句子配音，并补齐「听一听」的方言句子 |
| `python -m pytest tests/` | Python 工具和知识库校验 |

交付前四个都要过：`npm run typecheck`、`npm test`、`node tests/film-rules.mjs`、`npm run build`。改了 `data/` 还要跑 `python -m pytest tests/`。

## 地图

| 路由 | 页面 | 文件 |
|---|---|---|
| `#/` | 首页：3D 小星球、5 个主题、方言地图和游戏入口 | `src/pages/HomePage.tsx` |
| `#/topic/<主题>` | 一个主题的问题列表 | `src/pages/QuestionListPage.tsx` |
| `#/q/<问题id>` | 一问一答 + 讲解动画 + 听一听 + 方言词 + 给大人 | `src/pages/QuestionPage.tsx` |
| `#/map[/<概念>]` | 方言地图：一个词在 20 个方言点怎么说，方言点档案 | `src/pages/MapPage.tsx` |
| `#/game` | 猜猜是哪里话 | `src/pages/GamePage.tsx` |
| `#/sheet[/<问题id>]` | **只在开发服务器里有**：把每部动画每场戏的最后一刻排成总览，检查挤不挤 | `src/pages/SheetPage.tsx` |

内容和引擎：

- `src/data/questions/<主题>.ts`：问题和问答，类型在 `types.ts`。5 个主题：`why`（为什么说话不一样）`family`（方言大家族）`sound`（声调的秘密）`words`（一个意思各地说）`fun`（好玩的方言）。
- `src/data/films/<主题>.ts`：每个问题一部动画，格式见 `types.ts`。
- `src/lib/film.ts`：时间线、镜头、声调格坐标，全是纯函数；`src/components/film/FilmStage.tsx` 把某一时刻画成 SVG；`FilmPlayer.tsx` 管播放、拖动、分段和配音同步。
- `src/lib/narration.ts`：配音版时间线，按每轮配音的长度把对应的戏等比例拉长。
- `src/lib/geo.ts`：示意地图（经纬度 → 1200×900 画面，海岸线、台湾岛、海南岛、长江、黄河），`places` 是动画里常用的城市。**只画海岸线和河，不画国界、省界**。
- `src/lib/atlas.ts`：知识库的类型、方言大区的颜色、出题；`src/data/atlas.ts` 用 `import.meta.glob` 读 `data/`；`tools/atlas.mjs` 是 Node 里的同一个读法。
- `src/lib/samples.ts`：「听一听」的合成音色（粤语、东北话、普通话）和音频文件名；`collectSamples` 列出网站上所有要读出声的句子。
- `src/data/voice.ts` + `src/data/voice-manifest.json`：配音时长和指纹。问答配音在 `public/voice/<问题id>/<轮次>-<nian|dad>.mp3`，听一听在 `public/voice/say/<音色>-<指纹>.mp3`。
- `src/components/DialectMap.tsx`：方言地图和游戏里的 SVG 地图，方言点标签的偏移在 `pillOffset`。
- `src/components/RunLab3D.tsx`、`run-lab/`：首页 3D 的小念和爸爸，和其他奇遇记共用，轻易不要改。

## 加一个新问题

1. **问答**：写进 `src/data/questions/<主题>.ts`，跑 `node tests/dialogue-rules.mjs <文件>` 直到通过。
2. **动画**：写进 `src/data/films/<主题>.ts`，跑 `node tests/film-rules.mjs <文件>` 直到通过。
3. **看总览**：`npm run dev`，打开 `#/sheet/<问题id>`，每场戏最后一刻有没有字压字、气泡压图钉。总览卡片很小，字幕会像手机上一样放大，所以这里不挤，手机上也不挤。
4. **配音**：`npm run voice -- <问题id>`。要联网，要 `python -m pip install edge-tts`，PATH 里要有 ffmpeg / ffprobe。
5. **测试**：`npm test`。每个问题都要有动画，每句话都要有配音而且读的是现在的文字，每句「听一听」都要有音频。
6. **浏览器里看一遍**：打开 `#/q/<问题id>`，开声音听一遍，再看一眼手机宽度（390px）。

## 硬性规矩

- **孩子的内容**：
  - 不编数字、不编例句。方言说法优先用 `data/` 里已有的；新的说法要有出处，写进 `parentTip` 或 `skills/dialectverse-explainer/facts.md`。
  - 学界有争议的（方言还是语言、侬的来历、分区界线）就说有争议。
  - 每种方言都一样好，不拿方言取笑人；说「好玩」是好玩在词，不是好玩在人。
  - 不用术语表里的词，见 `tests/dialogue-rules.mjs` 的 `jargon`。
- **地图**：示意地图只画海岸线、海岛和两条大河，不画任何边界，不标国家名。
- **小念是男孩**，用"他"；配音是 `zh-CN-YunxiaNeural`，爸爸是 `zh-CN-YunxiNeural`。
- **素材许可**（详见 `THIRD_PARTY_NOTICES.md`）：配音由微软 Edge 在线语音生成，只按非商业使用考虑；新素材要写明来源。
- **代码风格**：照周围代码写。中文注释只写代码本身表达不了的约束；改动要小而完整。

## 已知的坑

- **`.ts` 扩展名**：Node 直接跑 `.ts`，所以 `src/data/` 和 `src/lib/` 里被测试导入的文件，相互导入时要写 `.ts` 扩展名。`tsconfig` 开了 `allowImportingTsExtensions`。
- **方言字缺字形**：冇、咗、𠊎、呒 这些字楷书字体里没有，浏览器会退回系统字体，看起来粗细不一样，这是正常的。
- **合成方言音色只有三种**：粤语（`zh-HK-HiuMaanNeural`）、东北话（`zh-CN-liaoning-XiaobeiNeural`）、普通话。其他方言的句子只显示文字和拼音，不要用普通话音色去读方言句子。粤语音色读的是简体字也没问题。
- **配音会串**：同一时间只让一部动画出声。用浏览器测有声动画，测完把它暂停，或者离开问答页。
- **PowerShell 写文件**：Windows PowerShell 5 的 `Set-Content -Encoding utf8` 会加 BOM，JSON 和源码会坏。用编辑工具，或者 `[IO.File]::WriteAllText(path, text, (New-Object Text.UTF8Encoding $false))`。
