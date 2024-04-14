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
    this.bulletDamage = 35;
    this.bulletSpeed = 12 / 60;
    this.bulletRadius = 0.25;
    this.cooldown = new Timer(45);
    this.randomTurn = new Timer(300 + Math.floor((Math.random() * 120) - 60));
  };
};