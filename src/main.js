import "./style.css";

import { createGameEngine } from "./core/GameEngine.js";

import { CanvasRenderer } from "./rendering/CanvasRenderer.js";
import { BoardRenderer } from "./rendering/BoardRenderer.js";
import { BlockRenderer } from "./rendering/BlockRenderer.js";
import { PathRenderer } from "./rendering/PathRenderer.js";
import { EffectsRenderer } from "./rendering/EffectsRenderer.js";
import { ParticleSystem } from "./rendering/ParticleSystem.js";
import { AnimationSystem } from "./rendering/AnimationSystem.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="game">
    <header class="game-header">
      <div>
        <h1>Game Block</h1>
        <span>Classic</span>
      </div>

      <div class="score">
        <small>SCORE</small>
        <strong id="score">0</strong>
      </div>
    </header>

    <section class="game-board">
      <canvas id="game-canvas"></canvas>
    </section>
  </main>
`;

const canvas = document.querySelector("#game-canvas");
const scoreElement = document.querySelector("#score");

const engine = createGameEngine({
  size: 8,
  seed: Date.now(),
});

engine.start();
engine.generate(10);

const canvasRenderer = new CanvasRenderer(canvas);

const boardRenderer = new BoardRenderer();
const blockRenderer = new BlockRenderer();
const pathRenderer = new PathRenderer();
const particles = new ParticleSystem();
const animations = new AnimationSystem();
const effectsRenderer = new EffectsRenderer(animations);

const renderers = [
  boardRenderer,
  blockRenderer,
  pathRenderer,
  particles,
  effectsRenderer,
];

let previousTime = window.performance.now();

function render(currentTime) {
  const deltaTime = Math.min(
    (currentTime - previousTime) / 1000,
    0.05
  );

  previousTime = currentTime;

  const state = engine.getState();

  particles.update(deltaTime);
  blockRenderer.update(state, deltaTime);
  pathRenderer.update(state, deltaTime);
  animations.update(deltaTime);
  effectsRenderer.update(deltaTime);

  canvasRenderer.render(renderers, state);

  scoreElement.textContent = state.score;

  window.requestAnimationFrame(render);
}

engine.on("move", (result) => {
  const clearCount = result.clear?.count ?? 0;

  if (clearCount <= 0) {
    return;
  }

  effectsRenderer.triggerFlash(
    Math.min(1, 0.4 + clearCount * 0.15)
  );

  effectsRenderer.triggerPulse(
    Math.min(1, 0.35 + clearCount * 0.12)
  );

  const state = engine.getState();

  const metrics = boardRenderer.getMetrics(
    state,
    {
      width: canvasRenderer.width,
      height: canvasRenderer.height,
    }
  );

  const intensity = Math.min(
    2,
    1 + clearCount * 0.2
  );

  for (const row of result.clear.rows ?? []) {
    for (let col = 0; col < state.size; col += 1) {
      particles.emitBurst(
        metrics.offsetX +
          (col + 0.5) * metrics.cellSize,
        metrics.offsetY +
          (row + 0.5) * metrics.cellSize,
        intensity
      );

      animations.addClear(
        metrics.offsetX +
          (col + 0.5) * metrics.cellSize,
        metrics.offsetY +
          (row + 0.5) * metrics.cellSize,
        metrics.cellSize,
        intensity
      );
    }
  }

  for (const col of result.clear.columns ?? []) {
    for (let row = 0; row < state.size; row += 1) {
      particles.emitBurst(
        metrics.offsetX +
          (col + 0.5) * metrics.cellSize,
        metrics.offsetY +
          (row + 0.5) * metrics.cellSize,
        intensity
      );

      animations.addClear(
        metrics.offsetX +
          (col + 0.5) * metrics.cellSize,
        metrics.offsetY +
          (row + 0.5) * metrics.cellSize,
        metrics.cellSize,
        intensity
      );
    }
  }
});

window.requestAnimationFrame(render);

window.gameBlock = {
  engine,
  renderer: canvasRenderer,
};
