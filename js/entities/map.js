'use strict';

class GameMap {
  constructor() {
    this.w = 0;
    this.w2 = 0;
    this.h = 0;
    this.h2 = 0;
    this.tiles = [];
    this.collisions = [];
    this.objects = [];
    this.redTeam = {
      "playerSpawn": {},
      "heartSpawn": {},
      "droneSpawns": [],
      "stationSpawns": []
    };
    this.blueTeam = {
      "playerSpawn": {},
      "heartSpawn": {},
      "droneSpawns": [],
      "stationSpawns": []
    };
    this.turrets = [];
  };
  create(width, height) {
    this.w = width;
    this.w2 = Math.floor(this.w * 0.5);
    this.h = height;
    this.h2 = Math.floor(this.h * 0.5);
    this.tiles = [];
    this.collisions = [];
    for (let x = 0; x < this.w; x++) {
      let tiles = [];
      let collisions = [];
      let objects = [];
      for (let y = 0; y < this.h; y++) {
        tiles.push(0);
        collisions.push(0);
        objects.push(-1);
      }
      this.tiles.push(tiles);
      this.collisions.push(collisions);
    }
  };
  load(data) {
    this.w = data.w;
    this.w2 = Math.floor(this.w * 0.5);
    this.h = data.h;
    this.h2 = Math.floor(this.h * 0.5);
    this.tiles = [];
    this.collisions = [];
    for (let x = 0; x < this.w; x++) {
      let tiles = [];
      let collisions = [];
      for (let y = 0; y < this.h; y++) {
        tiles.push(data.tiles[x][y]);
        collisions.push(data.collisions[x][y]);
        if (data.objects[x][y] != -1) {
          let id = data.objects[x][y];
          let pos = {"x": x + 0.5, "y": y + 0.5};
          switch (id) {
            case 0:
              // Red Player Spawn
              this.redTeam.playerSpawn = pos;
              break;
            case 1:
              // Blue Player Spawn
              this.blueTeam.playerSpawn = pos;
              break;
            case 2:
              // Red Drone Spawn
              this.redTeam.droneSpawns.push(pos);
              break;
            case 3:
              // Blue Drone Spawn
              this.blueTeam.droneSpawns.push(pos);
              break;
            case 4:
              // Red Heart Spawn
              this.redTeam.heartSpawn = pos;
              break;
            case 5:
              // Blue Heart Spawn
              this.blueTeam.heartSpawn = pos;
              break;
            case 6:
              // Red Station Spawn
              this.redTeam.stationSpawns.push(pos);
              break;
            case 7:
              // Blue Station Spawn
              this.blueTeam.stationSpawns.push(pos);
              break;
            case 8:
              // Unclaimed Turret Spawn
              break;
            case 9:
              // Red Turret Spawn
              break;
            case 10:
              // Blue Turret Spawn
              break;
          }
        }
      }
      this.tiles.push(tiles);
      this.collisions.push(collisions);
    }
  };
  getTile(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) {
      return undefined;
    }
    return this.tiles[Math.floor(x)][Math.floor(y)];
  };
  getCollision(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) {
      return true;
    }
    return this.collisions[Math.floor(x)][Math.floor(y)] == 1;
  };
  getMapImage(tileSize, tileImages) {
    let mapCanvas = document.createElement("canvas");
    mapCanvas.width = this.w * tileSize;
    mapCanvas.height = this.h * tileSize;
    let ctx = mapCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "rgb(255, 105, 180)"; // hot pink
    ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        let tileId = this.tiles[x][y];
        if (tileId >= 0 && tileId < tileImages.length) {
          let img = tileImages[tileId];
          ctx.drawImage(
            img,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
          );
        }
      }
    }
    return mapCanvas;
  };
  static getMapImageShadow(tileSize, mapData, blockColor, emptyColor) {
    let mapCanvas = document.createElement("canvas");
    mapCanvas.width = mapData.w * tileSize;
    mapCanvas.height = mapData.h * tileSize;
    let ctx = mapCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = emptyColor;
    ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.fillStyle = blockColor;
    for (let x = 0; x < mapData.w; x++) {
      for (let y = 0; y < mapData.h; y++) {
        if (mapData.collisions[x][y] == 1) {
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }
    return mapCanvas;
  };
  getAStarPath(sx, sy, ex, ey) {
    let openList = [{"x": sx,"y": sy,"f": 0,"g": 0,"h": 0, "p": undefined}];
    let closedList = [];
    let lowest = 0;
    let current = undefined;
    while(openList.length > 0) {
      lowest = 0;
      current = openList[lowest];
      if ((current.x == ex && current.y == ey)) {
        let node = current;
        let path = [];
        while (node !== undefined) {
          path.unshift([node.x, node.y]);
          node = node.p;
        }
        return path;
      }
      openList.splice(lowest, 1);
      closedList[current.y * this.w + current.x] = 0;
      let neighbors = [];
      current.x = Math.max(0, Math.min(this.w - 1, current.x));
      current.y = Math.max(0, Math.min(this.h - 1, current.y));
      if (current.x > 0 && this.collisions[current.x - 1][current.y] == 0 && closedList[(current.y * this.w) + current.x - 1] === undefined) {
        neighbors.push([current.x - 1, current.y]);
      }
      if (current.x < this.w - 1 && this.collisions[current.x + 1][current.y] == 0 && closedList[(current.y * this.w) + current.x + 1] === undefined) {
        neighbors.push([current.x + 1, current.y]);
      }
      if (current.y > 0 && this.collisions[current.x][current.y - 1] == 0 && closedList[((current.y - 1) * this.w) + current.x] === undefined) {
        neighbors.push([current.x, current.y - 1]);
      }
      if (current.y < this.h - 1 && this.collisions[current.x][current.y + 1] == 0 && closedList[((current.y + 1) * this.w) + current.x] === undefined) {
        neighbors.push([current.x, current.y + 1]);
      }
      for (let n = 0; n < neighbors.length; n++) {
        let g = current.g + 1;
        let newNode = true;
        for (let o = 0; o < openList.length; o++) {
          if (openList[o].x == neighbors[n][0] && openList[o].y == neighbors[n][1]) {
            newNode = false;
            if (g < openList[o].g) {
              openList[o].g = g;
              openList[o].f = g + openList[o].h;
              openList[o].p = current;
            }
            break;
          }
        }
        if (newNode) {
          let dx = ex - neighbors[n][0];
          let dy = ey - neighbors[n][1];
          // Euclidean
          let h = Math.sqrt((dx * dx) + (dy * dy));
          // Manhattan
          // let h = (Math.abs(ex - neighbors[n][0]) + Math.abs(ey - neighbors[n][1]));
          let f = g + h;
          let foundPlace = false;
          for (let o = openList.length - 1; o >= 0; o--) {
            if (openList[o].f < f) {
              openList.splice(o + 1, 0, {"x": neighbors[n][0],"y": neighbors[n][1],"f": f,"g": g,"h": h, "p": current});
              foundPlace = true;
              break;
            }
          }
          if (!foundPlace) {
            openList.unshift({"x": neighbors[n][0],"y": neighbors[n][1],"f": f,"g": g,"h": h, "p": current});
          }
        }
      }
    }
    return [];
  };
  getFlowField(x, y) {
    let grid = [];
    return grid;
  };
};