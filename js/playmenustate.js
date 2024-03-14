'use strict';

class PlayMenuState extends State {
  constructor(game) {
    super(game);
    // Menu
    this.menu = new MenuVertical(
      ["Resume", "Options", "Help", "Quit"],
      18,
      this.game.screenWidth * 0.5,
      this.game.screenHeight * 0.5
    );
  };
  update(dt) {
    // User Input
    let userChoice = this.menu.update(this.game.keys, this.game.mouse);
    // User Input
    switch(userChoice) {
      case "Resume":
        this.leave();
        break;
      case "Options":
        new OptionState(this.game).enter();
        break;
      case "Help":
        new HelpState(this.game).enter();
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
      "- Game Paused -"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,0
    );
    // Menu
    this.menu.render(ctx);
  };
};