'use strict';

/*
 allows for selecting from existing maps to edit
 or create a new map with size options
*/

class MapEditorSetupState extends State {
  constructor(game) {
    super(game);
    this.selectedMap = 0;
    this.backButton = new Button(
      "Back",
      "bold 18px Monospace",
      96,
      this.game.screenHeight - 48,
      128,
      24
    );
    this.nextButton = new Button(
      "Next",
      "bold 18px Monospace",
      this.game.screenWidth - 96,
      this.game.screenHeight - 48,
      128,
      24
    );
  };
  enter() {
    super.enter();
    if (MAPS.length == 0) {
      this.leave();
      new MapEditorNewState(this.game).enter();
    }
  };
  update(dt) {
    // User Input
    this.backButton.update(this.game.mouse);
    if (this.backButton.isClick) {
      this.leave();
    }
    this.nextButton.update(this.game.mouse);
    if (this.nextButton.isClick) {
      this.game.playerData.mapEditorSelectedMap = this.selectedMap;
      new MapEditorState(this.game).enter();
    }
  };
  render(ctx) {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    ctx.font = "32px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Map Editor Setup State"
      ,Math.floor(this.game.screenWidth * 0.5)
      ,Math.floor(this.game.screenHeight * 0.5)
    );
    // Buttons
    this.backButton.render(ctx);
    this.nextButton.render(ctx);
  };
};