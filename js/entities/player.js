'use strict';

class Player extends Entity {
  constructor(x, y) {
    super(x, y, 0.35);
    this.maxHealth = 100;
    this.hp = this.maxHealth;
    this.angle = Math.PI * 2 * Math.random();
    this.moveAcceleration = 0.01 / 60;
    this.turnAcceleration = 0.1 / 60;
    this.maxMoveSpeed = 5 / 60;
    this.maxTurnSpeed = 2.5 / 60;
    this.turnDrag = 0.88;
    this.moveDrag = 0.88;
    // Interactables
    this.showDroneShop = 0;
    this.showTurretShop = 0;
    this.isNearCollector = 0;
    // Weapon
    this.targetRange = 10;
    this.bulletDamage = 4;
    this.bulletRadius = 0.2;
    this.bulletSpeed = 35 / 60;
    this.barrels = [
      new Vector(1, 1).normalize(),
      new Vector(1, -1).normalize()
    ];
    this.weaponCooldown = new Timer(10);
  };
};