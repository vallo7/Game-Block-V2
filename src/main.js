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
const effectsRenderer = new EffectsRenderer();
const particles = new ParticleSystem();
const animations = new AnimationSystem();

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
  animations.update(deltaTime);
  effectsRenderer.update(deltaTime);

  canvasRenderer.render(renderers, state);

  scoreElement.textContent = state.score;

  window.requestAnimationFrame(render);
}

engine.on("move", () => {
  effectsRenderer.triggerFlash();
});

window.requestAnimationFrame(render);

window.gameBlock = {
  engine,
  renderer: canvasRenderer,
};
