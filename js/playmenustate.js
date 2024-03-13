'use strict';

class PlayMenuState extends State {
  constructor(game) {
    super(game);
    // Assets
    // Items
    this.indicatorX = (this.game.screenWidth * 0.5) - 112;
    this.indicatorWidth = 224;
    this.itemSize = 32;
    this.itemStartX = this.game.screenWidth * 0.5;
    this.itemStartY = this.game.screenHeight * 0.25;
    this.itemFont = `${this.itemSize}px Monospace`;
    this.itemAlignment = "center";
    this.itemBaseColor = "rgb(0,255,255)";
    this.itemHighlightColor = "rgb(255,255,255)";
    this.items = ["Resume", "Options", "Help", "Quit"];
    this.selectedItem = 0;
  };
  update(dt) {
    // User Input
    if (this.game.keys.isUp("Enter")) {
      switch(this.items[this.selectedItem]) {
        case "Resume":
          this.leave();
          break;
        case "Options":
          new OptionState(this.game).enter();
          break;
        case "Help":
          new HelpState(this.game).enter();
          break;
        case "Quit":
          this.reset();
          break;
        default:
          break;
      }
    }
    if (this.game.keys.isUp("ArrowUp")) {
      this.selectedItem = Math.max(0, this.selectedItem - 1);
    }
    if (this.game.keys.isUp("ArrowDown")) {
      this.selectedItem = Math.min(this.items.length - 1, this.selectedItem + 1);
    }
  };
  render(ctx) {
    // Background Image
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    ctx.font = "Bold 48px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(
      "- Game Paused -"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,0
    );
    // UI Selection
    ctx.fillStyle = "rgb(255,0,0,0.75)";
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