// 小念和爸爸的配音设置。改了这里或改了问答文字，都要重新跑 `npm run voice`。
// 「听一听」的方言音色在 src/lib/samples.ts，浏览器也要用它算文件名。
import { createHash } from "node:crypto";

export const voices = {
  nian: { voice: "zh-CN-YunxiaNeural", rate: "+0%" },
  dad: { voice: "zh-CN-YunxiNeural", rate: "-5%" }
};

/** 同一个声音读同一句话，指纹就不变；文字或声音一改，旧音频就算过期 */
export function clipHash(who, text) {
  const { voice, rate } = voices[who];
  return createHash("sha1").update(`${voice}|${rate}|${text}`).digest("hex").slice(0, 12);
}

export const clipKey = (question, turn, who) => `${question}/${turn}-${who}`;
