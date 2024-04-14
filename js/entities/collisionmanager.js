'use strict';

class CollisionManager {
  constructor(mapWidth, mapHeight, getCollision) {
    this.entities = [];
    this.getCollision = getCollision;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.quadTree = new QuadTree(0, 0, this.mapWidth, this.mapHeight);
    this.friction = 0.94;
  };
  reset() {
    this.entities = [];
    this.quadTree = new QuadTree(0, 0, this.mapWidth, this.mapHeight);
  };
  addEntity(e) {
    this.resolveMap(e);
    this.entities.push(e);
    this.quadTree.addEntity(e.pos.x, e.pos.y, this.entities.length - 1);
  };
  update() {
    for (let i = 0; i < this.entities.length; i++) {
      let e1 = this.entities[i];
      if (!e1.movable) { continue; }
      let nearList = this.quadTree.query(e1.pos.x, e1.pos.y, e1.radius, []);
      for (let j = 0; j < nearList.length; j++) {
        let index = nearList[j];
        if (i == index) { continue; }
        this.resolveEntity(e1, this.entities[index]);
      }
    }
  };
  resolveEntity(e1, e2) {
    let dist = e1.pos.getDistance(e2.pos);
    let radii = e1.radius + e2.radius;
    if (dist >= radii) { return; }
    let overlap = radii - dist;
    let e1Normal = e2.pos.sub(e1.pos).normalize();
    if (e2.movable) {
      overlap *= 0.5;
      let e2Normal = e1.pos.sub(e2.pos).normalize();
      e2.pos = e2.pos.sub(e2Normal.mul(overlap));
      this.resolveMap(e2);
    }
    e1.pos = e1.pos.sub(e1Normal.mul(overlap));
    e1.vel = e1.vel.mul(this.friction);
    this.resolveMap(e1);
  };
  resolveMap(e) {
    let applyFriction = false;
    for (let y = Math.floor(e.pos.y - 1); y <= Math.floor(e.pos.y + 1); y++) {
      for (let x = Math.floor(e.pos.x - 1); x <= Math.floor(e.pos.x + 1); x++) {
        if (this.getCollision(x, y)) {
          let near = new Vector(
            Math.max(x, Math.min(e.pos.x, x + 1)),
            Math.max(y, Math.min(e.pos.y, y + 1))
          );
          let ray = near.sub(e.pos);
          if (ray.x == 0 && ray.y == 0) {
            e.pos = e.pos.sub(e.vel.normalize().mul(e.radius));
          } else {
            let overlap = e.radius - ray.mag();
            if (overlap != undefined && overlap > 0) {
              e.pos = e.pos.sub(ray.normalize().mul(overlap));
              applyFriction = true;
            }
          }
        }
      }
    }
    if (applyFriction) {
      e.vel = e.vel.mul(this.friction);
    }
  };
};
