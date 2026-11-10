import assert from "node:assert/strict";
import test from "node:test";
import { familyColor, formsByDialect, makeQuiz } from "../src/lib/atlas.ts";
import { collectSamples, dialectVoice, sampleKey } from "../src/lib/samples.ts";
import { readAtlas } from "../tools/atlas.mjs";

const atlas = readAtlas();

test("知识库：方言点、概念都齐，每个方言点的大区都有颜色", () => {
  assert.ok(atlas.dialects.length >= 10);
  assert.ok(atlas.concepts.length >= 10);
  const families = new Set(atlas.families.map((family) => family.slug));
  for (const dialect of atlas.dialects) {
    assert.ok(families.has(dialect.family_slug), dialect.slug);
    assert.ok(familyColor[dialect.family_slug], `${dialect.family_slug} 没有颜色`);
  }
  const slugs = new Set(atlas.dialects.map((dialect) => dialect.slug));
  for (const concept of atlas.concepts) {
    for (const item of concept.expressions) assert.ok(slugs.has(item.dialect), `${concept.slug}：${item.dialect}`);
  }
  for (const dialect of Object.keys(dialectVoice)) assert.ok(slugs.has(dialect), dialect);
});

test("一个方言点有几种说法时都留着", () => {
  const what = atlas.concepts.find((concept) => concept.slug === "shen-me");
  const canton = formsByDialect(what).get("guangzhouhua").map((item) => item.form);
  assert.deepEqual(canton, ["乜嘢", "咩"]);
});

test("猜猜是哪里话：同一个种子抽出同样的题", () => {
  assert.deepEqual(makeQuiz(atlas, 42), makeQuiz(atlas, 42));
  assert.notDeepEqual(makeQuiz(atlas, 42), makeQuiz(atlas, 7));
});

test("猜猜是哪里话：每题三个选项，只有一个对，干扰项不会说这句里的词", () => {
  const bySlug = new Map(atlas.dialects.map((dialect) => [dialect.slug, dialect]));
  for (const seed of [1, 2, 3, 42, 2026]) {
    const rounds = makeQuiz(atlas, seed);
    assert.equal(rounds.length, 8, `种子 ${seed}`);
    assert.equal(new Set(rounds.map((round) => round.prompt)).size, rounds.length, "同一局里题不重复");
    for (const round of rounds) {
      assert.equal(round.options.length, 3);
      assert.equal(new Set(round.options).size, 3);
      assert.ok(round.options.includes(round.answer));
      const answer = bySlug.get(round.answer);
      const decoys = round.options.filter((slug) => slug !== round.answer).map((slug) => bySlug.get(slug));
      for (const decoy of decoys) {
        assert.notEqual(decoy.family_slug, answer.family_slug, `${round.prompt}：干扰项和答案同一大区`);
        assert.ok(!decoy.vocabulary.some((item) => item.term === round.clue), `${round.prompt}：${decoy.slug} 也说「${round.clue}」`);
      }
      assert.ok(round.prompt.includes(round.clue) || round.prompt === round.clue);
    }
  }
});

test("要读出声的句子不重名：同音色同文字只生成一份", () => {
  const samples = collectSamples([], atlas.dialects, atlas.concepts);
  const keys = samples.map((sample) => sampleKey(sample.voice, sample.text));
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(samples.some((sample) => sample.voice === "yue" && sample.text === "冇问题。"));
  assert.ok(samples.some((sample) => sample.voice === "dongbei" && sample.text === "你搁这儿嘎哈呢？"));
  assert.ok(samples.every((sample) => sample.voice !== "putonghua"), "知识库里的方言词不用普通话读");
});
