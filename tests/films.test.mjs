import assert from "node:assert/strict";
import test from "node:test";
import { dialectQuestions } from "../src/data/questions/index.ts";
import { films } from "../src/data/films/index.ts";
import { cameraAt, envelope, pointAlong, sceneAt, toneChart, tonePoints, toneY, totalDuration, turnAt } from "../src/lib/film.ts";
import { geo, places } from "../src/lib/geo.ts";
import { readAtlas } from "../tools/atlas.mjs";
import { filmProblems } from "./film-rules.mjs";

const byId = new Map(dialectQuestions.map((question) => [question.id, question]));

test("每部动画都通过规则检查", () => {
  for (const film of films) assert.deepEqual(filmProblems(film, byId.get(film.question)), [], film.question);
});

test("每个问题都有讲解动画，一个问题只有一部", () => {
  const have = new Set(films.map((film) => film.question));
  assert.deepEqual(dialectQuestions.filter((question) => !have.has(question.id)).map((question) => question.id), []);
  assert.equal(have.size, films.length);
});

test("时间线是时间的纯函数：同一时刻同一帧", () => {
  const film = films[0];
  const total = totalDuration(film);
  assert.deepEqual(sceneAt(film, 0), { index: 0, local: 0 });
  assert.equal(sceneAt(film, total + 5).index, film.scenes.length - 1);
  const second = film.scenes[0].duration + 0.5;
  assert.deepEqual(sceneAt(film, second), { index: 1, local: 0.5 });
  assert.equal(envelope(0.9, 1), 0);
  assert.ok(envelope(3, 1) > 0.99);
  assert.ok(envelope(10, 1, 4) < 0.01);
  assert.deepEqual(pointAlong([[0, 0], [100, 0], [100, 100]], 0.75), [100, 50]);
  const camera = cameraAt([{ t: 0, at: [600, 450], zoom: 2 }], 1);
  assert.deepEqual([camera.width, camera.height, camera.x, camera.y], [600, 450, 300, 225]);
  const edge = cameraAt([{ t: 0, at: [0, 0], zoom: 2 }], 0);
  assert.deepEqual([edge.x, edge.y], [0, 0]);
  assert.equal(turnAt(0, -90, 0, 2), -90);
  assert.equal(turnAt(5, -90, 0, 2), 0);
});

test("声调格：5 在最上，1 在最下；第三声 214 先降后升", () => {
  assert.equal(toneY(5), toneChart.top);
  assert.equal(toneY(1), toneChart.bottom);
  const third = tonePoints([2, 1, 4], [300, 500]);
  assert.deepEqual(third.map(([x]) => x), [300, 400, 500]);
  assert.ok(third[1][1] > third[0][1] && third[2][1] < third[0][1]);
  assert.deepEqual(tonePoints([5, 5], [300, 500]).map(([, y]) => y), [toneChart.top, toneChart.top]);
});

test("动画里的城市和知识库里方言点的位置一致", () => {
  const same = {
    guangzhou: "guangzhouhua", hongkong: "hongkong-cantonese", shanghai: "shanghaihua", suzhou: "suzhouhua",
    chengdu: "xinan-guanhua", changsha: "changshahua", nanchang: "nanchanghua", shantou: "chaoshanhua",
    meizhou: "hakkahua", xiamen: "fujian-minnan", fuzhou: "fuzhouhua", lanzhou: "lanyin-guanhua", beijing: "beijinghua",
    harbin: "dongbeihua", taiyuan: "taiyuanhua", xian: "xianhua", jinan: "jinanhua",
    wuhan: "wuhanhua", nanjing: "nanjinghua", wenzhou: "wenzhouhua"
  };
  const { dialects } = readAtlas();
  for (const [place, slug] of Object.entries(same)) {
    const dialect = dialects.find((item) => item.slug === slug);
    assert.ok(dialect, slug);
    const [x, y] = geo(dialect.point.lon, dialect.point.lat);
    const [px, py] = places[place];
    assert.ok(Math.hypot(x - px, y - py) <= 3, `${place} 和 ${slug}（${dialect.point.name}）对不上`);
  }
});
