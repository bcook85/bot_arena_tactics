'use strict';

class GameManager {
  constructor(mapID) {
    // Map
    this.mapID = mapID;
    this.map = new GameMap();
    this.map.load(MAPS[this.mapID]);
    this.redHeartFlowField = new FlowField(
      this.map.w,
      this.map.h,
      this.map.redTeam.heartSpawn.x,
      this.map.redTeam.heartSpawn.y,
      (x, y) => this.map.getObject(x, y),
      (x, y) => this.map.getCollision(x, y)
    );
    this.blueHeartFlowField = new FlowField(
      this.map.w,
      this.map.h,
      this.map.blueTeam.heartSpawn.x,
      this.map.blueTeam.heartSpawn.y,
      (x, y) => this.map.getObject(x, y),
      (x, y) => this.map.getCollision(x, y)
    );
    // Teams
    this.redTeam = new Team(
      "red",
      this.map.redTeam.playerSpawn,
      this.map.redTeam.heartSpawn,
      this.map.redTeam.droneSpawns,
      this.map.redTeam.stationSpawns
    );
    this.blueTeam = new Team(
      "blue",
      this.map.blueTeam.playerSpawn,
      this.map.blueTeam.heartSpawn,
      this.map.blueTeam.droneSpawns,
      this.map.blueTeam.stationSpawns
    );
    // Game Objects
    this.turrets = [];
    this.collectors = [];
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
    this.updateTeam(dt, this.redTeam, this.blueTeam, this.blueHeartFlowField);
    this.updateTeam(dt, this.blueTeam, this.redTeam, this.redHeartFlowField);
    
    // Calculate
    this.collisionManager.update();
  };
  updateTeam(dt, team, enemyTeam, flowField) {
    // Player Updates
    team.player.applyControls(dt);
    this.collisionManager.addEntity(team.player);
    // Station Updates
    for (let i = 0; i < team.stations.length; i++) {
      let stat = team.stations[i];
      stat.timer.tick(dt);
      if (stat.spawnQueue > 0 && stat.timer.isDone()) {
        let spawn = stat.spawnLocation;
        if (this.isSpawnClear(spawn.x, spawn.y, 0.5, enemyTeam)) {
          stat.spawnQueue -= 1;
          team.drones.push(new Drone(spawn.x, spawn.y));
          stat.timer.reset();
        }
      }
      this.collisionManager.addEntity(stat);
    }
    // Drone Updates
    for (let i = 0; i < team.drones.length; i++) {
      if (!team.drones[i].alive) { continue; }
      let drone = team.drones[i];
      // Search for target
      // If no target, Navigate to Heart
      let angle = flowField.getAngle(drone.pos.x, drone.pos.y);
      if (angle !== undefined) {
        drone.move.x = 1;
        drone.angle = angle;
      } else {
        drone.move.x = 0;
      }
      drone.applyControls(dt);
      this.collisionManager.addEntity(drone);
    }
    // Heart Updates
    this.collisionManager.addEntity(team.heart);
  };
  isSpawnClear(x, y, r, enemyTeam) {
    return true;
  };
};