'use strict';

/*
 allows for selecting from existing maps to edit
 or create a new map with size options
*/

class MapEditorSetupState extends State {
  constructor(game) {
    super(game);
    this.sectionSelected = 0;
    this.selectedMap = 0;
  };
  enter() {
    super.enter();
    if (MAPS.length == 0) {
      new MapEditorNewState(this.game).enter();
    }
  };
  update(dt) {
    // User Input
    if (this.game.keys.isUp("Escape")) {
      this.leave();
    }
    if (this.game.keys.isUp("Enter") || this.game.keys.isUp("f")) {
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
  };
};