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
          { kind: "sprite", icon: "⛰️", path: [[470, 675]], size: 70, from: 5 },
          { kind: "sprite", icon: "⛰️", path: [[760, 670]], size: 70, from: 5.5 },
          { kind: "text", at: [600, 110], text: "分开住久了，越变越不同", from: 7 }
        ]
      },
      {
        turn: 2, title: "一棵大树", duration: 10,
        cues: [
          { kind: "sprite", icon: "🌳", path: [[600, 560]], size: 400, from: 0.3 },
          { kind: "label", at: [470, 480], text: "上海话", side: "left", from: 1.5 },
          { kind: "label", at: [730, 480], text: "广州话", side: "right", from: 2.2 },
          { kind: "label", at: [600, 390], text: "四川话", side: "top", from: 2.9 },
          { kind: "word", text: "饭", at: [170, 175], size: 140, caption: "字一样", from: 4.5 },
          { kind: "word", text: "吃", at: [1030, 175], size: 140, caption: "读音变了", from: 5.2 },
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
          { kind: "bubble", at: [930, 560], text: "听得懂！", side: "top", size: "s", from: 4 },
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
          { kind: "sprite", icon: "⛰️", path: [[695, 675]], size: 34, from: 3.9 },
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
          { kind: "pin", at: places.fuzhou, text: "福州", side: "left", color: teal, from: 1 },
          { kind: "pin", at: places.xiamen, text: "厦门", side: "left", color: teal, from: 1.5 },
          { kind: "pin", at: places.shantou, text: "汕头", side: "left", color: teal, from: 2 },
          { kind: "text", at: [600, 110], text: "闽 = 福建", color: teal, from: 3 },
          { kind: "label", at: places.fuzhou, text: "闽东话", side: "right", from: 4.5 },
          { kind: "label", at: places.xiamen, text: "闽南话", pos: [900, 745], from: 5.5 }
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
          { kind: "sprite", icon: "🔑", path: [[380, 310]], size: 180, from: 0.5 },
          { kind: "sprite", icon: "🗝️", path: [[820, 310]], size: 180, from: 1.5 },
          { kind: "text", at: [380, 510], text: "普通话：和全国聊天", size: "s", from: 2.5 },
          { kind: "text", at: [820, 510], text: "方言：和家人更亲", size: "s", from: 3.5 },
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
          { kind: "sprite", icon: "👂", path: [[640, 470]], size: 90, wobble: true, from: 3.5 },
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
  },
  {
    question: "wenzhou-hua",
    scenes: [
      {
        turn: 0, title: "群山和大海围着", view: "map", duration: 11,
        camera: [{ t: 0, at: [600, 450], zoom: 1 }, { t: 2, at: [835, 595], zoom: 2 }],
        cues: [
          { kind: "pin", at: places.shanghai, text: "上海", side: "right", color: "#3d9be9", from: 2.2 },
          { kind: "pin", at: places.wenzhou, text: "温州", side: "right", color: "#3d9be9", from: 3 },
          { kind: "sprite", icon: "⛰️", path: [[800, 595]], size: 34, from: 3.8 },
          { kind: "sprite", icon: "⛰️", path: [[810, 650]], size: 34, from: 4.1 },
          { kind: "sprite", icon: "⛰️", path: [[845, 570]], size: 34, from: 4.4 },
          { kind: "text", at: [600, 110], text: "三面大山，东边大海", from: 6 }
        ]
      },
      {
        turn: 1, title: "该日、走归、天光", duration: 11,
        cues: [
          { kind: "word", text: "该日", at: [230, 340], size: 135, caption: "今天", color: "#3d9be9", from: 0.5 },
          { kind: "word", text: "走归", at: [600, 340], size: 135, caption: "回家", color: "#3d9be9", from: 2.2 },
          { kind: "word", text: "天光", at: [970, 340], size: 135, caption: "早饭", color: "#b4621a", from: 4 },
          { kind: "sprite", icon: "🌅", path: [[970, 610]], size: 120, from: 5 },
          { kind: "text", at: [600, 820], text: "天一亮就吃的那顿饭", from: 6.5 }
        ]
      },
      {
        turn: 2, title: "吴语的老印记", duration: 11,
        cues: [
          { kind: "shape", shape: "pill", at: [250, 260], size: [260, 90], color: "#e1efff", text: "上海话", from: 0.5 },
          { kind: "shape", shape: "pill", at: [600, 260], size: [260, 90], color: "#e1efff", text: "苏州话", from: 1.2 },
          { kind: "shape", shape: "pill", at: [950, 260], size: [260, 90], color: "#e1efff", text: "温州话", from: 1.9 },
          { kind: "pulse", at: [600, 480], radius: 95, color: "#3d9be9", from: 3 },
          { kind: "word", text: "物事", at: [600, 650], size: 130, caption: "东西", color: "#3d9be9", from: 4.5 },
          { kind: "text", at: [600, 840], text: "嗓子嗡嗡响：都是吴语", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "两边都沾一点", view: "map", duration: 11,
        camera: [{ t: 0, at: [800, 640], zoom: 1.9 }],
        cues: [
          { kind: "bubble", at: places.shanghai, text: "物事", sub: "像北边吴语", side: "right", size: "s", color: "#3d9be9", from: 0.5 },
          { kind: "pin", at: places.wenzhou, text: "温州", side: "left", color: "#3d9be9", from: 2 },
          { kind: "bubble", at: places.wenzhou, text: "箸 · 徛", sub: "筷子 · 站", side: "right", size: "s", color: teal, from: 3 },
          { kind: "bubble", at: places.xiamen, text: "箸 · 徛", sub: "像南边闽语", side: "right", size: "s", color: teal, from: 4.8 },
          { kind: "text", at: [600, 110], text: "两省交界，两边都像一点", from: 6.5 }
        ]
      },
      {
        turn: 4, title: "不是密码是家乡话", duration: 10,
        cues: [
          { kind: "sprite", icon: "🧳", path: [[260, 390], [940, 390]], size: 140, travel: 3, from: 0.5 },
          { kind: "word", text: "温州话", at: [600, 220], size: 120, color: "#3d9be9", from: 1.5 },
          { kind: "myth", wrong: "温州话是故意编出来的暗号", right: "大山留住的古老吴语，亲切的家乡话", from: 4 }
        ]
      }
    ]
  },
  {
    question: "luo-yu",
    scenes: [
      {
        turn: 0, title: "北边下雨，南边落雨", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.beijing, text: "下雨", side: "right", size: "s", from: 0.5 },
          { kind: "bubble", at: places.taiyuan, text: "下雨", side: "left", size: "s", from: 1.4 },
          { kind: "bubble", at: places.shanghai, text: "落雨", side: "right", size: "s", color: "#3d9be9", from: 2.6 },
          { kind: "bubble", at: places.changsha, text: "落雨", side: "left", size: "s", color: "#e8578a", from: 3.6 },
          { kind: "bubble", at: places.guangzhou, text: "落雨", side: "left", size: "s", color: red, from: 4.6 },
          { kind: "bubble", at: places.xiamen, text: "落雨", side: "right", size: "s", color: teal, from: 5.6 },
          { kind: "text", at: [600, 110], text: "一条整齐的南北线", from: 7.2 }
        ]
      },
      {
        turn: 1, title: "花落和雨落", duration: 10,
        cues: [
          { kind: "flow", path: [[350, 120], [350, 720]], icon: "💧", count: 5, speed: 180, size: 12, from: 0.3 },
          { kind: "flow", path: [[850, 120], [850, 720]], icon: "💧", count: 5, speed: 180, size: 12, from: 0.6 },
          { kind: "word", text: "落雨", at: [350, 390], size: 145, caption: "古话·南方留着", color: "#3d9be9", from: 1.2 },
          { kind: "word", text: "下雨", at: [850, 390], size: 145, caption: "北方改口", color: "#f39c34", from: 3 },
          { kind: "text", at: [600, 820], text: "从天上掉下来，都说得通", from: 5.5 }
        ]
      },
      {
        turn: 2, title: "江边两种都说", view: "map", duration: 10,
        camera: [{ t: 0, at: [530, 540], zoom: 1.7 }],
        cues: [
          { kind: "pin", at: places.wuhan, text: "武汉", side: "right", from: 0.5 },
          { kind: "bubble", at: places.wuhan, text: "下雨 · 落雨", side: "top", size: "s", from: 1.5 },
          { kind: "pin", at: places.chengdu, text: "成都", side: "left", from: 3.2 },
          { kind: "bubble", at: places.chengdu, text: "落雨 · 下雨", side: "bottom", size: "s", from: 4.2 },
          { kind: "text", at: [600, 110], text: "交汇的地方，两种都能听见", from: 6 }
        ]
      },
      {
        turn: 3, title: "落水和荡雨", view: "map", duration: 10,
        camera: [{ t: 0, at: [755, 700], zoom: 2 }],
        cues: [
          { kind: "bubble", at: places.meizhou, text: "落水", sub: "客家话", side: "left", size: "s", color: green, from: 0.6 },
          { kind: "bubble", at: places.fuzhou, text: "荡雨", sub: "福州话", side: "top", size: "s", color: "#0e86b8", from: 2.6 },
          { kind: "bubble", at: places.xiamen, text: "落雨", sub: "闽南话", side: "right", size: "s", color: teal, from: 4.4 },
          { kind: "text", at: [600, 840], text: "雨本来就是天上的水！", from: 6 }
        ]
      },
      {
        turn: 4, title: "晚上的名字", view: "map", duration: 12,
        cues: [
          { kind: "bubble", at: places.harbin, text: "下黑儿", side: "bottom", size: "s", from: 0.5 },
          { kind: "bubble", at: places.xian, text: "黑咧", side: "left", size: "s", from: 1.8 },
          { kind: "bubble", at: places.shanghai, text: "夜里", side: "right", size: "s", color: "#3d9be9", from: 3.1 },
          { kind: "bubble", at: places.guangzhou, text: "晚黑", side: "left", size: "s", color: red, from: 4.4 },
          { kind: "bubble", at: places.xiamen, text: "暗暝", side: "right", size: "s", color: teal, from: 5.7 },
          { kind: "text", at: [600, 855], text: "天黑了，各地叫法也成片", from: 7.5 }
        ]
      }
    ]
  }
];
