'use strict';

class Collector extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.movable = false;
    this.timer = new Timer(300);
    this.creditsPerTick = 1;
  };
};