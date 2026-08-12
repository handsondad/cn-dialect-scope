# Chinese Dialect Scope｜方言识别与学习工具

## 中文简介

**Chinese Dialect Scope（方言识别与学习工具）** 是一个面向方言爱好者与学习者的轻量应用。用户输入一句中文方言文本，系统会基于方言词汇、语法线索与音韵提示，快速推测**可能地区**，并给出**可解释的语言特征**与**学习卡片**，帮助用户在“识别”之外真正理解各地乡音。

### 它能做什么？
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
├── app.py
├── dialect_data.py
├── dialect_engine.py
├── requirements.txt
├── static/
│   └── index.html
└── tests/
    └── test_dialect_engine.py
```

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
