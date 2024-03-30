'use strict';

class Drone extends Entity {
  constructor(x, y) {
    super(x, y, 0.25);
    this.angle = Math.PI * 2 * Math.random();
    this.moveAcceleration = 0.01 / 60;
    this.turnAcceleration = 0.01 / 60;
    this.maxMoveSpeed = 2 / 60;
    this.maxTurnSpeed = 2 / 60;
    this.turnDrag = 0.1;
    this.moveDrag = 0.1;
  };
};