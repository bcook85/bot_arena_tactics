'use strict';

class ObjectSelectState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.objectSheet = this.game.gfx.objects.fullImage;
    this.objectSize = 32;
    // Objects
    this.objectStartX = (this.game.screenWidth * 0.5) - (this.objectSheet.width * 0.5);
    this.objectStartY = 128;
    this.selectedTile = -1;
    this.selectedX = 0;
    this.selectedY = 0;
    // Buttons
    this.backButton = new Button(
      "Back",
      "16px Monospace",
      this.game.screenWidth * 0.5,
      this.game.screenHeight - 32,
      72,
      24
    );
  };
  update(dt) {
    this.selectedTile = -1;
    // User Input
    let mx = this.game.mouse.x;
    let my = this.game.mouse.y;
    if (mx >= this.objectStartX &&
        mx <= this.objectStartX + this.objectSheet.width &&
        my >= this.objectStartY &&
        my <= this.objectStartY + this.objectSheet.height) {
      this.selectedX = Math.max(0, Math.min(Math.floor(this.objectSheet.width / this.objectSize) - 1,
        Math.floor((mx - this.objectStartX) / this.objectSize)
      ));
      this.selectedY = Math.max(0, Math.min(Math.floor(this.objectSheet.height / this.objectSize) - 1,
        Math.floor((my - this.objectStartY) / this.objectSize)
      ));
      this.selectedTile = (this.selectedY * Math.floor(this.objectSheet.width / this.objectSize)) + this.selectedX;
      if (this.game.mouse.isUp("left")) {
        this.parent.selected = this.selectedTile;
        this.leave();
      }
    }
    this.backButton.update(this.game.mouse);
    if (this.backButton.isClick) {
      this.leave();
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
      "Tile Select"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Buttons
    this.backButton.render(ctx);
    // Objects
    let left = 
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(
      this.objectStartX,
      this.objectStartY,
      this.objectSheet.width,
      this.objectSheet.height
    );
    ctx.drawImage(
      this.objectSheet,
      this.objectStartX,
      this.objectStartY,
      this.objectSheet.width,
      this.objectSheet.height
    );
    // Hover Tile
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "rgb(0,255,255)";
    ctx.rect(
      this.objectStartX + (this.selectedX * this.objectSize),
      this.objectStartY + (this.selectedY * this.objectSize),
      this.objectSize,
      this.objectSize
    );
    ctx.stroke();
  };
};