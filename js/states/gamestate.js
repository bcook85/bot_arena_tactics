'use strict';

class GameState {
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
    for (let i = 0; i < this.map.turrets.length; i++) {
      let t = this.map.turrets[i];
      this.turrets.push(new Turret(t.pos.x, t.pos.y, t.id));
    }
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
    this.collisionManager.reset();
    
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

    // Update Turrets
    this.updateTurrets(dt);

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
      drone.weaponCooldown.tick(dt);
      let enemyTurrets = this.getTurretsByTeam(enemyTeam.id);
      let target = this.selectTargetNear(drone, enemyTurrets.concat([enemyTeam.player]).concat(enemyTeam.drones));
      if (target !== undefined) {
        drone.move.x = 0;
        drone.angle = drone.pos.getAngle(target.pos);
        team.spawnBullet(drone);
      } else {
        // If no target, Navigate to Heart
        let angle = flowField.getAngle(drone.pos.x, drone.pos.y);
        if (angle !== undefined) {
          drone.move.x = 1;
          drone.angle = angle;
        } else {
          drone.move.x = 0;
        }
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
      // Map Collision
      if (this.map.getCollision(bullet.pos.x, bullet.pos.y)) {
        bullet.alive = false;
        continue;
      }
      // Player Collision
      if (enemyTeam.player.alive) {
        if (bullet.pos.getDistance(enemyTeam.player.pos) < bullet.radius + enemyTeam.player.radius) {
          bullet.alive = false;
          // enemyTeam.player.takeDamage(bullet.damage);
          continue;
        }
      }
      // Drone Collision
      for (let j = 0; j < enemyTeam.drones.length; j++) {
        if (!enemyTeam.drones[j].alive) { continue; }
        let drone = enemyTeam.drones[j];
        if (bullet.pos.getDistance(drone.pos) > bullet.radius + drone.radius) { continue; }
        bullet.alive = false;
        drone.takeDamage(bullet.damage);
      }
      // Heart Collision
      if (bullet.pos.getDistance(enemyTeam.heart.pos) < bullet.radius + enemyTeam.heart.radius) {
        bullet.alive = false;
        // enemyTeam.heart.takeDamage(bullet.damage);
        continue;
      }
      // Turret Collision
      for (let j = 0; j < this.turrets.length; j++) {
      }
    }
    // Heart Updates
    this.collisionManager.addEntity(team.heart);
  };
  updateTurrets(dt) {
    for (let i = 0; i < this.turrets.length; i++) {
      let turret = this.turrets[i];
      turret.weaponCooldown.tick(dt);
      turret.fire = false;
      switch (turret.team) {
        case "red": {
          let target = this.selectTargetNear(turret, this.blueTeam.drones.concat(this.blueTeam.player));
          if (target !== undefined) {
            turret.angle = turret.pos.getAngle(target.pos);
            turret.fire = true;
          } else {
            // If no target, "scan"
            turret.angle = Vector.normalizeAngle(turret.angle + (turret.turnSpeed * dt));
          }
          if (turret.fire) {
            this.redTeam.spawnBullet(turret);
          }
          break;
        }
        case "blue": {
          let target = this.selectTargetNear(turret, this.redTeam.drones.concat(this.redTeam.player));
          if (target !== undefined) {
            turret.angle = turret.pos.getAngle(target.pos);
            turret.fire = true;
          } else {
            // If no target, "scan"
            turret.angle = Vector.normalizeAngle(turret.angle + (turret.turnSpeed * dt));
          }
          if (turret.fire) {
            this.blueTeam.spawnBullet(turret);
          }
          break;
        }
        default: {// Unclaimed
          turret.randomTurn.tick(dt);
          if (turret.randomTurn.isDone()) {
            turret.randomTurn.reset();
            turret.angle = Math.random() * Math.PI * 2;
          }
          break;
        }
      }
      this.collisionManager.addEntity(turret);
    }
  };
  selectTargetNear(obj, enemies) {
    let dist = obj.targetRange;
    let target = undefined;
    for (let i = 0; i < enemies.length; i++) {
      if (!enemies[i].alive) {
        continue;
      }
      let d = obj.pos.getDistance(enemies[i].pos);
      let a = obj.pos.getAngle(enemies[i].pos);
      if (d < dist) {
        let wallDist = Vision.wallCast(
          obj.pos,
          a,
          (x, y) => this.map.getCollision(x, y),
          obj.targetRange
        ) * obj.targetRange;
        if (d < wallDist) {
          dist = d;
          target = enemies[i];
        }
      }
    }
    return target;
  };
  getTurretsByTeam(team) {
    let list = [];
    for (let i = 0; i < this.turrets.length; i++) {
      if (this.turrets[i].team == team) {
        list.push(this.turrets[i]);
      }
    }
    return list;
  };
};