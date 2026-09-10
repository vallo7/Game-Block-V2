import { createGestureRecognizer } from "./GestureRecognizer.js";

export class TouchController {
  constructor(canvas, getCellAtPoint, handlers = {}) {
    if (!canvas) {
      throw new TypeError("TouchController requires a canvas element");
    }

    this.canvas = canvas;
    this.getCellAtPoint = getCellAtPoint;
    this.handlers = handlers;
    this.gesture = createGestureRecognizer();
    this.pointerId = null;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);

    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerCancel);
  }

  getCell(event) {
    const bounds = this.canvas.getBoundingClientRect();
    return this.getCellAtPoint(
      event.clientX - bounds.left,
      event.clientY - bounds.top
    );
  }

  onPointerDown(event) {
    if (this.pointerId !== null) return;
    const cell = this.getCell(event);
    if (!cell || !this.handlers.start?.(cell)) return;

    this.pointerId = event.pointerId;
    this.gesture.start(cell);
    this.canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  onPointerMove(event) {
    if (event.pointerId !== this.pointerId) return;
    const cell = this.gesture.move(this.getCell(event));
    if (cell) this.handlers.move?.(cell);
    event.preventDefault();
  }

  onPointerUp(event) {
    if (event.pointerId !== this.pointerId) return;
    this.handlers.end?.();
    this.reset();
    event.preventDefault();
  }

  onPointerCancel(event) {
    if (event.pointerId !== this.pointerId) return;
    this.handlers.cancel?.();
    this.reset();
  }

  reset() {
    this.pointerId = null;
    this.gesture.reset();
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerCancel);
  }
}
