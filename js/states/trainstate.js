'use strict';

class TrainState extends State {
  constructor(game) {
    super(game);
    // Buttons
    this.menuButton = new Button(
      "Menu",
      this.game.fonts.button,
      48,32,72,24
    );
  };
  update(dt) {
    // User Input
    this.menuButton.update(this.game.mouse);
    if (this.menuButton.isClick) {
      new TrainMenuState(this.game).enter();
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
      "Training Grounds"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,32
    );
    // Buttons
    this.menuButton.render(ctx);
  };
};