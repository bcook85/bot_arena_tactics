'use strict';

class GameManager {
  constructor() {
    // Player Spawns
    this.team1PlayerSpawn = undefined;
    this.team2PlayerSpawn = undefined;
    // Player Drone Spawns
    this.team1DroneSpawn1 = undefined;
    this.team1DroneSpawn2 = undefined;
    this.team2DroneSpawn1 = undefined;
    this.team2DroneSpawn2 = undefined;
    // Player Drone Stations
    this.team1DroneStation1 = undefined;
    this.team1DroneStation2 = undefined;
    this.team2DroneStation1 = undefined;
    this.team2DroneStation2 = undefined;
    // Heart Entities
    this.team1Heart = undefined;
    this.team2Heart = undefined;
    // Player Entities
    this.team1Player = undefined;
    this.team2Player = undefined;
    // Drone Entities
    this.team1Drones = [];
    this.team2Drones = [];
    // Bullet Entities
    this.team1Bullets = [];
    this.team2Bullets = [];
    // Turrent Entities
    this.turrets = [];
    // Collector Entities
    this.collectors = [];
    // Map
    this.map = undefined;
    // Collision Manager
    this.collisionManager = undefined;
    // Timers
    this.gameTimer = undefined;
    this.moneyTimer = undefined;
    this.team1DroneTimer = undefined;
    this.team2DroneTimer = undefined;
    this.team1RespawnTimer = undefined;
    this.team2RespawnTimer = undefined;
    // Money
    this.team1Money = 0;
    this.team2Money = 0;
  };
  update(dt, player1Input, player2Input) {
    // Handle Player 1 Input
    // Handle Player 2 Input

    // Update Timers

    // 
  };
};