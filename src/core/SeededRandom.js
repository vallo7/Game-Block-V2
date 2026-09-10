export function createSeededRandom(seed = 1) {
  let state = normalizeSeed(seed);

  function next() {
    state += 0x6d2b79f5;

    let value = state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(
      value ^ (value >>> 7),
      value | 61
    );

    return (
      ((value ^ (value >>> 14)) >>> 0) /
      4294967296
    );
  }

  function nextInt(max) {
    if (!Number.isInteger(max) || max <= 0) {
      throw new RangeError("max must be a positive integer");
    }

    return Math.floor(next() * max);
  }

  function pick(array) {
    if (!Array.isArray(array) || array.length === 0) {
      throw new RangeError("array must not be empty");
    }

    return array[nextInt(array.length)];
  }

  return {
    next,
    nextInt,
    pick,
  };
}

function normalizeSeed(seed) {
  if (!Number.isFinite(seed)) {
    throw new TypeError("seed must be a finite number");
  }

  return seed >>> 0;
}
