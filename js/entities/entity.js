'use strict';

class Entity {
  constructor(x, y, r) {
    this.alive = true;
    this.movable = true;
    this.draw = true;
    this.collides = true;
    this.pos = new Vector(x, y);
    this.ppos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.radius = r;// radius
    this.angle = 0;
    this.move = new Vector(0, 0);
    this.turn = 0;
    this.moveAcceleration = 0.001 / 60;
    this.turnAcceleration = 0.001 / 60;
    this.turnSpeed = 0.0;
    this.maxMoveSpeed = 0.01 / 60;
    this.maxTurnSpeed = 0.01 / 60;
    this.turnDrag = 0.88;
    this.moveDrag = 0.88;
  };
  applyControls(dt) {
    // Calculate Turn
    if (this.turn < 0) {
      if (this.turnSpeed > 0) {
        this.turnSpeed -= this.turnAcceleration * dt;
      }
      this.turnSpeed -= this.turnAcceleration * dt;
    } else if (this.turn > 0) {
      if (this.turnSpeed < 0) {
        this.turnSpeed += this.turnAcceleration * dt;
      }
      this.turnSpeed += this.turnAcceleration * dt;
    } else {
      if (Math.abs(this.turnSpeed) < this.turnAcceleration * dt) {
        this.turnSpeed = 0.0;
      } else {
        this.turnSpeed *= this.turnDrag;
      }
    }
    // Apply Turning
    this.turnSpeed = Math.max(-1, Math.min(1, this.turnSpeed));
    this.angle += this.maxTurnSpeed * this.turnSpeed;
    // Normalize Angle
    if (this.angle < 0) {
      this.angle += Math.PI * 2;
    } else if (this.angle > Math.PI * 2) {
      this.angle -= Math.PI * 2;
    }
    // Calculate Acceleration
    let acc = new Vector(
      this.move.x * this.moveAcceleration * dt,
      this.move.y * this.moveAcceleration * dt
    ).rot(this.angle);
    // Update Velocity
    this.vel = this.vel.add(acc);
    // Apply Drag or Cap Speed at Max
    if (acc.mag() > 0) {
      let mag = this.vel.mag();
      // Cap at max speed
      let f = Math.min(this.maxMoveSpeed, mag) / mag;
      this.vel = this.vel.mul(f);
    } else {
      // Apply drag
      let mag = this.vel.mag();
      this.vel = this.vel.mul(this.moveDrag);
      if (mag < this.moveAcceleration) {
        this.vel = new Vector(0, 0);
      }
    }
    // Set Potential Position
    this.ppos = this.pos.add(this.vel);
  };
  applyVelocity() {
    this.pos = this.ppos;
  };
};
