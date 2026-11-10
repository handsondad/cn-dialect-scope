// 每段小念 × 爸爸问答都要守的规矩。写内容时可以只查一个文件：
//   node tests/dialogue-rules.mjs src/data/questions/why.ts
import { pathToFileURL } from "node:url";
import { sampleVoices } from "../src/lib/samples.ts";

/** 七岁孩子听不懂、爸爸要换成大白话的词 */
export const jargon = /音位|调值|调类|声母|韵母|韵尾|音系|中古音|上古音|构拟|反切|本字|俗字|训读|变调|同源词|语族|语支|方言岛|底层/;

// 只由这些字组成的两字词说明不了话题
const filler = new Set("的了吗呢吧呀啊哦嘛是我你他她它们这那就也都还又在有和么什怎为个一不没会要说想看能可以得很太好真再");
/** 每段都会说到的词，接住了也不算真的接着话头追问 */
const generic = new Set(["方言", "爸爸", "小念", "时候", "现在", "样子", "意思", "知道", "东西", "一样", "地方", "大家"]);

/** 话里有意思的两字词，比如 声调、官话、粤语 */
export function topicWords(line) {
  const words = new Set();
  const chars = [...line];
  for (let i = 0; i < chars.length - 1; i += 1) {
    const a = chars[i];
    const b = chars[i + 1];
    if (!/\p{Script=Han}/u.test(a) || !/\p{Script=Han}/u.test(b)) continue;
    if (filler.has(a) || filler.has(b) || generic.has(a + b)) continue;
    words.add(a + b);
  }
  return words;
}

export function sharedWords(question, answer) {
  return [...topicWords(question)].filter((word) => answer.includes(word));
}

export function dialogueProblems(question) {
  const problems = [];
  const say = (message) => problems.push(`${question.id}: ${message}`);
  if (!/？/.test(question.title)) say("标题要是一个问句，带「？」");
  const turns = question.dialogue ?? [];
  if (turns.length < 5 || turns.length > 8) say(`要 5～8 轮问答，现在 ${turns.length} 轮`);

  const words = question.words ?? [];
  if (words.length < 1 || words.length > 10) say(`words 要 1～10 个，现在 ${words.length} 个`);
  const spoken = [question.title, ...turns.flatMap((turn) => [turn.nian, turn.dad])].join("");
  for (const word of words) if (!spoken.includes(word)) say(`words 里的「${word}」在问答里没出现`);
  if (new Set(words).size !== words.length) say("words 里有重复的词");

  turns.forEach((turn, index) => {
    const last = index === turns.length - 1;
    if (!turn.nian || !turn.dad) say(`第 ${index + 1} 轮要有小念和爸爸两句`);
    if (!last && !/？/.test(turn.nian)) say(`第 ${index + 1} 轮：小念要问一个问题，带「？」`);
    if (last && !/^我(懂了|明白了)/.test(turn.nian)) say("最后一轮：小念用自己的话总结，以「我懂了」或「我明白了」开头");
    if (index > 0) {
      const shared = sharedWords(turn.nian, turns[index - 1].dad);
      if (shared.length === 0) say(`第 ${index + 1} 轮：小念要接住爸爸上一句里的一个词再追问`);
    }
    const length = [...turn.dad].length;
    if (length < 20 || length > 170) say(`第 ${index + 1} 轮：爸爸说了 ${length} 个字（要 20～170）`);
    for (const line of [turn.nian, turn.dad]) if (jargon.test(line)) say(`第 ${index + 1} 轮：「${line.match(jargon)[0]}」太专业了，换成大白话`);
    if (turn.show?.kind === "steps" && turn.show.frames.length < 2) say(`第 ${index + 1} 轮：图解至少 2 步`);
    if (turn.show?.kind === "say") {
      const lines = turn.show.lines;
      if (lines.length < 1 || lines.length > 9) say(`第 ${index + 1} 轮：听一听要 1～9 句`);
      for (const line of lines) {
        if (line.voice && !sampleVoices[line.voice]) say(`第 ${index + 1} 轮：没有「${line.voice}」这个音色`);
        if ([...line.text].length > 16) say(`第 ${index + 1} 轮：听一听的「${line.text}」太长了（最多 16 个字）`);
      }
    }
  });
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const files = process.argv.slice(2);
  let total = 0;
  for (const file of files) {
    const module = await import(pathToFileURL(file).href);
    for (const list of Object.values(module)) {
      if (!Array.isArray(list)) continue;
      for (const question of list) {
        const problems = dialogueProblems(question);
        total += problems.length;
        for (const problem of problems) console.log(problem);
      }
    }
  }
  console.log(total ? `${total} 个问题` : "all dialogues pass");
  process.exitCode = total ? 1 : 0;
}
