import "./style.css";

import { createGameEngine } from "./core/GameEngine.js";
import { CanvasRenderer } from "./rendering/CanvasRenderer.js";
import { BoardRenderer } from "./rendering/BoardRenderer.js";
import { BlockRenderer } from "./rendering/BlockRenderer.js";
import { PathRenderer } from "./rendering/PathRenderer.js";
import { EffectsRenderer } from "./rendering/EffectsRenderer.js";
import { ParticleSystem } from "./rendering/ParticleSystem.js";
import { AnimationSystem } from "./rendering/AnimationSystem.js";
import { TouchController } from "./input/TouchController.js";
import { ScreenManager } from "./ui/ScreenManager.js";
import { FeedbackManager } from "./feedback/FeedbackManager.js";

const app = document.querySelector("#app");
app.innerHTML = `
  <main class="game">
    <header class="game-header">
      <div><h1>Game Block</h1><span id="game-status">Classic</span></div>
      <div class="header-actions"><div class="score"><small>SCORE</small><strong id="score">0</strong></div><button class="icon-button" id="pause-button" aria-label="Pause game">Ⅱ</button></div>
    </header>
    <section class="game-board"><canvas id="game-canvas" aria-label="Game board"></canvas><div id="screen-overlay" class="screen-overlay"></div></section>
  </main>`;

const canvas = document.querySelector("#game-canvas");
const scoreElement = document.querySelector("#score");
const statusElement = document.querySelector("#game-status");
const pauseButton = document.querySelector("#pause-button");
const engine = createGameEngine({ size: 8, seed: Date.now() });
const canvasRenderer = new CanvasRenderer(canvas);
const boardRenderer = new BoardRenderer();
const blockRenderer = new BlockRenderer();
const pathRenderer = new PathRenderer();
const particles = new ParticleSystem();
const animations = new AnimationSystem();
const effectsRenderer = new EffectsRenderer(animations);
const feedback = new FeedbackManager();
const screens = new ScreenManager(document.querySelector("#screen-overlay"));
const renderers = [boardRenderer, blockRenderer, pathRenderer, particles, effectsRenderer];

function startGame() {
  engine.restart(Date.now());
  engine.generate(10);
  engine.start();
  screens.render(null);
  feedback.trigger("button");
}

function showMenu() {
  engine.cancelCurrentMove();
  if (engine.getState().phase !== "ready") engine.restart(Date.now());
  screens.render("menu");
  statusElement.textContent = "Classic";
  pauseButton.hidden = true;
}

screens.bind({
  start: startGame,
  resume: () => { engine.resume(); screens.render(null); feedback.trigger("button"); },
  menu: showMenu,
  retry: startGame,
  revive: () => { if (engine.revive()) { screens.render(null); feedback.trigger("revive"); } },
});

pauseButton.addEventListener("click", () => {
  if (engine.pause()) { screens.render("pause"); feedback.trigger("button"); }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && engine.pause()) screens.render("pause");
});

const input = new TouchController(canvas, (x, y) => {
  const state = engine.getState();
  const metrics = boardRenderer.getMetrics(state, { width: canvasRenderer.width, height: canvasRenderer.height });
  const col = Math.floor((x - metrics.offsetX) / metrics.cellSize);
  const row = Math.floor((y - metrics.offsetY) / metrics.cellSize);
  return row >= 0 && row < state.size && col >= 0 && col < state.size ? { row, col } : null;
}, {
  start: (cell) => { const accepted = engine.beginMove(cell.row, cell.col); if (accepted) feedback.trigger("cellSelected"); return accepted; },
  move: (cell) => engine.extendMove(cell.row, cell.col),
  end: () => { const result = engine.finishMove(); if (result?.accepted) feedback.trigger(result.clear.count ? "lineClear" : "moveCompleted"); },
  cancel: () => engine.cancelCurrentMove(),
});

engine.on("game:start", () => { statusElement.textContent = "Playing"; pauseButton.hidden = false; });
engine.on("game:resume", () => { statusElement.textContent = "Playing"; pauseButton.hidden = false; });
engine.on("game:over", (state) => { statusElement.textContent = "Game over"; pauseButton.hidden = true; screens.render("gameover", { score: state.score, revived: state.session.revives > 0 }); feedback.trigger("gameOver"); });
engine.on("move", (result) => {
  const clearCount = result.clear?.count ?? 0;
  if (clearCount <= 0) return;
  effectsRenderer.triggerFlash(Math.min(1, 0.4 + clearCount * 0.15));
  effectsRenderer.triggerPulse(Math.min(1, 0.35 + clearCount * 0.12));
  const state = engine.getState();
  const metrics = boardRenderer.getMetrics(state, { width: canvasRenderer.width, height: canvasRenderer.height });
  const intensity = Math.min(2, 1 + clearCount * 0.2);
  const cleared = new Set();
  for (const row of result.clear.rows ?? []) for (let col = 0; col < state.size; col += 1) cleared.add(`${row}:${col}`);
  for (const col of result.clear.columns ?? []) for (let row = 0; row < state.size; row += 1) cleared.add(`${row}:${col}`);
  for (const key of cleared) { const [row, col] = key.split(":").map(Number); const x = metrics.offsetX + (col + .5) * metrics.cellSize; const y = metrics.offsetY + (row + .5) * metrics.cellSize; particles.emitBurst(x, y, intensity); animations.addClear(x, y, metrics.cellSize, intensity); }
});

let previousTime = window.performance.now();
function render(currentTime) {
  const deltaTime = Math.min((currentTime - previousTime) / 1000, 0.05);
  previousTime = currentTime;
  const state = engine.getState();
  particles.update(deltaTime); blockRenderer.update(state, deltaTime); pathRenderer.update(state, deltaTime); animations.update(deltaTime); effectsRenderer.update(deltaTime);
  canvasRenderer.render(renderers, state); scoreElement.textContent = state.score;
  window.requestAnimationFrame(render);
}

showMenu();
window.requestAnimationFrame(render);
window.gameBlock = { engine, renderer: canvasRenderer, input };
