'use strict';

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
  add(vec) {
    if (vec instanceof Vector) {
      return new Vector(this.x + vec.x, this.y + vec.y); 
    } else {
      return new Vector(this.x + vec, this.y + vec);
    }
  };
  sub(vec) {
    if (vec instanceof Vector) {
      return new Vector(this.x - vec.x, this.y - vec.y); 
    } else {
      return new Vector(this.x - vec, this.y - vec);
    }
  };
  rot(angle) {
    return new Vector(
      (this.x * Math.cos(angle)) - (this.y * Math.sin(angle))
      ,(this.x * Math.sin(angle)) + (this.y * Math.cos(angle))
    );
  };
  mul(vec) {
    if (vec instanceof Vector) {
      return new Vector(this.x * vec.x, this.y * vec.y); 
    } else {
      return new Vector(this.x * vec, this.y * vec);
    }
  };
  div(vec) {
    if (vec instanceof Vector) {
      return new Vector(this.x / vec.x, this.y / vec.y); 
    } else {
      return new Vector(this.x / vec, this.y / vec);
    }
  };
  normalize() {
    let m = this.mag();
    if (m != 0) {
      return this.div(m);
    }
    return this;
  };
  mag() {
    return Math.hypot(this.x, this.y);
  };
  mag2() {
    return (this.x * this.x) + (this.y * this.y);
  };
  getDistance(toVec) {
    return Math.hypot(toVec.x - this.x, toVec.y - this.y);
  };
  getAngle(toVec) {
    return Math.atan2(toVec.y - this.y, toVec.x - this.x);
  };
  getNormalizedAngle(toVec) {
    return (Math.atan2(toVec.y - this.y, toVec.x - this.x) + (Math.PI * 2)) % (Math.PI * 2);
  };
  isEqual(toVec) {
    return this.x == toVec.x && this.y == toVec.y;
  };
  copy() {
    return new Vector(this.x, this.y);
  };
  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  };
  toArray() {
    return [this.x, this.y];
  };
  static fromArray(arr) {
    return new Vector(arr[0], arr[1]);
  };
  static normalizeAngle(angle) {
    let newAngle = angle
    if (newAngle > Math.PI * 2) {
      newAngle -= Math.PI * 2;
    } else if (newAngle < 0) {
      newAngle += Math.PI * 2;
    }
    return newAngle;
  };
};