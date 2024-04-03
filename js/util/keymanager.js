'use strict';

class KeyManager {
  constructor() {
    this.keysPressed = {};
    this.keysReleased = {};
    window.addEventListener(
      "keydown", (e) => {
        this.keysPressed[e.code] = true;
      },false
    );
    window.addEventListener(
      "keyup", (e) => {
        delete this.keysPressed[e.code];
        this.keysReleased[e.code] = true;
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
