'use strict';

class Game {
  constructor(gameName, screenSize, canvasElement, startState) {
    // Init Game
    this.title = gameName;
    this.screenWidth = screenSize[0];
    this.screenHeight = screenSize[1];
    // Init Graphics
    this.assets = new AssetContainer();
    this.gfx = {};
    // Init Sound Effects
    this.sfx = {};
    // Standard Color Definitions
    this.colors = {};
    // Standard Font Definitions
    this.fonts = {};
    // Player Data
    this.playerData = {};
    // Init Screen
    this.screen = new Screen(
      canvasElement,
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
    this.startState = startState;
  };
  start() {
    let ts = 0;
    this.animationFrameId = requestAnimationFrame((ts) => this.loadLoop(ts));
  };
  loadLoop(ts) {
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
      this.states.push(new this.startState(this));
      this.states[this.states.length - 1].enter();
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
