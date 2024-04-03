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
    this.objectImages = this.game.gfx.objects.toList(32, 32);
    // Selection
    this.selected = 0;
    this.selectionType = MapEditorState.TYPES.tile;
    // Buttons
    this.items = ["Menu", "Tiles", "Collision", "Objects"];
    this.buttons = [];
    for (let i = 0; i < this.items.length; i++) {
      this.buttons.push(new Button(
        this.items[i],
        this.game.fonts.button,
        128 + (128 * i),
        16,116,24
      ));
    }
    // Map
    this.tileDrawSize = 32;
    this.map = MAPS[this.game.playerData.selectedMap];
    this.mapMaxWidth = this.map.w * this.tileDrawSize;
    this.mapMaxHeight = this.map.h * this.tileDrawSize;
    // Camera
    this.cam = {"x": -this.tileDrawSize, "y": -this.tileDrawSize, "w": this.game.screenWidth, "h": this.game.screenHeight};
    this.camMinX = 0 - this.tileDrawSize;
    this.camMaxX = this.mapMaxWidth - this.cam.w + this.tileDrawSize;
    this.camMinY = 0 - this.tileDrawSize;
    this.camMaxY = this.mapMaxHeight - this.cam.h + this.tileDrawSize;
    this.camSpeed = 7.0;
    // Mouse
    this.tileX = 0;
    this.tileY = 0;
  };
  update(dt) {
    // Buttons
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].update(this.game.mouse);
      if (this.buttons[i].isClick) {
        switch(this.buttons[i].text) {
          case "Menu":
            new MapEditorMenuState(this.game).enter();
            return;
          case "Tiles":
            this.selectionType = MapEditorState.TYPES.tile;
            new TileSelectState(this.game).enter();
            return;
          case "Collision":
            this.selectionType = MapEditorState.TYPES.collision;
            return;
          case "Objects":
            this.selectionType = MapEditorState.TYPES.object;
            new ObjectSelectState(this.game).enter();
            return;
          default:
            break;
        }
      }
    }
    // Keyboard Controls
    if (this.game.keys.isDown("KeyW") || this.game.keys.isDown("ArrowUp")) {
      this.cam.y = Math.max(this.camMinY, this.cam.y - this.camSpeed);
    }
    if (this.game.keys.isDown("KeyS") || this.game.keys.isDown("ArrowDown")) {
      this.cam.y = Math.min(this.camMaxY, this.cam.y + this.camSpeed);
    }
    if (this.game.keys.isDown("KeyA") || this.game.keys.isDown("ArrowLeft")) {
      this.cam.x = Math.max(this.camMinX, this.cam.x - this.camSpeed);
    }
    if (this.game.keys.isDown("KeyD") || this.game.keys.isDown("ArrowRight")) {
      this.cam.x = Math.min(this.camMaxX, this.cam.x + this.camSpeed);
    }
    // Mouse
    if (this.game.mouse.y > 40) {
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
          if (this.game.mouse.isDown("right")) {
            this.map.objects[this.tileX][this.tileY] = -1;
          }
          break;
      }
    }
  };
  render(ctx) {
    // Background
    ctx.fillStyle = this.game.colors.menuBackground;
    ctx.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
    // Map
    let mapStartX = Math.floor(this.cam.x / this.tileDrawSize) - 1;
    let mapStartY = Math.floor(this.cam.y / this.tileDrawSize) - 1;
    let mapEndX = Math.floor((this.cam.x + this.cam.w) / this.tileDrawSize) + 1;
    let mapEndY = Math.floor((this.cam.y + this.cam.h) / this.tileDrawSize) + 1;
    // Tiles
    for (let x = mapStartX; x <= mapEndX; x++) {
      for (let y = mapStartY; y <= mapEndY; y++) {
        if (x >= 0 && x < this.map.w && y >= 0 && y < this.map.h) {
          ctx.fillStyle = this.game.colors.white;
          ctx.fillRect(
            (x * this.tileDrawSize) - this.cam.x,
            (y * this.tileDrawSize) - this.cam.y,
            this.tileDrawSize,
            this.tileDrawSize
          );
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
    // Objects
    for (let x = mapStartX; x <= mapEndX; x++) {
      for (let y = mapStartY; y <= mapEndY; y++) {
        if (x >= 0 && x < this.map.w && y >= 0 && y < this.map.h) {
          if (this.map.objects[x][y] != -1) {
            let image = this.objectImages[this.map.objects[x][y]];
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
    }
    // Collisions
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
    }
    // Hovered Tile
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = this.game.colors.textHighlight;
    ctx.rect(
      (this.tileX * this.tileDrawSize) - this.cam.x,
      (this.tileY * this.tileDrawSize) - this.cam.y,
      this.tileDrawSize,
      this.tileDrawSize
    );
    ctx.stroke();
    // Buttons
    ctx.fillStyle = this.game.colors.black;
    ctx.fillRect(32, 0, this.game.screenWidth - 64, 32);
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].render(ctx);
    }
  };
};