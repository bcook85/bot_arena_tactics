'use strict';

class PlayState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.wallSprites = this.game.gfx.tiles.toList(32, 32);
    this.redPlayerSprites = [];
    this.redDroneSprites = [];
    this.redHeartSprite = [];
    this.redBulletSprite = [];
    this.bluePlayerSprites = [];
    this.blueDroneSprites = [];
    this.blueHeartSprite = [];
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
      70,
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
    this.gameManager.update(dt, controls[0], controls[1]);

    let player = this.gameManager.getPlayer(this.playerTeam);
    this.cam.set(player.pos.x, player.pos.y, player.angle);
    this.cam.projectWalls(
      (x, y) => this.gameManager.map.getCollision(x, y),
      (x, y) => this.gameManager.map.getTile(x, y)
    );
    let ai = this.gameManager.getPlayer(this.aiTeam);
  };
  render(ctx) {
    this.cam.drawBackgroundColors(ctx, "rgb(150,150,150)", "rgb(50,50,50)");
    this.cam.drawWalls(ctx);
    this.cam.drawEntities(ctx);
  };
  getAIControls() {
    return {"move": 0,"strafe": 0,"turn": 0,"fire": 0,"use": 0};
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