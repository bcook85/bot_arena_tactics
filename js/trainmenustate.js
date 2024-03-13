'use strict';

class TrainMenuState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.indicatorLeftImage = this.game.gfx.ui.cut(0, 0, 32, 32);
    this.indicatorRightImage = this.game.gfx.ui.cut(32, 0, 32, 32);
    // Items
    this.indicatorXOffset = 96;
    this.itemSize = 32;
    this.itemStartX = this.game.screenWidth * 0.5;
    this.itemStartY = this.game.screenHeight * 0.25;
    this.itemFont = `${this.itemSize}px Monospace`;
    this.itemAlignment = "center";
    this.itemBaseColor = "rgb(0,255,255)";
    this.itemHighlightColor = "rgb(255,255,255)";
    this.items = ["Resume", "Save", "Quit"];
    this.selectedItem = 0;
  };
  update(dt) {
    // User Input
    if (this.game.keys.isUp("Enter") || this.game.keys.isUp("f")) {
      switch(this.items[this.selectedItem]) {
        case "Resume":
          this.leave();
          break;
        case "Save":
          // stuff
          break;
        case "Quit":
          this.reset();
          break;
        default:
          break;
      }
    }
    if (this.game.keys.isUp("ArrowUp") || this.game.keys.isUp("w")) {
      this.selectedItem = Math.max(0, this.selectedItem - 1);
    }
    if (this.game.keys.isUp("ArrowDown") || this.game.keys.isUp("s")) {
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
      "- Training Paused -"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,0
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
    let indicatorY = this.itemStartY + ((this.selectedItem + 1) * this.itemSize);
    ctx.drawImage(
      this.indicatorLeftImage,
      this.itemStartX - this.indicatorXOffset - this.itemSize,
      indicatorY,
      this.itemSize,
      this.itemSize
    );
    ctx.drawImage(
      this.indicatorRightImage,
      this.itemStartX + this.indicatorXOffset,
      indicatorY,
      this.itemSize,
      this.itemSize
    );
  };
};