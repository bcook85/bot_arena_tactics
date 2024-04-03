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

class ImageButton {
  constructor(defaultImage, hoverImage, x, y, r) {
    this.defaultImage = defaultImage;
    this.hoverImage = hoverImage;
    this.x = x;
    this.y = y;
    this.r = r;
    this.isHover = false;
    this.isClick = false;
  };
  update(mouse) {
    this.isHover = false;
    this.isClick = false;
    if (mouse.isDown("left") || mouse.isDown("touch")) {
      let mx = mouse.x - this.x;
      let my = mouse.y - this.y;
      if ((mx * mx) + (my * my) > this.r * this.r) { return; }
      this.isHover = true;
      this.isClick = true;
    }
  };
  render(ctx) {
    let image = this.isHover || this.isClick ? this.hoverImage : this.defaultImage;
    ctx.drawImage(
      image,
      0,0,image.width,image.height,
      this.x - this.r, this.y - this.r, this.r * 2, this.r * 2
    );
  };
};