import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { dialectQuestions, nextQuestions, questionsAbout, questionsIn, topics } from "../src/data/questions/index.ts";
import { sampleVoices } from "../src/lib/samples.ts";
import { readAtlas } from "../tools/atlas.mjs";
import { dialogueProblems, sharedWords, topicWords } from "./dialogue-rules.mjs";

const atlas = readAtlas();

test("问题 id 不重复，每个问题都属于一个主题", () => {
  const ids = dialectQuestions.map((question) => question.id);
  assert.equal(new Set(ids).size, ids.length);
  const known = new Set(topics.map((topic) => topic.id));
  for (const question of dialectQuestions) assert.ok(known.has(question.topic), question.id);
});

test("每个主题至少三个问题，从简单排到难", () => {
  for (const topic of topics) {
    const list = questionsIn(topic.id);
    assert.ok(list.length >= 3, `${topic.id} 只有 ${list.length} 个`);
    assert.equal(list[0].difficulty, 1, topic.id);
    for (let i = 1; i < list.length; i += 1) assert.ok(list[i].difficulty >= list[i - 1].difficulty, topic.id);
  }
});

test("每段问答都是一路追问，最后小念自己总结", () => {
  const problems = dialectQuestions.flatMap((question) => dialogueProblems(question));
  assert.deepEqual(problems, []);
});

test("追问检查看的是有意思的词，不是虚词", () => {
  const words = topicWords("粤语为什么有九个声调？");
  assert.ok(words.has("粤语") && words.has("声调") && !words.has("什么"));
  assert.deepEqual(sharedWords("那为什么呢？", "这是为什么呢"), []);
  assert.deepEqual(sharedWords("方言是谁定的？", "方言很古老"), [], "人人都会说的词不算接住话头");
  assert.deepEqual(sharedWords("官话是什么？", "四川话也是官话"), ["官话"]);
});

test("相关问题在同一个主题里", () => {
  for (const question of dialectQuestions) {
    const related = nextQuestions(question);
    assert.ok(related.length >= 1, question.id);
    assert.ok(related.every((item) => item.topic === question.topic && item.id !== question.id), question.id);
  }
});

test("问答连到的概念都在知识库里，方言地图上能链回这个问题", () => {
  const slugs = new Set(atlas.concepts.map((concept) => concept.slug));
  for (const question of dialectQuestions) {
    for (const concept of question.concepts ?? []) {
      assert.ok(slugs.has(concept), `${question.id}：知识库里没有概念「${concept}」`);
      assert.ok(questionsAbout(concept).includes(question), `${question.id}：「${concept}」`);
    }
  }
});

test("「听一听」的音色都存在，配的图都在 public/ 里", () => {
  for (const question of dialectQuestions) {
    for (const turn of question.dialogue) {
      if (turn.show?.kind === "say") {
        for (const line of turn.show.lines) assert.ok(!line.voice || sampleVoices[line.voice], `${question.id}：「${line.text}」`);
      }
      if (turn.show?.kind === "image") {
        assert.ok(!turn.show.src.startsWith("/") && existsSync(new URL(`../public/${turn.show.src}`, import.meta.url)), `${question.id}：public/${turn.show.src}`);
        assert.ok(turn.show.alt, `${question.id}：图要写 alt`);
      }
    }
  }
});
