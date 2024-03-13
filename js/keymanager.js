'use strict';

class KeyManager {
  constructor() {
    this.keysPressed = {};
    this.keysReleased = {};
    window.addEventListener(
      "keydown", (e) => {
        this.keysPressed[e.key] = true;
      },false
    );
    window.addEventListener(
      "keyup", (e) => {
        delete this.keysPressed[e.key];
        this.keysReleased[e.key] = true;
      },false
    );
  };
  isDown(key) {
    return this.keysPressed[key];
  };
  isUp(key) {
    return this.keysReleased[key];
  };
  reset() {
    this.keysReleased = {};
  };
};
