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
    this.heart = new Heart(this.heartSpawn.x, this.heartSpawn.y);
    this.stations = [];
    for (let i = 0; i < this.stationSpawns.length; i++) {
      let stat = new Station(this.stationSpawns[i].x, this.stationSpawns[i].y);
      stat.spawnLocation = this.droneSpawns[Math.min(this.droneSpawns.length - 1, i)];
      this.stations.push(stat);
    }
  };
  update(dt, enemyTeam, turrets, map) {
    // Player
    this.player.applyControls(dt);
    // Drones
    for (let i = 0; i < this.drones.length; i++) {
      this.drones[i].applyControls(dt);
    }
    //  Stations
    for (let i = 0; i < this.stations.length; i++) {
      let stat = this.stations[i];
      stat.timer.tick(dt);
      if (stat.spawnQueue == 0) {
        continue;
      }
      if (!stat.timer.isDone()) {
        continue;
      }
      let spawn = stat.spawnLocation;
      if (this.isSpawnClear(spawn.x, spawn.y, 0.5, enemyTeam)) {
        stat.spawnQueue -= 1;
        this.drones.push(new Drone(spawn.x, spawn.y));
        stat.timer.reset();
      }
    }
    // Bullets
    for (let i = 0; i < this.bullets.length; i++) {

    }
  };
  isSpawnClear(x, y, r, enemyTeam) {

    return true;
  };
};