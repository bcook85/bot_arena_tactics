'use strict';

class Station extends Entity {
  constructor(x, y) {
    super(x, y, 0.35);
    this.movable = false;
    this.immortal = true;
    this.spawnQueue = 5;
    this.spawnLocation = undefined;
    this.timer = new Timer(60);
  };
};