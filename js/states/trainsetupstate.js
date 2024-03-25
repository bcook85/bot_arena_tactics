'use strict';

class TrainSetupState extends State {
  constructor(game) {
    super(game);
    this.backButton = new Button(
      "Back",
      "bold 18px Monospace",
      96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.playButton = new Button(
      "Play",
      "bold 18px Monospace",
      this.game.screenWidth - 96,
      this.game.screenHeight - 32,
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
    ctx.font = "bold 32px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Training Setup"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Buttons
    this.backButton.render(ctx);
    this.playButton.render(ctx);
  };
};