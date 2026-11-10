---
name: dialectverse-explainer
description: >-
  Writes new 方言奇遇记 content in the house style: a 小念 × 爸爸 question-and-answer dialogue
  about Chinese dialects for kids, a matching narrated explainer animation on a schematic map,
  a five-level tone chart or paper, 「听一听」 dialect audio samples, and page UI that fits the
  warm, kid-friendly design. Use when adding or revising a dialect question, writing or fixing
  an explainer film (src/data/films), generating narration, editing the dialect knowledge base
  for the site, or styling pages in the cn-dialect-scope repo, or when the user mentions 小念,
  爸爸, 讲解动画, 配音, 方言地图, 声调, 听一听 or 新问题.
---

# 方言奇遇记：写问答、做讲解动画

目标只有一个：孩子从头听到尾，就真的弄懂了标题里的那个问题。问答负责把道理讲对、讲顺；动画负责让孩子"看见"方言在哪里、声音怎么走、一个词怎么在各地变身；配音和「听一听」让孩子不认字也能跟着听，还能听到方言本来的声音。

## 先弄清楚

- 仓库结构、命令、硬性规矩见根目录 `AGENTS.md`。
- 问答怎么写：[dialogue.md](dialogue.md)
- 动画怎么做（数据格式、元素、配方、排版）：[film.md](film.md)
- 页面风格：[design.md](design.md)
- 讲方言时可以直接用的事实和出处：[facts.md](facts.md)。**不在这里、也不在 `data/` 里的说法，先查到可靠出处再写**。

## 做一个新问题

```
- [ ] 1. 选题：小念真会遇到的一件事（外婆的一句话、招牌上的字、同学的口音、古诗），答案能落到几个具体的词或字上
- [ ] 2. 查知识库：data/concepts、data/dialects 里有没有现成的说法和例句；有就用，问题的 concepts 填上概念 slug
- [ ] 3. 问答：写进 src/data/questions/<主题>.ts → node tests/dialogue-rules.mjs <文件> 通过
- [ ] 4. 核对事实：每个说法都站得住；学界有争议的写"专家们还在研究""有人认为"；不编数字、不编例句
- [ ] 5. 分镜：每轮问答一场戏，先列出每场的底图（纸 / 地图 / 声调格）、出现顺序和那一句台词
- [ ] 6. 动画：写进 src/data/films/<主题>.ts → node tests/film-rules.mjs <文件> 通过
- [ ] 7. 看总览：npm run dev，打开 #/sheet/<问题id>，没有字压字、气泡压图钉
- [ ] 8. 配音：npm run voice -- <问题id>
- [ ] 9. npm run typecheck && npm test && npm run build
- [ ] 10. 浏览器里看：#/q/<问题id>，开声音从头听一遍，点一点「听一听」，再看手机宽度
```

## 讲法（问答）

- **小念是男孩**，7 岁左右，好奇、爱追问，说话像孩子："外婆说的话我怎么一句也听不懂？"
- **爸爸**温和、具体、不说教。先拿孩子熟悉的东西打比方（传话游戏、大树分枝、搬家带行李、身份证），再说出真名一次（"……老名字叫「入声」"）。
- **从一句真话出发**：每个道理都落到具体的方言词、句子上，说出它，再说它是什么意思、哪里说。说"粤语声调多"，就让孩子听"诗、史、试、时、市、事"。
- **一条追问链**：每个追问都接着爸爸上一句里的一个词往深里问。顺序一般是：这句话什么意思 → 为什么这样说 → 别的地方怎么说 → 古时候是什么样 → 我能怎么用。
- **最后一轮**：小念说"我懂了！"，用自己的话串一遍；爸爸夸一句，再给一个能马上做的小事（问外婆一句话、去方言地图上点一个词）。
- **尊重每一种方言**：不说哪种方言"土""不标准"，好玩是好玩在词和声音，不是笑话说这种话的人。普通话和方言是"两把钥匙"。
- **诚实**：方言词的来历很多是推测，就说"一般认为""专家们还在研究"。

细则、长度限制和完整例子见 [dialogue.md](dialogue.md)。

## 画法（动画）

1. **一轮问答一场戏**，场次顺序和问答一致，最多空一轮（一般是总结轮）。
2. **底图跟着问题走**：讲"在哪里说"用 `map`（示意地图，配 `pin` 和 `bubble`）；讲声调用 `tones`（五度声调格，配 `tone`）；讲字和词用默认的纸面（配 `word`）。
3. **方言要"说出来"**：各地的说法用 `bubble` 贴在地图上的城市旁边，一个接一个冒出来，比列一张表直观得多。
4. **逐步长出来**：说到哪个地方，哪个图钉才落下；任何时刻不超过 6 个元素，检查器的上限是 8 个。
5. **误会要翻过来**：爸爸辟谣的那一轮放 `myth` 卡，先划掉错的，再亮出对的。
6. **字要少**：标签 ≤12 字，大字 ≤14 字，气泡 ≤10 字，场次标题 ≤12 字。完整的话交给配音和旁边的对话。

数据格式、每种元素的用法、常用配方和配色见 [film.md](film.md)。

## 配音和「听一听」

- `npm run voice -- <问题id>` 用 edge-tts 生成每一句：小念是 `zh-CN-YunxiaNeural`，爸爸是 `zh-CN-YunxiNeural`（-5%）。只有新的或改过的句子会重新生成。
- 播放器打开声音时，按配音长度把每场戏等比例拉长（`src/lib/narration.ts`），所以写动画时只管按原始节奏排；元素出现的先后要和爸爸台词的先后一致。
- 「听一听」（问答里 `show: { kind: "say" }`）只有三种合成音色：`yue` 粤语、`dongbei` 东北话、`putonghua` 普通话。别的方言句子不写 `voice`，只显示文字和 `sub`（拼音、意思）。**不要用普通话音色读方言句子**。
- 知识库里广州话、香港粤语、东北话的高频词、例句、概念说法会自动生成「听一听」，地图页和游戏里会出现 🔊。
- 问答改了字，配音就过期了，`npm test` 会报出来，重新跑 `npm run voice`。
- **单字要听一遍**：单独读的字（诗、一、行）合成音色可能读成别的音，生成后点开听；读错就换成词（"行路"）。

## 验收

- 检查器全过：`node tests/dialogue-rules.mjs`、`node tests/film-rules.mjs`、`npm test`。
- `#/sheet/<问题id>` 总览里没有字压字（总览卡片小，字幕会像手机上一样放大）。
- 浏览器里开着声音从头看一遍：爸爸说到哪个地方，图钉和气泡正好冒出来；「听一听」的按钮能出声。
- 测完把有声动画暂停，或者离开问答页，别留着它和别的页面串音。
