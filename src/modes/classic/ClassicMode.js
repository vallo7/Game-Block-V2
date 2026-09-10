import { setCell } from "../../core/Board.js";
import { clearLines } from "../../core/ClearSystem.js";

const MIN_BLOCKS = 1;
const MAX_BLOCKS = 6;

export function createClassicMode() {
  function getRequiredBlocks(state) {
    return state.requiredBlocks;
  }

  function canValidate(state) {
    return (
      state.phase === "playing" &&
      state.path.length === state.requiredBlocks &&
      state.path.length >= MIN_BLOCKS &&
      state.path.length <= MAX_BLOCKS
    );
  }

  function placePath(state) {
    for (const cell of state.path) {
      setCell(state.board, cell.row, cell.col, "block");
    }
  }

  function applyClear(state) {
    return clearLines(state.board);
  }

  function isBoardEmpty(state) {
    return state.board.every((row) =>
      row.every((cell) => cell === null)
    );
  }

  function advanceTurn(state) {
    state.turn += 1;
    state.session.moves += 1;
  }

  function resetPath(state) {
    state.path.length = 0;
  }

  function playMove(state) {
    if (!canValidate(state)) {
      return {
        accepted: false,
        clear: {
          rows: [],
          columns: [],
          count: 0,
        },
        scoreGain: 0,
        combo: state.combo.current,
        boardEmpty: false,
      };
    }

    placePath(state);

    const clear = applyClear(state);
    const boardEmpty = isBoardEmpty(state);

    resetPath(state);
    advanceTurn(state);

    return {
      accepted: true,
      clear,
      scoreGain: 0,
      combo: state.combo.current,
      boardEmpty,
    };
  }

  return {
    getRequiredBlocks,
    canValidate,
    playMove,
  };
}
