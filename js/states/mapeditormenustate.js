'use strict';

class MapEditorMenuState extends State {
  constructor(game) {
    super(game);
    // BUttons
    this.items = ["Resume", "Save", "Quit"];
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
          case "Resume":
            this.leave();
            break;
          case "Save":
            //new OptionState(this.game).enter();
            break;
          case "Quit":
            this.reset();
            break;
          default:
            break;
        }
      }
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
      "- Map Editor Menu -"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,0
    );
    // Buttons
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].render(ctx);
    }
  };
};