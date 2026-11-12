import { places } from "../../lib/geo.ts";
import type { Film } from "./types.ts";

const red = "#e5483b";
const purple = "#8e6ae8";
const blue = "#3d9be9";
const green = "#2fae6a";
const orange = "#f39c34";

export const films: readonly Film[] = [
  {
    question: "four-tones",
    scenes: [
      {
        turn: 0, title: "拼音一样的四个字", duration: 9,
        cues: [
          { kind: "word", text: "妈", at: [180, 380], size: 170, caption: "mā", from: 0.5 },
          { kind: "word", text: "麻", at: [460, 380], size: 170, caption: "má", from: 1.5 },
          { kind: "word", text: "马", at: [740, 380], size: 170, caption: "mǎ", from: 2.5 },
          { kind: "word", text: "骂", at: [1020, 380], size: 170, caption: "mà", from: 3.5 },
          { kind: "text", at: [600, 760], text: "字母一样，声调不同", from: 5 }
        ]
      },
      {
        turn: 0, title: "高低升降", duration: 10,
        cues: [
          { kind: "arrow", path: [[110, 400], [290, 400]], color: red, draw: 0.8, from: 0.5 },
          { kind: "arrow", path: [[390, 500], [570, 320]], color: orange, draw: 0.8, from: 2 },
          { kind: "arrow", path: [[670, 420], [760, 520], [850, 330]], color: green, draw: 1, from: 3.5 },
          { kind: "arrow", path: [[950, 320], [1110, 520]], color: blue, draw: 0.8, from: 5 },
          { kind: "text", at: [600, 680], text: "平、升、拐弯、降", from: 6.5 },
          { kind: "text", at: [600, 110], text: "声调：声音的高低升降", size: "s", from: 0.3 }
        ]
      },
      {
        turn: 1, title: "五级台阶", view: "tones", duration: 13,
        cues: [
          { kind: "tone", levels: [5, 5], span: [240, 420], text: "妈 mā", color: red, from: 0.5 },
          { kind: "tone", levels: [3, 5], span: [460, 640], text: "麻 má", color: orange, from: 3 },
          { kind: "tone", levels: [2, 1, 4], span: [680, 860], text: "马 mǎ", color: green, from: 5.5 },
          { kind: "tone", levels: [5, 1], span: [900, 1080], text: "骂 mà", color: blue, from: 8 },
          { kind: "text", at: [600, 870], text: "从低到高，分成五格", from: 10 }
        ]
      },
      {
        turn: 2, title: "读错就变了", duration: 10,
        cues: [
          { kind: "word", text: "买", at: [280, 340], size: 200, caption: "mǎi", from: 0.5 },
          { kind: "arrow", path: [[440, 340], [760, 340]], text: "读成第四声", color: red, draw: 1, from: 2 },
          { kind: "word", text: "卖", at: [920, 340], size: 200, caption: "mài", color: red, from: 3.2 },
          { kind: "sprite", icon: "🪪", path: [[600, 650]], size: 150, from: 5 },
          { kind: "text", at: [600, 870], text: "声调像字的身份证", from: 6 }
        ]
      },
      {
        turn: 3, title: "各地的声调个数", view: "map", duration: 11,
        cues: [
          { kind: "pin", at: places.beijing, text: "北京", side: "left", from: 0.3 },
          { kind: "bubble", at: places.beijing, text: "4 个声调", side: "right", size: "s", from: 1 },
          { kind: "pin", at: places.shanghai, text: "上海", side: "left", from: 2.5 },
          { kind: "bubble", at: places.shanghai, text: "5 个声调", side: "right", size: "s", from: 3.2 },
          { kind: "pin", at: places.guangzhou, text: "广州", side: "left", from: 4.7 },
          { kind: "bubble", at: places.guangzhou, text: "9 个声调", side: "right", size: "s", from: 5.4 },
          { kind: "text", at: [600, 110], text: "个数和唱法都不一样", from: 7 }
        ]
      },
      {
        turn: 4, title: "同一个妈，两种唱法", view: "tones", duration: 10,
        cues: [
          { kind: "tone", levels: [5, 5], span: [260, 560], text: "北京：妈", color: red, from: 0.5 },
          { kind: "tone", levels: [2, 1], span: [740, 1040], text: "天津：妈", color: purple, from: 3 },
          { kind: "text", at: [600, 870], text: "高低一点点跑开了", from: 6 }
        ]
      }
    ]
  },
  {
    question: "cantonese-tones",
    scenes: [
      {
        turn: 0, title: "表姐的粤语歌", duration: 9,
        cues: [
          { kind: "sprite", icon: "👧", path: [[300, 560]], size: 220, from: 0.3 },
          { kind: "sprite", icon: "🎤", path: [[470, 540]], size: 90, from: 0.8 },
          { kind: "flow", path: [[530, 470], [1080, 260]], icon: "🎵", count: 5, speed: 160, size: 14, from: 1.5 },
          { kind: "bubble", at: [880, 640], text: "九声六调！", side: "top", from: 3.5 },
          { kind: "text", at: [600, 840], text: "粤语的声调特别多", from: 5.5 }
        ]
      },
      {
        turn: 0, title: "诗史试时市事", view: "tones", duration: 14,
        cues: [
          { kind: "tone", levels: [5, 5], span: [230, 350], text: "诗", color: red, from: 0.5 },
          { kind: "tone", levels: [3, 5], span: [375, 495], text: "史", color: orange, from: 2.3 },
          { kind: "tone", levels: [3, 3], span: [520, 640], text: "试", color: green, from: 4.1 },
          { kind: "tone", levels: [2, 1], span: [665, 785], text: "时", color: blue, from: 5.9 },
          { kind: "tone", levels: [1, 3], span: [810, 930], text: "市", color: purple, from: 7.7 },
          { kind: "tone", levels: [2, 2], span: [955, 1075], text: "事", color: "#8b5a2b", from: 9.5 }
        ]
      },
      {
        turn: 1, title: "短短的三声", view: "tones", duration: 11,
        cues: [
          { kind: "tone", levels: [5, 5], span: [300, 380], text: "一 jat1", color: red, draw: 0.4, from: 0.8 },
          { kind: "tone", levels: [3, 3], span: [560, 640], text: "八 baat3", color: green, draw: 0.4, from: 2.8 },
          { kind: "tone", levels: [2, 2], span: [820, 900], text: "六 luk6", color: "#8b5a2b", draw: 0.4, from: 4.8 },
          { kind: "text", at: [600, 870], text: "又短又急：6 + 3 = 9", from: 7 }
        ]
      },
      {
        turn: 2, title: "普通话拉长了", duration: 10,
        cues: [
          { kind: "word", text: "入声", at: [600, 230], size: 150, caption: "老名字", from: 0.5 },
          { kind: "text", at: [250, 520], text: "粤语", size: "s", from: 2 },
          { kind: "shape", shape: "pill", at: [250, 620], size: [170, 120], color: "#ffd9d4", text: "一", from: 2.3 },
          { kind: "text", at: [780, 520], text: "普通话", size: "s", from: 4 },
          { kind: "shape", shape: "pill", at: [780, 620], size: [560, 120], color: "#dbeaff", text: "一", motion: "grow", over: 2, from: 4.3 },
          { kind: "text", at: [600, 870], text: "短字慢慢拉长了", from: 7 }
        ]
      },
      {
        turn: 3, title: "山里的老房子", view: "map", duration: 10,
        cues: [
          { kind: "highlight", at: places.luoyang, size: [260, 200], color: orange, from: 0.3 },
          { kind: "label", at: places.luoyang, text: "古时候的中原", side: "left", from: 1 },
          { kind: "sprite", icon: "⛰️", path: [[520, 655]], size: 70, from: 2.5 },
          { kind: "sprite", icon: "⛰️", path: [[620, 645]], size: 70, from: 2.8 },
          { kind: "sprite", icon: "⛰️", path: [[720, 655]], size: 70, from: 3.1 },
          { kind: "pin", at: places.guangzhou, text: "广州", side: "left", color: red, from: 4 },
          { kind: "text", at: [600, 110], text: "隔着南岭，老读音留下来", from: 5.5 }
        ]
      },
      {
        turn: 4, title: "数一、二、三", duration: 9,
        cues: [
          { kind: "word", text: "一", at: [250, 380], size: 200, caption: "jat1 短！", color: red, motion: "pulse", from: 0.5 },
          { kind: "word", text: "二", at: [600, 380], size: 200, caption: "ji6", from: 2.5 },
          { kind: "word", text: "三", at: [950, 380], size: 200, caption: "saam1", from: 4 },
          { kind: "text", at: [600, 780], text: "短短一下就停：入声", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "ancient-poem",
    scenes: [
      {
        turn: 0, title: "千山鸟飞绝", duration: 11,
        cues: [
          { kind: "flow", path: [[100, 0], [180, 900]], icon: "❄️", count: 4, speed: 90, size: 10, from: 0.3 },
          { kind: "flow", path: [[1100, 0], [1020, 900]], icon: "❄️", count: 4, speed: 90, size: 10, from: 0.6 },
          { kind: "sprite", icon: "🛶", path: [[600, 640]], size: 150, from: 0.8 },
          { kind: "word", text: "绝", at: [300, 320], size: 160, caption: "jué", from: 2 },
          { kind: "word", text: "灭", at: [600, 320], size: 160, caption: "miè", from: 3.2 },
          { kind: "word", text: "雪", at: [900, 320], size: 160, caption: "xuě", from: 4.4 },
          { kind: "text", at: [600, 840], text: "读起来不太顺？", from: 6.5 }
        ]
      },
      {
        turn: 0, title: "普通话：三个调", view: "tones", duration: 10,
        cues: [
          { kind: "tone", levels: [3, 5], span: [260, 480], text: "绝 jué", color: orange, from: 0.5 },
          { kind: "tone", levels: [5, 1], span: [540, 760], text: "灭 miè", color: blue, from: 2.5 },
          { kind: "tone", levels: [2, 1, 4], span: [820, 1040], text: "雪 xuě", color: green, from: 4.5 },
          { kind: "text", at: [600, 870], text: "分到了三个声调里", from: 7 }
        ]
      },
      {
        turn: 1, title: "粤语：都短短一收", view: "tones", duration: 11,
        cues: [
          { kind: "tone", levels: [2, 2], span: [300, 380], text: "绝 zyut6", color: red, draw: 0.4, from: 0.8 },
          { kind: "tone", levels: [2, 2], span: [560, 640], text: "灭 mit6", color: red, draw: 0.4, from: 2.6 },
          { kind: "tone", levels: [3, 3], span: [820, 900], text: "雪 syut3", color: red, draw: 0.4, from: 4.4 },
          { kind: "text", at: [600, 870], text: "短短一收，像一伙", from: 6.5 }
        ]
      },
      {
        turn: 2, title: "床前明月光", duration: 10,
        cues: [
          { kind: "sprite", icon: "🌙", path: [[1020, 160]], size: 120, from: 0.3 },
          { kind: "word", text: "光", at: [250, 400], size: 170, caption: "guāng", from: 1 },
          { kind: "word", text: "霜", at: [600, 400], size: 170, caption: "shuāng", from: 2.2 },
          { kind: "word", text: "乡", at: [950, 400], size: 170, caption: "xiāng", from: 3.4 },
          { kind: "text", at: [600, 780], text: "大部分唐诗还押韵", from: 5 }
        ]
      },
      {
        turn: 3, title: "像侦探一样", duration: 11,
        cues: [
          { kind: "sprite", icon: "🕵️", path: [[600, 470]], size: 220, from: 0.3 },
          { kind: "shape", shape: "pill", at: [220, 260], size: [230, 80], color: "#ffe2c4", text: "粤语", from: 1.5 },
          { kind: "shape", shape: "pill", at: [980, 260], size: [230, 80], color: "#d8f3ee", text: "闽南话", from: 2.3 },
          { kind: "shape", shape: "pill", at: [220, 680], size: [230, 80], color: "#e2f6e9", text: "客家话", from: 3.1 },
          { kind: "shape", shape: "pill", at: [980, 680], size: [230, 80], color: "#efe6ff", text: "古人的书", from: 3.9 },
          { kind: "text", at: [600, 110], text: "没有录音，只能推", from: 0.5 },
          { kind: "text", at: [600, 840], text: "拼出古人的读音", from: 6 }
        ]
      },
      {
        turn: 4, title: "平平的平声", view: "tones", duration: 10,
        cues: [
          { kind: "tone", levels: [5, 5], span: [260, 480], text: "江", color: red, from: 0.5 },
          { kind: "tone", levels: [5, 5], span: [540, 760], text: "山", color: red, from: 1.8 },
          { kind: "tone", levels: [5, 5], span: [820, 1040], text: "风", color: red, from: 3.1 },
          { kind: "text", at: [600, 870], text: "平声字，今天还平平的", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "er-hua",
    scenes: [
      {
        turn: 0, title: "舌头一卷", duration: 10,
        cues: [
          { kind: "word", text: "今儿", at: [250, 290], size: 140, caption: "今天", color: orange, from: 0.5 },
          { kind: "word", text: "明儿", at: [600, 290], size: 140, caption: "明天", color: orange, from: 1.5 },
          { kind: "word", text: "玩儿", at: [950, 290], size: 140, caption: "玩", color: orange, from: 2.5 },
          { kind: "sprite", icon: "👅", path: [[600, 610]], size: 140, wobble: true, from: 4 },
          { kind: "text", at: [600, 830], text: "舌尖往上一卷", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "加儿变意思", duration: 12,
        cues: [
          { kind: "word", text: "头", at: [200, 280], size: 130, caption: "脑袋", from: 0.5 },
          { kind: "word", text: "头儿", at: [470, 280], size: 130, caption: "带头的人", color: red, from: 1.5 },
          { kind: "word", text: "盖", at: [740, 280], size: 130, caption: "盖上", from: 3.5 },
          { kind: "word", text: "盖儿", at: [1000, 280], size: 130, caption: "盖子", color: red, from: 4.5 },
          { kind: "word", text: "画", at: [360, 600], size: 130, caption: "画画", from: 6.5 },
          { kind: "word", text: "画儿", at: [800, 600], size: 130, caption: "一幅画", color: red, from: 7.5 }
        ]
      },
      {
        turn: 2, title: "小小的、可爱的", duration: 10,
        cues: [
          { kind: "word", text: "小孩儿", at: [300, 290], size: 100, from: 0.5 },
          { kind: "word", text: "小猫儿", at: [900, 290], size: 100, from: 1.5 },
          { kind: "word", text: "一会儿", at: [600, 520], size: 100, from: 2.5 },
          { kind: "sprite", icon: "🐱", path: [[900, 520]], size: 110, wobble: true, from: 3.5 },
          { kind: "text", at: [600, 820], text: "听起来小小的、可爱的", from: 5 }
        ]
      },
      {
        turn: 3, title: "南方呢？", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.beijing, text: "今儿", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.guangzhou, text: "细路仔", side: "left", size: "s", from: 2 },
          { kind: "bubble", at: places.shanghai, text: "小囡", side: "right", size: "s", from: 3.5 },
          { kind: "bubble", at: places.hangzhou, text: "小伢儿", side: "bottom", size: "s", color: blue, from: 5 },
          { kind: "text", at: [600, 110], text: "杭州话也带儿", from: 6.5 }
        ]
      },
      {
        turn: 4, title: "粘在一起", duration: 11,
        cues: [
          { kind: "word", text: "花", at: [220, 340], size: 170, from: 0.5 },
          { kind: "word", text: "儿", at: [440, 340], size: 170, color: orange, from: 1.5 },
          { kind: "arrow", path: [[560, 340], [760, 340]], text: "越说越快", draw: 0.8, from: 3 },
          { kind: "word", text: "花儿", at: [960, 340], size: 160, caption: "粘成一个音", color: red, from: 4.5 },
          { kind: "text", at: [600, 780], text: "先单读，后粘在一起", from: 6.5 }
        ]
      }
    ]
  }
];
