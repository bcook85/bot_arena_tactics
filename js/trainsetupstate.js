'use strict';

class TrainSetupState extends State {
  constructor(game) {
    super(game);
  };
  update(dt) {
    // User Input
    if (this.game.keys.isUp("Escape")) {
      this.leave();
    }
    if (this.game.keys.isUp("Enter") || this.game.keys.isUp("f")) {
      new TrainState(this.game).enter();
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
      "Train Setup State"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,Math.floor(this.game.screenHeight * 0.5)
    );
  };
};