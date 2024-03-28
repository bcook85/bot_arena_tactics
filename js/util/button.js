'use strict';

class Button {
  constructor(text, font, x, y, w, h) {
    this.text = text;
    this.font = font;
    this.defaultColor = "rgb(0,255,255)";
    this.hoverColor = "rgb(255,255,255)";
    this.textAlign = "center";
    this.textBaseLine = "middle";
    this.isHover = false;
    this.isClick = false;
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
    this.left = this.x - Math.floor(this.width * 0.5);
    this.top = this.y - Math.floor(this.height * 0.5);
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  };
  update(mouse) {
    this.isHover = false;
    this.isClick = false;
    if (mouse.x > this.right) { return; }
    if (mouse.x < this.left) { return; }
    if (mouse.y < this.top) { return; }
    if (mouse.y > this.bottom) { return; }
    this.isHover = true;
    if (mouse.isUp("left") || mouse.isUp("touch")) {
      this.isClick = true;
    }
  };
  render(ctx) {
    // Hover Highlight
    if (this.isHover) {
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(
        this.left,
        this.top,
        this.width,
        this.height
      );
    }
    // Text
    ctx.fillStyle = this.isHover ? this.hoverColor : this.defaultColor;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseLine;
    ctx.fillText(this.text, this.x, this.y);
  };
};