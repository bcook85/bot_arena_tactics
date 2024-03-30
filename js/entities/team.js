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
    for (let i = 0; i < 3; i++) {
      this.drones.push(new Drone(this.droneSpawns[0].x, this.droneSpawns[0].y));
      this.drones.push(new Drone(this.droneSpawns[1].x, this.droneSpawns[1].y));
    }
    this.bullets = [];
    this.heart = new Heart(this.heartSpawn.x, this.heartSpawn.y);
    this.stations = [];
    for (let i = 0; i < this.stationSpawns.length; i++) {
      this.stations.push(new Station(this.stationSpawns[i].x, this.stationSpawns[i].y));
    }
  };
  update(dt, enemyTeam, turrets, map) {
    // Player
    this.player.applyControls(dt);
    // Drones
    for (let i = 0; i < this.drones.length; i++) {
      this.drones[i].applyControls(dt);
    }
    // Bullets
    for (let i = 0; i < this.bullets.length; i++) {

    }
  };
};