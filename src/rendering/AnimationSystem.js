export class AnimationSystem {
  constructor() {
    this.time = 0;
    this.animations = [];
  }

  update(deltaTime) {
    this.time += deltaTime;

    for (const animation of this.animations) {
      animation.elapsed += deltaTime;
    }

    this.animations = this.animations.filter(
      (animation) => animation.elapsed < animation.duration
    );
  }

  add(animation) {
    this.animations.push({
      ...animation,
      elapsed: 0,
    });
  }

  addClear(x, y, size, intensity = 1) {
    this.add({
      type: "clear",
      x,
      y,
      size,
      intensity,
      duration: 0.45,
    });
  }

  getActive() {
    return this.animations;
  }

  clear() {
    this.animations.length = 0;
  }

  getProgress(animation) {
    if (!animation.duration) {
      return 1;
    }

    return Math.min(
      1,
      animation.elapsed / animation.duration
    );
  }

  easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }
}
