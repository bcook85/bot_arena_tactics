'use strict';

class Player extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.angle = Math.PI * 2 * Math.random();
    this.moveAcceleration = 0.01 / 60;
    this.turnAcceleration = 0.1 / 60;
    this.maxMoveSpeed = 5 / 60;
    this.maxTurnSpeed = 2.5 / 60;
  };
};