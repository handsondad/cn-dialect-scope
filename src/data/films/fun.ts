import { places } from "../../lib/geo.ts";
import type { Film } from "./types.ts";

const red = "#e5483b";
const brown = "#b4621a";

export const films: readonly Film[] = [
  {
    question: "dongbei",
    scenes: [
      {
        turn: 0, title: "嘎哈呢？", duration: 10,
        cues: [
          { kind: "sprite", icon: "🧒", path: [[300, 600]], size: 200, from: 0.3 },
          { kind: "bubble", at: [300, 480], text: "你搁这儿嘎哈呢？", sub: "你在这儿干啥呢？", from: 1 },
          { kind: "sprite", icon: "👦", path: [[920, 600]], size: 200, from: 3 },
          { kind: "sprite", icon: "😂", path: [[1000, 420]], size: 100, wobble: true, from: 4 },
          { kind: "text", at: [600, 840], text: "搁 = 在，嘎哈 = 干啥", from: 5.5 }
        ]
      },
      {
        turn: 0, title: "干啥变嘎哈", duration: 9,
        cues: [
          { kind: "word", text: "干啥", at: [250, 380], size: 150, caption: "说快一点", from: 0.5 },
          { kind: "arrow", path: [[480, 380], [720, 380]], text: "一溜", color: red, draw: 0.6, from: 2 },
          { kind: "word", text: "嘎哈", at: [950, 380], size: 150, caption: "又响又脆", color: red, motion: "wiggle", from: 2.8 },
          { kind: "text", at: [600, 780], text: "两个字连在一起", from: 5 }
        ]
      },
      {
        turn: 1, title: "东北话百宝箱", duration: 12,
        cues: [
          { kind: "shape", shape: "pill", at: [320, 280], size: [380, 110], color: "#ffe2c4", text: "唠嗑=聊天", from: 0.5 },
          { kind: "shape", shape: "pill", at: [880, 280], size: [380, 110], color: "#e2f6e9", text: "老鼻子=很多", from: 2.5 },
          { kind: "shape", shape: "pill", at: [320, 560], size: [380, 110], color: "#e1efff", text: "埋汰=脏", from: 4.5 },
          { kind: "shape", shape: "pill", at: [880, 560], size: [380, 110], color: "#efe6ff", text: "整=弄", from: 6.5 },
          { kind: "text", at: [600, 820], text: "点一点，听东北人说", from: 8.5 }
        ]
      },
      {
        turn: 2, title: "万能的整", duration: 10,
        cues: [
          { kind: "word", text: "整", at: [600, 300], size: 220, caption: "万能钥匙", color: brown, from: 0.5 },
          { kind: "sprite", icon: "🍳", path: [[250, 620]], size: 120, from: 2 },
          { kind: "sprite", icon: "🔧", path: [[600, 640]], size: 120, from: 2.6 },
          { kind: "sprite", icon: "🍢", path: [[950, 620]], size: 120, from: 3.2 },
          { kind: "text", at: [600, 830], text: "整点烧烤 = 弄点烧烤", from: 4.5 }
        ]
      },
      {
        turn: 3, title: "又熟又新鲜", duration: 10,
        cues: [
          { kind: "meter", at: [600, 190], label: "能听懂", start: 0, end: 0.9, color: "#2fae6a", over: 2, from: 0.5 },
          { kind: "sprite", icon: "😄", path: [[600, 500]], size: 220, wobble: true, from: 3 },
          { kind: "bubble", at: [800, 430], text: "老鼻子多了！", side: "right", size: "s", from: 4.5 },
          { kind: "text", at: [600, 830], text: "听得懂，又冒出新鲜词", from: 6 }
        ]
      },
      {
        turn: 4, title: "东北大平原", view: "map", duration: 10,
        camera: [{ t: 0, at: [880, 280], zoom: 1.6 }],
        cues: [
          { kind: "pin", at: places.harbin, text: "哈尔滨", side: "left", from: 0.3 },
          { kind: "pin", at: places.shenyang, text: "沈阳", side: "left", from: 0.8 },
          { kind: "pin", at: places.beijing, text: "北京", side: "left", from: 1.3 },
          { kind: "pin", at: places.jinan, text: "山东", side: "left", from: 2.5 },
          { kind: "flow", path: [places.jinan, [855, 340], places.shenyang, places.harbin], icon: "🧳", count: 6, speed: 120, size: 12, from: 3 },
          { kind: "text", at: [600, 820], text: "闯关东：混在一起说话", from: 5 }
        ]
      }
    ]
  },
  {
    question: "nong",
    scenes: [
      {
        turn: 0, title: "两个侬", duration: 10,
        cues: [
          { kind: "sprite", icon: "👵", path: [[260, 600]], size: 200, from: 0.3 },
          { kind: "bubble", at: [260, 490], text: "侬好！", sub: "上海话：你好", from: 1 },
          { kind: "sprite", icon: "📖", path: [[920, 610]], size: 180, from: 2.5 },
          { kind: "label", at: [920, 515], pos: [920, 370], text: "葬花吟：侬 = 我", color: red, from: 3.2 },
          { kind: "text", at: [600, 840], text: "同一个字，两个意思", from: 5.5 }
        ]
      },
      {
        turn: 0, title: "江南的民歌", view: "map", duration: 10,
        camera: [{ t: 0, at: [600, 450], zoom: 1 }, { t: 2, at: [800, 540], zoom: 2 }],
        cues: [
          { kind: "pin", at: places.suzhou, text: "苏州", side: "left", from: 2.2 },
          { kind: "pulse", at: places.suzhou, color: "#3d9be9", radius: 60, from: 3 },
          { kind: "sprite", icon: "🎵", path: [[900, 470]], size: 40, wobble: true, from: 3.5 },
          { kind: "text", at: [600, 820], text: "一千五百年前：侬 = 我", from: 5 }
        ]
      },
      {
        turn: 1, title: "侬跑来跑去", duration: 11,
        cues: [
          { kind: "word", text: "侬", at: [600, 220], size: 170, from: 0.5 },
          { kind: "arrow", path: [[530, 320], [330, 470]], draw: 0.8, from: 1.5 },
          { kind: "word", text: "我", at: [280, 570], size: 150, caption: "古代江南", from: 2.3 },
          { kind: "arrow", path: [[670, 320], [870, 470]], draw: 0.8, from: 3.5 },
          { kind: "word", text: "你", at: [920, 570], size: 150, caption: "今天上海", color: red, from: 4.3 },
          { kind: "text", at: [600, 840], text: "上海话：阿拉 = 我们", from: 6.5 }
        ]
      },
      {
        turn: 2, title: "会变身的侬", view: "map", duration: 11,
        camera: [{ t: 0, at: [780, 600], zoom: 1.6 }],
        cues: [
          { kind: "bubble", at: places.suzhou, text: "侬 = 我", sub: "古代江南", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.shanghai, text: "侬 = 你", sub: "今天上海", side: "right", size: "s", from: 2.5 },
          { kind: "bubble", at: places.fuzhou, text: "侬 = 人", sub: "福州", side: "right", size: "s", from: 4.5 },
          { kind: "text", at: [600, 110], text: "一个字，三个意思", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "汝在福建", view: "map", duration: 10,
        camera: [{ t: 0, at: [760, 640], zoom: 1.8 }],
        cues: [
          { kind: "pin", at: places.xiamen, text: "厦门", side: "left", from: 0.3 },
          { kind: "bubble", at: places.xiamen, text: "汝", sub: "lí：你", side: "right", from: 1.2 },
          { kind: "text", at: [600, 110], text: "古书里的「汝」= 你", from: 3.5 }
        ]
      },
      {
        turn: 4, title: "老字百宝箱", duration: 10,
        cues: [
          { kind: "sprite", icon: "🧰", path: [[600, 620]], size: 230, from: 0.3 },
          { kind: "word", text: "侬", at: [280, 300], size: 130, path: [[600, 560], [280, 300]], travel: 1.2, from: 1.5 },
          { kind: "word", text: "汝", at: [600, 230], size: 130, path: [[600, 560], [600, 230]], travel: 1.2, from: 2.5 },
          { kind: "word", text: "食", at: [920, 300], size: 130, path: [[600, 560], [920, 300]], travel: 1.2, from: 3.5 },
          { kind: "text", at: [600, 840], text: "老字藏在方言里", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "shi-fan",
    scenes: [
      {
        turn: 0, title: "早茶店", duration: 10,
        cues: [
          { kind: "sprite", icon: "🫖", path: [[250, 560]], size: 150, from: 0.3 },
          { kind: "sprite", icon: "🥟", path: [[450, 610]], size: 120, from: 0.8 },
          { kind: "sprite", icon: "👩", path: [[880, 600]], size: 200, from: 1.5 },
          { kind: "bubble", at: [880, 480], text: "食咗饭未？", sub: "吃了饭没有？", from: 2.2 },
          { kind: "text", at: [600, 840], text: "食 = 吃", color: red, from: 5 }
        ]
      },
      {
        turn: 0, title: "说「食」的地方", view: "map", duration: 10,
        camera: [{ t: 0, at: [690, 720], zoom: 2 }],
        cues: [
          { kind: "bubble", at: places.guangzhou, text: "食饭", sub: "广州", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.meizhou, text: "食朝", sub: "梅州客家", size: "s", from: 1.8 },
          { kind: "bubble", at: places.shantou, text: "食未？", sub: "潮汕", side: "bottom", size: "s", from: 3.1 },
          { kind: "bubble", at: places.xiamen, text: "食饱未？", sub: "厦门", side: "right", size: "s", from: 4.4 },
          { kind: "text", at: [600, 110], text: "南方很多地方说食", from: 6 }
        ]
      },
      {
        turn: 1, title: "孔子的论语", duration: 11,
        cues: [
          { kind: "text", at: [600, 110], text: "食不语，寝不言", from: 0.3 },
          { kind: "sprite", icon: "📜", path: [[600, 290]], size: 170, from: 0.8 },
          { kind: "sprite", icon: "🍚", path: [[320, 505]], size: 125, from: 2.5 },
          { kind: "label", at: [320, 575], pos: [320, 690], text: "吃饭不说话", from: 3 },
          { kind: "sprite", icon: "🛏️", path: [[880, 505]], size: 125, from: 4.5 },
          { kind: "label", at: [880, 575], pos: [880, 690], text: "睡觉不聊天", from: 5 },
          { kind: "text", at: [600, 845], text: "两千多年前：食 = 吃", from: 7 }
        ]
      },
      {
        turn: 2, title: "年轻的吃", duration: 11,
        cues: [
          { kind: "word", text: "食", at: [280, 300], size: 190, caption: "老", from: 0.5 },
          { kind: "arrow", path: [[430, 300], [770, 300]], text: "唐宋前后", draw: 1, from: 1.8 },
          { kind: "word", text: "吃", at: [920, 300], size: 190, caption: "年轻", color: red, from: 3 },
          { kind: "word", text: "食物", at: [280, 660], size: 100, from: 5 },
          { kind: "word", text: "零食", at: [600, 660], size: 100, from: 5.6 },
          { kind: "word", text: "食堂", at: [920, 660], size: 100, from: 6.2 }
        ]
      },
      {
        turn: 3, title: "一杯茶，四种说法", view: "map", duration: 11,
        cues: [
          { kind: "sprite", icon: "🍵", path: [[300, 220]], size: 90, from: 0.3 },
          { kind: "bubble", at: places.beijing, text: "喝茶", size: "s", from: 1 },
          { kind: "bubble", at: places.shanghai, text: "吃茶", side: "right", size: "s", from: 2.5 },
          { kind: "bubble", at: places.guangzhou, text: "饮茶", size: "s", from: 4 },
          { kind: "bubble", at: places.xiamen, text: "食茶", side: "right", size: "s", from: 5.5 },
          { kind: "text", at: [600, 840], text: "一杯茶，四种说法", from: 7 }
        ]
      },
      {
        turn: 4, title: "两条路", duration: 10,
        cues: [
          { kind: "word", text: "食", at: [600, 700], size: 150, caption: "古时候", from: 0.5 },
          { kind: "arrow", path: [[540, 600], [300, 330]], text: "北方：改说吃", color: brown, draw: 1, from: 1.8 },
          { kind: "word", text: "吃", at: [250, 210], size: 140, color: brown, from: 3 },
          { kind: "arrow", path: [[660, 600], [900, 330]], text: "广东福建：还说食", color: red, draw: 1, from: 4.5 },
          { kind: "word", text: "食", at: [950, 210], size: 140, color: red, from: 5.7 }
        ]
      }
    ]
  },
  {
    question: "xi-lu",
    scenes: [
      {
        turn: 0, title: "细路 = 小孩", duration: 10,
        cues: [
          { kind: "sprite", icon: "🧒", path: [[600, 580]], size: 190, from: 0.3 },
          { kind: "bubble", at: [600, 470], text: "细路！", sub: "广州话", size: "s", from: 1 },
          { kind: "word", text: "细", at: [220, 300], size: 180, caption: "小", color: brown, from: 2.5 },
          { kind: "word", text: "路", at: [980, 300], size: 180, caption: "只是记个音", from: 4 },
          { kind: "text", at: [600, 830], text: "细路 = 小孩", from: 6 }
        ]
      },
      {
        turn: 1, title: "爱用细的地方", view: "map", duration: 11,
        camera: [{ t: 0, at: [720, 650], zoom: 1.5 }],
        cues: [
          { kind: "bubble", at: places.guangzhou, text: "细路", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.changsha, text: "细伢子", side: "left", size: "s", from: 1.8 },
          { kind: "bubble", at: places.nanchang, text: "细人子", side: "top", size: "s", from: 3.1 },
          { kind: "bubble", at: places.meizhou, text: "细人仔", side: "bottom", size: "s", from: 4.4 },
          { kind: "bubble", at: places.wenzhou, text: "细儿", side: "right", size: "s", from: 5.7 },
          { kind: "text", at: [600, 110], text: "都用「细」说小", from: 7 }
        ]
      },
      {
        turn: 2, title: "伢和娃", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.wuhan, text: "小伢", side: "right", size: "s", from: 0.5 },
          { kind: "bubble", at: places.chengdu, text: "娃儿", side: "left", size: "s", from: 2.5 },
          { kind: "bubble", at: places.xian, text: "碎娃", side: "top", size: "s", from: 4.5 },
          { kind: "text", at: [600, 840], text: "伢、娃都是小孩", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "囡仔和小囡", view: "map", duration: 10,
        cues: [
          { kind: "bubble", at: places.xiamen, text: "囡仔", sub: "gín-á", side: "right", size: "s", from: 0.5 },
          { kind: "bubble", at: places.shanghai, text: "小囡", sub: "也说小人", side: "right", size: "s", from: 2.5 },
          { kind: "text", at: [600, 110], text: "上海的小人 = 小孩", color: red, from: 5 }
        ]
      },
      {
        turn: 4, title: "字面会骗人", duration: 11,
        cues: [
          { kind: "word", text: "小人", at: [300, 300], size: 150, caption: "上海：小孩", color: brown, from: 0.5 },
          { kind: "word", text: "走", at: [900, 300], size: 170, caption: "广州：跑", color: brown, from: 2 },
          { kind: "myth", wrong: "细路就是小路", right: "细路是小孩，要听整句话", from: 4 }
        ]
      }
    ]
  },
  {
    question: "ji-gong",
    scenes: [
      {
        turn: 0, title: "鸡公 = 公鸡", duration: 10,
        cues: [
          { kind: "sprite", icon: "🐓", path: [[600, 300]], size: 190, wobble: true, from: 0.3 },
          { kind: "word", text: "鸡公", at: [320, 620], size: 140, caption: "长沙话", color: brown, from: 1.5 },
          { kind: "word", text: "公鸡", at: [880, 620], size: 140, caption: "普通话", from: 3 },
          { kind: "text", at: [600, 110], text: "倒过来了！", from: 5 }
        ]
      },
      {
        turn: 0, title: "母鸡的名字", view: "map", duration: 10,
        cues: [
          { kind: "bubble", at: places.changsha, text: "鸡婆", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.guangzhou, text: "鸡乸", side: "left", size: "s", from: 2 },
          { kind: "bubble", at: places.xiamen, text: "鸡母", side: "right", size: "s", from: 3.5 },
          { kind: "sprite", icon: "🐔", path: [[1060, 160]], size: 110, from: 4.5 },
          { kind: "text", at: [600, 110], text: "先说鸡，再说公母", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "两种排法", duration: 11,
        cues: [
          { kind: "word", text: "公鸡", at: [300, 300], size: 150, caption: "先说公", from: 0.5 },
          { kind: "word", text: "鸡公", at: [900, 300], size: 150, caption: "先说鸡", color: brown, from: 2.5 },
          { kind: "word", text: "雄鸡", at: [600, 620], size: 150, caption: "古时候·上海", color: red, from: 5.5 }
        ]
      },
      {
        turn: 2, title: "换个顺序", duration: 11,
        cues: [
          { kind: "word", text: "客人", at: [300, 270], size: 130, from: 0.5 },
          { kind: "arrow", path: [[460, 270], [740, 270]], text: "倒过来", draw: 0.8, from: 1.5 },
          { kind: "word", text: "人客", at: [900, 270], size: 130, caption: "广州、上海", color: brown, from: 2.5 },
          { kind: "word", text: "热闹", at: [300, 590], size: 130, from: 4 },
          { kind: "arrow", path: [[460, 590], [740, 590]], draw: 0.8, from: 5 },
          { kind: "word", text: "闹热", at: [900, 590], size: 130, caption: "成都、厦门", color: brown, from: 5.8 }
        ]
      },
      {
        turn: 3, title: "两种都对", duration: 10,
        cues: [
          { kind: "sprite", icon: "👟", path: [[380, 455]], size: 150, from: 0.5 },
          { kind: "label", at: [380, 370], pos: [380, 230], text: "先穿左脚", from: 1 },
          { kind: "sprite", icon: "👟", path: [[820, 455]], size: 150, from: 2 },
          { kind: "label", at: [820, 370], pos: [820, 230], text: "先穿右脚", from: 2.5 },
          { kind: "text", at: [600, 780], text: "两种都对", from: 4 }
        ]
      },
      {
        turn: 4, title: "冰棍的名字", view: "map", duration: 12,
        cues: [
          { kind: "bubble", at: places.beijing, text: "冰棍儿", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.wuhan, text: "冰棒", side: "top", size: "s", from: 1.8 },
          { kind: "bubble", at: places.shanghai, text: "棒冰", side: "right", size: "s", from: 3.1 },
          { kind: "bubble", at: places.guangzhou, text: "雪条", side: "left", size: "s", from: 4.4 },
          { kind: "bubble", at: places.chengdu, text: "冰糕", side: "left", size: "s", from: 5.7 },
          { kind: "text", at: [600, 110], text: "一根冰棍，好多名字", from: 7 }
        ]
      }
    ]
  },
  {
    question: "da-di",
    scenes: [
      {
        turn: 0, title: "TAXI = 的士", duration: 10,
        cues: [
          { kind: "sprite", icon: "🚕", path: [[600, 580]], size: 200, from: 0.3 },
          { kind: "word", text: "taxi", at: [290, 290], size: 130, font: "song", caption: "英语", from: 1.5 },
          { kind: "arrow", path: [[460, 290], [740, 290]], text: "照着读", draw: 0.8, from: 2.5 },
          { kind: "word", text: "的士", at: [910, 290], size: 150, caption: "粤语 dik si", color: red, from: 3.5 },
          { kind: "text", at: [600, 830], text: "的士 = 出租车", from: 5.5 }
        ]
      },
      {
        turn: 1, title: "借来的词", duration: 12,
        cues: [
          { kind: "word", text: "巴士", at: [300, 270], size: 130, caption: "bus", color: brown, from: 0.5 },
          { kind: "word", text: "士多", at: [900, 270], size: 130, caption: "store", color: brown, from: 2.5 },
          { kind: "word", text: "梳化", at: [300, 570], size: 130, caption: "sofa", color: brown, from: 4.5 },
          { kind: "word", text: "的士", at: [900, 570], size: 130, caption: "taxi", color: brown, from: 6.5 },
          { kind: "text", at: [600, 830], text: "照着英语的读音", from: 8 }
        ]
      },
      {
        turn: 2, title: "打的", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.guangzhou, text: "的士", side: "left", size: "s", from: 0.5 },
          { kind: "flow", path: [places.guangzhou, places.wuhan, places.beijing], icon: "🚕", count: 4, speed: 150, size: 14, from: 2 },
          { kind: "bubble", at: places.beijing, text: "打的", sub: "普通话", side: "left", size: "s", from: 5 },
          { kind: "text", at: [600, 110], text: "先进粤语，再进普通话", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "上海和广州", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.shanghai, text: "水门汀", sub: "cement 水泥", side: "right", size: "s", from: 0.5 },
          { kind: "bubble", at: places.guangzhou, text: "踢波", sub: "ball 踢球", side: "left", size: "s", from: 3.5 },
          { kind: "text", at: [600, 110], text: "也是借来的", from: 6 }
        ]
      },
      {
        turn: 4, title: "新东西要名字", duration: 10,
        cues: [
          { kind: "sprite", icon: "🍇", path: [[300, 465]], size: 165, from: 0.5 },
          { kind: "label", at: [300, 370], pos: [300, 230], text: "葡萄：两千多年前", from: 1.2 },
          { kind: "sprite", icon: "🚕", path: [[900, 465]], size: 165, from: 3 },
          { kind: "label", at: [900, 370], pos: [900, 230], text: "的士：近代借来", from: 3.7 },
          { kind: "text", at: [600, 810], text: "借来的词用久了", from: 5.5 }
        ]
      }
    ]
  },
  {
    question: "guo-zao",
    scenes: [
      {
        turn: 0, title: "武汉的过早", duration: 10,
        cues: [
          { kind: "sprite", icon: "🍜", path: [[320, 460]], size: 200, from: 0.4 },
          { kind: "word", text: "过早", at: [840, 360], size: 185, caption: "武汉话：吃早饭", color: red, from: 1.5 },
          { kind: "text", at: [600, 810], text: "像过节一样吃早饭！", from: 5 }
        ]
      },
      {
        turn: 1, title: "早饭的名字", view: "map", duration: 11,
        cues: [
          { kind: "bubble", at: places.wuhan, text: "过早", side: "left", size: "s", from: 0.5 },
          { kind: "bubble", at: places.nanjing, text: "点心", side: "top", size: "s", from: 2 },
          { kind: "bubble", at: places.wenzhou, text: "天光", side: "right", size: "s", from: 3.5 },
          { kind: "bubble", at: places.xiamen, text: "早起顿", side: "right", size: "s", from: 5 },
          { kind: "text", at: [600, 110], text: "一顿早饭，各地叫法不同", from: 6.8 }
        ]
      },
      {
        turn: 2, title: "婆婆到底是谁", duration: 11,
        cues: [
          { kind: "word", text: "婆婆", at: [600, 220], size: 165, color: red, from: 0.4 },
          { kind: "arrow", path: [[510, 310], [310, 470]], draw: 0.8, from: 1.6 },
          { kind: "word", text: "奶奶", at: [280, 580], size: 135, caption: "成都 · 南昌", color: brown, from: 2.5 },
          { kind: "arrow", path: [[690, 310], [890, 470]], draw: 0.8, from: 3.8 },
          { kind: "word", text: "外婆", at: [920, 580], size: 135, caption: "广州（奶奶叫阿嫲）", color: red, from: 4.6 },
          { kind: "text", at: [600, 830], text: "同一个词，换城就换人！", from: 6.5 }
        ]
      },
      {
        turn: 3, title: "各地怎么喊奶奶", view: "map", duration: 12,
        cues: [
          { kind: "bubble", at: places.suzhou, text: "好婆", side: "top", size: "s", from: 0.5 },
          { kind: "bubble", at: places.shanghai, text: "阿奶", side: "right", size: "s", from: 1.8 },
          { kind: "bubble", at: places.changsha, text: "娭毑", side: "left", size: "s", from: 3.1 },
          { kind: "bubble", at: places.fuzhou, text: "依妈", side: "right", size: "s", from: 4.4 },
          { kind: "bubble", at: places.xiamen, text: "阿妈", side: "bottom", size: "s", from: 5.7 },
          { kind: "bubble", at: places.guangzhou, text: "阿嫲", side: "left", size: "s", from: 7 },
          { kind: "text", at: [600, 110], text: "都是爸爸的妈妈", from: 8.5 }
        ]
      },
      {
        turn: 4, title: "好乖 = 好漂亮", duration: 10,
        cues: [
          { kind: "word", text: "乖", at: [600, 260], size: 190, color: brown, from: 0.4 },
          { kind: "label", at: [520, 320], pos: [290, 520], text: "北京：听话懂事", from: 1.8 },
          { kind: "label", at: [680, 320], pos: [910, 520], text: "四川·长沙：真漂亮", color: red, from: 3.4 },
          { kind: "myth", wrong: "字写得一样，意思肯定一样", right: "换个地方，亲人称呼和词义都会变", from: 5.2 }
        ]
      }
    ]
  },
  {
    question: "m-goi",
    scenes: [
      {
        turn: 0, title: "两种谢谢", duration: 11,
        cues: [
          { kind: "sprite", icon: "🫖", path: [[300, 560]], size: 150, from: 0.4 },
          { kind: "word", text: "唔该", at: [300, 290], size: 150, caption: "倒茶·帮忙", color: brown, from: 1 },
          { kind: "sprite", icon: "🧧", path: [[900, 560]], size: 150, from: 2.8 },
          { kind: "word", text: "多谢", at: [900, 290], size: 150, caption: "礼物·红包", color: red, from: 3.4 },
          { kind: "text", at: [600, 820], text: "粤语里两句分工清楚", from: 5.8 }
        ]
      },
      {
        turn: 1, title: "唔该 = 不该劳烦", duration: 10,
        cues: [
          { kind: "word", text: "唔", at: [280, 340], size: 185, caption: "不", from: 0.5 },
          { kind: "word", text: "该", at: [580, 340], size: 185, caption: "应该", from: 1.6 },
          { kind: "arrow", path: [[710, 340], [830, 340]], draw: 0.7, from: 2.8 },
          { kind: "word", text: "唔该", at: [1000, 340], size: 135, caption: "劳驾 · 谢谢", color: red, from: 3.6 },
          { kind: "text", at: [600, 790], text: "真不该劳烦你！", from: 5.5 }
        ]
      },
      {
        turn: 2, title: "千万别说反啦", duration: 10,
        cues: [
          { kind: "sprite", icon: "🎁", path: [[600, 330]], size: 180, from: 0.4 },
          { kind: "myth", wrong: "收红包和礼物也随便说唔该", right: "帮忙说唔该，收礼郑重说多谢", from: 3.2 }
        ]
      },
      {
        turn: 3, title: "暖心的谢谢", view: "map", duration: 11,
        camera: [{ t: 0, at: [755, 700], zoom: 1.9 }],
        cues: [
          { kind: "bubble", at: places.meizhou, text: "恁仔细", sub: "客家话", side: "top", size: "s", from: 0.6 },
          { kind: "bubble", at: places.shantou, text: "㩼谢", sub: "潮汕：很多谢", side: "bottom", size: "s", from: 2.5 },
          { kind: "bubble", at: places.xiamen, text: "劳力", sub: "闽南：谢谢出力", side: "right", size: "s", from: 4.4 },
          { kind: "text", at: [600, 110], text: "每句谢谢都很有心意", from: 6.5 }
        ]
      },
      {
        turn: 4, title: "对唔住和歹势", view: "map", duration: 10,
        cues: [
          { kind: "bubble", at: places.shanghai, text: "勿好意思", side: "right", size: "s", from: 0.5 },
          { kind: "bubble", at: places.xiamen, text: "歹势", sub: "pháinn-sè", side: "right", size: "s", from: 2.3 },
          { kind: "bubble", at: places.guangzhou, text: "对唔住", side: "left", size: "s", from: 4.1 },
          { kind: "text", at: [600, 110], text: "礼貌话走到哪儿都受欢迎", from: 6 }
        ]
      }
    ]
  }
];
