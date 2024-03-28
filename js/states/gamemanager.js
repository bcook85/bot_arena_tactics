'use strict';

class GameManager {
  constructor(mapID) {
    // Map
    this.mapID = mapID;
    this.map = new GameMap();
    this.map.load(MAPS[this.mapID]);
    // Teams
    this.redTeam = new Team(
      this.map.redTeam.playerSpawn,
      this.map.redTeam.heartSpawn,
      this.map.redTeam.droneSpawns,
      this.map.redTeam.stationSpawns
    );
    this.blueTeam = new Team(
      this.map.blueTeam.playerSpawn,
      this.map.blueTeam.heartSpawn,
      this.map.blueTeam.droneSpawns,
      this.map.blueTeam.stationSpawns
    );
    // Game Objects
    this.turrets = [];
    this.gameTimer = 0;
    this.collisionManager = new CollisionManager(
      this.map.w,
      this.map.h,
      (x, y) => this.map.getCollision(x, y)
    );
  };
  getPlayer(team) {
    if (team == 0 || team == "red") {
      return this.redTeam.player;
    } else if (team == 1 || team == "blue") {
      return this.blueTeam.player;
    }
  };
  update(dt, player1Input, player2Input) {
    this.collisionManager.reset();
    // Handle Player 1 Input
    this.redTeam.player.move.x = player1Input.move;
    this.redTeam.player.move.y = player1Input.strafe;
    this.redTeam.player.turn = player1Input.turn;
    // Handle Player 2 Input
    this.blueTeam.player.move.x = player2Input.move;
    this.blueTeam.player.move.y = player2Input.strafe;
    this.blueTeam.player.turn = player2Input.turn;

    // Update Timers

    // Update Red
    this.redTeam.update(dt, this.blueTeam, this.turrets, this.map);
    this.collisionManager.addEntity(this.redTeam.player);
    for (let i = 0; i < this.redTeam.drones.length; i++) {
      if (this.redTeam.drones[i].alive) {
        this.collisionManager.addEntity(this.redTeam.drones[i]);
      }
    }
    for (let i = 0; i < this.redTeam.stations.length; i++) {
      this.collisionManager.addEntity(this.redTeam.stations[i]);
    }
    this.collisionManager.addEntity(this.redTeam.heart);

    // Update Blue
    this.blueTeam.update(dt, this.redTeam, this.turrets, this.map);
    this.collisionManager.addEntity(this.blueTeam.player);
    for (let i = 0; i < this.blueTeam.drones.length; i++) {
      if (this.blueTeam.drones[i].alive) {
        this.collisionManager.addEntity(this.blueTeam.drones[i]);
      }
    }
    for (let i = 0; i < this.blueTeam.stations.length; i++) {
      this.collisionManager.addEntity(this.blueTeam.stations[i]);
    }
    this.collisionManager.addEntity(this.blueTeam.heart);
    
    // Calculate
    this.collisionManager.update();
  };
};