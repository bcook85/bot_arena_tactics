'use strict';

class Player extends Entity {
  constructor(x, y) {
    super(x, y, 0.5);
    this.angle = Math.PI * 2 * Math.random();
    this.moveAcceleration = 0.01 / 60;
    this.turnAcceleration = 0.1 / 60;
    this.maxMoveSpeed = 5 / 60;
    this.maxTurnSpeed = 2.5 / 60;
    this.turnDrag = 0.88;
    this.moveDrag = 0.88;
    this.showDroneShop = 0;
    this.showTurretShop = 0;
    this.isNearCollector = 0;
    this.use = false;
    this.fire = false;
    this.bulletDamage = 25;
    this.bulletSpeed = 15 / 60;
    this.bulletRadius = 0.25;
    this.cooldown = new Timer(30);
  };
};