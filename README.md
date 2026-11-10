# 🗣️ 方言奇遇记 · Chinese Dialect Scope

给 6–12 岁孩子的汉语方言科普网站，奇遇记系列（[身体奇遇记](https://handsondad.github.io/bodyverse/)、[化学奇遇记](https://handsondad.github.io/chemverse/)、[汉字奇遇记](https://handsondad.github.io/hanverse/)）的一员。

小念（男孩）听到外婆说「侬饭吃过了伐？」、看到奶茶店写着「冇问题」，就去问爸爸；爸爸回答，小念接着爸爸的话追问，5–8 轮一路讲到道理，最后小念用自己的话总结。每个问题都配一部讲解动画：示意地图上的图钉和对话气泡、五度声调格上画出来的声调曲线、一个字在各地变身的样子，小念和爸爸的配音把整段问答读出来，动画跟着声音走。粤语、东北话、普通话的句子可以点「🔊」听一听。

仓库里原来的 Python 方言识别工具和方言知识库（`data/`）都还在，网站直接读同一份知识库。

## 网站里有什么

| 页面 | 路由 | 内容 |
|---|---|---|
| 首页 | `#/` | 小念和爸爸的 3D 小星球、5 个主题、方言地图和游戏入口 |
| 主题 | `#/topic/<主题>` | 问题列表，按入门 / 进阶 / 挑战排 |
| 问答 | `#/q/<问题>` | 一问一答 + 讲解动画 + 「听一听」 + 这一问里的方言词 + 给大人的补充 |
| 方言地图 | `#/map[/<概念>]` | 点一个词（没有、吃、外婆……），看 19 个方言点各怎么说；点方言点看它的档案 |
| 猜猜是哪里话 | `#/game` | 读一句、听一句方言，猜是哪里话，8 题一局 |

5 个主题、25 个问题：

- 🧭 为什么说话不一样：外婆的上海话、福建的山、普通话是怎么来的、方言会不会消失
- 🌳 方言大家族：七大方言和十个大区、四川话为什么好懂、山西的晋语、唐人街的粤语、土楼里的客家话
- 🎵 声调的秘密：妈麻马骂、北京话的儿化、粤语九声六调、古诗为什么不押韵（入声）
- 💬 一个意思各地说：冇和无、外婆和姥姥、太阳叫日头、古书里的「走」是跑、筷子古时叫箸、今朝和听日
- 🎲 好玩的方言：东北话嘎哈、广州的细路、侬从「我」变成「你」、食饭和吃饭、鸡公和鸡母、的士和巴士

问答里的古画和照片来自 Wikimedia Commons（公有领域或 CC 许可），作者和许可写在每张图下面和 `THIRD_PARTY_NOTICES.md` 里。

## 运行

需要 Node.js 22.18+（测试和脚本直接用 Node 跑 `.ts`）。

```bash
npm install
npm run dev        # 开发服务器
npm run typecheck  # 类型检查
npm test           # 全部测试
npm run build      # 生产构建到 dist/
```

推到 `main` 后，`.github/workflows/deploy.yml` 会构建并发布到 GitHub Pages。

配音（只在改了问答文字或新增问题时需要）：

```bash
python -m pip install edge-tts   # 另外 PATH 里要有 ffmpeg / ffprobe
npm run voice                    # 只生成新的或改过的句子，可以中断再续
```

写新问题、新动画的方法见 `AGENTS.md` 和 `skills/dialectverse-explainer/SKILL.md`。

## 目录

```text
.
├── src/
│   ├── data/questions/   # 小念 × 爸爸的问答，一个主题一个文件
│   ├── data/films/       # 每个问题一部讲解动画
│   ├── data/atlas.ts     # 在浏览器里读 data/ 下的方言知识库
│   ├── components/film/  # 动画舞台和播放器
│   ├── lib/              # 时间线、配音时间线、示意地图投影、出题
│   └── pages/            # 首页、问题列表、问答、方言地图、游戏
├── public/voice/         # 配音（npm run voice 生成）
├── tests/                # node --test：问答规则、动画规则、知识库、配音
├── tools/voice/          # 配音脚本
├── data/                 # 方言知识库（JSON，网站和 Python 工具共用）
├── app.py …              # Python 方言识别工具（见下）
└── static/index.html     # Python 工具的页面
```

## 方言知识库（`data/`）

数据以 **概念 ↔ 表达 ↔ 方言点** 为核心，全部是 JSON 文件，便于直接编辑和用 PR 审阅。

- **方言点** (`data/dialects/<slug>.json`)：`classification.path` 记录分区层级（如 `["吴语", "太湖片", "苏沪嘉小片"]`，参考《中国语言地图集》），`point` 记录代表点和经纬度，另有高频词、语法和语音特征、常用表达。
- **概念** (`data/concepts/<slug>.json`)：`headword`、`gloss`、`category`、`aliases`、`related`、`etymology`。
- **表达**（概念里的 `expressions`）：`dialect`、`form`、`orthography`（本字 / 俗字 / 训读字 / 借音字 / 通用字 / 待考）、`etymon`、`romanization`、`example` / `example_gloss`、`register`、`status`、`confidence`（`high` / `medium` / `unverified`）、`sources`。

目前收录 19 个方言点（8 个大区）、25 个概念。各地说法绝大多数已和维基词典的方言同义词表（[Module:zh/data/dial-syn](https://en.wiktionary.org/wiki/Module:zh/data/dial-syn)，CC BY-SA 4.0）核对，来源记为 `wiktionary-dial-syn`；其余来自项目整理（`editorial`），网站和 Python 工具都会标出“还要再核对”或“待考”。查一个词各地怎么说：`node tools/dial-syn.mjs 太陽`（用繁体字）。欢迎补充出处和更正。改了 `data/` 以后，跑一下 `npm test`（会检查网站用到的字段和动画里的城市坐标）和 `python -m pytest tests/`，如果新词属于粤语或东北话，再跑 `npm run voice` 给它配上「听一听」。

## Python 方言识别工具

输入一句方言文本，基于方言词汇、语法线索与音韵提示推测可能地区，并给出可解释的特征和学习卡片。

```bash
pip install -r requirements.txt
python app.py              # 打开 http://127.0.0.1:5000/
python -m pytest tests/ -v
```

| 接口 | 说明 |
| --- | --- |
| `POST /api/identify` | `{"text": "我冇带钥匙，食咗饭未啊？"}` → Top 3 可能地区、命中的特征、学习卡片 |
| `GET /api/dialects`、`GET /api/dialects/<slug>` | 方言列表、方言档案 |
| `GET /api/learning/<dialect>` | 某个方言的学习卡片 |
| `GET /api/concepts?category=`、`GET /api/concepts/<slug>` | 概念列表、概念详情 |
| `GET /api/search?q=` | 按普通话词、别名、方言写法或拼音搜索 |
| `GET /api/features?kind=grammar\|phonology` | 各方言的语法 / 语音特征 |
| `GET /api/topics`、`GET /api/topics/<slug>`、`GET /api/sources` | 趣味专题、来源 |

示例：`你搁这儿嘎哈呢？` → 东北话；`歹势啦，我袂晓按怎做。` → 闽南话（福建）；`侬哪能现在才来？` → 上海话。

## 许可与致谢

3D 角色、配音、动效思路等第三方素材的来源和许可见 `THIRD_PARTY_NOTICES.md`。配音由微软 Edge 在线语音生成，只按家庭和非商业用途考虑。
