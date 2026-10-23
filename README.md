# Chinese Dialect Scope｜方言识别与学习工具

## 中文简介

**Chinese Dialect Scope（方言识别与学习工具）** 是一个面向方言爱好者与学习者的轻量应用。用户输入一句中文方言文本，系统会基于方言词汇、语法线索与音韵提示，快速推测**可能地区**，并给出**可解释的语言特征**与**学习卡片**，帮助用户在“识别”之外真正理解各地乡音。

### 它能做什么？
- **概念对照（一个意思，各地怎么说）**：搜索“没有”“吃”“走”等概念，按方言大区分组列出各方言点的说法、读音、本字／俗字标注、例句与可信度。
- **方言档案**：每个方言点的分区、地理坐标、高频词、语言特征，以及它在概念对照里的全部说法。
- **趣味专题**：如“‘走’与‘行’”“‘侬’：从‘我’到‘你’”“本字与俗字”。
- **文本输入 → 方言地区识别**：输入一句方言样例，返回 Top 3 可能地区与置信度。
- **语言特征解释**：展示命中的方言词、语法结构、音韵提示，并附示例说明。
- **学习卡片**：自动生成对应方言的核心词汇、表达套路与语法观察卡片。
- **内置示例**：网页中预置多条方言例句，可一键体验。
- **后续可扩展音频识别**：当前实现文本识别，架构已适合未来加入语音入口。

### 当前覆盖的主要方言家族
- 官话：北京话、东北话、西南官话、兰银官话
- 粤语：广州话、香港粤语
- 闽南语：潮汕话、闽南话（福建）
- 吴语：上海话、苏州话
- 客家话
- 湘语：长沙话
- 赣语：南昌话

## English Overview

**Chinese Dialect Scope** is a lightweight dialect recognition and learning app for dialect enthusiasts and learners. Users enter a short dialect sentence, and the system returns the most likely regions, explains the linguistic clues behind the guess, and provides learning cards for further study.

### Features
- **Text input → region detection** with Top 3 candidates
- **Explainable matching** based on vocabulary, grammar, and phonological hints
- **Learning cards** for dialect-specific phrases and study focus
- **Clickable sample phrases** to try the tool instantly
- **Responsive single-page UI** for desktop and mobile

## Project Structure

```text
.
├── app.py                 # Flask API
├── knowledge_base.py      # loads data/, validates schema, query helpers
├── dialect_data.py        # compatibility layer for the engine
├── dialect_engine.py      # rule-based identifier
├── data/
│   ├── families.json      # 方言大区（含识别用的标志词）
│   ├── dialects/*.json    # 一个方言点一个文件：分区、坐标、词汇、特征、表达
│   ├── concepts/*.json    # 一个概念一个文件：各方言点的说法、词源、关联
│   ├── topics.json        # 趣味专题
│   └── sources.json       # 来源
├── static/
│   └── index.html
└── tests/
```

## Knowledge Base Data Model｜知识库数据模型

数据以 **概念 ↔ 表达 ↔ 方言点** 为核心，全部是 `data/` 下的 JSON 文件，便于直接编辑和用 PR 审阅。

- **方言点** (`data/dialects/<slug>.json`)：`classification.path` 记录分区层级（如 `["吴语", "太湖片", "苏沪嘉小片"]`，参考《中国语言地图集》），`point` 记录代表点和经纬度。
- **概念** (`data/concepts/<slug>.json`)：`headword`、`gloss`、`category`、`aliases`、`related`（`related` / `synonym` / `broader` / `narrower`）、`etymology`（字、《广韵》反切、说明）。
- **表达**（概念里的 `expressions`）：
  - `dialect`、`form`、`orthography`（本字 / 俗字 / 训读字 / 借音字 / 通用字 / 待考）、`etymon`（本字）
  - `romanization`（如粤拼、台罗）、可选 `ipa`
  - `example` / `example_gloss`、`register`（口语 / 书面 / 俚俗 / 通用）、`status`（常用 / 老派 / 少用 / 濒危）
  - `confidence`（`high` 共识 / `medium` 需核对 / `unverified` 待考）、`sources`
- 每条表达、词源和专题都必须带 `confidence` 和 `sources`。

`KnowledgeBase.validate()` 会检查字段、取值范围和引用完整性（方言、概念、来源是否存在）；`tests/test_knowledge_base.py` 会在测试中运行它。

> 目前收录 16 个概念，多数条目来自项目整理（来源 `editorial`），尚未逐条与文献核对，界面上会标出“需核对”或“待考”。欢迎补充出处和更正。

## How to Run｜运行方式

### 1) Install dependencies

```bash
cd /home/runner/work/cn-dialect-scope/cn-dialect-scope
pip install -r requirements.txt
```

### 2) Start the Flask app

```bash
python app.py
```

Then open:

```text
http://127.0.0.1:5000/
```

## API Endpoints

### `POST /api/identify`
Request:

```json
{
  "text": "我冇带钥匙，食咗饭未啊？"
}
```

Response example:

```json
{
  "possible_regions": [
    {"region": "广州", "score": 0.78, "dialect_family": "粤语", "dialect": "广州话"},
    {"region": "香港", "score": 0.22, "dialect_family": "粤语", "dialect": "香港粤语"}
  ],
  "features": [
    {"name": "词汇：冇", "description": "表示‘没有’。", "example": "我冇带钥匙。"}
  ],
  "learning_cards": [
    {"title": "广州话｜核心词汇", "content": "...", "examples": ["咩", "冇", "佢"]}
  ]
}
```

### `GET /api/dialects`
Returns all supported dialect families and their representative dialects.

### `GET /api/learning/<dialect>`
Returns learning cards for a specific dialect slug, such as:

```text
/api/learning/hakkahua
/api/learning/beijinghua
```

### Knowledge base endpoints

| Endpoint | Description |
| --- | --- |
| `GET /api/concepts?category=` | 概念列表 |
| `GET /api/concepts/<slug>` | 概念详情：按方言大区分组的说法、词源、相关概念、专题 |
| `GET /api/search?q=` | 按普通话词、别名、方言写法或拼音搜索概念，也会匹配方言和专题 |
| `GET /api/dialects/<slug>` | 方言档案 |
| `GET /api/features?kind=grammar\|phonology` | 各方言的语法 / 语音特征 |
| `GET /api/topics`, `GET /api/topics/<slug>` | 趣味专题 |
| `GET /api/sources` | 来源列表 |

## Example Usage｜示例

### Web examples
- `你搁这儿嘎哈呢？` → likely **东北话**
- `我冇带钥匙，食咗饭未啊？` → likely **粤语（广州话）**
- `歹势啦，我袂晓按怎做。` → likely **闽南话（福建）**
- `侬哪能现在才来？` → likely **上海话**

### Run tests

```bash
python -m pytest tests/ -v
```

## Notes
- This version focuses on **rule-based, explainable recognition** instead of machine learning.
- The dataset is intentionally educational: each dialect includes vocabulary, grammar features, phonological hints, and common expressions.
- Audio support can later be added by extending the input pipeline and feature extraction layer.
