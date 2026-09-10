export function createGestureRecognizer() {
  let active = false;
  let lastCell = null;

  function reset() {
    active = false;
    lastCell = null;
  }

  function start(cell) {
    active = true;
    lastCell = cell;
    return cell;
  }

  function move(cell) {
    if (!active || !cell) {
      return null;
    }

    if (
      lastCell &&
      lastCell.row === cell.row &&
      lastCell.col === cell.col
    ) {
      return null;
    }

    lastCell = cell;
    return cell;
  }

  return { reset, start, move };
}
