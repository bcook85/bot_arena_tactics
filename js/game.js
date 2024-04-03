'use strict';

class Game {
  constructor() {
    // Init Game
    this.title = "Bot Arena: Tactics";
    this.screenWidth = 640;
    this.screenHeight = 360;
    // Init Graphics
    this.assets = new AssetContainer();
    this.gfx = {
      "tiles": this.assets.loadImage("gfx/sprites_tiles.png"),
      "objects": this.assets.loadImage("gfx/sprites_objects.png"),
      "entities": this.assets.loadImage("gfx/sprites_entities.png"),
      "ui": this.assets.loadImage("gfx/sprites_ui.png")
    };
    // Init Sound Effects
    this.sfx = {};
    // Standard Color Definitions
    this.colors = {
      "red": "rgb(255,0,0)",
      "green": "rgb(0,255,0)",
      "blue": "rgb(0,0,255)",
      "black": "rgb(0,0,0)",
      "white": "rgb(255,255,255)",
      "menuBackground": "rgb(0,0,0)",
      "textNormal": "rgb(255,255,255)",
      "textHighlight": "rgb(0,255,255)",
      "header": "rgb(255,255,255)"
    };
    // Standard Font Definitions
    this.fonts = {
      "title1": "bold 96px Monospace",
      "title2": "bold 72px Monospace",
      "small": "12px Monospace",
      "medium": "18px Monospace",
      "large": "32px Monospace",
      "header": "bold 32px Monospace",
      "button": "bold 18px Monospace"
    };
    // Player Data
    this.playerData = {
      "selectedMap": 0,
      "selectedTeam": "red"
    };
    // Init Screen
    this.screen = new Screen(
      document.getElementById("gameScreen"),
      this.screenWidth,
      this.screenHeight,
      Screen.SCALING.aspectRatio
    );
    // Init Input
    this.mouse = new MouseManager(this.screen.canvas);
    this.keys = new KeyManager();
    // Init FPS/Timing
    this.now = performance.now();
    this.last = this.now;
    this.elapsed = 0;
    this.deltaTime = 0;
    this.animationFrameId = 0;
    this.fpsFrame = 0;
    this.fpsTime = 0;
    this.fpsMin = 20;
    this.maxFrameTime = 1000 / this.fpsMin;
    // States
    this.states = [];
  };
  start() {
    let t = 0;
    this.animationFrameId = requestAnimationFrame((t) => this.loadLoop(t));
  };
  loadLoop() {
    this.screen.ctx.fillStyle = "rgb(0,0,0)";
    this.screen.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    this.screen.ctx.font = `bold ${Math.floor(this.screenWidth * 0.1)}px Monospace`;
    this.screen.ctx.fillStyle = "rgb(255,0,0)";
    this.screen.ctx.textAlign = "center";
    this.screen.ctx.textBaseline = "middle";
    this.screen.ctx.fillText(
      "LOADING..."
      ,Math.floor(this.screenWidth * 0.5)
      ,Math.floor(this.screenHeight * 0.5)
    );
    if (this.assets.isLoaded()) {
      new MainState(this).enter();
      this.animationFrameId = requestAnimationFrame((ts) => this.runLoop(ts));
    } else {
      this.animationFrameId = requestAnimationFrame((ts) => this.loadLoop(ts));
    }
  };
  runLoop(ts) {
    // Re-Loop
    this.animationFrameId = requestAnimationFrame((ts) => this.runLoop(ts));
    // Timing
    this.now = ts;
    this.elapsed = this.now - this.last;
    this.last = this.now;
    this.deltaTime = Math.min(this.maxFrameTime, this.elapsed);
    // FPS
    this.fpsFrame += 1;
    this.fpsTime += this.elapsed;
    if (this.fpsFrame >= 60) {
      document.title = `${this.title} - ${Math.round(1000 / this.fpsTime * this.fpsFrame)}fps`;
      this.fpsFrame = 0;
      this.fpsTime = 0;
    }
    // Update
    this.states[this.states.length - 1].update(this.deltaTime);
    // Render
    this.states[this.states.length - 1].render(this.screen.ctx);
    // Reset
    this.keys.reset();
    this.mouse.reset();
  };
};
// Automatically Start Game
//new Game().start();