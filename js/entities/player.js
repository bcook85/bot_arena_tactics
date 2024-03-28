'use strict';

class Player extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.angle = 0;//Math.PI * 2 * Math.random();
    this.moveSpeed = 0.1;
    this.turnSpeed = 0.05;
    this.drawSize = 0.75;
    this.zLevel = 0;
  };
};