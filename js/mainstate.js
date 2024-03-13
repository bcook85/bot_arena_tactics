'use strict';

class MainState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.backgroundImage = this.game.gfx.mainmenu.fullImage;
    // Item Indicator
    this.indicatorAlphaMax = 0.15;
    this.indicatorAlphaMin = 0.05;
    this.indicatorDelta = 0.0025;
    this.indicatorAlpha = 0;
    this.indicatorWidth = 180;
    this.indicatorX = (this.game.screenWidth * 0.5) - (this.indicatorWidth * 0.5);
    // Items
    this.itemSize = 18;
    this.itemStartX = this.game.screenWidth * 0.5;
    this.itemStartY = (this.game.screenHeight * 0.5);
    this.itemFont = `bold ${this.itemSize}px Monospace`;
    this.itemAlignment = "center";
    this.itemBaseColor = "rgb(0,255,255)";
    this.itemHighlightColor = "rgb(255,255,255)";
    this.items = ["Play", "Map Editor", "Train", "Options", "Help"];
    this.selectedItem = 0;
  };
  update(dt) {
    if (this.game.keys.isUp("ArrowUp")) {
      this.selectedItem = Math.max(0, this.selectedItem - 1);
    }
    if (this.game.keys.isUp("ArrowDown")) {
      this.selectedItem = Math.min(this.items.length - 1, this.selectedItem + 1);
    }
    // Mouse Inputs
    for (let i = 0; i < this.items.length; i++) {
      // construct a box for the "button"
      // check if mouse-hover, set selectedItem
      // if click and hover, do it
    }
    // User Input
    if (this.game.keys.isUp("Enter")) {
      switch(this.items[this.selectedItem]) {
        case "Play":
          new PlaySetupState(this.game).enter();
          break;
        case "Map Editor":
          new MapEditorSetupState(this.game).enter();
          break;
        case "Train":
          new TrainSetupState(this.game).enter();
          break;
        case "Options":
          new OptionState(this.game).enter();
          break;
        case "Help":
          new HelpState(this.game).enter();
          break;
        default:
          break;
      }
    }
    // Indicator Color
    this.indicatorAlpha += this.indicatorDelta;
    if (this.indicatorAlpha >= this.indicatorAlphaMax) {
      this.indicatorAlpha = this.indicatorAlphaMax;
      this.indicatorDelta *= -1;
    } else if (this.indicatorAlpha <= this.indicatorAlphaMin) {
      this.indicatorAlpha = this.indicatorAlphaMin;
      this.indicatorDelta *= -1;
    }
  };
  render(ctx) {
    // Background Image
    ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.game.screenWidth,
      this.game.screenHeight
    );
    // UI Indicator
    ctx.fillStyle = `rgba(255,255,255,${this.indicatorAlpha})`;
    ctx.fillRect(
      this.indicatorX,
      this.itemStartY + ((this.selectedItem + 1) * this.itemSize),
      this.indicatorWidth,
      this.itemSize
    );
    // UI Items
    ctx.font = this.itemFont;
    ctx.textAlign = this.itemAlignment;
    ctx.textBaseline = "top";
    for (let i = 0; i < this.items.length; i++) {
      let color = i == this.selectedItem ? this.itemHighlightColor : this.itemBaseColor;
      ctx.fillStyle = color;
      ctx.fillText(
        this.items[i]
        ,this.itemStartX
        ,this.itemStartY + ((i + 1) * this.itemSize)
      );
    }
  };
};