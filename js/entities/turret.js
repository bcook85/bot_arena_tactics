'use strict';

class Turret extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.movable = false;
    this.team = "";
    this.bulletDamage = 35;
    this.bulletSpeed = 12 / 60;
    this.bulletRadius = 0.25;
    this.cooldown = new Timer(45);
  };
};