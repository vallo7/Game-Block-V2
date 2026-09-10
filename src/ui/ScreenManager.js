export class ScreenManager {
  constructor(root) {
    if (!root) throw new TypeError("ScreenManager requires a root element");
    this.root = root;
    this.handlers = {};
    root.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action) this.handlers[action]?.();
    });
  }

  render(screen, data = {}) {
    const templates = {
      menu: `<section class="screen-card"><p class="eyebrow">CLASSIC</p><h1>Game Block</h1><p>Trace a path of three empty cells to place blocks and clear complete lines.</p><button class="primary-button" data-action="start">Play</button></section>`,
      pause: `<section class="screen-card"><p class="eyebrow">GAME PAUSED</p><h2>Take a breath</h2><button class="primary-button" data-action="resume">Resume</button><button class="text-button" data-action="menu">Quit to menu</button></section>`,
      gameover: `<section class="screen-card"><p class="eyebrow">NO MORE MOVES</p><h2>Game over</h2><strong class="final-score">${data.score ?? 0}</strong><span class="score-caption">score</span><p>${data.revived ? "Your revive has been used." : "A revive removes blocks to give you one more chance."}</p>${data.revived ? "" : '<button class="primary-button" data-action="revive">Revive</button>'}<button class="secondary-button" data-action="retry">Retry</button><button class="text-button" data-action="menu">Menu</button></section>`,
    };
    this.root.innerHTML = templates[screen] ?? "";
    this.root.hidden = !templates[screen];
  }

  bind(handlers) { this.handlers = handlers; }
}
