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
    this.player = undefined;
    this.drones = [];
    this.bullets = [];
    this.heart = new Heart(this.heartSpawn.x, this.heartSpawn.y);
    this.stations = [];
    for (let i = 0; i < this.stationSpawns.length; i++) {
      let stat = new Station(this.stationSpawns[i].x, this.stationSpawns[i].y);
      stat.spawnLocation = this.droneSpawns[Math.min(this.droneSpawns.length - 1, i)];
      this.stations.push(stat);
    }
    this.spawnPlayer();
  };
  spawnPlayer() {
    this.player = new Player(this.playerSpawn.x, this.playerSpawn.y);
    this.player.angle = this.player.pos.getAngle(this.heart.pos) - Math.PI;
    this.player.angle = Vector.normalizeAngle(this.player.angle);
  };
  addBullet(pos, angle, damage, speed, radius, id) {
    let b = undefined;
    for (let i = 0; i < this.bullets.length; i++) {
      if (!this.bullets[i].alive) {
        this.bullets[i] = b;
        return;
      }
    }
    this.bullets.push(b);
  };
};