'use strict';

class PlayState extends State {
  constructor(game) {
    super(game);
    this.menuButton = new Button(
      "Menu",
      "16px Monospace",
      this.game.screenWidth - 48,
      32,
      72,
      24
    );
  };
  update(dt) {
    // User Input
    this.menuButton.update(this.game.mouse);
    if (this.menuButton.isClick) {
      new PlayMenuState(this.game).enter();
    }
  };
  render(ctx) {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    ctx.font = "64px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Play State"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,Math.floor(this.game.screenHeight * 0.5)
    );
    this.menuButton.render(ctx);
  };
};