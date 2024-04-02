'use strict';

class CollisionManager {
  constructor(mapWidth, mapHeight, getCollision) {
    this.entities = [];
    this.getCollision = getCollision;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.quadTree = new QuadTree(0, 0, this.mapWidth, this.mapHeight);
  };
  addEntity(e) {
    this.entities.push(e);
    this.quadTree.addEntity(e.pos.x, e.pos.y, this.entities.length - 1);
  };
  update() {
    for (let i = 0; i < this.entities.length; i++) {
      let e1 = this.entities[i];
      if (!e1.movable) {
        continue;
      }
      // if too fast, need to repeat the below for each segment... eventually
      this.resolveMap(e1);
      let nearList = this.quadTree.query(e1.pos.x, e1.pos.y, e1.radius, []);
      for (let j = 0; j < nearList.length; j++) {
        let index = nearList[j];
        if (i != index) {
          this.resolveEntity(e1, this.entities[index]);
        }
      }
      e1.applyVelocity();
      if (this.getCollision(e1.pos.x, e1.pos.y)) {
        e1.pos = e1.spawn.copy();
      }
    }
    this.entities = [];
    this.quadTree = new QuadTree(0, 0, this.mapWidth, this.mapHeight);
  };
  resolveEntity(e1, e2) {
    if (e1.pos.getDistance(e2.pos) == 0.0) {
      e1.vel = Vector.fromAngle(Math.random() * Math.PI * 2).normalize().mul(e1.radius);
      e1.ppos = e1.pos.add(e1.vel);
      this.resolveMap(e1);
      e2.vel = Vector.fromAngle(Math.random() * Math.PI * 2).normalize().mul(e2.radius);
      e2.ppos = e2.pos.add(e2.vel);
      this.resolveMap(e2);
      return true;
    }
    let dist = e1.ppos.getDistance(e2.ppos);
    let overlap = (dist - (e1.radius + e2.radius));
    if (dist < e1.radius + e2.radius) {
      let e2ppos = e2.ppos.copy();
      if (e2.movable) {
        overlap *= 0.5;
        e2.ppos = e2.ppos.sub(e2.ppos.sub(e1.ppos).normalize().mul(overlap).div(dist));
        e2.vel = e2.ppos.sub(e2.pos);
        this.resolveMap(e2);
      }
      e1.ppos = e1.ppos.sub(e1.ppos.sub(e2ppos).normalize().mul(overlap).div(dist));
      e1.vel = e1.ppos.sub(e1.pos);
      this.resolveMap(e1);
      return true;
    }
    return false;
  };
  resolveMap(e) {
    let tl = new Vector(
      Math.floor(Math.min(e.pos.x, e.ppos.x) - e.radius) - 1,
      Math.floor(Math.min(e.pos.y, e.ppos.y) - e.radius) - 1,
    );
    let br = new Vector(
      Math.ceil(Math.max(e.pos.x, e.ppos.x) + e.radius) + 1,
      Math.ceil(Math.max(e.pos.y, e.ppos.y) + e.radius) + 1,
    );
    for (let y = tl.y; y <= br.y; y++) {
      for (let x = tl.x; x <= br.x; x++) {
        if (this.getCollision(x, y)) {
          e.ppos = e.pos.add(e.vel);
          let near = new Vector(
            Math.max(x, Math.min(e.ppos.x, x + 1)),
            Math.max(y, Math.min(e.ppos.y, y + 1))
          );
          let ray = near.sub(e.ppos);
          if (ray.x == 0 && ray.y == 0) {
            e.ppos = e.ppos.sub(e.vel.normalize().mul(e.radius));
          } else {
            let overlap = e.radius - ray.mag();
            if (overlap != undefined && overlap > 0) {
              e.ppos = e.ppos.sub(ray.normalize().mul(overlap));
            }
          }
          e.vel = Vector.fromAngle(e.pos.getAngle(e.ppos)).normalize().mul(e.pos.getDistance(e.ppos));
        }
      }
    }
  };
};
