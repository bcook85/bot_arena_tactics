'use strict';

class TileSelectState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.tileSheet = this.game.gfx.tiles.fullImage;
    this.tileSize = 32;
    // Tiles
    this.tileStartX = (this.game.screenWidth * 0.5) - (this.tileSheet.width * 0.5);
    this.tileStartY = (this.game.screenHeight * 0.5) - (this.tileSheet.height * 0.5);
    this.selectedTile = -1;
    this.selectedX = 0;
    this.selectedY = 0;
    // Buttons
    this.backButton = new Button(
      "Back",
      this.game.fonts.button,
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
    if (mx >= this.tileStartX &&
        mx <= this.tileStartX + this.tileSheet.width &&
        my >= this.tileStartY &&
        my <= this.tileStartY + this.tileSheet.height) {
      this.selectedX = Math.max(0, Math.min(Math.floor(this.tileSheet.width / this.tileSize) - 1,
        Math.floor((mx - this.tileStartX) / this.tileSize)
      ));
      this.selectedY = Math.max(0, Math.min(Math.floor(this.tileSheet.height / this.tileSize) - 1,
        Math.floor((my - this.tileStartY) / this.tileSize)
      ));
      this.selectedTile = (this.selectedY * Math.floor(this.tileSheet.width / this.tileSize)) + this.selectedX;
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
    // Background
    ctx.fillStyle = this.game.colors.menuBackground;
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    // Header
    ctx.font = this.game.fonts.header;
    ctx.fillStyle = this.game.colors.header;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Tile Select"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Buttons
    this.backButton.render(ctx);
    // Tiles
    let left = 
    ctx.fillStyle = this.game.colors.white;
    ctx.fillRect(
      this.tileStartX,
      this.tileStartY,
      this.tileSheet.width,
      this.tileSheet.height
    );
    ctx.drawImage(
      this.tileSheet,
      this.tileStartX,
      this.tileStartY,
      this.tileSheet.width,
      this.tileSheet.height
    );
    // Hover Tile
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = this.game.colors.textHighlight;
    ctx.rect(
      this.tileStartX + (this.selectedX * this.tileSize),
      this.tileStartY + (this.selectedY * this.tileSize),
      this.tileSize,
      this.tileSize
    );
    ctx.stroke();
  };
};