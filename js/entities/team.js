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
};