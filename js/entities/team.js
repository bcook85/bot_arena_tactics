'use strict';

class Team {
  constructor(playerSpawn, heartSpawn, droneSpawns, stationSpawns) {
    // Object Locations
    this.playerSpawn = playerSpawn;
    this.droneSpawns = droneSpawns;
    this.stationSpawns = stationSpawns;
    this.heartSpawn = heartSpawn;
    this.credits = 0;
    // Entities
    this.player = new Player(this.playerSpawn.x, this.playerSpawn.y);
    this.drones = [];
    this.bullets = [];
    this.heart = new Player(this.heartSpawn.x, this.heartSpawn.y);
    this.stations = [];
    for (let i = 0; i < this.stationSpawns.length; i++) {
      this.stations.push(new Player(this.stationSpawns[i].x, this.stationSpawns[i].y));
    }
  };
  update(dt, enemyTeam, turrets, map) {
    // Player
    this.player.applyControls(dt);
    // Drones
    for (let i = 0; i < this.drones.lenth; i++) {
      this.drones[i].applyControls(dt);
    }
    // Bullets
    for (let i = 0; i < this.bullets.length; i++) {

    }
  };
};