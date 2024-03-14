'use strict';

class MainState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.backgroundImage = this.game.gfx.mainmenu.fullImage;
    // Menu
    this.menu = new MenuVertical(
      ["Play", "Map Editor", "Train", "Options", "Help"],
      18,
      this.game.screenWidth * 0.5,
      this.game.screenHeight * 0.5
    );
  };
  update(dt) {
    // User Input
    let userChoice = this.menu.update(this.game.keys, this.game.mouse);
    switch(userChoice) {
      case "Play":
        new PlaySetupState(this.game).enter();
        break;
      case "Map Editor":
        new MapEditorSetupState(this.game).enter();
        break;
      case "Train":
        new TrainSetupState(this.game).enter();
        break;
      case "Options":
        new OptionState(this.game).enter();
        break;
      case "Help":
        new HelpState(this.game).enter();
        break;
      default:
        break;
    }
  };
  render(ctx) {
    // Background Image
    ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.game.screenWidth,
      this.game.screenHeight
    );
    // Menu
    this.menu.render(ctx);
  };
};