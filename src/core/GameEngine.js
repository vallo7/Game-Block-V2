import {
  createGameState,
  resetGameState,
} from "./GameState.js";

import {
  startMove,
  continueMove,
  cancelMove,
} from "./MoveSystem.js";

import {
  updateDifficulty,
} from "./DifficultySystem.js";

import {
  generateBlocks,
} from "./GenerationSystem.js";

import {
  canGenerateBlocks,
} from "./FairnessSystem.js";

import {
  createEventBus,
} from "./EventBus.js";

import {
  createStateMachine,
} from "./StateMachine.js";

import {
  createClassicMode,
} from "../modes/classic/ClassicMode.js";

const transitions = {
  ready: ["playing"],
  playing: ["paused", "gameover", "ready"],
  paused: ["playing", "ready"],
  gameover: ["playing", "ready"],
};

export function createGameEngine(
  options = {}
) {
  let state =
    createGameState(options);

  const events =
    createEventBus();

  const mode =
    options.mode ||
    createClassicMode();

  const machine =
    createStateMachine(
      state.phase,
      transitions
    );

  function syncPhase() {
    state.phase =
      machine.getState();
  }

  function resolveMove() {
    const result =
      mode.playMove(state);

    if (!result.accepted) {
      return result;
    }

    updateDifficulty(state);

    events.emit("move", {
      move: result.move,
      clear: result.clear,
      score: state.score,
      gained: result.score,
      combo: state.combo,
      level: state.level,
      turn: state.turn,
    });

    if (result.gameover) {
      machine.transition(
        "gameover"
      );

      syncPhase();

      events.emit(
        "game:over",
        state
      );
    }

    return result;
  }

  function start() {
    if (
      machine.getState() ===
      "ready"
    ) {
      machine.transition(
        "playing"
      );

      syncPhase();

      events.emit(
        "game:start",
        state
      );
    }

    return state;
  }

  function move(row, col) {
    if (
      machine.getState() !==
      "playing"
    ) {
      return false;
    }

    const started =
      startMove(
        state,
        row,
        col
      );

    if (!started) {
      return false;
    }

    return resolveMove();
  }

  function beginMove(row, col) {
    if (
      machine.getState() !==
      "playing"
    ) {
      return false;
    }

    return startMove(
      state,
      row,
      col
    );
  }

  function extendMove(row, col) {
    if (
      machine.getState() !==
      "playing"
    ) {
      return false;
    }

    return continueMove(
      state,
      row,
      col
    );
  }

  function finishMove() {
    if (
      machine.getState() !==
      "playing"
    ) {
      return null;
    }

    if (state.path.length === 0) {
      return {
        accepted: false,
      };
    }

    return resolveMove();
  }

  function cancelCurrentMove() {
    cancelMove(state);
  }

  function generate(
    count,
    seed = state.seed
  ) {
    if (
      !canGenerateBlocks(
        state.board,
        count
      )
    ) {
      return [];
    }

    const generated =
      generateBlocks(
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

  function pause() {
    if (machine.getState() !== "playing") return false;
    machine.transition("paused");
    syncPhase();
    events.emit("game:pause", state);
    return true;
  }

  function resume() {
    if (machine.getState() !== "paused") return false;
    machine.transition("playing");
    syncPhase();
    events.emit("game:resume", state);
    return true;
  }

  function revive() {
    if (machine.getState() !== "gameover" || state.session.revives > 0) {
      return false;
    }

    for (let row = state.size - 1; row >= 0; row -= 1) {
      for (let col = state.size - 1; col >= 0; col -= 1) {
        if (state.board[row][col] === "block") state.board[row][col] = null;
        if (mode.hasPossibleMove(state.board, state.requiredBlocks)) {
          state.session.revives += 1;
          machine.transition("playing");
          syncPhase();
          events.emit("game:revive", state);
          return true;
        }
      }
    }

    return false;
  }

  function restart(
    seed = state.seed
  ) {
    if (
      machine.getState() ===
      "playing"
    ) {
      machine.transition(
        "ready"
      );
    }

    if (
      machine.getState() ===
      "gameover"
    ) {
      machine.transition(
        "ready"
      );
    }

    state =
      resetGameState(
        state,
        seed
      );

    machine.reset("ready");

    syncPhase();

    events.emit(
      "game:restart",
      state
    );

    return state;
  }

  function getState() {
    return state;
  }

  function on(
    event,
    listener
  ) {
    return events.on(
      event,
      listener
    );
  }

  return {
    start,
    move,
    beginMove,
    extendMove,
    finishMove,
    cancelCurrentMove,
    generate,
    pause,
    resume,
    revive,
    restart,
    getState,
    on,
  };
}
