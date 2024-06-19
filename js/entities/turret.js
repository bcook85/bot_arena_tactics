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
    this.targetRange = 9.0;
    this.bulletDamage = 12;
    this.bulletSpeed = 24 / 60;
    this.bulletRadius = 0.35;
    this.barrels = [
      new Vector(1, 1).normalize(),
      new Vector(1, -1).normalize()
    ];
    this.weaponCooldown = new Timer(20);
    this.randomTurn = new Timer(300 + Math.floor((Math.random() * 120) - 60));
    this.fire = false;
  };
};