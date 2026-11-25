// A tiny seeded random source, so screenshot scenes and practice runs are repeatable.
export function makeRandom(seed) {
  let state = (seed >>> 0) || 1;
  return function nextRandom() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
