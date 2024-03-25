'use strict';

class MapEditorState extends State {
  static TYPES = {
    "tile": 0,
    "collision": 1,
    "object": 2
  };
  constructor(game) {
    super(game);
    // Assets
    this.tileImages = this.game.gfx.tiles.toList(32, 32);
    this.objectImages = [];
    // Selection
    this.selected = 0;
    this.selectionType = MapEditorState.TYPES.tile;
    // Buttons
    this.menuButton = new Button(
      "Menu",
      "16px Monospace",
      128,16,116,24
    );
    this.tilesButton = new Button(
      "Tiles",
      "16px Monospace",
      256,16,116,24
    );// set selectionType, enter TileSelectState
    this.collisionButton = new Button(
      "Collision",
      "16px Monospace",
      378,16,116,24
    );
    this.objectsButton = new Button(
      "Objects",
      "16px Monospace",
      512,16,116,24
    );
    // Map
    this.tileDrawSize = 32;
    this.map = MAPS[this.game.playerData.mapEditorSelectedMap];
    this.mapMaxWidth = this.map.w * this.tileDrawSize;
    this.mapMaxHeight = this.map.h * this.tileDrawSize;
    // Camera
    this.cam = {"x": 0, "y": 0, "w": this.game.screenWidth, "h": this.game.screenHeight};
    this.camMinX = 0 - this.tileDrawSize;
    this.camMaxX = this.mapMaxWidth - this.cam.w + this.tileDrawSize;
    this.camMinY = 0 - this.tileDrawSize;
    this.camMaxY = this.mapMaxHeight - this.cam.h + this.tileDrawSize;
    this.camSpeed = 5.0;
    // Mouse
    this.tileX = 0;
    this.tileY = 0;
  };
  update(dt) {
    // Buttons
    this.menuButton.update(this.game.mouse);
    if (this.menuButton.isClick) {
      new MapEditorMenuState(this.game).enter();
      return;
    }
    this.tilesButton.update(this.game.mouse);
    if (this.tilesButton.isClick) {
      this.selectionType = MapEditorState.TYPES.tile;
      new TileSelectState(this.game).enter();
      return;
    }
    this.collisionButton.update(this.game.mouse);
    if (this.collisionButton.isClick) {
      this.selectionType = MapEditorState.TYPES.collision;
      return;
    }
    this.objectsButton.update(this.game.mouse);
    if (this.objectsButton.isClick) {
      this.selectionType = MapEditorState.TYPES.object;
      // new ObjectSelectState(this.game).enter();
      return;
    }
    // Keyboard Controls
    if (this.game.keys.isDown("w")) {
      this.cam.y = Math.max(this.camMinY, this.cam.y - this.camSpeed);
    }
    if (this.game.keys.isDown("s")) {
      this.cam.y = Math.min(this.camMaxY, this.cam.y + this.camSpeed);
    }
    if (this.game.keys.isDown("a")) {
      this.cam.x = Math.max(this.camMinX, this.cam.x - this.camSpeed);
    }
    if (this.game.keys.isDown("d")) {
      this.cam.x = Math.min(this.camMaxX, this.cam.x + this.camSpeed);
    }
    // Mouse
    this.tileX = Math.floor((this.game.mouse.x + this.cam.x) / this.tileDrawSize);
    this.tileY = Math.floor((this.game.mouse.y + this.cam.y) / this.tileDrawSize);
    if (this.tileX < 0) { return; }
    if (this.tileX >= this.map.w) { return; }
    if (this.tileY < 0) { return; }
    if (this.tileY >= this.map.h) { return; }
    switch (this.selectionType) {
      case MapEditorState.TYPES.tile:
        if (this.game.mouse.isDown("left")) {
          this.map.tiles[this.tileX][this.tileY] = this.selected;
        }
        break;
      case MapEditorState.TYPES.collision:
        if (this.game.mouse.isDown("left")) {
          this.map.collisions[this.tileX][this.tileY] = 1;
        } else if (this.game.mouse.isDown("right")) {
          this.map.collisions[this.tileX][this.tileY] = 0;
        }
        break;
      case MapEditorState.TYPES.object:
        if (this.game.mouse.isDown("left")) {
          this.map.objects[this.tileX][this.tileY] = this.selected;
        }
        break;
    }
  };
  render(ctx) {
    // Background
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    // Map
    let mapStartX = Math.floor(this.cam.x / this.tileDrawSize) - 1;
    let mapStartY = Math.floor(this.cam.y / this.tileDrawSize) - 1;
    let mapEndX = Math.floor((this.cam.x + this.cam.w) / this.tileDrawSize) + 1;
    let mapEndY = Math.floor((this.cam.y + this.cam.h) / this.tileDrawSize) + 1;
    for (let x = mapStartX; x <= mapEndX; x++) {
      for (let y = mapStartY; y <= mapEndY; y++) {
        if (x >= 0 && x < this.map.w && y >= 0 && y < this.map.h) {
          let image = this.tileImages[this.map.tiles[x][y]];
          ctx.drawImage(
            image,
            (x * this.tileDrawSize) - this.cam.x,
            (y * this.tileDrawSize) - this.cam.y,
            this.tileDrawSize,
            this.tileDrawSize
          );
        }
      }
    }
    if (this.selectionType == MapEditorState.TYPES.collision) {
      for (let x = mapStartX; x <= mapEndX; x++) {
        for (let y = mapStartY; y <= mapEndY; y++) {
          if (x >= 0 && x < this.map.w && y >= 0 && y < this.map.h) {
            if (this.map.collisions[x][y] == 1) {
              ctx.fillStyle = "rgba(255,0,0,0.35)";
              ctx.fillRect(
                (x * this.tileDrawSize) - this.cam.x,
                (y * this.tileDrawSize) - this.cam.y,
                this.tileDrawSize,
                this.tileDrawSize
              );
            }
          }
        }
      }
    } else if (this.selectionType == MapEditorState.TYPES.object) {

    }
    // Hovered Tile
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "rgb(0,255,255)";
    ctx.rect(
      (this.tileX * this.tileDrawSize) - this.cam.x,
      (this.tileY * this.tileDrawSize) - this.cam.y,
      this.tileDrawSize,
      this.tileDrawSize
    );
    ctx.stroke();
    // Buttons
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(32, 0, this.game.screenWidth - 64, 32);
    this.menuButton.render(ctx);
    this.tilesButton.render(ctx);
    this.collisionButton.render(ctx);
    this.objectsButton.render(ctx);
  };
};