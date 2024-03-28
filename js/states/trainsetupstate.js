'use strict';

class TrainSetupState extends State {
  constructor(game) {
    super(game);
    // Buttons
    this.backButton = new Button(
      "Back",
      this.game.fonts.button,
      96,
      this.game.screenHeight - 32,
      128,
      24
    );
    this.trainButton = new Button(
      "Train",
      this.game.fonts.button,
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
    this.trainButton.update(this.game.mouse);
    if (this.trainButton.isClick) {
      new TrainState(this.game).enter();
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
      "Training Setup"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Buttons
    this.backButton.render(ctx);
    this.trainButton.render(ctx);
  };
};