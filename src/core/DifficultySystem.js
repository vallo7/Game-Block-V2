export function calculateLevel(score) {
  if (!Number.isFinite(score) || score < 0) {
    throw new RangeError("score must be a non-negative number");
  }

  return Math.floor(score / 1000) + 1;
}

export function updateDifficulty(state) {
  const previousLevel = state.level;
  const nextLevel = calculateLevel(state.score);

  state.level = nextLevel;

  return {
    level: nextLevel,
    increased: nextLevel > previousLevel,
  };
}
