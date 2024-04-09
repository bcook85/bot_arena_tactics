'use strict';

class Bullet extends Entity {
  constructor(x, y, r, a, d, s) {
    super(x, y, r);
    this.angle = a;
    this.damage = d;
    this.moveAcceleration = s;
    this.maxMoveSpeed = s;
  };
};