'use strict';

class Drone extends Entity {
  constructor(x, y) {
    super(x, y, 0.25);
    this.maxHealth = 50;
    this.hp = this.maxHealth;
    this.angle = Math.PI * 2 * Math.random();
    this.moveAcceleration = 0.01 / 60;
    this.turnAcceleration = 0.01 / 60;
    this.maxMoveSpeed = 2 / 60;
    this.maxTurnSpeed = 2 / 60;
    this.turnDrag = 0.1;
    this.moveDrag = 0.1;
    this.targetRange = 5;
    this.bulletDamage = 5;
    this.bulletSpeed = 18 / 60;
    this.bulletRadius = 0.25;
    this.weaponCooldown = new Timer(45);
    this.barrels = [
      new Vector(1, 0).normalize(),
    ];
  };
};