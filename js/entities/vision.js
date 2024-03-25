'use strict';

class Vision {
  constructor(rayCount, fieldOfView, maxDistance) {
    this.rayCount = rayCount;
    this.fov = fieldOfView * Math.PI / 180;
    this.fovHalf = this.fov * 0.5;
    this.maxDistance = maxDistance;
    this.rays = [];
    this.slices = [];
    // Init
    let rayAngle = this.fov / this.rayCount;
    // Wall Cast, DDA
    for (let i = 0; i < this.rayCount; i++) {
      let angle = 0 - this.fovHalf;
      angle += i * rayAngle;
      angle += rayAngle * 0.5;
      this.rays.push(angle);
    }
    // Entity "Cast"
    for (let i = 0; i < this.rayCount; i++) {
      let angle1 = 0 - this.fovHalf;
      angle1 += i * rayAngle;
      let angle2 = 0 - this.fovHalf;
      angle2 += (i + 1) * rayAngle;
      this.slices.push([angle1, angle2]);
    }
  };
  static wallCast(pos, angle, isBlocked, maxDistance) {
    let px = pos.x;
    let py = pos.y;
    let vx = Math.cos(angle);
    let vy = Math.sin(angle);
    let dx = Math.abs(1 / vx);
    let dy = Math.abs(1 / vy);
    let ox = 0;
    let oy = 0;
    let ix = 0;
    let iy = 0;
    if (vx > 0) {
      ix = 1;
      ox = (Math.floor(px) - px + 1) / vx;
    } else {
      ix = -1;
      ox = Math.abs((px - Math.floor(px)) / vx);
    }
    if (vy > 0) {
      iy = 1;
      oy = (Math.floor(py) - py + 1) / vy;
    } else {
      iy = -1;
      oy = Math.abs((py - Math.floor(py)) / vy);
    }
    let travelDistance = 0;
    while (travelDistance < maxDistance) {
      if (ox < oy) {
        px += ix;
        travelDistance = ox;
        ox += dx;
      } else {
        py += iy;
        travelDistance = oy;
        oy += dy;
      }
      if (isBlocked(px, py)) {
        return travelDistance / maxDistance;
      }
    }
    return 1;
  };
  static objectCast(pos1, pos2, slice1, slice2, maxDistance) {
    let angleToTarget = pos1.getAngle(pos2);
    let angle1 = NormalizeAngle(slice1);
    let angle2 = NormalizeAngle(slice2);
    if (angle2 < angle1) {
      angle1 = angle1 - (Math.PI * 2);
    } else {
      angleToTarget = NormalizeAngle(angleToTarget);
    }
    if (angleToTarget >= angle1 && angleToTarget <= angle2) {
      let distance = pos1.getDistance(pos2);
      if (distance < maxDistance) {
        return distance / maxDistance;
      }
    }
    return 1;
  };
  static lineVsCircle(pos, angle, circlePos, radius, maxDistance) {
    let distance = pos.getDistance(circlePos);
    if (distance < maxDistance) {
      let nx = pos.x + (Math.cos(angle) * distance);
      let ny = pos.y + (Math.sin(angle) * distance);
      if (circlePos.getDistance(new Vector(nx, ny)) <= radius) {
        return (distance - radius) / maxDistance;
      }
    }
    return 1;
  };
};
