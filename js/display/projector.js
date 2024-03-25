'use strict';

class ProjectorCamera {
  constructor(width, height, fieldOfView, wallSprites) {
    // Camera Position in World
    this.x = 0;
    this.y = 0;
    this.a = 0;
    // Screen Size
    this.width = width;
    this.height = height;
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;
    // Set Viewport Options
    this.fov = fieldOfView * Math.PI / 180;
    this.halfFov = this.fov * 0.5;
    this.wallHeight = Math.abs(Math.floor(this.halfWidth / Math.tan(this.halfFov)));
    this.wallHeightHalf = this.wallHeight * 0.5;
    this.viewDistance = 128;
    this.shadowScale = 1.75;// distance affects brightness
    // Drawable Objects
    this.wallSprites = wallSprites;
    this.walls = [];
    this.objects = [];
  };
  set(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
  };
  drawBackgroundColors(ctx, skyColor, floorColor) {
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, this.width, this.halfHeight);
    ctx.fillStyle = floorColor;
    ctx.fillRect(0, this.halfHeight, this.width, this.halfHeight);
  };
  drawBackgroundStatic(ctx, image) {
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      this.width,
      this.height
    )
  };
  drawBackgroundScrolling(ctx, image) {};
  projectWalls(isBlocked, getSprite) {
    for (let i = 0; i < this.width; i++) {
      let wall = {
        "distance": Infinity,
        "height": 0,
        "top": 0,
        "tile": undefined,
        "xTexture": 0,
        "shade": 0
      };
      let x = this.x;
      let y = this.y;
      let ia = (this.a - this.halfFov) + (i / this.width * this.fov);
      if (ia > Math.PI * 2) {
        ia -= Math.PI * 2;
      } else if (ia < 0) {
        ia += Math.PI * 2;
      }
      let vx = Math.cos(ia);
      let vy = Math.sin(ia);
      let fac = Math.cos(ia - this.a);
      let dx = Math.abs(1 / vx);
      let dy = Math.abs(1 / vy);
      let ox = 0;
      let oy = 0;
      let ix = 0;
      let iy = 0;
      if (vx > 0) {
        ix = 1;
        ox = (Math.floor(x) - x + 1) / vx;
      } else {
        ix = -1;
        ox = Math.abs((x - Math.floor(x)) / vx);
      }
      if (vy > 0) {
        iy = 1;
        oy = (Math.floor(y) - y + 1) / vy;
      } else {
        iy = -1;
        oy = Math.abs((y - Math.floor(y)) / vy);
      }
      let travelDistance = 0;
      while (travelDistance < this.viewDistance) {
        let tx = 0;
        if (ox < oy) {
          x += ix;
          travelDistance = ox * fac;
          tx = (this.y + vy * ox) % 1;
          if (!(ia > Math.PI * 1.5 || ia < Math.PI * 0.5)) {
            tx = 1 - tx
          }
          ox += dx;
        } else {
          y += iy;
          travelDistance = oy * fac;
          tx = (this.x + vx * oy) % 1;
          if (!(ia < 0 || ia > Math.PI)) {
            tx = 1 - tx
          }
          oy += dy;
        }
        if (isBlocked(x, y)) {
          let tile = getSprite(x, y);
          if (tile !== undefined) {
            wall.distance = travelDistance;
            wall.height = Math.floor(this.wallHeight / travelDistance);
            wall.top = Math.floor((this.height - wall.height) * 0.5);
            wall.xTexture = tx;
            wall.tile = tile;
            wall.shade = Math.min(1, travelDistance / this.viewDistance * this.shadowScale);
          }
          break;
        }
      }
      this.walls[i] = wall;
    }
  };
  drawWalls(ctx) {
    for (let i = 0; i < this.walls.length; i++) {
      if (this.walls[i].distance < this.viewDistance) {
        let wallImage = this.wallSprites[this.walls[i].tile];
        // Draw Wall Slice
        ctx.drawImage(
          wallImage,
          Math.floor(this.walls[i].xTexture * wallImage.width),
          0,
          1,
          wallImage.height,
          i,
          this.walls[i].top,
          1,
          this.walls[i].height
        );
        // Shade
        ctx.fillStyle = `rgba(0,0,0,${this.walls[i].shade})`;
        ctx.fillRect(
          i,
          this.walls[i].top,
          1,
          this.walls[i].height
        );
      }
    }
  };
  projectEntity(pos, sprite, drawSize, zLevel) {
    let camPos = new Vector(this.x, this.y);
    let angleToTarget = camPos.getAngle(pos);
    let a1 = NormalizeAngle(this.a - this.halfFov);
    let a2 = NormalizeAngle(this.a + this.halfFov);
    if (a2 < a1) {
      a1 -= Math.PI * 2;
    } else {
      angleToTarget = NormalizeAngle(angleToTarget);
    }
    if (angleToTarget >= a1 && angleToTarget <= a2) {
      let a = angleToTarget - this.a;
      let fac = Math.cos(a);
      let dist = camPos.getDistance(pos) * fac;
      if (dist <= this.viewDistance && dist >= 0.25) {
        let size = this.wallHeight * drawSize / dist;
        let bottom = this.halfHeight + (this.wallHeightHalf / dist);
        let top = bottom - size - (zLevel * (this.wallHeight / dist));
        let left = this.halfWidth + (Math.tan(a) * this.width) - (size * 0.5);
        if (left < this.width && left + size >= 0) {
          let obj = {};
          obj.dist = dist;
          obj.left = left;
          obj.top = top;
          obj.bottom = bottom;
          obj.size = size;
          obj.sprite = sprite;
          for (let i = 0; i < this.objects.length; i++) {
            if (obj.dist > this.objects[i].dist) {
              this.objects.splice(i, 0, obj);
              return;
            }
          }
          this.objects.push(obj);
        }
      }
    }
  };

  drawEntities(ctx) {
    for (let i = 0; i < this.objects.length; i++) {
      let obj = this.objects[i];
      let left = Math.max(0, Math.ceil(obj.left));
      let right = Math.min(this.width, Math.floor(obj.left + obj.size - 1));
      for (let j = left; j < right; j++) {
        if (obj.dist < this.walls[j].distance) {
          ctx.drawImage(
            obj.sprite,
            0,
            0,
            obj.sprite.width,
            obj.sprite.height,
            j,
            obj.top,
            1,
            obj.bottom - obj.top
          );
        }
      }
    }
    this.objects = [];
  };
};
