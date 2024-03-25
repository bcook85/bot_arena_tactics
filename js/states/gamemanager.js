'use strict';

class GameManager {
  constructor(mapID) {
    // Map
    this.mapID = mapID;
    this.map = new Map();
    this.map.load(MAPS[this.mapID]);
    let redPlayerSpawn = {};
    let redHeart = {};
    let redDroneSpawns = [];
    let redDroneStations = [];
    let bluePlayerSpawn = {};
    let blueHeart = {};
    let blueDroneSpawns = [];
    let blueDroneStations = [];
    for (let i = 0; i < this.map.objects.length; i++) {
      switch (this.map.objects[i].id) {
        case 0:
          // Red Drone Station
          redDroneStations.push({
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          });
          break;
        case 1:
          // Blue Drone Station
          blueDroneStations.push({
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          });
          break;
        case 2:
          // Unclaimed Turret
          break;
        case 3:
          // Red Team Turret
          break;
        case 4:
          // Red Team Heart
          redHeart = {
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          };
          break;
        case 5:
          // Blue Team Heart
          blueHeart = {
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          };
          break;
        case 6:
          // Blue Team Turret
          break;
        case 7:
          // Nothing
          break;
        case 8:
          // Red Player Spawn
          redPlayerSpawn = {
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          };
          break;
        case 9:
          // Blue Player Spawn
          bluePlayerSpawn = {
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          };
          break;
        case 10:
          // Nothing
          break;
        case 11:
          // Nothing
          break;
        case 12:
          // Red Drone Spawn
          redDroneSpawns.push({
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          });
          break;
        case 13:
          // Blue Drone Spawn
          blueDroneSpawns.push({
            "x": this.map.objects[i].x,
            "y": this.map.objects[i].y
          });
          break;
      }
    }
    // Teams
    this.redTeam = new Team(redPlayerSpawn, redHeart, redDroneSpawns, redDroneStations);
    this.blueTeam = new Team(bluePlayerSpawn, blueHeart, blueDroneSpawns, blueDroneStations);
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
    // Handle Player 1 Input
    this.redTeam.player.move.x = player1Input.move;
    this.redTeam.player.move.y = player1Input.strafe;
    this.redTeam.player.turn = player1Input.turn;
    // Handle Player 2 Input
    this.blueTeam.player.move.x = player2Input.move;
    this.blueTeam.player.move.y = player2Input.strafe;
    this.blueTeam.player.turn = player2Input.turn;

    // Update Timers

    // Update Teams
    this.redTeam.update(dt, this.blueTeam, this.turrets, this.map);
    this.collisionManager.addEntity(this.redTeam.player);
    for (let i = 0; i < this.redTeam.drones.length; i++) {
      if (this.redTeam.drones[i].alive) {
        this.collisionManager.addEntity(this.redTeam.drones);
      }
    }
    this.blueTeam.update(dt, this.redTeam, this.turrets, this.map);
    this.collisionManager.addEntity(this.blueTeam.player);
    for (let i = 0; i < this.blueTeam.drones.length; i++) {
      if (this.blueTeam.drones[i].alive) {
        this.collisionManager.addEntity(this.blueTeam.drones);
      }
    }
    this.collisionManager.update();
    this.collisionManager.reset();
  };
};