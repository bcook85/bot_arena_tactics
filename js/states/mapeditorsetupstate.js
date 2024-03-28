'use strict';

class MapEditorSetupState extends State {
  constructor(game) {
    super(game);
    this.tileImages = this.game.gfx.tiles.toList(32, 32);
    this.mapImages = [];
    for (let i = 0; i < MAPS.length; i++) {
      this.mapImages.push(GameMap.getMapImageShadow(4, MAPS[i], "rgb(255,0,0)", "rgb(63,0,0)"));
    }
    this.selectedMap = this.game.playerData.selectedMap;
    this.backButton = new Button(
      "Back",
      this.game.fonts.button,
      96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.nextButton = new Button(
      "Select",
      this.game.fonts.button,
      this.game.screenWidth * 0.5,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.newMapButton = new Button(
      "New Map",
      this.game.fonts.button,
      this.game.screenWidth - 96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.mapDownButton = new Button(
      "<",
      this.game.fonts.button,
      (this.game.screenWidth * 0.5) - 192,
      this.game.screenHeight * 0.5,
      48,
      48
    );
    this.mapUpButton = new Button(
      ">",
      this.game.fonts.button,
      (this.game.screenWidth * 0.5) + 192,
      this.game.screenHeight * 0.5,
      48,
      48
    );
  };
  enter() {
    super.enter();
    if (MAPS.length == 0) {
      this.leave();
      new MapEditorNewState(this.game).enter();
    }
  };
  update(dt) {
    // User Input
    this.backButton.update(this.game.mouse);
    if (this.backButton.isClick) {
      this.leave();
    }
    this.nextButton.update(this.game.mouse);
    if (this.nextButton.isClick) {
      this.game.playerData.selectedMap = this.selectedMap;
      new MapEditorState(this.game).enter();
    }
    this.newMapButton.update(this.game.mouse);
    if (this.newMapButton.isClick) {
      new MapEditorNewState(this.game).enter();
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
      "Map Select"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Map
    let image = this.mapImages[this.selectedMap];
    ctx.drawImage(
      image,
      0,0,image.width,image.height,
      (this.game.screenWidth * 0.5) - (image.width * 0.5),
      (this.game.screenHeight * 0.5) - (image.height * 0.5),
      image.width,
      image.height
    );
    // Buttons
    this.backButton.render(ctx);
    this.nextButton.render(ctx);
    this.newMapButton.render(ctx);
    this.mapDownButton.render(ctx);
    this.mapUpButton.render(ctx);
  };
};