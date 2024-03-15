'use strict';

class TrainMenuState extends State {
  constructor(game) {
    super(game);
    // Menu
    this.menu = new MenuVertical(
      ["Resume", "Save", "Quit"],
      18,
      this.game.screenWidth * 0.5,
      this.game.screenHeight * 0.5
    );
  };
  update(dt) {
    // User Input
    let userChoice = this.menu.update(this.game.keys, this.game.mouse);
    switch(userChoice) {
      case "Resume":
        this.leave();
        break;
      case "Save":
        // stuff
        break;
      case "Quit":
        this.reset();
        break;
      default:
        break;
    }
  };
  render(ctx) {
    // Background Image
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    ctx.font = "Bold 48px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(
      "- Training Paused -"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,0
    );
    // Menu
    this.menu.render(ctx);
  };
};