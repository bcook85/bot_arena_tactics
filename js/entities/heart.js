'use strict';

class Heart extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.maxHealth = 250;
    this.hp = this.maxHealth;
    this.movable = false;
  };
};