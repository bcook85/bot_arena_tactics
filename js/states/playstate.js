'use strict';

class PlayState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.wallSprites = this.game.gfx.tiles.toList(32, 32);
    this.entitySprites = this.game.gfx.entities.toList(32, 32);
    this.uiSprites = this.game.gfx.ui.toList(32, 32);
    this.redPlayerSprites = [0, 1, 2, 3];
    this.redDroneSprites = [4, 5, 6, 7];
    this.redStationSprite = 33;
    this.redHeartSprite = 34;
    this.redBulletSprite = [];
    this.bluePlayerSprites = [8, 9, 10, 11];
    this.blueDroneSprites = [12, 13, 14, 15];
    this.blueStationSprite = 32;
    this.blueHeartSprite = 35;
    this.blueBulletSprite = [];
    this.redTurretSprites = [20, 21, 22, 23];
    this.blueTurretSprites = [28, 29, 30, 31];
    this.unclaimedTurretSprites = [16, 17, 18, 19];
    this.redBulletSprite = 36;
    this.blueBulletSprite = 37;
    this.playerSize = 0.75;
    this.droneSize = 0.65;
    this.heartSize = 1.0;
    this.stationSize = 0.75;
    this.turretSize = 1.0;
    // Game
    this.gameManager = new GameManager(this.game.playerData.selectedMap);
    // Player & AI
    this.aiVision = new Vision(16, 60, 32);
    this.cam = new Projector(
      this.game.screenWidth,
      this.game.screenHeight,
      60,
      this.wallSprites
    );
    this.playerTeam = 0;
    this.aiTeam = 1;
    if (this.game.playerData.selectedTeam == "blue") {
      this.playerTeam = 1;
      this.aiTeam = 0;
    }
    // Touch Controls
    this.moveControlButton = new ImageButton(
      this.uiSprites[0],
      this.uiSprites[1],
      48,
      this.game.screenHeight - 48,
      32
    );
    this.turnRightControlButton = new ImageButton(
      this.uiSprites[4],
      this.uiSprites[5],
      this.game.screenWidth - 48,
      this.game.screenHeight - 32,
      16
    );
    this.turnLeftControlButton = new ImageButton(
      this.uiSprites[2],
      this.uiSprites[3],
      this.game.screenWidth - 96,
      this.game.screenHeight - 32,
      16
    );
    this.useControlButton = new ImageButton(
      this.uiSprites[0],
      this.uiSprites[1],
      this.game.screenWidth - 64,
      this.game.screenHeight - 128,
      16
    );
    this.fireControlButton = new ImageButton(
      this.uiSprites[0],
      this.uiSprites[1],
      this.game.screenWidth - 64,
      this.game.screenHeight - 80,
      16
    );
    this.menuButton = new Button(
      "Menu",
      this.game.fonts.button,
      this.game.screenWidth - 48,
      24,
      72,
      24
    );
  };
  update(dt) {
    // Open Pause Menu
    this.menuButton.update(this.game.mouse);
    if (this.game.keys.isUp("Escape") || this.menuButton.isClick) {
      new PlayMenuState(this.game).enter();
      return;
    }

    // Player Controls
    let controls = [];
    controls[this.playerTeam] = this.getPlayerControls();
    controls[this.aiTeam] = this.getAIControls();

    // Update Game
    this.gameManager.update(dt, controls[0], controls[1]);

    // Project Walls
    let player = this.gameManager.getPlayer(this.playerTeam);
    this.cam.set(player.pos.x, player.pos.y, player.angle);
    this.cam.projectWalls(
      (x, y) => this.gameManager.map.getCollision(x, y),
      (x, y) => this.gameManager.map.getTile(x, y)
    );

    // Project Entities
    this.projectEntities();
  };
  render(ctx) {
    this.cam.drawBackgroundColors(ctx, "rgb(150,150,150)", "rgb(50,50,50)");
    this.cam.drawWalls(ctx);
    this.cam.drawEntities(ctx);
    // if (this.game.mouse.touchEnabled) {
    //   this.renderTouchControls(ctx);
    // }
    let player = this.gameManager.getPlayer(this.playerTeam);
    // Station Shop
    if (player.showDroneShop == 1) {
      this.renderStationMenu(ctx);
    }
  };
  projectEntities() {
    // Turrets
    for (let i = 0; i < this.gameManager.turrets.length; i++) {
      let turret = this.gameManager.turrets[i];
      let turretSprites = this.unclaimedTurretSprites;
      if (turret.team == "red") {
        turretSprites = this.redTurretSprites;
      } else if (turret.team == "blue") {
        turretSprites = this.blueTurretSprites;
      }
      let tAngle = Projector.normalizeAngle(turret.pos.getAngle(new Vector(this.cam.x, this.cam.y)) - turret.angle + (Math.PI * 0.25));
      let tFrame = Math.floor((tAngle / (Math.PI * 2)) * turretSprites.length);
      let tSprite = this.entitySprites[turretSprites[tFrame]];
      this.cam.projectEntity(turret.pos.toArray(), tSprite, this.turretSize, 0);
    }
    // Collectors
    // Teams
    this.renderTeam(
      this.gameManager.redTeam,
      this.redPlayerSprites,
      this.redDroneSprites,
      this.redStationSprite,
      this.redHeartSprite,
      this.redBulletSprite
    );
    this.renderTeam(
      this.gameManager.blueTeam,
      this.bluePlayerSprites,
      this.blueDroneSprites,
      this.blueStationSprite,
      this.blueHeartSprite,
      this.blueBulletSprite
    );
  };
  renderTeam(team, playerSprites, droneSprites, stationSprite, heartSprite, bulletSprite) {
    let camPos = new Vector(this.cam.x, this.cam.y);
    // Player
    let player = team.player;
    let pAngle = Projector.normalizeAngle(player.pos.getAngle(camPos) - player.angle + (Math.PI * 0.25));
    let pFrame = Math.floor((pAngle / (Math.PI * 2)) * playerSprites.length);
    let pSprite = this.entitySprites[playerSprites[pFrame]];
    this.cam.projectEntity(player.pos.toArray(), pSprite, this.playerSize, 0);
    // Drones
    for (let i = 0; i < team.drones.length; i++) {
      let drone = team.drones[i];
      if (!drone.alive) { continue; }
      let angle = Projector.normalizeAngle(drone.pos.getAngle(camPos) + (Math.PI * 0.25) - drone.angle);
      let frame = Math.floor((angle / (Math.PI * 2)) * droneSprites.length);
      let sprite = this.entitySprites[droneSprites[frame]];
      this.cam.projectEntity(drone.pos.toArray(), sprite, this.droneSize, 0);
    }
    // Bullets
    for (let i = 0; i < team.bullets.length; i++) {
      let bullet = team.bullets[i];
      if (!bullet.alive) { continue; }
      this.cam.projectEntity(bullet.pos.toArray(), this.entitySprites[bulletSprite], bullet.radius, 0.25);
    }
    // Stations
    for (let i = 0; i < team.stations.length; i++) {
      let station = team.stations[i];
      this.cam.projectEntity(station.pos.toArray(), this.entitySprites[stationSprite], this.stationSize, 0);
    }
    // Heart
    this.cam.projectEntity(team.heart.pos.toArray(), this.entitySprites[heartSprite], this.heartSize, 0);
  };
  renderStationMenu(ctx) {
    // Background
    ctx.fillStyle = this.game.colors.menuBackground;
    ctx.fillRect(
      Math.floor(this.game.screenWidth * 0.5) - 128,
      Math.floor(this.game.screenHeight * 0.5) - 48,
      256, 96
    );
    // Border
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = this.game.colors.textHighlight;
    ctx.rect(
      Math.floor(this.game.screenWidth * 0.5) - 128,
      Math.floor(this.game.screenHeight * 0.5) - 48,
      256, 96
    );
    ctx.stroke();
    // Purchase Text
    ctx.font = this.game.fonts.small;
    ctx.fillStyle = this.game.colors.textHighlight;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Purchase Drone for 50 Credits?"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,Math.floor(this.game.screenHeight * 0.5) - 16
    );
    ctx.fillText(
      "Press: F or ENTER"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,Math.floor(this.game.screenHeight * 0.5) + 16
    );
  };
  renderTouchControls(ctx) {
    this.moveControlButton.render(ctx);
    this.turnRightControlButton.render(ctx);
    this.turnLeftControlButton.render(ctx);
    this.useControlButton.render(ctx);
    this.fireControlButton.render(ctx);
    ctx.fillStyle = this.game.colors.menuBackground;
    ctx.fillRect(this.menuButton.left, this.menuButton.top, this.menuButton.width, this.menuButton.height);
    this.menuButton.render(ctx);
  };
  getAIControls() {
    /*let visionTypes = [
      "empty",
      "wall",
      "drone",
      "station",
      "heart",
      "turret",
      "collector",
      "unclaimedCollector",
      "unclaimedTurret",
      "enemyPlayer",
      "enemyDrone",
      "enemyStation",
      "enemyHeart",
      "enemyTurret",
      "enemyCollector"
    ];
    let visionValues = [];
    let len = visionTypes.length;
    for (let i = 0; i < len; i++) {
      let val = i / (visionTypes.length - 1);
      visionValues.push(Math.floor(val * 100) / 100);
    }*/
    return {"move": 1,"strafe": 0,"turn": 1,"fire": 0,"use": 0};
  };
  getPlayerControls() {
    let gameControls = {
      "move": 0,
      "strafe": 0,
      "turn": 0,
      "fire": 0,
      "use": 0
    };
    // if (this.game.mouse.touchEnabled) {
    //   this.moveControlButton.update(this.game.mouse);
    //   if (this.moveControlButton.isClick) {
    //     let angle = Math.atan2(
    //       this.moveControlButton.y - this.game.mouse.y,
    //       this.moveControlButton.x - this.game.mouse.x
    //     ) - (Math.PI * 0.5);//shift down 90 as 0 is ->
    //     angle = Vector.normalizeAngle(angle);
    //     if (angle > Math.PI * 1.75 || angle < Math.PI * 0.25) {
    //       gameControls.move += 1;
    //     } else if (angle > Math.PI * 0.25 && angle < Math.PI * 0.75) {
    //       gameControls.strafe += 1;
    //     } else if (angle > Math.PI * 0.75 && angle < Math.PI * 1.25) {
    //       gameControls.move -= 1;
    //     } else if (angle > Math.PI * 1.25 && angle < Math.PI * 1.75) {
    //       gameControls.strafe -= 1;
    //     }
    //   }
    //   this.turnRightControlButton.update(this.game.mouse);
    //   if (this.turnRightControlButton.isClick) {
    //     gameControls.turn += 1;
    //   }
    //   this.turnLeftControlButton.update(this.game.mouse);
    //   if (this.turnLeftControlButton.isClick) {
    //     gameControls.turn -= 1;
    //   }
    //   this.useControlButton.update(this.game.mouse);
    //   if (this.useControlButton.isClick) {
    //     gameControls.use = 1;
    //   }
    //   this.fireControlButton.update(this.game.mouse);
    //   if (this.fireControlButton.isClick) {
    //     gameControls.fire = 1;
    //   }
    // }
    if (this.game.keys.isDown("KeyW") || this.game.keys.isDown("ArrowUp")) {
    gameControls.move += 1;
    }
    if (this.game.keys.isDown("KeyS") || this.game.keys.isDown("ArrowDown")) {
      gameControls.move -= 1;
    }
    if (this.game.keys.isDown("KeyA")) {
      gameControls.strafe -= 1;
    }
    if (this.game.keys.isDown("KeyD")) {
      gameControls.strafe += 1;
    }
    if (this.game.keys.isDown("KeyQ") || this.game.keys.isDown("ArrowLeft")) {
      gameControls.turn -= 1;
    }
    if (this.game.keys.isDown("KeyE") || this.game.keys.isDown("ArrowRight")) {
      gameControls.turn += 1;
    }
    if (this.game.keys.isUp("KeyF") || this.game.keys.isUp("Enter")) {
      gameControls.use = 1;
    }
    if (this.game.keys.isDown("Space") || this.game.keys.isDown("ShiftRight")) {
      gameControls.fire = 1;
    }
    return gameControls;
  };
};