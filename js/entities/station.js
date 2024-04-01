'use strict';

class Station extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.movable = false;
    this.angle = 0;//Math.PI * 2 * Math.random();
    this.moveAcceleration = 0.0;
    this.turnAcceleration = 0.0;
    this.maxMoveSpeed = 0.0;
    this.maxTurnSpeed = 0.0;
    this.spawnQueue = 5;
    this.spawnLocation = undefined;
    this.timer = new Timer(60);
  };
};