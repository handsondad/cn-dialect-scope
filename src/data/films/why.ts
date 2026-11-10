import { places } from "../../lib/geo.ts";
import type { Film } from "./types.ts";

const red = "#e5483b";
const green = "#2fae6a";
const teal = "#13a99a";

export const films: readonly Film[] = [
  {
    question: "why-different",
    scenes: [
      {
        turn: 0, title: "外婆的一句话", duration: 9,
        cues: [
          { kind: "sprite", icon: "👵", path: [[300, 540]], size: 220, from: 0.3 },
          { kind: "bubble", at: [330, 420], text: "侬饭吃过了伐？", from: 1 },
          { kind: "sprite", icon: "🧒", path: [[900, 580]], size: 180, from: 2 },
          { kind: "sprite", icon: "❓", path: [[990, 400]], size: 110, wobble: true, from: 3 },
          { kind: "text", at: [600, 820], text: "意思是：你吃过饭了吗？", from: 5 },
          { kind: "text", at: [600, 110], text: "侬 = 你　伐 = 吗", size: "s", color: red, from: 6.5 }
        ]
      },
      {
        turn: 1, title: "传话游戏", duration: 11,
        cues: [
          { kind: "sprite", icon: "🧑", path: [[150, 580]], size: 120, from: 0.3 },
          { kind: "sprite", icon: "👧", path: [[375, 580]], size: 120, from: 0.6 },
          { kind: "sprite", icon: "👦", path: [[600, 580]], size: 120, from: 0.9 },
          { kind: "sprite", icon: "🧓", path: [[825, 580]], size: 120, from: 1.2 },
          { kind: "sprite", icon: "👩", path: [[1050, 580]], size: 120, from: 1.5 },
          { kind: "bubble", at: [150, 500], text: "吃饭了吗？", size: "s", from: 2, to: 5.5 },
          { kind: "arrow", path: [[220, 320], [980, 320]], text: "传呀传", draw: 3, from: 2.5 },
          { kind: "bubble", at: [1050, 500], text: "侬饭吃过伐？", size: "s", from: 6 },
          { kind: "text", at: [600, 820], text: "每人改一点点", from: 7.5 }
        ]
      },
      {
        turn: 1, title: "山和河隔开", view: "map", duration: 10,
        cues: [
          { kind: "pin", at: places.shanghai, text: "上海", from: 0.5 },
          { kind: "pin", at: places.guangzhou, text: "广州", side: "left", from: 1 },
          { kind: "pin", at: places.beijing, text: "北京", from: 1.5 },
          { kind: "pin", at: places.chengdu, text: "成都", side: "left", from: 2 },
          { kind: "label", at: [596, 553], text: "大河隔开南北", side: "top", from: 4 },
          { kind: "sprite", icon: "⛰️", path: [[500, 690]], size: 70, from: 5 },
          { kind: "sprite", icon: "⛰️", path: [[760, 670]], size: 70, from: 5.5 },
          { kind: "text", at: [600, 110], text: "分开住久了，越变越不同", from: 7 }
        ]
      },
      {
        turn: 2, title: "一棵大树", duration: 10,
        cues: [
          { kind: "sprite", icon: "🌳", path: [[600, 560]], size: 420, from: 0.3 },
          { kind: "label", at: [480, 440], text: "上海话", side: "left", from: 1.5 },
          { kind: "label", at: [720, 440], text: "广州话", side: "right", from: 2.2 },
          { kind: "label", at: [600, 380], text: "四川话", side: "top", from: 2.9 },
          { kind: "word", text: "饭", at: [170, 200], size: 150, caption: "字一样", from: 4.5 },
          { kind: "word", text: "吃", at: [1030, 200], size: 150, caption: "读音变了", from: 5.2 },
          { kind: "text", at: [600, 830], text: "写下来都是汉字", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "离得远和离得近", view: "map", duration: 11,
        cues: [
          { kind: "pin", at: places.beijing, text: "北京", side: "left", from: 0.3 },
          { kind: "pin", at: places.guangzhou, text: "广州", side: "left", from: 1 },
          { kind: "arrow", path: [[725, 295], [640, 735]], text: "听不懂", color: red, draw: 1.2, from: 2 },
          { kind: "pin", at: places.harbin, text: "哈尔滨", side: "left", from: 5 },
          { kind: "pin", at: places.chengdu, text: "成都", side: "left", from: 5.4 },
          { kind: "arrow", path: [[740, 255], [995, 115]], text: "听得懂", color: green, draw: 1, from: 6 },
          { kind: "arrow", path: [[705, 300], [380, 520]], color: green, draw: 1, from: 6.5 },
          { kind: "text", at: [600, 110], text: "官话：一大枝", color: "#f39c34", from: 8.5 }
        ]
      },
      {
        turn: 4, title: "京城里的官话", duration: 10,
        cues: [
          { kind: "sprite", icon: "🏯", path: [[600, 380]], size: 260, from: 0.3 },
          { kind: "sprite", icon: "🧑‍💼", path: [[100, 800], [400, 600]], size: 110, travel: 2, from: 1 },
          { kind: "sprite", icon: "🧑‍💼", path: [[1100, 800], [800, 600]], size: 110, travel: 2, from: 1.4 },
          { kind: "sprite", icon: "🧑‍💼", path: [[600, 900], [600, 660]], size: 110, travel: 2, from: 1.8 },
          { kind: "bubble", at: [800, 560], text: "听得懂！", size: "s", from: 4 },
          { kind: "text", at: [600, 110], text: "官员的共同话：官话", from: 6 }
        ]
      }
    ]
  },
  {
    question: "mountains",
    scenes: [
      {
        turn: 0, title: "福建的山", view: "map", duration: 10,
        camera: [{ t: 0, at: [600, 450], zoom: 1 }, { t: 2, at: [760, 660], zoom: 2.2 }],
        cues: [
          { kind: "pin", at: places.fuzhou, text: "福州", from: 2.5 },
          { kind: "pin", at: places.xiamen, text: "厦门", side: "left", from: 3 },
          { kind: "sprite", icon: "⛰️", path: [[745, 640]], size: 34, from: 3.6 },
          { kind: "sprite", icon: "⛰️", path: [[705, 690]], size: 34, from: 3.9 },
          { kind: "sprite", icon: "⛰️", path: [[770, 590]], size: 34, from: 4.2 },
          { kind: "sprite", icon: "⛰️", path: [[690, 625]], size: 34, from: 4.5 },
          { kind: "text", at: [600, 110], text: "八山一水一分田", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "顺着河坐船", duration: 11,
        cues: [
          { kind: "sprite", icon: "⛰️", path: [[600, 430]], size: 300, from: 0.3 },
          { kind: "line", path: [[150, 180], [250, 420], [290, 680], [360, 880]], color: "#4fa3e0", width: 22, draw: 1.2, from: 0.8 },
          { kind: "line", path: [[1050, 180], [950, 420], [910, 680], [840, 880]], color: "#4fa3e0", width: 22, draw: 1.2, from: 1.2 },
          { kind: "sprite", icon: "⛵", path: [[190, 300], [285, 680]], size: 80, travel: 3, from: 2 },
          { kind: "sprite", icon: "⛵", path: [[1010, 300], [915, 680]], size: 80, travel: 3, from: 2.5 },
          { kind: "text", at: [250, 820], text: "福州话", size: "s", from: 4 },
          { kind: "text", at: [950, 820], text: "厦门话", size: "s", from: 4.5 },
          { kind: "text", at: [600, 110], text: "山的两边，各说各的", from: 6 }
        ]
      },
      {
        turn: 2, title: "闽语一大家", view: "map", duration: 10,
        camera: [{ t: 0, at: [740, 650], zoom: 1.8 }],
        cues: [
          { kind: "highlight", at: [775, 690], size: [190, 190], color: teal, from: 0.3 },
          { kind: "pin", at: places.fuzhou, text: "福州", color: teal, from: 1 },
          { kind: "pin", at: places.xiamen, text: "厦门", side: "left", color: teal, from: 1.5 },
          { kind: "pin", at: places.shantou, text: "汕头", side: "left", color: teal, from: 2 },
          { kind: "text", at: [600, 110], text: "闽 = 福建", color: teal, from: 3 },
          { kind: "label", at: places.fuzhou, text: "闽东话", side: "right", from: 4.5 },
          { kind: "label", at: places.xiamen, text: "闽南话", side: "bottom", from: 5.5 }
        ]
      },
      {
        turn: 3, title: "东北大平原", view: "map", duration: 11,
        camera: [{ t: 0, at: [900, 260], zoom: 1.7 }],
        cues: [
          { kind: "pin", at: places.harbin, text: "哈尔滨", side: "left", from: 0.5 },
          { kind: "pin", at: places.shenyang, text: "沈阳", side: "left", from: 1 },
          { kind: "line", path: [places.harbin, places.shenyang], color: "#8b7a5c", width: 5, dashed: true, draw: 1.2, from: 1.5 },
          { kind: "pin", at: places.jinan, text: "济南", side: "left", from: 3.5 },
          { kind: "flow", path: [places.jinan, [855, 340], places.shenyang, places.harbin], icon: "🧳", count: 6, speed: 120, size: 12, from: 4 },
          { kind: "text", at: [600, 820], text: "一百多年前：闯关东", from: 4.5, to: 7.4 },
          { kind: "text", at: [600, 820], text: "一大片平地，说话差不多", from: 7.6 }
        ]
      },
      {
        turn: 4, title: "方言地图像山路图", duration: 10,
        cues: [
          { kind: "shape", shape: "rect", at: [320, 470], size: [480, 520], color: "#f6ead2", from: 0.3 },
          { kind: "shape", shape: "rect", at: [880, 470], size: [480, 520], color: "#e6f4e0", from: 0.3 },
          { kind: "sprite", icon: "⛰️", path: [[320, 430]], size: 200, from: 0.8 },
          { kind: "sprite", icon: "🛤️", path: [[880, 430]], size: 200, from: 1.2 },
          { kind: "text", at: [320, 640], text: "山多：方言分得碎", size: "s", from: 2.5 },
          { kind: "text", at: [880, 640], text: "路通：连成一大片", size: "s", from: 4 },
          { kind: "text", at: [600, 110], text: "方言地图≈山和路的地图", from: 6 }
        ]
      }
    ]
  },
  {
    question: "putonghua",
    scenes: [
      {
        turn: 0, title: "全国的共同话", view: "map", duration: 10,
        cues: [
          { kind: "pin", at: places.harbin, text: "哈尔滨", side: "left", from: 0.5 },
          { kind: "pin", at: places.guangzhou, text: "广州", side: "left", from: 1 },
          { kind: "pin", at: places.shanghai, text: "上海", from: 1.5 },
          { kind: "pin", at: places.chengdu, text: "成都", side: "left", from: 2 },
          { kind: "bubble", at: places.harbin, text: "你好！", side: "bottom", size: "s", from: 3 },
          { kind: "bubble", at: [places.guangzhou[0] + 50, places.guangzhou[1] - 60], text: "你好！", side: "right", size: "s", from: 3.6 },
          { kind: "text", at: [600, 830], text: "普通 = 普遍通用", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "定下一份方子", duration: 11,
        cues: [
          { kind: "text", at: [600, 110], text: "上世纪五十年代定下", from: 0.5 },
          { kind: "sprite", icon: "📜", path: [[600, 380]], size: 220, from: 0.8 },
          { kind: "shape", shape: "pill", at: [250, 650], size: [320, 96], color: "#ffe2c4", text: "读音：北京", from: 2 },
          { kind: "shape", shape: "pill", at: [600, 650], size: [320, 96], color: "#e2f6e9", text: "词语：北方", from: 3.5 },
          { kind: "shape", shape: "pill", at: [950, 650], size: [320, 96], color: "#e1efff", text: "语法：白话文", from: 5 },
          { kind: "text", at: [600, 820], text: "这就是普通话", color: red, from: 7 }
        ]
      },
      {
        turn: 2, title: "为什么是北京", view: "map", duration: 11,
        cues: [
          { kind: "pin", at: places.beijing, text: "北京", color: red, from: 0.5 },
          { kind: "sprite", icon: "🏯", path: [[620, 230]], size: 80, from: 1 },
          { kind: "text", at: [600, 110], text: "元、明、清的都城", from: 1.5 },
          { kind: "flow", path: [places.guangzhou, places.beijing], icon: "🧑", count: 4, speed: 160, size: 11, from: 2 },
          { kind: "flow", path: [places.shanghai, places.beijing], icon: "🧑", count: 4, speed: 160, size: 11, from: 2.4 },
          { kind: "flow", path: [places.chengdu, places.beijing], icon: "🧑", count: 4, speed: 160, size: 11, from: 2.8 },
          { kind: "highlight", at: [640, 340], size: [720, 440], color: "#f39c34", from: 6 },
          { kind: "text", at: [600, 830], text: "说北方话的人最多", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "北京土话不收", duration: 11,
        cues: [
          { kind: "word", text: "很", at: [300, 320], size: 170, caption: "普通话", from: 0.5 },
          { kind: "word", text: "倍儿", at: [860, 320], size: 160, caption: "北京土话", color: "#b4621a", from: 1.5 },
          { kind: "word", text: "傍晚", at: [300, 630], size: 130, caption: "普通话", from: 3.5 },
          { kind: "word", text: "晚半晌儿", at: [860, 630], size: 110, caption: "北京土话", color: "#b4621a", from: 4.5 },
          { kind: "text", at: [600, 110], text: "土话没收进普通话", from: 6.5 }
        ]
      },
      {
        turn: 4, title: "两把钥匙", duration: 10,
        cues: [
          { kind: "sprite", icon: "🔑", path: [[380, 400]], size: 200, from: 0.5 },
          { kind: "sprite", icon: "🗝️", path: [[820, 400]], size: 200, from: 1.5 },
          { kind: "text", at: [380, 620], text: "普通话：和全国聊天", size: "s", from: 2.5 },
          { kind: "text", at: [820, 620], text: "方言：和家人更亲", size: "s", from: 3.5 },
          { kind: "myth", wrong: "学普通话就要丢掉方言", right: "两种话都能说得好", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "disappear",
    scenes: [
      {
        turn: 0, title: "听得懂，说不出", duration: 10,
        cues: [
          { kind: "sprite", icon: "👴", path: [[260, 540]], size: 200, from: 0.3 },
          { kind: "bubble", at: [280, 430], text: "侬好！", sub: "上海话", from: 1 },
          { kind: "sprite", icon: "🧒", path: [[900, 560]], size: 180, from: 2 },
          { kind: "sprite", icon: "👂", path: [[760, 420]], size: 90, wobble: true, from: 3.5 },
          { kind: "bubble", at: [900, 450], text: "你好！", sub: "普通话", size: "s", from: 5 },
          { kind: "text", at: [600, 820], text: "听得懂，说不出", from: 6.5 }
        ]
      },
      {
        turn: 1, title: "一代传一代", duration: 11,
        cues: [
          { kind: "sprite", icon: "👵", path: [[200, 470]], size: 150, from: 0.3 },
          { kind: "arrow", path: [[250, 300], [950, 300]], text: "一代传一代", draw: 2.5, from: 1 },
          { kind: "sprite", icon: "👩", path: [[460, 470]], size: 150, from: 1.3 },
          { kind: "sprite", icon: "🧒", path: [[720, 470]], size: 150, from: 2.3 },
          { kind: "sprite", icon: "👶", path: [[980, 470]], size: 150, from: 3.3 },
          { kind: "meter", at: [600, 780], label: "会说的人", start: 1, end: 0.2, over: 4, color: red, from: 5 }
        ]
      },
      {
        turn: 2, title: "把方言录下来", duration: 10,
        cues: [
          { kind: "sprite", icon: "👵", path: [[300, 480]], size: 200, from: 0.3 },
          { kind: "sprite", icon: "🎙️", path: [[510, 460]], size: 120, from: 1 },
          { kind: "pulse", at: [510, 460], radius: 120, color: "#ff9f43", from: 1.5 },
          { kind: "flow", path: [[570, 460], [860, 460]], icon: "🎵", count: 5, speed: 160, size: 14, from: 2.5 },
          { kind: "sprite", icon: "💾", path: [[940, 460]], size: 140, from: 3 },
          { kind: "text", at: [600, 110], text: "2015 年：语言资源保护", from: 4.5 },
          { kind: "text", at: [600, 800], text: "字、词、故事、歌谣", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "照片和活的话", duration: 11,
        cues: [
          { kind: "sprite", icon: "📷", path: [[330, 420]], size: 200, from: 0.3 },
          { kind: "text", at: [330, 650], text: "录音：留住声音", size: "s", from: 1.5 },
          { kind: "text", at: [600, 110], text: "网上就能听", from: 2.5 },
          { kind: "sprite", icon: "🗣️", path: [[870, 420]], size: 200, from: 4 },
          { kind: "text", at: [870, 650], text: "天天说：话才活着", size: "s", from: 5 }
        ]
      },
      {
        turn: 4, title: "存下一颗种子", duration: 10,
        cues: [
          { kind: "sprite", icon: "📒", path: [[280, 450]], size: 180, from: 0.3 },
          { kind: "word", text: "侬好", at: [720, 380], size: 150, caption: "上海话：你好", from: 1.5 },
          { kind: "sprite", icon: "🌱", path: [[720, 680]], size: 120, from: 4 },
          { kind: "text", at: [600, 110], text: "学会一句，存一颗种子", from: 5.5 }
        ]
      }
    ]
  }
];
