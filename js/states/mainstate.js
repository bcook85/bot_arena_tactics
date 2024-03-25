'use strict';

class MainState extends State {
  constructor(game) {
    super(game);
    // Assets
    this.backgroundImage = this.game.gfx.mainmenu.fullImage;
    // Menu Items
    this.items = ["Play", "Map Editor", "Train", "Options", "Help"];
    this.buttons = [];
    for (let i = 0; i < this.items.length; i++) {
      this.buttons.push(new Button(
        this.items[i],
        "bold 18px Monospace",
        Math.floor(this.game.screenWidth * 0.5),
        Math.floor(this.game.screenHeight * 0.5) + (i * 26) + 32,
        192,
        24
      ));
    }
  };
  update(dt) {
    // User Input
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].update(this.game.mouse);
      if (this.buttons[i].isClick) {
        switch(this.buttons[i].text) {
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
      }
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
    // Buttons
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].render(ctx);
    }
  };
};