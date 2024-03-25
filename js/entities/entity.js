'use strict';

class Entity {
  constructor(x, y, r) {
    this.alive = true;
    this.draw = true;
    this.collides = true;
    this.pos = new Vector(x, y);
    this.ppos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.radius = r;// radius
    this.angle = 0;
    this.move = new Vector(0, 0);
    this.turn = 0;
    this.moveSpeed = 0.005;
    this.turnSpeed = 0.01;
  };
  applyControls(dt) {
    // Apply Turning
    this.angle += this.turnSpeed * dt * this.turn;
    // Normalize Angle
    if (this.angle < 0) {
      this.angle += Math.PI * 2;
    } else if (this.angle > Math.PI * 2) {
      this.angle -= Math.PI * 2;
    }
    // Apply Movement to Velocity
    this.vel = this.move.normalize().rot(this.angle).mul(this.moveSpeed * dt);
    this.ppos = this.pos.add(this.vel);
  };
  applyVelocity() {
    this.pos = this.ppos;
    this.vel = new Vector(0, 0);
  };
};
