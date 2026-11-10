# 做讲解动画

动画放在 `src/data/films/<主题>.ts`，类型见 `src/data/films/types.ts`。每个问题一部，`question` 填问题的 `id`。

画面坐标是 1200×900，`[x, y]`，左上角是原点。每个元素只由时间决定（出现时间 `from`，可选消失时间 `to`），所以能暂停、拖动、从任意一帧看。

写完跑 `node tests/film-rules.mjs src/data/films/<主题>.ts`，再在开发服务器里打开 `#/sheet/<问题id>` 看每场戏的最后一刻。

## 结构

```ts
{
  question: "why-different",
  scenes: [
    { turn: 0, title: "外婆的一句话", duration: 9, cues: [ … ] },
    { turn: 1, title: "山和河隔开", view: "map", duration: 10, camera: [ … ], cues: [ … ] }
  ]
}
```

- `turn`：配对话里第几轮（从 0 数）。第一场是 0，场次按轮次排，一轮可以有几场戏，最多空一轮。
- `title` ≤12 字，显示在左上角胶囊里。
- `duration` 4～14 秒，全片 30～110 秒。开了配音会自动拉长，不用自己算。
- `view`：`paper`（默认，暖色纸面）、`map`（示意地图）、`tones`（五度声调格）。

检查器还会管：同时出现的元素不超过 8 个；元素出现半秒后要在镜头里；`from` 不晚于结尾前 0.8 秒；实心的 `shape` 不能盖住先出现的 `word`、`bubble`；`pin` 只能用在地图上，`tone` 只能用在声调格上。

## 底图

### 示意地图 `map`

`src/lib/geo.ts` 把经纬度投影到画面上：`geo(lon, lat)`。画了海岸线（从朝鲜半岛一路到北部湾）、台湾岛、海南岛、长江、黄河，标了"黄河""长江""大海"。**不画国界、省界**。

常用城市在 `places` 里，直接写 `places.guangzhou`。方言点的城市和 `data/dialects/*.json` 的 `point` 一致，测试会核对：

| 城市 | 坐标 | 城市 | 坐标 |
|---|---|---|---|
| beijing 北京 | 720, 268 | guangzhou 广州 | 627, 763 |
| harbin 哈尔滨 | 1019, 94 | hongkong 香港 | 654, 787 |
| shenyang 沈阳 | 927, 212 | shantou 汕头 | 728, 757 |
| jinan 济南 | 738, 364 | meizhou 梅州 | 712, 729 |
| lanzhou 兰州 | 349, 382 | xiamen 厦门 | 770, 723 |
| chengdu 成都 | 356, 541 | fuzhou 福州 | 805, 676 |
| changsha 长沙 | 618, 613 | shanghai 上海 | 869, 524 |
| nanchang 南昌 | 704, 599 | suzhou 苏州 | 844, 522 |
| wuhan 武汉 | 658, 543 | nanjing 南京 | 791, 500 |
| xian 西安 | 500, 432 | wenzhou 温州 | 847, 620 |
| taiyuan 太原 | 606, 328 | hangzhou 杭州 | 830, 553 |

还有 chongqing、taipei、luoyang、huangshan、nanning，以及客家地区的 yongding（永定）、ganzhou（赣州）。东南沿海的城市挤在一起，要推近镜头（`zoom` 1.6～2.2）或者把气泡放到不同方向。

### 声调格 `tones`

五条虚线从下到上是 1～5 度，左边写"高、中、低"。格子横跨 x 220～1100，上沿 y 190，下沿 y 730；每条曲线下面（y≈800）会写出五度数字（55、214）。所以声调格上的 `text` 放在 y≈870，不要放在上方（高调的标签在 y≈134）。

## 元素

### 地图上

| 元素 | 用途 | 主要字段 |
|---|---|---|
| `pin` | 图钉从上面落下来，旁边写地名 | `at`、`text`（≤6 字）、`side`、`color` |
| `bubble` | 说话气泡，尾巴指着 `at` | `text`（≤10 字）、`sub`（≤16 字，拼音或意思）、`side`（top 默认 / bottom / left / right）、`size`（s / m / l） |
| `highlight` | 一片柔光，圈出一个大区 | `at`、`size: [宽, 高]`、`color` |
| `flow` | 一串小图标沿路线流动：搬家的人、传过去的话 | `path`、`icon`、`count`、`speed`、`size` |
| `label` | 带引线的标签 | `at`、`text`（≤12 字）、`side` 或 `pos` |

### 声调

| 元素 | 用途 | 主要字段 |
|---|---|---|
| `tone` | 一笔画出的声调曲线 | `levels`（五度，1～3 个数，比如 `[2, 1, 4]`）、`span: [x0, x1]`、`text`（≤8 字，写在曲线上方）、`draw`（几秒画完，入声用 0.4）、`color` |

几条曲线并排时 `span` 不要重叠；相邻两条都到第 5 格时，标签会挤，`text` 只写一个字。

### 字和词

| 元素 | 用途 | 主要字段 |
|---|---|---|
| `word` | 一个字或词（≤6 字），下面可以写小字 | `text`、`at`、`size`（默认 200）、`caption`（≤10 字）、`color`、`path` + `travel`（挪过去）、`strike`（几秒后划掉）、`motion` |
| `text` | 一行大字，点出关键词（字幕：坐标是屏幕位置，镜头动它不动） | `text`（≤14 字）、`size`、`color` |
| `myth` | 常见误会：先划掉错的，再亮出对的（显示在底部） | `wrong`、`right`（各 ≤18 字） |

### 其他

`sprite`（emoji 图标，一个点就弹出来，几个点就走一趟）、`arrow`、`line`、`shape`（方框、圆、胶囊，可以写 ≤6 字）、`pulse`（波纹）、`count`（数字从 start 数到 end）、`meter`（进度条）。

### 镜头

`camera` 是关键帧列表 `{ t, at, zoom }`，`zoom` 1～2.6。东南沿海、东北、江南这些城市挤的地方推近；可以先全图再推近（`[{ t: 0, at: [600, 450], zoom: 1 }, { t: 2, at: [800, 540], zoom: 2 }]`），推近后的元素从 2 秒以后再出。

## 配方

**一个意思，各地说法**（地图 + 气泡）：
```ts
{ kind: "bubble", at: places.beijing, text: "没有", side: "left", size: "s", from: 0.5 },
{ kind: "bubble", at: places.shanghai, text: "呒没", side: "right", size: "s", from: 1.5 },
{ kind: "bubble", at: places.guangzhou, text: "冇", size: "s", from: 2.5 },
{ kind: "bubble", at: places.xiamen, text: "无", side: "right", size: "s", from: 3.5 },
{ kind: "text", at: [600, 840], text: "同一个意思，好几种说法", from: 5 }
```
北京的气泡放左边，免得压到上方的字幕；上海、厦门放右边（海上空）；广州放上面或左边。

**普通话四声**（声调格）：
```ts
{ kind: "tone", levels: [5, 5], span: [240, 420], text: "妈 mā", from: 0.5 },
{ kind: "tone", levels: [3, 5], span: [460, 640], text: "麻 má", from: 3 },
{ kind: "tone", levels: [2, 1, 4], span: [680, 860], text: "马 mǎ", from: 5.5 },
{ kind: "tone", levels: [5, 1], span: [900, 1080], text: "骂 mà", from: 8 }
```

**入声**：`span` 只宽 80，`draw: 0.4`，一下子画完，看着就"短"。

**搬家把话带走**：起点、终点各一个 `pin`，中间一条 `flow`，`icon: "🧳"`。

**一个字变身**：中间一个 `word`，两条 `arrow` 分到两边，两边各一个 `word` 带 `caption`（"古代江南""今天上海"）。

**字幕盖不住**：`text` 放在上方（y≈110）或下方（y≈840）；地图上北京的气泡朝上时会碰到上方字幕，这时字幕放下方。

## 颜色

方言大区的颜色在 `src/lib/atlas.ts` 的 `familyColor`，地图页、图例和动画用同一套：

| 大区 | 颜色 |
|---|---|
| 官话 `mandarin` | `#f39c34` |
| 晋语 `jin` | `#c77d2e` |
| 吴语 `wu` | `#3d9be9` |
| 湘语 `xiang` | `#e8578a` |
| 赣语 `gan` | `#8e6ae8` |
| 客家话 `hakka` | `#2fae6a` |
| 粤语 `cantonese` | `#e5483b` |
| 闽语 `minnan` | `#13a99a` |

墨色 `#4a3b2a` 是字的默认色；强调用红 `#e5483b`；方言词用棕 `#b4621a` 和普通话区分。

## 排版

- 字要大：主角字 `size` 200～260，并排三个字 150～190，一排四个词 105～130。
- 两个字的词 `size` 150 宽约 300，并排时中心至少隔 330。
- 多个气泡、图钉挤在一起时，先换 `side`，还挤就推近镜头。
- 看 `#/sheet/<问题id>`：总览卡片宽约 330 像素，字幕会自动放大，和手机上一样。这里不挤，手机上就不挤。
