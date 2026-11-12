import { places } from "../../lib/geo.ts";
import { familyColor } from "../../lib/atlas.ts";
import type { Film } from "./types.ts";

export const films: readonly Film[] = [
  {
    question: "how-many",
    scenes: [
      {
        turn: 0, title: "数也数不清", view: "map", duration: 10,
        cues: [
          { kind: "bubble", at: places.beijing, text: "什么？", size: "s", from: 0.5 },
          { kind: "bubble", at: places.shanghai, text: "啥？", side: "right", size: "s", from: 1.2 },
          { kind: "bubble", at: places.guangzhou, text: "乜嘢？", side: "left", size: "s", from: 1.9 },
          { kind: "bubble", at: places.changsha, text: "么子？", size: "s", from: 2.6 },
          { kind: "bubble", at: places.chengdu, text: "啥子？", size: "s", from: 3.3 },
          { kind: "bubble", at: places.xiamen, text: "啥物？", side: "right", size: "s", from: 4 },
          { kind: "text", at: [600, 850], text: "每个地方都有点不一样", from: 5.5 }
        ]
      },
      {
        turn: 0, title: "像的排成一队", duration: 9,
        cues: [
          { kind: "sprite", icon: "🧩", path: [[600, 400]], size: 240, wobble: true, from: 0.3 },
          { kind: "text", at: [600, 110], text: "像的归成一大片", from: 1.5 },
          { kind: "count", at: [600, 700], label: "归成几大片", start: 0, end: 7, unit: "片", over: 3, from: 3 },
          { kind: "text", at: [600, 840], text: "常说：七大方言", color: "#e5483b", from: 6.5 }
        ]
      },
      {
        turn: 1, title: "七大方言", view: "map", duration: 12,
        cues: [
          { kind: "highlight", at: [560, 360], size: [760, 420], color: familyColor.mandarin, from: 0.3 },
          { kind: "pin", at: places.shanghai, text: "吴语", side: "right", color: familyColor.wu, from: 2 },
          { kind: "pin", at: places.changsha, text: "湘语", side: "left", color: familyColor.xiang, from: 3 },
          { kind: "pin", at: places.nanchang, text: "赣语", side: "top", color: familyColor.gan, from: 4 },
          { kind: "pin", at: places.guangzhou, text: "粤语", side: "left", color: familyColor.cantonese, from: 5 },
          { kind: "pin", at: places.meizhou, text: "客家话", side: "bottom", color: familyColor.hakka, from: 6 },
          { kind: "pin", at: places.xiamen, text: "闽语", side: "right", color: familyColor.minnan, from: 7 },
          { kind: "text", at: [600, 110], text: "北方一大片：官话", color: "#b4621a", from: 1 }
        ]
      },
      {
        turn: 2, title: "官话最大", duration: 10,
        cues: [
          { kind: "meter", at: [600, 190], label: "说官话的人", start: 0, end: 0.7, color: familyColor.mandarin, over: 2.5, from: 0.5 },
          { kind: "sprite", icon: "🧑", path: [[280, 580]], size: 170, from: 3.5 },
          { kind: "bubble", at: [280, 480], text: "你说啥子？", sub: "四川话", size: "s", from: 4.2 },
          { kind: "sprite", icon: "🧔", path: [[920, 580]], size: 170, from: 5 },
          { kind: "bubble", at: [920, 480], text: "你瞅啥？", sub: "东北话", size: "s", from: 5.7 },
          { kind: "text", at: [600, 830], text: "各说各的，也能聊", from: 7.2 }
        ]
      },
      {
        turn: 3, title: "广州人和上海人", duration: 10,
        cues: [
          { kind: "sprite", icon: "👩", path: [[280, 580]], size: 170, from: 0.3 },
          { kind: "bubble", at: [280, 480], text: "你讲乜嘢？", sub: "广州话", size: "s", from: 1 },
          { kind: "sprite", icon: "👨", path: [[920, 580]], size: 170, from: 1.8 },
          { kind: "bubble", at: [920, 480], text: "侬做啥？", sub: "上海话", size: "s", from: 2.5 },
          { kind: "sprite", icon: "❓", path: [[600, 560]], size: 120, wobble: true, from: 4 },
          { kind: "text", at: [600, 830], text: "出门在外：说普通话", from: 6.5 }
        ]
      },
      {
        turn: 4, title: "分得更细的地图", view: "map", duration: 11,
        cues: [
          { kind: "count", at: [600, 110], label: "汉语方言大区", start: 7, end: 10, unit: "个", over: 3, from: 0.5 },
          { kind: "pin", at: places.taiyuan, text: "晋语", side: "left", color: familyColor.jin, from: 4 },
          { kind: "pin", at: places.huangshan, text: "徽语", side: "left", color: "#6c8ebf", from: 5 },
          { kind: "pin", at: places.nanning, text: "平话和土话", side: "left", color: "#b56fb0", from: 6 },
          { kind: "text", at: [600, 840], text: "《中国语言地图集》", size: "s", from: 7.5 }
        ]
      }
    ]
  },
  {
    question: "guanhua",
    scenes: [
      {
        turn: 0, title: "熊猫基地", duration: 10,
        cues: [
          { kind: "sprite", icon: "🐼", path: [[300, 560]], size: 240, wobble: true, from: 0.3 },
          { kind: "sprite", icon: "👨", path: [[880, 580]], size: 200, from: 1 },
          { kind: "bubble", at: [880, 460], text: "莫得事，巴适得很！", sub: "没事，舒服得很！", from: 1.8 },
          { kind: "text", at: [600, 830], text: "四川话：官话的一员", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "官话一大家", view: "map", duration: 12,
        cues: [
          { kind: "highlight", at: [640, 300], size: [700, 360], color: familyColor.mandarin, from: 0.3 },
          { kind: "highlight", at: [430, 600], size: [380, 260], color: "#f6b26b", from: 0.8 },
          { kind: "pin", at: places.chengdu, text: "西南官话", side: "left", color: "#b4621a", from: 2 },
          { kind: "pin", at: places.beijing, text: "北京官话", side: "left", color: "#b4621a", from: 3.5 },
          { kind: "pin", at: places.harbin, text: "东北官话", side: "left", color: "#b4621a", from: 4.5 },
          { kind: "pin", at: places.nanjing, text: "江淮官话", side: "right", color: "#b4621a", from: 5.5 },
          { kind: "text", at: [600, 840], text: "同一家，好几支", from: 7.5 }
        ]
      },
      {
        turn: 2, title: "湖广填四川", view: "map", duration: 10,
        cues: [
          { kind: "pin", at: places.chengdu, text: "四川", side: "left", from: 0.3 },
          { kind: "pin", at: places.wuhan, text: "湖北", side: "right", from: 1 },
          { kind: "pin", at: places.changsha, text: "湖南", side: "right", from: 1.5 },
          { kind: "flow", path: [places.wuhan, [520, 520], places.chengdu], icon: "🧳", count: 5, speed: 140, size: 12, from: 2.5 },
          { kind: "flow", path: [places.changsha, [480, 600], places.chengdu], icon: "🧳", count: 5, speed: 140, size: 12, from: 3 },
          { kind: "text", at: [600, 110], text: "三四百年前：搬进四川", from: 4 }
        ]
      },
      {
        turn: 3, title: "什么、啥、啥子", duration: 11,
        cues: [
          { kind: "word", text: "什么", at: [220, 380], size: 140, caption: "普通话", from: 0.5 },
          { kind: "word", text: "啥", at: [600, 380], size: 160, caption: "东北话", color: "#b4621a", from: 2 },
          { kind: "word", text: "啥子", at: [980, 380], size: 140, caption: "四川话", color: "#b4621a", from: 3.5 },
          { kind: "text", at: [600, 760], text: "只差一点点，很好猜", from: 5.5 }
        ]
      },
      {
        turn: 4, title: "摆龙门阵", duration: 10,
        cues: [
          { kind: "sprite", icon: "🧓", path: [[260, 590]], size: 170, from: 0.3 },
          { kind: "sprite", icon: "🍵", path: [[600, 660]], size: 100, from: 0.8 },
          { kind: "sprite", icon: "👴", path: [[940, 590]], size: 170, from: 1.2 },
          { kind: "bubble", at: [600, 470], text: "摆龙门阵！", sub: "坐下来聊家常", from: 2 },
          { kind: "text", at: [600, 110], text: "老词要靠猜", from: 5 }
        ]
      }
    ]
  },
  {
    question: "chinatown",
    scenes: [
      {
        turn: 0, title: "旧金山的唐人街", duration: 10,
        cues: [
          { kind: "sprite", icon: "🏮", path: [[200, 200]], size: 110, wobble: true, from: 0.3 },
          { kind: "sprite", icon: "🏮", path: [[1000, 200]], size: 110, wobble: true, from: 0.5 },
          { kind: "shape", shape: "rect", at: [600, 200], size: [420, 150], color: "#ffd9a8", from: 0.8 },
          { kind: "word", text: "唐人街", at: [600, 200], size: 100, color: "#e5483b", from: 1 },
          { kind: "sprite", icon: "👴", path: [[320, 620]], size: 180, from: 2 },
          { kind: "bubble", at: [320, 510], text: "食咗饭未？", sub: "吃了饭没有？", size: "s", from: 2.8 },
          { kind: "sprite", icon: "👴", path: [[880, 620]], size: 180, from: 4 },
          { kind: "text", at: [600, 840], text: "说的是粤语、台山话", from: 6 }
        ]
      },
      {
        turn: 1, title: "坐船去美国", duration: 10,
        cues: [
          { kind: "text", at: [180, 300], text: "广东", from: 0.3 },
          { kind: "text", at: [1020, 300], text: "美国", from: 0.6 },
          { kind: "arrow", path: [[260, 400], [940, 400]], text: "一百多年前", draw: 2, from: 1 },
          { kind: "sprite", icon: "🚢", path: [[200, 560], [1000, 560]], size: 150, travel: 4, from: 1.5 },
          { kind: "text", at: [600, 830], text: "去做工、开店", from: 6 }
        ]
      },
      {
        turn: 1, title: "一个带一个", duration: 10,
        cues: [
          { kind: "sprite", icon: "🏠", path: [[200, 480]], size: 170, from: 0.3 },
          { kind: "sprite", icon: "🏙️", path: [[1000, 480]], size: 170, from: 0.6 },
          { kind: "flow", path: [[300, 480], [900, 480]], icon: "🧑", count: 6, speed: 150, size: 14, from: 1.5 },
          { kind: "meter", at: [600, 760], label: "同乡越聚越多", start: 0.1, end: 0.9, color: "#2fae6a", over: 4, from: 2.5 }
        ]
      },
      {
        turn: 2, title: "下南洋", view: "map", duration: 12,
        camera: [{ t: 0, at: [700, 680], zoom: 1.5 }],
        cues: [
          { kind: "pin", at: places.guangzhou, text: "广东", side: "left", from: 0.3 },
          { kind: "pin", at: places.xiamen, text: "福建", side: "right", from: 0.8 },
          { kind: "pin", at: places.shantou, text: "潮汕", side: "top", from: 1.3 },
          { kind: "arrow", path: [[627, 790], [520, 885]], text: "粤语", color: "#e5483b", draw: 1, from: 2.5 },
          { kind: "arrow", path: [[728, 780], [700, 885]], text: "潮州话", color: "#13a99a", draw: 1, from: 3.5 },
          { kind: "arrow", path: [[770, 745], [900, 870]], text: "闽南话", color: "#13a99a", draw: 1, from: 4.5 },
          { kind: "text", at: [600, 110], text: "往南：南洋", from: 6 }
        ]
      },
      {
        turn: 3, title: "南洋的华人街", duration: 12,
        cues: [
          { kind: "sprite", icon: "👨", path: [[165, 710]], size: 130, from: 0.3 },
          { kind: "bubble", at: [165, 625], text: "食饱未？", sub: "闽南话", size: "s", from: 0.8 },
          { kind: "sprite", icon: "👩", path: [[455, 460]], size: 130, from: 2.2 },
          { kind: "bubble", at: [455, 375], text: "食未？", sub: "潮州话", size: "s", from: 2.7 },
          { kind: "sprite", icon: "🧓", path: [[745, 710]], size: 130, from: 4.1 },
          { kind: "bubble", at: [745, 625], text: "食咗饭未？", sub: "粤语", size: "s", from: 4.6 },
          { kind: "sprite", icon: "👵", path: [[1035, 460]], size: 130, from: 6 },
          { kind: "bubble", at: [1035, 375], text: "食朝未？", sub: "客家话", size: "s", from: 6.5 }
        ]
      },
      {
        turn: 4, title: "新加坡的华语", duration: 9,
        cues: [
          { kind: "sprite", icon: "🏫", path: [[600, 420]], size: 230, from: 0.3 },
          { kind: "bubble", at: [600, 300], text: "说华语！", sub: "华语 = 普通话", from: 1.5 },
          { kind: "text", at: [600, 830], text: "谁的同乡多，就学谁的话", from: 4.5 }
        ]
      },
      {
        turn: 5, title: "方言像行李", duration: 9,
        cues: [
          { kind: "sprite", icon: "🌏", path: [[600, 450]], size: 300, from: 0.3 },
          { kind: "sprite", icon: "🧳", path: [[150, 760], [1050, 760]], size: 110, travel: 4, from: 1 },
          { kind: "text", at: [600, 110], text: "方言像行李，跟着人走", from: 3.5 }
        ]
      }
    ]
  },
  {
    question: "jin-yu",
    scenes: [
      {
        turn: 0, title: "山西的晋语", view: "map", duration: 11,
        camera: [{ t: 0, at: [640, 350], zoom: 1.7 }],
        cues: [
          { kind: "highlight", at: [590, 340], size: [300, 280], color: familyColor.jin, from: 0.3 },
          { kind: "pin", at: places.taiyuan, text: "太原", side: "right", color: familyColor.jin, from: 1 },
          { kind: "bubble", at: [places.taiyuan[0], places.taiyuan[1] - 32], text: "阳婆", sub: "太阳", side: "top", size: "s", from: 2.5 },
          { kind: "bubble", at: [places.taiyuan[0] - 18, places.taiyuan[1] + 12], text: "甚", sub: "什么", side: "bottom", size: "s", from: 4 },
          { kind: "pin", at: places.beijing, text: "北京", side: "right", color: familyColor.mandarin, from: 5.5 },
          { kind: "text", at: [600, 840], text: "晋语：北京话的邻居", from: 7 }
        ]
      },
      {
        turn: 1, title: "还留着入声", duration: 12,
        cues: [
          { kind: "word", text: "北京话", at: [360, 230], size: 90, from: 0.5 },
          { kind: "shape", shape: "pill", at: [360, 420], size: [440, 90], color: "#ffe2c4", text: "读得长", from: 1.2 },
          { kind: "word", text: "太原话", at: [880, 230], size: 90, color: familyColor.jin, from: 3 },
          { kind: "shape", shape: "pill", at: [880, 420], size: [130, 90], color: "#f3d3a8", text: "短", from: 3.8 },
          { kind: "pulse", at: [880, 420], color: familyColor.jin, radius: 90, from: 4.3 },
          { kind: "text", at: [600, 800], text: "入声：一出口就收住", from: 6 }
        ]
      },
      {
        turn: 2, title: "分不分出来", duration: 11,
        cues: [
          { kind: "word", text: "晋语", at: [300, 330], size: 150, caption: "李荣：单独一区", color: familyColor.jin, from: 0.5 },
          { kind: "word", text: "官话", at: [900, 330], size: 150, caption: "有人说：官话一支", color: familyColor.mandarin, from: 3 },
          { kind: "sprite", icon: "🤔", path: [[600, 640]], size: 130, wobble: true, from: 5 },
          { kind: "text", at: [600, 830], text: "专家们还在讨论", from: 6 }
        ]
      },
      {
        turn: 3, title: "像和不像", duration: 11,
        cues: [
          { kind: "word", text: "吃饭", at: [250, 280], size: 110, caption: "一样", from: 0.5 },
          { kind: "word", text: "睡觉", at: [600, 280], size: 110, caption: "一样", from: 1.2 },
          { kind: "word", text: "回家", at: [950, 280], size: 110, caption: "一样", from: 1.9 },
          { kind: "word", text: "耍", at: [400, 590], size: 150, caption: "玩", color: familyColor.jin, from: 4 },
          { kind: "word", text: "月明", at: [800, 590], size: 130, caption: "月亮", color: familyColor.jin, from: 5.5 }
        ]
      },
      {
        turn: 4, title: "竖起耳朵听", view: "map", duration: 10,
        camera: [{ t: 0, at: [620, 380], zoom: 1.4 }],
        cues: [
          { kind: "highlight", at: [590, 340], size: [320, 300], color: familyColor.jin, from: 0.3 },
          { kind: "count", at: [600, 110], label: "说晋语的人", start: 0, end: 4570, unit: "万", over: 3, from: 0.5 },
          { kind: "sprite", icon: "👂", path: [places.taiyuan], size: 90, wobble: true, from: 4 },
          { kind: "text", at: [600, 840], text: "找一找一下收住的字", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "hakka",
    scenes: [
      {
        turn: 0, title: "土楼里的客家人", duration: 10,
        cues: [
          { kind: "shape", shape: "circle", at: [600, 400], size: [380, 380], color: "#ecd3ae", from: 0.3 },
          { kind: "shape", shape: "circle", at: [600, 400], size: [200, 200], color: "#fff6e8", from: 0.6 },
          { kind: "label", at: [600, 220], text: "土楼", side: "top", from: 1.2 },
          { kind: "sprite", icon: "👨‍👩‍👧‍👦", path: [[600, 400]], size: 110, from: 2 },
          { kind: "text", at: [600, 820], text: "一座楼住好几十户", from: 4 }
        ]
      },
      {
        turn: 0, title: "三省挨着的山区", view: "map", duration: 11,
        camera: [{ t: 0, at: [600, 450], zoom: 1 }, { t: 2, at: [700, 690], zoom: 2 }],
        cues: [
          { kind: "highlight", at: [705, 705], size: [180, 130], color: familyColor.hakka, from: 2 },
          { kind: "pin", at: places.meizhou, text: "梅州", side: "bottom", color: familyColor.hakka, from: 2.6 },
          { kind: "pin", at: places.yongding, text: "永定", side: "right", color: familyColor.hakka, from: 3.8 },
          { kind: "pin", at: places.ganzhou, text: "赣南", side: "left", color: familyColor.hakka, from: 5 },
          { kind: "text", at: [600, 840], text: "广东、福建、江西挨着", from: 6.5 }
        ]
      },
      {
        turn: 1, title: "名字的来历", view: "map", duration: 11,
        cues: [
          { kind: "pin", at: places.luoyang, text: "北方", side: "top", from: 0.5 },
          { kind: "flow", path: [places.luoyang, places.wuhan, places.nanchang, places.meizhou], icon: "🧳", count: 5, speed: 140, size: 12, from: 1.5 },
          { kind: "pin", at: places.meizhou, text: "客家", side: "right", color: familyColor.hakka, from: 3.5 },
          { kind: "text", at: [600, 110], text: "一种说法：从北方搬来", from: 4.5 },
          { kind: "text", at: [600, 840], text: "也有人说：慢慢融合", from: 7 }
        ]
      },
      {
        turn: 2, title: "客家话的老说法", duration: 11,
        cues: [
          { kind: "word", text: "𠊎", at: [250, 320], size: 190, caption: "ngai 我", color: familyColor.hakka, from: 0.5 },
          { kind: "word", text: "食饭", at: [610, 320], size: 140, caption: "吃饭", from: 2.5 },
          { kind: "word", text: "日头", at: [960, 320], size: 140, caption: "太阳", from: 4 },
          { kind: "text", at: [600, 800], text: "古时候的说法还在", from: 5.5 }
        ]
      },
      {
        turn: 3, title: "转屋下", view: "map", duration: 11,
        camera: [{ t: 0, at: [600, 450], zoom: 1 }, { t: 2, at: [705, 735], zoom: 2.1 }],
        cues: [
          { kind: "bubble", at: places.meizhou, text: "转屋下", sub: "客家话：回家", side: "top", size: "s", from: 2.2 },
          { kind: "bubble", at: places.xiamen, text: "转厝", sub: "闽南话：回家", side: "bottom", size: "s", from: 4.2 },
          { kind: "bubble", at: places.guangzhou, text: "返屋企", sub: "广州话：回家", side: "left", size: "s", from: 6.2 },
          { kind: "text", at: [600, 110], text: "回家，各说各的", from: 7.5 }
        ]
      },
      {
        turn: 4, title: "一大家子", duration: 10,
        cues: [
          { kind: "shape", shape: "circle", at: [360, 420], size: [320, 320], color: "#ecd3ae", from: 0.3 },
          { kind: "label", at: [360, 260], text: "墙又厚又结实", side: "top", from: 1 },
          { kind: "sprite", icon: "👨‍👩‍👧‍👦", path: [[360, 420]], size: 100, from: 2 },
          { kind: "sprite", icon: "⛵", path: [[620, 440], [1060, 440]], size: 120, travel: 3, from: 4 },
          { kind: "text", at: [600, 820], text: "客家话跟着人走", from: 6 }
        ]
      }
    ]
  }
];
