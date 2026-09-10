import { createGameState, resetGameState } from "./GameState.js";
import {
  startMove,
  continueMove,
  cancelMove,
  endMove,
} from "./MoveSystem.js";
import { clearLines } from "./ClearSystem.js";
import { updateCombo } from "./ComboSystem.js";
import { addScore } from "./ScoreSystem.js";
import { updateDifficulty } from "./DifficultySystem.js";
import {
  generateBlocks,
} from "./GenerationSystem.js";
import {
  hasAvailableMove,
  canGenerateBlocks,
} from "./FairnessSystem.js";
import { createEventBus } from "./EventBus.js";
import { createStateMachine } from "./StateMachine.js";

const transitions = {
  ready: ["playing"],
  playing: ["gameover", "ready"],
  gameover: ["ready"],
};

export function createGameEngine(options = {}) {
  let state = createGameState(options);
  const events = createEventBus();

  const machine = createStateMachine(
    state.phase,
    transitions
  );

  function syncPhase() {
    state.phase = machine.getState();
  }

  function start() {
    if (machine.getState() === "ready") {
      machine.transition("playing");
      syncPhase();
      events.emit("game:start", state);
    }

    return state;
  }

  function move(row, col) {
    if (machine.getState() !== "playing") {
      return false;
    }

    const started = startMove(state, row, col);

    if (!started) {
      return false;
    }

    const movePath = endMove(state);

    state.lastMove = movePath;

    const lines = clearLines(state.board);

    state.lastClear = lines;

    updateCombo(state, lines.count);
    addScore(state, lines.count);
    updateDifficulty(state);

    events.emit("move", {
      move: movePath,
      clear: lines,
      score: state.score,
      combo: state.combo,
      level: state.level,
    });

    if (!hasAvailableMove(state.board)) {
      machine.transition("gameover");
      syncPhase();

      events.emit("game:over", state);
    }

    return true;
  }

  function beginMove(row, col) {
    if (machine.getState() !== "playing") {
      return false;
    }

    return startMove(state, row, col);
  }

  function extendMove(row, col) {
    if (machine.getState() !== "playing") {
      return false;
    }

    return continueMove(state, row, col);
  }

  function finishMove() {
    if (machine.getState() !== "playing") {
      return null;
    }

    return endMove(state);
  }

  function cancelCurrentMove() {
    cancelMove(state);
  }

  function generate(count, seed = state.seed) {
    if (
      !canGenerateBlocks(
        state.board,
        count
      )
    ) {
      return [];
    }

    const generated = generateBlocks(
      state.board,
      count,
      seed
    );

    events.emit(
      "blocks:generated",
      generated
    );

    return generated;
  }

  function restart(seed = state.seed) {
    if (machine.getState() === "playing") {
      machine.transition("ready");
    }

    if (machine.getState() === "gameover") {
      machine.transition("ready");
    }

    state = resetGameState(state, seed);
    machine.reset("ready");
    syncPhase();

    events.emit("game:restart", state);

    return state;
  }

  function getState() {
    return state;
  }

  function on(event, listener) {
    return events.on(event, listener);
  }

  return {
    start,
    move,
    beginMove,
    extendMove,
    finishMove,
    cancelCurrentMove,
    generate,
    restart,
    getState,
    on,
  };
      }
