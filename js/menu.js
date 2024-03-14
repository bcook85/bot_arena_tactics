'use strict';

class MenuVertical {
  constructor(items, textSize, centerX, topY) {
    this.items = items;
    this.itemAlignment = "center";
    this.itemBaseColor = "rgb(0,255,255)";
    this.itemHighlightColor = "rgb(255,255,255)";
    this.textSize = textSize;
    this.font = `bold ${textSize}px Monospace`;
    this.upKey = "ArrowUp";
    this.downKey = "ArrowDown";
    this.selectKey = "Enter";
    this.selectedItem = 0;
    // Calculate Menu Position & Size
    this.centerX = centerX;
    this.y = topY;
    this.width = 0;
    this.height = items.length * textSize;
    let tempCanvas = document.createElement("canvas");
    let ctx = tempCanvas.getContext("2d");
    ctx.font = this.font;
    for (let i = 0; i < items.length; i++) {
      let width = ctx.measureText(items[i]).width;
      if (width > this.width) {
        this.width = width;
      }
    }
    // Item Indicator
    this.indicatorAlphaMax = 0.15;
    this.indicatorAlphaMin = 0.05;
    this.indicatorDelta = 0.0025;
    this.indicatorAlpha = 0;
    this.indicatorWidth = Math.floor(this.width * 2);
    this.indicatorWidthHalf = Math.floor(this.indicatorWidth * 0.5);
  };
  update(keys, mouse) {
    let choice = "";
    // Keyboard Inputs
    if (keys.isUp(this.upKey)) {
      this.selectedItem = Math.max(0, this.selectedItem - 1);
    }
    if (keys.isUp(this.downKey)) {
      this.selectedItem = Math.min(this.items.length - 1, this.selectedItem + 1);
    }
    // Mouse Inputs
    if (mouse.x >= this.centerX - this.indicatorWidthHalf && mouse.x <= this.centerX + this.indicatorWidthHalf) {
      for (let i = 0; i < this.items.length; i++) {
        let y1 = this.y + (i * this.textSize);
        let y2 = this.y + (i * this.textSize) + this.textSize;
        if (mouse.y >= y1 && mouse.y <= y2) {
          this.selectedItem = i;
          break;
        }
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
    // Handle Selection
    if (keys.isUp(this.selectKey)) {
      choice = this.items[this.selectedItem];
    } else if (mouse.isUp("left") || mouse.isUp("touch")) {
      if (mouse.x >= this.centerX - this.indicatorWidthHalf && mouse.x <= this.centerX + this.indicatorWidthHalf &&
        mouse.y >= this.y && mouse.y <= this.y + this.height) {
        choice = this.items[this.selectedItem];
      }
    }
    return choice;
  };
  render(ctx) {
    // UI Indicator
    ctx.fillStyle = `rgba(255,255,255,${this.indicatorAlpha})`;
    ctx.fillRect(
      this.centerX - this.indicatorWidthHalf,
      this.y + (this.selectedItem * this.textSize),
      this.indicatorWidth,
      this.textSize
    );
    // UI Items
    ctx.font = this.font;
    ctx.textAlign = this.itemAlignment;
    ctx.textBaseline = "top";
    for (let i = 0; i < this.items.length; i++) {
      let color = i == this.selectedItem ? this.itemHighlightColor : this.itemBaseColor;
      ctx.fillStyle = color;
      ctx.fillText(
        this.items[i]
        ,this.centerX
        ,this.y + (i * this.textSize)
      );
    }
  };
};