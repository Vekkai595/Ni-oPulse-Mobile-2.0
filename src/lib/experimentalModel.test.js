import test from "node:test";
import assert from "node:assert/strict";
import { calculateExperimentalOutlook } from "./experimentalModel.js";

function fixture({ anomaly = 0.8, first = 65, last = 80 } = {}) {
  return {
    current: { weeklySst: { regions: { nino34: { anomaly } } } },
    forecast: { seasons: [
      { probability: { elNino: first, neutral: 30, laNina: 5 } },
      { probability: { elNino: last, neutral: 15, laNina: 5 } },
    ] },
    sources: [{ available: true }, { available: true }, { available: true }],
  };
}

test("calculates a bounded transparent experimental signal index", () => {
  const result = calculateExperimentalOutlook(fixture());
  assert.ok(result.signalScore >= 0 && result.signalScore <= 100);
  assert.equal(Object.values(result.components).reduce((a, b) => a + b, 0), result.signalScore);
  assert.equal(result.trend, "strengthening");
});

test("returns a stable outlook when probabilities barely change", () => {
  const result = calculateExperimentalOutlook(fixture({ anomaly: 0.2, first: 45, last: 48 }));
  assert.equal(result.trend, "stable");
});


test("does not fabricate a score when ENSO data is unavailable", () => {
  const result = calculateExperimentalOutlook({ current: {}, forecast: null, sources: [] });
  assert.equal(result.signalScore, null);
  assert.equal(result.trend, "unavailable");
});
