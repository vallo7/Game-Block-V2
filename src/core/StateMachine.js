export function createStateMachine(
  initialState,
  transitions = {}
) {
  let currentState = initialState;

  function getState() {
    return currentState;
  }

  function canTransition(nextState) {
    const allowed = transitions[currentState];

    if (!allowed) {
      return false;
    }

    return allowed.includes(nextState);
  }

  function transition(nextState) {
    if (!canTransition(nextState)) {
      throw new Error(
        `Invalid transition: ${currentState} -> ${nextState}`
      );
    }

    currentState = nextState;

    return currentState;
  }

  function reset(state = initialState) {
    currentState = state;

    return currentState;
  }

  return {
    getState,
    canTransition,
    transition,
    reset,
  };
}
