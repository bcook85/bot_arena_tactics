'use strict';

class Team {
  constructor(id, playerSpawn, heartSpawn, droneSpawns, stationSpawns) {
    this.id = id;
    // Object Locations
    this.playerSpawn = playerSpawn;
    this.droneSpawns = droneSpawns;
    this.stationSpawns = stationSpawns;
    this.heartSpawn = heartSpawn;
    this.credits = 0;
    // Entities
    this.heart = undefined;
    this.stations = [];
    this.player = undefined;
    this.drones = [];
    this.bullets = [];
    this.spawnHeart();
    this.spawnStations();
    this.spawnPlayer();
  };
  spawnPlayer() {
    this.player = new Player(this.playerSpawn.x, this.playerSpawn.y);
    this.player.angle = this.player.pos.getAngle(this.heart.pos) - Math.PI;
    this.player.angle = Vector.normalizeAngle(this.player.angle);
  };
  spawnHeart() {
    this.heart = new Heart(this.heartSpawn.x, this.heartSpawn.y);
  };
  spawnStations() {
    this.stations = [];
    for (let i = 0; i < this.stationSpawns.length; i++) {
      let stat = new Station(this.stationSpawns[i].x, this.stationSpawns[i].y);
      stat.spawnLocation = this.droneSpawns[Math.min(this.droneSpawns.length - 1, i)];
      this.stations.push(stat);
    }
  };
  spawnBullet(ent) {
    if (!ent.weaponCooldown.isDone()) { return; }
    ent.weaponCooldown.reset();
    for (let i = 0; i < ent.barrels.length; i++) {
      let pos = ent.pos.add(ent.barrels[i].rot(ent.angle).mul(ent.radius));
      let b = new Bullet(
        pos.x,
        pos.y,
        ent.bulletRadius,
        ent.angle,
        ent.bulletDamage,
        ent.bulletSpeed
      );
      let found = false;
      for (let j = 0; j < this.bullets.length; j++) {
        if (!this.bullets[j].alive) {
          this.bullets[j] = b;
          found = true;
          break;
        }
      }
      if (!found) {
        this.bullets.push(b); 
      }
    }
  };
};