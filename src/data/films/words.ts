import { places } from "../../lib/geo.ts";
import type { Film } from "./types.ts";

const red = "#e5483b";
const brown = "#b4621a";

export const films: readonly Film[] = [
  {
    question: "mei-you",
    scenes: [
      {
        turn: 0, title: "有字空了心", duration: 10,
        cues: [
          { kind: "word", text: "有", at: [280, 380], size: 260, caption: "有", from: 0.5 },
          { kind: "arrow", path: [[460, 380], [740, 380]], text: "拿掉两横", color: red, draw: 1, from: 2 },
          { kind: "word", text: "冇", at: [920, 380], size: 260, caption: "里面空了", color: red, from: 3.2 },
          { kind: "sprite", icon: "🧋", path: [[150, 760]], size: 110, from: 4.5 },
          { kind: "text", at: [600, 780], text: "冇 = 没有", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "冇和无", view: "map", duration: 10,
        cues: [
          { kind: "pin", at: places.guangzhou, text: "广州", side: "left", from: 0.3 },
          { kind: "bubble", at: places.guangzhou, text: "冇", sub: "mou5", size: "s", from: 1 },
          { kind: "pin", at: places.xiamen, text: "厦门", side: "bottom", from: 3 },
          { kind: "bubble", at: places.xiamen, text: "无", sub: "bô", side: "right", size: "s", from: 3.7 },
          { kind: "text", at: [600, 110], text: "都是「没有」", from: 6 }
        ]
      },
      {
        turn: 2, title: "各地的没有", view: "map", duration: 12,
        cues: [
          { kind: "bubble", at: places.beijing, text: "没有", size: "s", from: 0.5 },
          { kind: "bubble", at: places.shanghai, text: "呒没", side: "right", size: "s", from: 1.5 },
          { kind: "bubble", at: places.chengdu, text: "没得", size: "s", from: 2.5 },
          { kind: "bubble", at: places.changsha, text: "冇得", size: "s", from: 3.5 },
          { kind: "bubble", at: places.guangzhou, text: "冇", side: "left", size: "s", from: 4.5 },
          { kind: "bubble", at: places.xiamen, text: "无", side: "right", size: "s", from: 5.5 },
          { kind: "text", at: [600, 840], text: "同一个意思，六种说法", from: 7 }
        ]
      },
      {
        turn: 3, title: "开头都是 m", duration: 10,
        cues: [
          { kind: "word", text: "冇", at: [160, 280], size: 120, caption: "mou", from: 0.5 },
          { kind: "word", text: "没得", at: [440, 280], size: 105, caption: "méi de", from: 1.2 },
          { kind: "word", text: "冇得", at: [750, 280], size: 105, caption: "mao de", from: 1.9 },
          { kind: "word", text: "呒没", at: [1050, 280], size: 105, caption: "m 开头", from: 2.6 },
          { kind: "shape", shape: "circle", at: [600, 620], size: [200, 200], color: "#ffe2c4", text: "m", motion: "pulse", from: 4 },
          { kind: "text", at: [600, 840], text: "都从「无」「没」变来", from: 5.5 }
        ]
      },
      {
        turn: 4, title: "m 变成了 b", duration: 10,
        cues: [
          { kind: "word", text: "米", at: [280, 350], size: 180, caption: "bí", from: 0.5 },
          { kind: "word", text: "马", at: [600, 350], size: 180, caption: "bé", from: 1.7 },
          { kind: "word", text: "无", at: [920, 350], size: 180, caption: "bô", color: red, from: 2.9 },
          { kind: "sprite", icon: "👄", path: [[600, 690]], size: 130, wobble: true, from: 4.5 },
          { kind: "text", at: [600, 110], text: "闽南话：m 变成 b", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "wai-po",
    scenes: [
      {
        turn: 0, title: "姥姥还是外婆", duration: 10,
        cues: [
          { kind: "sprite", icon: "👵", path: [[600, 380]], size: 240, from: 0.3 },
          { kind: "sprite", icon: "🧒", path: [[220, 640]], size: 150, from: 1 },
          { kind: "bubble", at: [220, 560], text: "姥姥！", sub: "北京", size: "s", from: 1.6 },
          { kind: "sprite", icon: "👦", path: [[980, 640]], size: 150, from: 3 },
          { kind: "bubble", at: [980, 560], text: "外婆！", sub: "上海", size: "s", from: 3.6 },
          { kind: "text", at: [600, 840], text: "两个都叫对了", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "一个外婆，六个名字", view: "map", duration: 12,
        cues: [
          { kind: "bubble", at: places.beijing, text: "姥姥", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.shanghai, text: "外婆", side: "right", size: "s", from: 1.5 },
          { kind: "bubble", at: places.chengdu, text: "家婆", size: "s", from: 2.5 },
          { kind: "bubble", at: places.guangzhou, text: "婆婆", side: "left", size: "s", from: 3.5 },
          { kind: "bubble", at: places.meizhou, text: "姐婆", side: "bottom", size: "s", from: 4.5 },
          { kind: "bubble", at: places.xiamen, text: "外妈", side: "right", size: "s", from: 5.5 },
          { kind: "text", at: [600, 110], text: "都是妈妈的妈妈", from: 7 }
        ]
      },
      {
        turn: 2, title: "外家", duration: 11,
        cues: [
          { kind: "sprite", icon: "🏠", path: [[260, 400]], size: 200, from: 0.3 },
          { kind: "label", at: [260, 400], text: "外家", side: "top", color: red, from: 1 },
          { kind: "sprite", icon: "🏡", path: [[940, 400]], size: 200, from: 1.5 },
          { kind: "sprite", icon: "👩", path: [[360, 470], [840, 470]], size: 100, travel: 3, from: 2.5 },
          { kind: "word", text: "外婆", at: [300, 720], size: 100, from: 6 },
          { kind: "word", text: "外公", at: [600, 720], size: 100, from: 6.6 },
          { kind: "word", text: "外孙", at: [900, 720], size: 100, from: 7.2 }
        ]
      },
      {
        turn: 3, title: "姥 = 女 + 老", duration: 10,
        cues: [
          { kind: "word", text: "女", at: [200, 380], size: 180, from: 0.5 },
          { kind: "word", text: "老", at: [480, 380], size: 180, from: 1.5 },
          { kind: "arrow", path: [[600, 380], [800, 380]], text: "合起来", draw: 0.8, from: 2.5 },
          { kind: "word", text: "姥", at: [980, 380], size: 220, caption: "年纪大的女人", color: red, from: 3.3 },
          { kind: "text", at: [600, 780], text: "叠起来：姥姥", from: 5.5 }
        ]
      },
      {
        turn: 4, title: "叠起来叫", duration: 10,
        cues: [
          { kind: "word", text: "爸爸", at: [250, 260], size: 110, from: 0.5 },
          { kind: "word", text: "妈妈", at: [600, 260], size: 110, from: 1 },
          { kind: "word", text: "爷爷", at: [950, 260], size: 110, from: 1.5 },
          { kind: "word", text: "哥哥", at: [250, 480], size: 110, from: 2 },
          { kind: "word", text: "姐姐", at: [950, 480], size: 110, from: 2.5 },
          { kind: "sprite", icon: "👶", path: [[600, 560]], size: 150, wobble: true, from: 3.5 },
          { kind: "text", at: [600, 830], text: "一个音说两遍", from: 5 }
        ]
      }
    ]
  },
  {
    question: "zou-pao",
    scenes: [
      {
        turn: 0, title: "兔走触株", duration: 11,
        cues: [
          { kind: "sprite", icon: "🪵", path: [[880, 600]], size: 150, from: 0.3 },
          { kind: "sprite", icon: "🐇", path: [[100, 620], [800, 600]], size: 120, travel: 2.5, from: 1 },
          { kind: "sprite", icon: "💥", path: [[830, 520]], size: 110, from: 3.6 },
          { kind: "text", at: [600, 110], text: "兔走触株", from: 4.5 },
          { kind: "text", at: [600, 830], text: "走 = 跑！", color: red, from: 6 }
        ]
      },
      {
        turn: 0, title: "古时候的行和走", duration: 10,
        cues: [
          { kind: "word", text: "行", at: [320, 300], size: 190, caption: "慢慢走路", from: 0.5 },
          { kind: "sprite", icon: "🚶", path: [[320, 620]], size: 150, from: 1.2 },
          { kind: "word", text: "走", at: [880, 300], size: 190, caption: "快快地跑", color: red, from: 3 },
          { kind: "sprite", icon: "🏃", path: [[880, 620]], size: 150, wobble: true, from: 3.7 },
          { kind: "text", at: [600, 830], text: "古书里的意思", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "走慢下来了", duration: 10,
        cues: [
          { kind: "word", text: "走", at: [230, 300], size: 170, caption: "古：跑", color: red, from: 0.5 },
          { kind: "arrow", path: [[370, 300], [770, 300]], text: "慢慢变了", draw: 1.2, from: 1.8 },
          { kind: "word", text: "走", at: [920, 300], size: 170, caption: "今：走路", from: 3.2 },
          { kind: "word", text: "跑", at: [600, 620], size: 160, caption: "新来的：跑步", color: brown, from: 5 }
        ]
      },
      {
        turn: 2, title: "南方还说行", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.beijing, text: "走路", sub: "普通话", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.guangzhou, text: "行路", sub: "广州话", side: "left", size: "s", from: 2 },
          { kind: "bubble", at: places.meizhou, text: "行", sub: "客家话", side: "bottom", size: "s", from: 3.5 },
          { kind: "bubble", at: places.xiamen, text: "行", sub: "闽南话", side: "right", size: "s", from: 5 },
          { kind: "text", at: [600, 110], text: "南方：行 = 走路", from: 7 }
        ]
      },
      {
        turn: 3, title: "会说话的活化石", duration: 10,
        cues: [
          { kind: "sprite", icon: "📜", path: [[300, 430]], size: 200, from: 0.3 },
          { kind: "label", at: [300, 430], text: "走 = 跑", side: "top", from: 1 },
          { kind: "arrow", path: [[440, 430], [760, 430]], draw: 1, from: 2 },
          { kind: "sprite", icon: "🗣️", path: [[900, 430]], size: 200, from: 3 },
          { kind: "label", at: [900, 430], text: "走先 = 先走了", side: "top", from: 3.7 },
          { kind: "text", at: [600, 800], text: "古书的意思活在方言里", from: 5.5 }
        ]
      },
      {
        turn: 4, title: "藏在方言里的古话", duration: 10,
        cues: [
          { kind: "word", text: "跑", at: [250, 350], size: 170, caption: "上海：走路", from: 0.5 },
          { kind: "word", text: "奔", at: [600, 350], size: 170, caption: "上海：跑", from: 2 },
          { kind: "word", text: "食", at: [950, 350], size: 170, caption: "广州：吃", from: 3.5 },
          { kind: "text", at: [600, 780], text: "问问说方言的老人", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "tai-yang",
    scenes: [
      {
        turn: 0, title: "日头就是太阳", duration: 10,
        cues: [
          { kind: "sprite", icon: "☀️", path: [[600, 330]], size: 200, wobble: true, from: 0.3 },
          { kind: "word", text: "日", at: [230, 360], size: 200, caption: "古时候", from: 1.5 },
          { kind: "word", text: "日头", at: [950, 360], size: 150, caption: "客家话", color: brown, from: 3.5 },
          { kind: "text", at: [600, 800], text: "日头 = 太阳", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "太阳的名字", view: "map", duration: 12,
        cues: [
          { kind: "bubble", at: places.meizhou, text: "日头", side: "right", size: "s", from: 0.5 },
          { kind: "bubble", at: places.guangzhou, text: "热头", side: "left", size: "s", from: 1.8 },
          { kind: "bubble", at: places.taiyuan, text: "阳婆", side: "bottom", size: "s", from: 3.1 },
          { kind: "bubble", at: places.beijing, text: "老爷儿", side: "left", size: "s", from: 4.4 },
          { kind: "bubble", at: places.jinan, text: "老爷爷儿", side: "right", size: "s", from: 5.7 },
          { kind: "text", at: [600, 110], text: "一个太阳，好多名字", from: 7.5 }
        ]
      },
      {
        turn: 2, title: "亲热的外号", view: "map", duration: 10,
        cues: [
          { kind: "bubble", at: places.taiyuan, text: "阳婆", side: "top", size: "s", from: 0.5 },
          { kind: "bubble", at: places.xian, text: "日头爷", side: "left", size: "s", from: 2 },
          { kind: "bubble", at: places.xiamen, text: "日头公", side: "right", size: "s", from: 3.5 },
          { kind: "sprite", icon: "🌞", path: [[1060, 150]], size: 120, wobble: true, from: 5 },
          { kind: "text", at: [600, 840], text: "像给好朋友起外号", from: 6 }
        ]
      },
      {
        turn: 3, title: "月亮的名字", view: "map", duration: 12,
        cues: [
          { kind: "sprite", icon: "🌙", path: [[1060, 150]], size: 110, from: 0.3 },
          { kind: "bubble", at: places.guangzhou, text: "月光", side: "left", size: "s", from: 1 },
          { kind: "bubble", at: places.nanchang, text: "月光", side: "top", size: "s", from: 2.2 },
          { kind: "bubble", at: places.wenzhou, text: "月光", side: "right", size: "s", from: 3.4 },
          { kind: "bubble", at: places.xiamen, text: "月娘", side: "right", size: "s", from: 4.6 },
          { kind: "bubble", at: places.taiyuan, text: "月明", side: "left", size: "s", from: 5.8 },
          { kind: "text", at: [600, 110], text: "古时候就叫「月」", from: 7.5 }
        ]
      },
      {
        turn: 4, title: "添一个字", duration: 11,
        cues: [
          { kind: "word", text: "日", at: [190, 290], size: 160, caption: "古", from: 0.5 },
          { kind: "word", text: "日头", at: [560, 290], size: 120, from: 1.5 },
          { kind: "word", text: "太阳", at: [930, 290], size: 120, from: 2.5 },
          { kind: "word", text: "月", at: [190, 580], size: 160, caption: "古", from: 4 },
          { kind: "word", text: "月亮", at: [560, 580], size: 120, from: 5 },
          { kind: "word", text: "月光", at: [930, 580], size: 120, from: 6 },
          { kind: "text", at: [600, 830], text: "一个字变成两个字", from: 7.5 }
        ]
      }
    ]
  },
  {
    question: "kuai-zi",
    scenes: [
      {
        turn: 0, title: "古老的箸", duration: 10,
        cues: [
          { kind: "word", text: "箸", at: [600, 300], size: 240, caption: "tī", color: brown, from: 0.5 },
          { kind: "sprite", icon: "🥢", path: [[600, 600]], size: 160, from: 2 },
          { kind: "text", at: [600, 820], text: "两千多年前就有", from: 4.5 }
        ]
      },
      {
        turn: 0, title: "还叫箸的地方", view: "map", duration: 11,
        camera: [{ t: 0, at: [600, 450], zoom: 1 }, { t: 2, at: [780, 670], zoom: 1.8 }],
        cues: [
          { kind: "bubble", at: places.xiamen, text: "箸", sub: "闽南话", side: "right", size: "s", from: 2.2 },
          { kind: "bubble", at: places.shantou, text: "箸", sub: "潮汕话", side: "bottom", size: "s", from: 3.4 },
          { kind: "bubble", at: places.meizhou, text: "箸", sub: "客家话", side: "left", size: "s", from: 4.6 },
          { kind: "bubble", at: places.wenzhou, text: "箸", sub: "温州话", side: "right", size: "s", from: 5.8 },
          { kind: "text", at: [600, 110], text: "这些地方还说箸", from: 7 }
        ]
      },
      {
        turn: 1, title: "船家怕说住", duration: 12,
        cues: [
          { kind: "sprite", icon: "⛵", path: [[140, 620], [700, 620]], size: 150, travel: 3, from: 0.3 },
          { kind: "word", text: "箸", at: [260, 290], size: 170, caption: "zhù", from: 1 },
          { kind: "word", text: "住", at: [600, 290], size: 170, caption: "停住", color: red, from: 2.5 },
          { kind: "sprite", icon: "😟", path: [[860, 600]], size: 110, from: 4 },
          { kind: "word", text: "快儿", at: [950, 290], size: 140, caption: "快快走", color: brown, from: 5.5 },
          { kind: "text", at: [600, 830], text: "反过来叫「快儿」", from: 7 }
        ]
      },
      {
        turn: 2, title: "快加竹字头", duration: 10,
        cues: [
          { kind: "word", text: "快", at: [220, 350], size: 180, from: 0.5 },
          { kind: "word", text: "竹", at: [520, 350], size: 140, caption: "竹字头", color: brown, from: 1.5 },
          { kind: "arrow", path: [[640, 350], [790, 350]], draw: 0.8, from: 2.5 },
          { kind: "word", text: "筷", at: [960, 350], size: 220, color: red, from: 3.3 },
          { kind: "text", at: [600, 800], text: "一种说法，还在研究", from: 5.5 }
        ]
      },
      {
        turn: 3, title: "梜、箸、筷", duration: 10,
        cues: [
          { kind: "word", text: "梜", at: [250, 330], size: 180, caption: "木字旁", from: 0.5 },
          { kind: "word", text: "箸", at: [600, 330], size: 180, caption: "竹字头", from: 2 },
          { kind: "word", text: "筷", at: [950, 330], size: 180, caption: "竹字头", from: 3.5 },
          { kind: "sprite", icon: "🥢", path: [[600, 650]], size: 130, from: 5 },
          { kind: "text", at: [600, 830], text: "名字换了好几回", from: 6 }
        ]
      },
      {
        turn: 4, title: "老名字留下来", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.suzhou, text: "快儿", side: "right", size: "s", from: 0.5 },
          { kind: "flow", path: [places.suzhou, places.nanjing, places.jinan, places.beijing], icon: "🥢", count: 5, speed: 140, size: 12, from: 1.5 },
          { kind: "flow", path: [places.suzhou, places.wuhan, places.chengdu], icon: "🥢", count: 5, speed: 140, size: 12, from: 2.5 },
          { kind: "bubble", at: places.xiamen, text: "箸", side: "right", size: "s", from: 4.5 },
          { kind: "bubble", at: places.meizhou, text: "箸", side: "left", size: "s", from: 5.5 },
          { kind: "text", at: [600, 110], text: "远处还留着老名字", from: 7 }
        ]
      }
    ]
  },
  {
    question: "jin-zhao",
    scenes: [
      {
        turn: 0, title: "今朝 = 今天", duration: 10,
        cues: [
          { kind: "word", text: "今朝", at: [320, 310], size: 150, caption: "上海话", color: brown, from: 0.5 },
          { kind: "arrow", path: [[520, 310], [680, 310]], draw: 0.8, from: 1.8 },
          { kind: "word", text: "今天", at: [880, 310], size: 150, caption: "普通话", from: 2.6 },
          { kind: "sprite", icon: "🌅", path: [[300, 620]], size: 110, from: 4 },
          { kind: "sprite", icon: "☀️", path: [[600, 620]], size: 110, from: 4.5 },
          { kind: "sprite", icon: "🌙", path: [[900, 620]], size: 110, from: 5 },
          { kind: "text", at: [600, 820], text: "一整天都算", from: 6 }
        ]
      },
      {
        turn: 1, title: "朝是早上", duration: 11,
        cues: [
          { kind: "sprite", icon: "🌅", path: [[240, 300]], size: 160, from: 0.3 },
          { kind: "word", text: "朝", at: [640, 300], size: 220, caption: "zhāo 早上", color: red, from: 1 },
          { kind: "text", at: [600, 640], text: "今朝有酒今朝醉", from: 4 },
          { kind: "text", at: [600, 760], text: "唐 · 罗隐", size: "s", from: 5.5 }
        ]
      },
      {
        turn: 2, title: "古诗的说法还在", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.guangzhou, text: "今日", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.nanchang, text: "今日", side: "top", size: "s", from: 2 },
          { kind: "bubble", at: places.changsha, text: "今朝", side: "bottom", size: "s", from: 3.5 },
          { kind: "bubble", at: places.shanghai, text: "今朝", side: "right", size: "s", from: 5 },
          { kind: "text", at: [600, 110], text: "今日、今朝都还在", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "明天怎么说", view: "map", duration: 12,
        cues: [
          { kind: "bubble", at: places.guangzhou, text: "听日", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.meizhou, text: "天光日", side: "bottom", size: "s", from: 2.5 },
          { kind: "bubble", at: places.xiamen, text: "明仔载", side: "right", size: "s", from: 4.5 },
          { kind: "bubble", at: places.beijing, text: "明儿", side: "left", size: "s", from: 6 },
          { kind: "bubble", at: places.shanghai, text: "明朝", side: "right", size: "s", from: 7.2 },
          { kind: "text", at: [600, 110], text: "一个明天，五种说法", from: 8.5 }
        ]
      },
      {
        turn: 4, title: "今天的花样", view: "map", duration: 10,
        cues: [
          { kind: "bubble", at: places.xiamen, text: "今仔日", side: "right", size: "s", from: 0.5 },
          { kind: "bubble", at: places.wenzhou, text: "该日", side: "right", size: "s", from: 2 },
          { kind: "bubble", at: places.beijing, text: "今儿", side: "left", size: "s", from: 3.5 },
          { kind: "text", at: [600, 840], text: "藏着今、日、朝", from: 5.5 }
        ]
      }
    ]
  }
];
