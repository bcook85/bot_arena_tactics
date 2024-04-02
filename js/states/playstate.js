'use strict';

class PlayState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.wallSprites = this.game.gfx.tiles.toList(32, 32);
    this.entitySprites = this.game.gfx.entities.toList(32, 32);
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
    this.redTurretSprites = [];
    this.blueTurretSprites = [];
    this.unclaimedTurretSprites = [];
    this.playerSize = 0.75;
    this.droneSize = 0.65;
    this.heartSize = 1.0;
    this.stationSize = 0.75;
    // Game
    this.gameManager = new GameManager(this.game.playerData.selectedMap);
    // Player & AI
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
  };
  update(dt) {
    // User Input
    if (this.game.keys.isUp("Escape")) {
      new PlayMenuState(this.game).enter();
      return;
    }
    let controls = [];
    controls[this.playerTeam] = this.getKeyboardControls();
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
  };
  projectEntities() {
    // Turrets
    // Collectors
    // Teams
    this.renderTeam(
      this.gameManager.redTeam,
      this.redPlayerSprites,
      this.redDroneSprites,
      this.redStationSprite,
      this.redHeartSprite
    );
    this.renderTeam(
      this.gameManager.blueTeam,
      this.bluePlayerSprites,
      this.blueDroneSprites,
      this.blueStationSprite,
      this.blueHeartSprite
    );
  };
  renderTeam(team, playerSprites, droneSprites, stationSprite, heartSprite) {
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
    // Stations
    for (let i = 0; i < team.stations.length; i++) {
      let station = team.stations[i];
      this.cam.projectEntity(station.pos.toArray(), this.entitySprites[stationSprite], this.stationSize, 0);
    }
    // Heart
    this.cam.projectEntity(team.heart.pos.toArray(), this.entitySprites[heartSprite], this.heartSize, 0);
  };
  getAIControls() {
    return {"move": 1,"strafe": 0,"turn": 1,"fire": 0,"use": 0};
  };
  getKeyboardControls() {
    let gameControls = {
      "move": 0,
      "strafe": 0,
      "turn": 0,
      "fire": 0,
      "use": 0
    };
    if (this.game.keys.isDown("w") || this.game.keys.isDown("ArrowUp")) {
      gameControls.move += 1;
    }
    if (this.game.keys.isDown("s") || this.game.keys.isDown("ArrowDown")) {
      gameControls.move -= 1;
    }
    if (this.game.keys.isDown("a")) {
      gameControls.strafe -= 1;
    }
    if (this.game.keys.isDown("d")) {
      gameControls.strafe += 1;
    }
    if (this.game.keys.isDown("q") || this.game.keys.isDown("ArrowLeft")) {
      gameControls.turn -= 1;
    }
    if (this.game.keys.isDown("e") || this.game.keys.isDown("ArrowRight")) {
      gameControls.turn += 1;
    }
    if (this.game.keys.isDown("f") || this.game.keys.isDown("Enter")) {
      gameControls.use += 1;
    }
    if (this.game.keys.isDown(" ")) {
      gameControls.fire += 1;
    }
    return gameControls;
  };
};