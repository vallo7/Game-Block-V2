export function calculateScore(
  linesCleared,
  combo = 0,
  totalCleared = 0,
  boardEmpty = false
) {
  if (
    !Number.isInteger(linesCleared) ||
    linesCleared <= 0
  ) {
    return 0;
  }

  if (
    !Number.isInteger(combo) ||
    combo < 0
  ) {
    throw new RangeError(
      "combo must be a non-negative integer"
    );
  }

  if (
    !Number.isInteger(totalCleared) ||
    totalCleared < 0
  ) {
    throw new RangeError(
      "totalCleared must be a non-negative integer"
    );
  }

  const baseScore =
    linesCleared * 100;

  const previousMilestones =
    Math.floor(totalCleared / 2);

  const nextTotal =
    totalCleared + linesCleared;

  const newMilestones =
    Math.floor(nextTotal / 2);

  const milestoneBonus =
    (newMilestones -
      previousMilestones) *
    200;

  const multiplier =
    Math.max(1, combo);

  let score =
    (baseScore + milestoneBonus) *
    multiplier;

  if (boardEmpty) {
    score += 2400;
  }

  return score;
}

export function addScore(
  state,
  linesCleared,
  boardEmpty = false
) {
  const gained = calculateScore(
    linesCleared,
    state.combo,
    state.totalCleared,
    boardEmpty
  );

  state.score += gained;

  return gained;
}
