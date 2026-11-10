import assert from "node:assert/strict";
import { test } from "node:test";
import { advancePhase, breath, bump, maxFrameSeconds, pulseTravel, stageIndexAt, stepPhase, wave, wrap01 } from "../src/lib/motion.ts";

test("bump is zero outside its window and peaks at one", () => {
  assert.equal(bump(0.1, 0.2, 0.3, 0.6), 0);
  assert.equal(bump(0.6, 0.2, 0.3, 0.6), 0);
  assert.equal(bump(0.3, 0.2, 0.3, 0.6), 1);
  assert.ok(bump(0.25, 0.2, 0.3, 0.6) > 0 && bump(0.25, 0.2, 0.3, 0.6) < 1);
  assert.throws(() => bump(0.5, 0.3, 0.2, 0.6));
});

test("breath inhales faster than it exhales and closes the loop", () => {
  assert.equal(breath(0), 0);
  assert.equal(breath(0.4), 1);
  assert.ok(Math.abs(breath(1)) < 1e-12);
  assert.ok(breath(0.1) > 1 - breath(0.5), "after the same time, inhaling has filled more than exhaling has emptied");
  assert.ok(Math.abs(wave(0)) < 1e-12 && Math.abs(wave(1)) < 1e-12 && wave(0.5) === 1);
});

test("pulse travel covers exactly one unit per cycle so particle loops are seamless", () => {
  assert.equal(pulseTravel(0, 0.2, 0.6), 0);
  assert.equal(pulseTravel(0.1, 0.2, 0.6), 0);
  assert.equal(pulseTravel(0.6, 0.2, 0.6), 1);
  assert.equal(pulseTravel(0.99, 0.2, 0.6), 1);
  const count = 8;
  const at = (p) => Array.from({ length: count }, (_, i) => wrap01((i + 2 * pulseTravel(p, 0.2, 0.6)) / count)).sort();
  assert.deepEqual(at(0.9999).map((x) => x.toFixed(6)), at(0).map((x) => x.toFixed(6)));
});

test("stage lookup follows phase and wraps", () => {
  const stages = [{ start: 0, label: "a" }, { start: 0.3, label: "b" }, { start: 0.7, label: "c" }];
  assert.equal(stageIndexAt(stages, 0), 0);
  assert.equal(stageIndexAt(stages, 0.3), 1);
  assert.equal(stageIndexAt(stages, 0.95), 2);
  assert.equal(stageIndexAt(stages, 1.1), 0);
  assert.throws(() => stageIndexAt([], 0));
});

test("phase advances by speed over duration, ignores long frame gaps and steps both ways", () => {
  assert.ok(Math.abs(advancePhase(0, 0.1, 2, 1) - 0.05) < 1e-12);
  assert.ok(Math.abs(advancePhase(0, 0.1, 2, 0.5) - 0.025) < 1e-12);
  assert.ok(Math.abs(advancePhase(0.98, 0.1, 2, 1) - 0.03) < 1e-12);
  assert.ok(Math.abs(advancePhase(0, 5, 1, 1) - maxFrameSeconds) < 1e-12, "a tab coming back from background does not jump");
  assert.equal(advancePhase(0.5, -1, 1, 1), 0.5);
  assert.throws(() => advancePhase(0, 0.1, 0, 1));
  assert.ok(Math.abs(stepPhase(0.99) - 0.015) < 1e-12);
  assert.ok(Math.abs(stepPhase(0.01, -1) - 0.985) < 1e-12);
});
