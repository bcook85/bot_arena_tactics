'use strict';

class Entity {
  constructor(x, y, r) {
    this.spawn = new Vector(x, y);
    this.alive = true;
    this.maxHealth = 10;
    this.hp = this.maxHealth;
    this.movable = true;
    this.immortal = false;
    this.draw = true;
    this.collides = true;
    this.pos = new Vector(x, y);
    this.ppos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.turnVelocity = 0.0;
    this.radius = r;// radius
    this.angle = 0;
    this.move = new Vector(0, 0);
    this.turn = 0;
    this.use = false;
    this.fire = false;
    this.moveAcceleration = 0;
    this.turnAcceleration = 0;
    this.maxMoveSpeed = 0;
    this.maxTurnSpeed = 0;
    this.turnDrag = 0;
    this.moveDrag = 0;
  };
  applyControls(dt) {
    // Calculate Turn
    if (this.turn < 0) {
      if (this.turnVelocity > 0) {
        this.turnVelocity -= this.turnAcceleration * dt;
      }
      this.turnVelocity -= this.turnAcceleration * dt;
    } else if (this.turn > 0) {
      if (this.turnVelocity < 0) {
        this.turnVelocity += this.turnAcceleration * dt;
      }
      this.turnVelocity += this.turnAcceleration * dt;
    } else {
      if (Math.abs(this.turnVelocity) < this.turnAcceleration * dt) {
        this.turnVelocity = 0.0;
      } else {
        this.turnVelocity *= this.turnDrag;
      }
    }
    // Apply Turning
    this.turnVelocity = Math.max(-1, Math.min(1, this.turnVelocity));
    this.angle += this.maxTurnSpeed * this.turnVelocity;
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
  takeDamage(amount) {
    if (this.immortal) {
      return;
    }
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }
};
