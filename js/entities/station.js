'use strict';

class Station extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.movable = false;
    this.spawnQueue = 2;
    this.spawnLocation = undefined;
    this.timer = new Timer(60);
  };
};