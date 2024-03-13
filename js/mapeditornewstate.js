'use strict';

class MapEditorNewState extends State {
  constructor(game) {
    super(game);
    // Width
    this.widthMin = 16;
    this.widthMax = 48;
    this.widthIndex = 32;
    this.widthTitleX = (this.game.screenWidth * 0.5) - 32;
    this.widthY = 128;
    this.widthSliderX = (this.game.screenWidth * 0.5) + 64;
    this.widthSliderLength = 100;
    // Height
    this.heightMin = 16;
    this.heightMax = 48;
    this.heightIndex = 32;
    this.heightTitleX = (this.game.screenWidth * 0.5) - 32;
    this.heightY = 192;
    this.heightSliderX = (this.game.screenWidth * 0.5) + 64;
    this.heightSliderLength = 100;
    // UI Selector
    this.selectedItem = 0;
    this.indicatorAlphaMax = 0.15;
    this.indicatorAlphaMin = 0.05;
    this.indicatorDelta = 0.0025;
    this.indicatorAlpha = 0;
    this.indicatorWidth = 180;
  };
  update(dt) {
    // User Input
    if (this.game.keys.isUp("Escape")) {
      if (MAPS.length == 0) {
        this.reset();
      } else {
        this.leave();
      }
    }
    if (this.game.keys.isUp("ArrowUp")) {
      this.selectedItem = 0;
    }
    if (this.game.keys.isUp("ArrowDown")) {
      this.selectedItem = 1;
    }
    if (this.game.keys.isUp("ArrowLeft")) {
      if (this.selectedItem == 0) {
        this.widthIndex = Math.max(this.widthMin, this.widthIndex - 1);
      } else {
        this.heightIndex = Math.max(this.heightMin, this.heightIndex - 1);
      }
    }
    if (this.game.keys.isUp("ArrowRight")) {
      if (this.selectedItem == 0) {
        this.widthIndex = Math.min(this.widthMax, this.widthIndex + 1);
      } else {
        this.heightIndex = Math.min(this.heightMax, this.heightIndex + 1);
      }
    }
    if (this.game.keys.isUp("Enter")) {
      let newMap = new Map();
      newMap.create(this.widthIndex, this.heightIndex);
      MAPS.push(newMap);
      this.game.playerData.mapEditorSelectedMap = MAPS.length - 1;
      new MapEditorState(this.game).enter();
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
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    ctx.font = "Bold 48px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(
      "New Map Menu"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,16
    );
    // Section Selection
    let highlightY = this.widthY - 32;
    if (this.selectedItem == 1) {
      highlightY = this.heightY - 32;
    }
    ctx.fillStyle = `rgba(255,255,255,${this.indicatorAlpha})`;
    ctx.fillRect(
      32,
      highlightY,
      this.game.screenWidth - 64,
      64
    );
    // Sections
    this.renderWidthSection(ctx);
    this.renderHeightSection(ctx);
  };
  renderWidthSection(ctx) {
    // Width Section Title
    ctx.font = "Bold 16px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("Map Width:", this.widthTitleX, this.widthY);
    // Width Slider Bar
    ctx.strokeStyle = "rgb(255,0,0)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.widthSliderX, this.widthY);
    ctx.lineTo(this.widthSliderX + this.widthSliderLength, this.widthY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.widthSliderX, this.widthY - 4);
    ctx.lineTo(this.widthSliderX, this.widthY + 4);
    ctx.stroke();
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.widthMin, this.widthSliderX, this.widthY - 16);
    ctx.beginPath();
    ctx.moveTo(this.widthSliderX + this.widthSliderLength, this.widthY - 4);
    ctx.lineTo(this.widthSliderX + this.widthSliderLength, this.widthY + 4);
    ctx.stroke();
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.widthMax, this.widthSliderX + this.widthSliderLength, this.widthY - 16);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(
      this.widthSliderX + Math.floor((this.widthIndex - this.widthMin) / (this.widthMax - this.widthMin) * this.widthSliderLength) - 2,
      this.widthY - 6,
      4,
      12
    );
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(this.widthIndex, (this.game.screenWidth * 0.5), this.widthY);
  };
  renderHeightSection(ctx) {
    // Height Section Title
    ctx.font = "Bold 16px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("Map Height:", this.heightTitleX, this.heightY);
    // Height Slider Bar
    ctx.strokeStyle = "rgb(255,0,0)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.heightSliderX, this.heightY);
    ctx.lineTo(this.heightSliderX + this.heightSliderLength, this.heightY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.heightSliderX, this.heightY - 4);
    ctx.lineTo(this.heightSliderX, this.heightY + 4);
    ctx.stroke();
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.heightMin, this.heightSliderX, this.heightY - 16);
    ctx.beginPath();
    ctx.moveTo(this.heightSliderX + this.heightSliderLength, this.heightY - 4);
    ctx.lineTo(this.heightSliderX + this.heightSliderLength, this.heightY + 4);
    ctx.stroke();
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.heightMax, this.heightSliderX + this.heightSliderLength, this.heightY - 16);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(
      this.heightSliderX + Math.floor((this.heightIndex - this.heightMin) / (this.heightMax - this.heightMin) * this.heightSliderLength) - 2,
      this.heightY - 6,
      4,
      12
    );
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(this.heightIndex, (this.game.screenWidth * 0.5), this.heightY);
  };
};