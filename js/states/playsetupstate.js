'use strict';

class PlaySetupState extends State {
  constructor(game) {
    super(game);
    // Map Images
    this.mapImages = [];
    for (let i = 0; i < MAPS.length; i++) {
      this.mapImages.push(GameMap.getMapImageShadow(4, MAPS[i], "rgb(255,0,0)", "rgb(63,0,0)"));
    }
    this.selectedMap = this.game.playerData.selectedMap;
    this.selectedTeam = this.game.playerData.selectedTeam;
    this.backButton = new Button(
      "Back",
      this.game.fonts.button,
      96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.playButton = new Button(
      "Play",
      this.game.fonts.button,
      this.game.screenWidth - 96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.mapDownButton = new Button(
      "<",
      this.game.fonts.button,
      32,
      this.game.screenHeight * 0.5,
      48,
      48
    );
    this.mapUpButton = new Button(
      ">",
      this.game.fonts.button,
      288,
      this.game.screenHeight * 0.5,
      48,
      48
    );
    this.redTeamButton = new Button(
      "Red",
      this.game.fonts.button,
      (this.game.screenWidth * 0.5) + 164,
      (this.game.screenHeight * 0.5) - 48,
      196,
      64
    );
    this.redTeamButton.defaultColor = "rgb(255,0,0)";
    this.blueTeamButton = new Button(
      "Blue",
      this.game.fonts.button,
      (this.game.screenWidth * 0.5) + 164,
      (this.game.screenHeight * 0.5) + 48,
      196,
      64
    );
    this.blueTeamButton.defaultColor = "rgb(0,0,255)";
  };
  update(dt) {
    // User Input
    this.backButton.update(this.game.mouse);
    if (this.backButton.isClick) {
      this.leave();
    }
    this.playButton.update(this.game.mouse);
    if (this.playButton.isClick) {
      this.game.playerData.selectedMap = this.selectedMap;
      this.game.playerData.selectedTeam = this.selectedTeam;
      new PlayState(this.game).enter();
    }
    this.mapDownButton.update(this.game.mouse);
    if (this.mapDownButton.isClick) {
      this.selectedMap -= 1;
      if (this.selectedMap < 0) {
        this.selectedMap += MAPS.length;
      }
    }
    this.mapUpButton.update(this.game.mouse);
    if (this.mapUpButton.isClick) {
      this.selectedMap += 1;
      if (this.selectedMap >= MAPS.length) {
        this.selectedMap -= MAPS.length;
      }
    }
    this.redTeamButton.update(this.game.mouse);
    if (this.redTeamButton.isClick) {
      this.selectedTeam = "red";
    }
    this.blueTeamButton.update(this.game.mouse);
    if (this.blueTeamButton.isClick) {
      this.selectedTeam = "blue";
    }
  };
  render(ctx) {
    // Background
    ctx.fillStyle = this.game.colors.menuBackground;
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    // Header
    ctx.font = this.game.fonts.header;
    ctx.fillStyle = this.game.colors.header;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Setup"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Map
    ctx.font = this.game.fonts.medium;
    ctx.fillStyle = this.game.colors.textNormal;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Map Select",
      164,64
    );
    let image = this.mapImages[this.selectedMap];
    ctx.drawImage(
      image,
      0,0,image.width,image.height,
      160 - (image.width * 0.5),
      (this.game.screenHeight * 0.5) - (image.height * 0.5),
      image.width,image.height
    );
    // Team
    ctx.font = this.game.fonts.medium;
    ctx.fillStyle = this.game.colors.textNormal;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Team Select",
      this.game.screenWidth - 164,
      64
    );
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = this.game.colors.textHighlight;
    let pos = [this.redTeamButton.left - 4, this.redTeamButton.top - 4];
    if (this.selectedTeam == "blue") {
      pos = [this.blueTeamButton.left - 4, this.blueTeamButton.top - 4];
    }
    ctx.rect(
      pos[0],
      pos[1],
      204,
      72
    );
    ctx.stroke();
    // Buttons
    this.backButton.render(ctx);
    this.playButton.render(ctx);
    this.mapDownButton.render(ctx);
    this.mapUpButton.render(ctx);
    this.redTeamButton.render(ctx);
    this.blueTeamButton.render(ctx);
  };
};