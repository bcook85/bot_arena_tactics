'use strict';

class MapEditorNewState extends State {
  constructor(game) {
    super(game);
    // UI Selections
    this.width = 32;
    this.widthMin = 16;
    this.widthMax = 48;
    this.height = 32;
    this.heightMin = 16;
    this.heightMax = 48;
    // Buttons
    this.backButton = new Button(
      "Back",
      this.game.fonts.button,
      96,
      this.game.screenHeight - 48,
      128,24
    );
    this.nextButton = new Button(
      "Create",
      this.game.fonts.button,
      this.game.screenWidth - 96,
      this.game.screenHeight - 48,
      128,24
    );
    this.widthDownButton = new Button(
      "<",
      this.game.fonts.button,
      Math.floor(this.game.screenWidth * 0.5) + 64,
      128,24,24
    );
    this.widthUpButton = new Button(
      ">",
      this.game.fonts.button,
      Math.floor(this.game.screenWidth * 0.5) + 128,
      128,24,24
    );
    this.heightDownButton = new Button(
      "<",
      this.game.fonts.button,
      Math.floor(this.game.screenWidth * 0.5) + 64,
      196,24,24
    );
    this.heightUpButton = new Button(
      ">",
      this.game.fonts.button,
      Math.floor(this.game.screenWidth * 0.5) + 128,
      196,24,24
    );
  };
  update(dt) {
    // User Input
    this.backButton.update(this.game.mouse);
    if (this.backButton.isClick) {
      this.leave();
    }
    this.nextButton.update(this.game.mouse);
    if (this.nextButton.isClick) {
      let newMap = new GameMap();
      newMap.create(this.width, this.height);
      MAPS.push(newMap);
      this.game.playerData.selectedMap = MAPS.length - 1;
      new MapEditorState(this.game).enter();
    }
    this.widthDownButton.update(this.game.mouse);
    if (this.widthDownButton.isClick) {
      this.width = Math.max(this.widthMin, this.width - 1);
    }
    this.widthUpButton.update(this.game.mouse);
    if (this.widthUpButton.isClick) {
      this.width = Math.min(this.widthMax, this.width + 1);
    }
    this.heightDownButton.update(this.game.mouse);
    if (this.heightDownButton.isClick) {
      this.height = Math.max(this.heightMin, this.height - 1);
    }
    this.heightUpButton.update(this.game.mouse);
    if (this.heightUpButton.isClick) {
      this.height = Math.min(this.heightMax, this.height + 1);
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
      "Create New Map"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Selection Headers
    ctx.fillStyle = this.game.colors.textNormal;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = this.game.fonts.medium;
    ctx.fillText(
      "Map Width:",
      Math.floor(this.game.screenWidth * 0.5) - 32,
      128
    );
    ctx.fillText(
      "Map Height:",
      Math.floor(this.game.screenWidth * 0.5) - 32,
      196
    );
    // Selection Values
    ctx.textAlign = "center";
    ctx.fillStyle = this.game.colors.textNormal;
    ctx.fillText(
      this.width,
      Math.floor(this.game.screenWidth * 0.5) + 96,
      128
    );
    ctx.fillText(
      this.height,
      Math.floor(this.game.screenWidth * 0.5) + 96,
      196
    );
    // Buttons
    this.backButton.render(ctx);
    this.nextButton.render(ctx);
    this.widthDownButton.render(ctx);
    this.widthUpButton.render(ctx);
    this.heightDownButton.render(ctx);
    this.heightUpButton.render(ctx);
  };
};