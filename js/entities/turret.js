'use strict';

class Turret extends Entity {
  constructor(x, y, team) {
    super(x, y, 0.5);
    this.maxHealth = 150;
    this.hp = this.maxHealth;
    this.angle = Math.random() * Math.PI * 2;
    this.movable = false;
    this.turnSpeed = 0.05 / 60;
    this.team = team;
    this.captureRange = 1.5;
    this.capturePoints = {};
    this.captureSpeed = 0.001;
    this.captureThreshold = 5.0;
    this.targetRange = 9.0;
    this.bulletDamage = 14;
    this.bulletSpeed = 24 / 60;
    this.bulletRadius = 0.35;
    this.barrels = [
      new Vector(1, 1).normalize(),
      new Vector(1, -1).normalize()
    ];
    this.weaponCooldown = new Timer(60);
    this.randomTurn = new Timer(300 + Math.floor((Math.random() * 120) - 60));
    this.fire = false;
  };
};