'use strict';

class TrainSetupState extends State {
  constructor(game) {
    super(game);
    this.backButton = new Button(
      "Back",
      "bold 18px Monospace",
      96,
      this.game.screenHeight - 48,
      128,
      24
    );
    this.playButton = new Button(
      "Play",
      "bold 18px Monospace",
      this.game.screenWidth - 96,
      this.game.screenHeight - 48,
      128,
      24
    );
  };
  update(dt) {
    // User Input
    this.backButton.update(this.game.mouse);
    if (this.backButton.isClick) {
      this.leave();
    }
    this.playButton.update(this.game.mouse);
    if (this.playButton.isClick) {
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
    // Buttons
    this.backButton.render(ctx);
    this.playButton.render(ctx);
  };
};