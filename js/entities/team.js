'use strict';

class Team {
  constructor(playerSpawn, heartSpawn, droneSpawns, droneStations) {
    // Object Locations
    this.playerSpawn = playerSpawn;
    this.droneSpawns = droneSpawns;
    this.droneStations = droneStations;
    this.credits = 0;
    // Entities
    this.player = new Player(this.playerSpawn.x, this.playerSpawn.y);
    this.drones = [];
    this.bullets = [];
    this.heart = heartSpawn
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