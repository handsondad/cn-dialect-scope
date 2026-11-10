import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { films } from "../src/data/films/index.ts";
import { dialectQuestions } from "../src/data/questions/index.ts";
import { lineAt, narrateFilm, narrationGaps } from "../src/lib/narration.ts";
import { collectSamples, sampleKey } from "../src/lib/samples.ts";
import { readAtlas } from "../tools/atlas.mjs";
import { clipHash, clipKey } from "../tools/voice/voices.mjs";

const manifest = JSON.parse(readFileSync(new URL("../src/data/voice-manifest.json", import.meta.url), "utf8"));

test("每一句问答都有配音，而且配音读的是现在的文字", () => {
  const missing = [];
  for (const question of dialectQuestions) {
    question.dialogue.forEach((turn, index) => {
      for (const who of ["nian", "dad"]) {
        const key = clipKey(question.id, index, who);
        const clip = manifest.clips[key];
        if (!clip) missing.push(`${key} 没有配音`);
        else if (clip.hash !== clipHash(who, turn[who])) missing.push(`${key} 文字改过了`);
        else if (!existsSync(new URL(`../public/voice/${key}.mp3`, import.meta.url))) missing.push(`${key} 缺音频文件`);
      }
    });
  }
  assert.deepEqual(missing.slice(0, 10), [], `共 ${missing.length} 句要重新配音：npm run voice`);
});

test("「听一听」要读的方言句子都生成了音频", () => {
  const { dialects, concepts } = readAtlas();
  const missing = [];
  for (const sample of collectSamples(dialectQuestions, dialects, concepts)) {
    const key = sampleKey(sample.voice, sample.text);
    if (manifest.samples[key]?.text !== sample.text) missing.push(`${sample.voice}「${sample.text}」没有配音`);
    else if (!existsSync(new URL(`../public/voice/say/${key}.mp3`, import.meta.url))) missing.push(`${key} 缺音频文件`);
  }
  assert.deepEqual(missing.slice(0, 10), [], `共 ${missing.length} 句要配音：npm run voice`);
});

const scene = (turn, duration, extra = {}) => ({
  turn, title: "t", duration,
  cues: [{ kind: "text", at: [600, 450], text: "字", from: 1, to: duration - 1 }, { kind: "count", at: [600, 450], label: "数", start: 0, end: 9, from: 2 }],
  ...extra
});

test("配音版把每场戏拉长到读完为止，循环动作和短场景不受影响", () => {
  const film = { question: "demo", scenes: [scene(0, 10, { camera: [{ t: 0, at: [600, 450], zoom: 1 }, { t: 5, at: [600, 450], zoom: 2 }] }), scene(1, 10)] };
  const lengths = { "0-nian": 4, "0-dad": 25.65, "1-nian": 1, "1-dad": 2, "2-nian": 3, "2-dad": 6 };
  const result = narrateFilm(film, 3, (turn, who) => lengths[`${turn}-${who}`]);
  assert.ok(result);
  const first = result.film.scenes[0];
  const needed = narrationGaps.lead + 4 + narrationGaps.between + 25.65 + narrationGaps.tail;
  assert.ok(Math.abs(first.duration - needed) < 1e-9);
  const factor = first.duration / 10;
  assert.ok(Math.abs(first.cues[0].from - factor) < 1e-9);
  assert.ok(Math.abs(first.cues[1].over - 2 * factor) < 1e-9);
  assert.ok(Math.abs(first.camera[1].t - 5 * factor) < 1e-9);

  const second = result.film.scenes[1];
  const tail = narrationGaps.lead + 1 + narrationGaps.between + 2 + narrationGaps.afterTurn + 3 + narrationGaps.between + 6 + narrationGaps.tail;
  assert.ok(Math.abs(second.duration - Math.max(10, tail)) < 1e-9, "没配动画的最后一轮接在最后一场戏里读");
  assert.deepEqual(result.lines.map((line) => `${line.turn}-${line.who}`), ["0-nian", "0-dad", "1-nian", "1-dad", "2-nian", "2-dad"]);
  assert.ok(Math.abs(result.lines[2].start - (first.duration + narrationGaps.lead)) < 1e-9);
  assert.deepEqual(lineAt(result.lines, 0.5), { line: result.lines[0], speaking: true });
  assert.equal(lineAt(result.lines, 0.1), undefined);

  assert.equal(narrateFilm(film, 3, (turn, who) => (turn === 2 && who === "dad" ? undefined : 1)), undefined, "缺一句配音就退回无声版");
});

test("所有动画都能配上音，配音版每场戏不短于原来", () => {
  const byId = new Map(dialectQuestions.map((question) => [question.id, question]));
  for (const film of films) {
    const question = byId.get(film.question);
    const result = narrateFilm(film, question.dialogue.length, (turn, who) => manifest.clips[clipKey(film.question, turn, who)]?.seconds);
    assert.ok(result, `${film.question} 缺配音`);
    result.film.scenes.forEach((item, index) => assert.ok(item.duration >= film.scenes[index].duration, film.question));
    assert.equal(result.lines.length, question.dialogue.length * 2, `${film.question} 每句都要读到`);
    result.lines.slice(1).forEach((line, index) => {
      const before = result.lines[index];
      assert.ok(before.start + before.seconds <= line.start, `${film.question} 第${before.turn + 1}轮和后一句叠在一起了`);
    });
  }
});
