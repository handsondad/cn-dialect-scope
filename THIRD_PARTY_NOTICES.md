# 第三方声明

方言奇遇记的代码和问答、动画内容是本项目自己写的；下面这些素材和做法来自第三方，版权和许可如下。再分发网站（包括 `public/` 里的文件）时，请一并保留本文件。

## 3D 角色

首页小念和爸爸的模型 `public/models/character.glb` 来自 Quaternius 的 Ultimate Animated Character Pack（CC0 1.0），处理方式见 `public/models/CREDITS.md`。3D 场景代码（`src/components/RunLab3D.tsx`、`run-lab/`）和身体奇遇记、汉字奇遇记共用。

## 字体

页面正文和动画里的字用 Google Fonts 上的 Comic Neue 和马善政毛笔楷书（Ma Shan Zheng），都是 SIL Open Font License 1.1，运行时从 Google Fonts 加载，不随网站发布。

## 配音（Microsoft Edge 在线语音）

`public/voice/` 里的音频由 [edge-tts](https://github.com/rany2/edge-tts)（GPL-3.0，只在生成时使用，不随网站发布）调用微软 Edge"大声朗读"的在线神经语音生成：

| 用途 | 语音 |
|---|---|
| 小念 | `zh-CN-YunxiaNeural` |
| 爸爸 | `zh-CN-YunxiNeural` |
| 「听一听」粤语 | `zh-HK-HiuMaanNeural` |
| 「听一听」东北话 | `zh-CN-liaoning-XiaobeiNeural` |
| 「听一听」普通话 | `zh-CN-XiaoxiaoNeural` |

这项服务没有为批量生成音频单独给出授权条款，所以这些音频只按家庭和非商业用途考虑；公开发布或商用前，应改用有明确商用授权的语音服务（如 Azure AI Speech）重新生成。合成语音只是帮孩子感受方言的大致声音，不能代替真人发音。

## 图片

`public/images/` 里的图片来自 Wikimedia Commons，只缩小了尺寸、没有改画面；问答页每张图下面都写了作者和许可。

| 文件 | 作品 | 作者 | 许可 | 来源 |
|---|---|---|---|---|
| `han-jiang-du-diao.jpg` | 《寒江独钓图》（东京国立博物馆藏） | 马远（南宋） | 公有领域 | [Commons](https://commons.wikimedia.org/wiki/File:Angler_on_a_Wintry_Lake,_by_Ma_Yuan,_1195.jpg) |
| `chinatown-sf.jpg` | Street in Chinatown, San Francisco, California（美国国会图书馆藏，[LCCN 2015650750](https://lccn.loc.gov/2015650750)） | Arnold Genthe | 公有领域 | [Commons](https://commons.wikimedia.org/wiki/File:Street_in_Chinatown,_San_Francisco,_California_LCCN2015650750.jpg) |
| `chengqi-lou.jpg` | Chengqi Lou（福建永定承启楼） | Motohiro Sunouchi | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Chengqi_Lou_DSC5172_(16196344182).jpg) |
| `hongkong-taxi.jpg` | Hong Kong Urban Red Taxi | T1NH0（Commons 用户 Sdee） | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Hong_Kong_Urban_Red_Taxi_5980.JPG) |
| `sanfang-qixiang.jpg` | Fuzhou Three Lanes and Seven Alleys Mainstreet（福州三坊七巷） | Lennartbj | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Fuzhou_Three_Lanes_and_Seven_Alleys_Mainstreet.jpg) |
| `wenzhou-jiangxin.jpg` | Jiangxin Temple（温州江心寺） | 猫猫的日记本 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Jiangxin_Temple_07_2018-10.jpg) |
| `wuhan-guozao.jpg` | Hot dry noodles, doupi and soy milk provided by Cailinji（武汉过早：热干面、豆皮、豆浆） | Shwangtianyuan | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Hot_dry_noodles,_doupi_and_soy_milk_provided_by_Cailinji.jpg) |
| `nanjing-wall.jpg` | Nanjing City Wall（南京明城墙） | Gary Todd | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Nanjing_City_Wall_(10150679504).jpg) |
| `cantonese-dimsum.jpg` | A Cantonese Dim Sum at Hoi Lin Tea House（广式早茶点心） | Peachyeung316 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:A_Cantonese_Dim_Sum_at_Hoi_Lin_Tea_House.jpg) |

`hongkong-taxi.jpg` 是 CC BY-SA 3.0，`sanfang-qixiang.jpg`、`wenzhou-jiangxin.jpg`、`wuhan-guozao.jpg`、`cantonese-dimsum.jpg` 是 CC BY-SA 4.0：缩小后的这几张图仍按各自的 CC BY-SA 许可提供。

## 方言知识库

`data/` 下的方言点、概念和专题是本项目整理的，来源记在 `data/sources.json` 和每条数据的 `sources` 字段里。问答里"给大人"一栏写了所依据的文献（《中国语言地图集》、李荣《官话方言的分区》、《菽园杂记》、《论语》、《韩非子》等）。

各地说法大多和维基词典的方言同义词表核对过（[Module:zh/data/dial-syn](https://en.wiktionary.org/wiki/Module:zh/data/dial-syn)，维基词典编者，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)），核对过的条目在 `sources` 里记为 `wiktionary-dial-syn`。用到的是其中个别地点的个别词形，按词条重新整理，不是整表照搬；这些词形连同 `data/concepts/` 按 CC BY-SA 4.0 提供。工具 `tools/dial-syn.mjs` 只在整理时读取这份表，不随网站发布。

## BodyVista（MIT）

`src/lib/motion.ts` 中的相位曲线（`bump`、`breath`、`pulseTravel` 等）和"相位驱动教学动画"的做法参考并改写自 BodyVista（经身体奇遇记）。

```
MIT License

Copyright (c) 2026 FreedomAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## HyperFrames（Apache-2.0）

讲解动画的做法参考了 HyperFrames（heygen-com/hyperframes）的动效指南：画面是时间 t 的纯函数、可以拖动和暂停；到达用长尾 ease-out、退场比进场短；"一张图逐步长出来"。只借鉴了思路，没有复制代码。

## 汉字奇遇记

动画引擎（时间线、镜头、配音同步、播放器）和问答页的结构改写自同系列的汉字奇遇记（hanverse），本项目在此基础上加了示意地图、声调格、对话气泡、图钉等方言专用的元素。
