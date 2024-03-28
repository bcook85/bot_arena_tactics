'use strict';

class PlayState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.wallSprites = this.game.gfx.tiles.toList(32, 32);
    this.entitySprites = this.game.gfx.entities.toList(32, 32);
    this.redPlayerSprites = [0, 1, 2, 3];
    this.redDroneSprites = [4, 5, 6, 7];
    this.redStationSprite = 0;
    this.redHeartSprite = 0;
    this.redBulletSprite = [];
    this.bluePlayerSprites = [8, 9, 10, 11];
    this.blueDroneSprites = [12, 13, 14, 15];
    this.blueStationSprite = 0;
    this.blueHeartSprite = 0;
    this.blueBulletSprite = [];
    this.redTurretSprites = [];
    this.blueTurretSprites = [];
    this.unclaimedTurretSprites = [];
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
    let camPos = new Vector(this.cam.x, this.cam.y);

    // Red Player
    if (this.playerTeam == 1) {
      let player = this.gameManager.redTeam.player;
      let angle = Projector.normalizeAngle(player.pos.getAngle(camPos) - player.angle + (Math.PI * 0.25));
      let frame = Math.floor((angle / (Math.PI * 2)) * this.redPlayerSprites.length);
      if (frame >= this.redPlayerSprites.length) { poo }
      let sprite = this.entitySprites[this.redPlayerSprites[frame]];
      this.cam.projectEntity(player.pos, sprite, player.drawSize, player.zLevel);
    }
    // Red Drones
    for (let i = 0; i < this.gameManager.redTeam.drones.length; i++) {
      let drone = this.gameManager.redTeam.drones[i];
      if (drone.alive) {
        let angle = Projector.normalizeAngle(drone.pos.getAngle(camPos) + (Math.PI * 0.25));
        let sprite = this.entitySprites[this.redDroneSpries[
          Math.floor((angle / (Math.PI * 2)) * this.redDroneSpries.length)
        ]];
        this.cam.projectEntity(drone.pos, sprite, drone.drawSize, drone.zLevel);
      }
    }
    // Red Stations
    for (let i = 0; i < this.gameManager.redTeam.stations.length; i++) {
      let station = this.gameManager.redTeam.stations[i];
      this.cam.projectEntity(station.pos, this.entitySprites[this.redStationSprite], station.drawSize, station.zLevel);
    }
    // Red Heart
    let redHeart = this.gameManager.redTeam.heart;
    this.cam.projectEntity(redHeart.pos, this.entitySprites[this.redHeartSprite], redHeart.drawSize, redHeart.zLevel);

    // Blue Player
    if (this.playerTeam == 0) {
      let player = this.gameManager.blueTeam.player;
      let angle = Projector.normalizeAngle(player.pos.getAngle(camPos) + (Math.PI * 0.25) - player.angle);
      let frame = Math.floor((angle / (Math.PI * 2)) * this.bluePlayerSprites.length);
      if (frame >= this.bluePlayerSprites.length || frame < 0) { poo }
      let sprite = this.entitySprites[this.bluePlayerSprites[frame]];
      this.cam.projectEntity(player.pos, sprite, player.drawSize, player.zLevel);
    }
    // Blue Drones
    for (let i = 0; i < this.gameManager.blueTeam.drones.length; i++) {
      let drone = this.gameManager.blueTeam.drones[i];
      if (drone.alive) {
        let angle = Projector.normalizeAngle(drone.pos.getAngle(camPos) + (Math.PI * 0.25));
        let sprite = this.entitySprites[this.blueDroneSpries[
          Math.floor((angle / (Math.PI * 2)) * this.blueDroneSpries.length)
        ]];
        this.cam.projectEntity(drone.pos, sprite, drone.drawSize, drone.zLevel);
      }
    }
    // Blue Stations
    for (let i = 0; i < this.gameManager.blueTeam.stations.length; i++) {
      let station = this.gameManager.blueTeam.stations[i];
      this.cam.projectEntity(station.pos, this.entitySprites[this.blueStationSprite], station.drawSize, station.zLevel);
    }
    // Blue Heart
    let blueHeart = this.gameManager.blueTeam.heart;
    this.cam.projectEntity(blueHeart.pos, this.entitySprites[this.blueHeartSprite], blueHeart.drawSize, blueHeart.zLevel);
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
    if (this.game.keys.isDown("w")) {
      gameControls.move += 1;
    }
    if (this.game.keys.isDown("s")) {
      gameControls.move -= 1;
    }
    if (this.game.keys.isDown("a")) {
      gameControls.strafe -= 1;
    }
    if (this.game.keys.isDown("d")) {
      gameControls.strafe += 1;
    }
    if (this.game.keys.isDown("q")) {
      gameControls.turn -= 1;
    }
    if (this.game.keys.isDown("e")) {
      gameControls.turn += 1;
    }
    if (this.game.keys.isDown("f")) {
      gameControls.use += 1;
    }
    if (this.game.keys.isDown(" ")) {
      gameControls.fire += 1;
    }
    return gameControls;
  };
};