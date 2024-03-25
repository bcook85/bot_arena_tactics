'use strict';

/*
 allows for selecting from existing maps to edit
 or create a new map with size options
*/

class MapEditorSetupState extends State {
  constructor(game) {
    super(game);
    this.tileImages = this.game.gfx.tiles.toList(32, 32);
    this.mapImages = [];
    for (let i = 0; i < MAPS.length; i++) {
      this.mapImages.push(Map.getMapImageShadow(4, MAPS[i], "rgb(255,0,0)", "rgb(63,0,0)"));
    }
    this.selectedMap = this.game.playerData.selectedMap;
    this.backButton = new Button(
      "Back",
      "bold 18px Monospace",
      96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.nextButton = new Button(
      "Select",
      "bold 18px Monospace",
      this.game.screenWidth * 0.5,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.newMapButton = new Button(
      "New Map",
      "bold 18px Monospace",
      this.game.screenWidth - 96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.mapDownButton = new Button(
      "<",
      "bold 32px Monospace",
      (this.game.screenWidth * 0.5) - 192,
      this.game.screenHeight * 0.5,
      48,
      48
    );
    this.mapUpButton = new Button(
      ">",
      "bold 32px Monospace",
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
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    ctx.font = "bold 32px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
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