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
    this.redTeam.player.use = player1Input.use;
    this.redTeam.player.fire = player1Input.fire;
    // Handle Player 2 Input
    this.blueTeam.player.move.x = player2Input.move;
    this.blueTeam.player.move.y = player2Input.strafe;
    this.blueTeam.player.turn = player2Input.turn;
    this.blueTeam.player.use = player2Input.use;
    this.blueTeam.player.fire = player2Input.fire;

    // Update Timers

    // Update Teams
    this.updateTeam(dt, this.redTeam, this.blueTeam, this.blueHeartFlowField);
    this.updateTeam(dt, this.blueTeam, this.redTeam, this.redHeartFlowField);
    
    // Calculate
    this.collisionManager.update();
  };
  updateTeam(dt, team, enemyTeam, flowField) {
    // Player Updates
    team.player.weaponCooldown.tick(dt);
    team.player.applyControls(dt);
    if (team.player.fire) {
      team.spawnBullet(team.player);
    }
    this.collisionManager.addEntity(team.player);
    // Station Updates
    team.player.showDroneShop = 0;
    for (let i = 0; i < team.stations.length; i++) {
      let stat = team.stations[i];
      stat.timer.tick(dt);
      if (stat.spawnQueue > 0 && stat.timer.isDone()) {
        let spawn = stat.spawnLocation;
        stat.spawnQueue -= 1;
        team.drones.push(new Drone(spawn.x, spawn.y));
        stat.timer.reset();
      }
      // Player Interaction
      let pDist = Vision.objectCast(team.player.pos, team.player.angle, stat.pos, stat.radius, 1.5);
      if (pDist < 1) {
        team.player.showDroneShop = 1;
        if (team.player.use) {
          team.player.use = false;
          stat.spawnQueue += 1;
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
    // Bullet Updates
    for (let i = 0; i < team.bullets.length; i++) {
      if (!team.bullets[i].alive) { continue; }
      let bullet = team.bullets[i];
      bullet.lifeSpan.tick(dt);
      if (bullet.lifeSpan.isDone()) {
        bullet.alive = false;
        continue;
      }
      bullet.move.x = 1;
      bullet.applyControls(dt);
      if (this.map.getCollision(bullet.pos.x, bullet.pos.y)) {
        bullet.alive = false;
        continue;
      }
      if (enemyTeam.player.alive) {
        if (bullet.pos.getDistance(enemyTeam.player.pos) < bullet.radius + enemyTeam.player.radius) {
          bullet.alive = false;
          // enemyTeam.player.takeDamage(bullet.damage);
          continue;
        }
      }
      for (let j = 0; j < enemyTeam.drones.length; j++) {
        if (!enemyTeam.drones[j].alive) { continue; }
        let drone = enemyTeam.drones[j];
        if (bullet.pos.getDistance(drone.pos) > bullet.radius + drone.radius) { continue; }
        bullet.alive = false;
        drone.takeDamage(bullet.damage);
      }
      if (bullet.pos.getDistance(enemyTeam.heart.pos) < bullet.radius + enemyTeam.heart.radius) {
        bullet.alive = false;
        // enemyTeam.heart.takeDamage(bullet.damage);
        continue;
      }
      // turrets go here
    }
    // Heart Updates
    this.collisionManager.addEntity(team.heart);
  };
};