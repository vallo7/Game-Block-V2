export class FeedbackManager {
  constructor(options = {}) {
    this.enabled = options.enabled ?? true;
    this.haptics = options.haptics ?? (globalThis.navigator?.vibrate?.bind(globalThis.navigator));
  }

  trigger(type) {
    if (!this.enabled) return;
    const durations = { button: 8, cellSelected: 5, moveCompleted: 10, lineClear: 18, combo: [12, 30, 18], perfect: [16, 30, 16, 30, 24], gameOver: 35, revive: [15, 20, 15] };
    const duration = durations[type];
    if (duration && this.haptics) this.haptics(duration);
  }
}
