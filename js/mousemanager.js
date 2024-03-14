'use strict';

class MouseManager {
  constructor(canvasElement) {
    this.x = 0;
    this.y = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.buttons = {
      "left": {
        "isDown": false,
        "isUp": false
      },
      "middle": {
        "isDown": false,
        "isUp": false
      },
      "right": {
        "isDown": false,
        "isUp": false
      },
      "touch": {
        "isDown": false,
        "isUp": false,
      },
      "wheel": {
        "isDown": false,
        "isUp": false,
      }
    };
    this.touchEnabled = false;
    // Add Event Listeners
    canvasElement.addEventListener(
      "mousemove", (e) => {
        this.touchEnabled = false;
        this.lastX = this.x;
        this.lastY = this.y;
        let canvasRect = canvasElement.getBoundingClientRect();
        let scaleX = canvasElement.width / canvasRect.width;
        let scaleY = canvasElement.height / canvasRect.height;
        this.x = Math.min(Math.max(Math.floor((e.clientX - canvasRect.left) * scaleX), 0), canvasElement.width);
        this.y = Math.min(Math.max(Math.floor((e.clientY - canvasRect.top) * scaleY), 0), canvasElement.height);
      },false
    );
    canvasElement.addEventListener(
      "mousedown", (e) => {
        this.touchEnabled = false;
        e.preventDefault();
        if (e.button === 0) {
          this.buttons.left.isDown = true;
          this.buttons.left.isUp = false;
        } else if (e.button === 1) {
          this.buttons.middle.isDown = true;
          this.buttons.middle.isUp = false;
        } else if (e.button === 2) {
          this.buttons.right.isDown = true;
          this.buttons.right.isUp = false;
        }
      },false
    );
    canvasElement.addEventListener(
      "mouseup", (e) => {
        this.touchEnabled = false;
        e.preventDefault();
        if (e.button === 0) {
          this.buttons.left.isDown = false;
          this.buttons.left.isUp = true;
        } else if (e.button === 1) {
          this.buttons.middle.isDown = false;
          this.buttons.middle.isUp = true;
        } else if (e.button === 2) {
          this.buttons.right.isDown = false;
          this.buttons.right.isUp = true;
        }
      },false
    );
    canvasElement.addEventListener(
      "wheel", (e) => {
        this.touchEnabled = false;
        e.preventDefault();
        if (e.deltaY > 0) {
          this.buttons.wheel.isDown = true;
          this.buttons.wheel.isUp = false;
        } else if (e.deltaY < 0) {
          this.buttons.wheel.isDown = false;
          this.buttons.wheel.isUp = true;
        }
      },false
    );
    canvasElement.addEventListener(
      "touchstart", (e) => {
        this.lastX = this.x;
        this.lastY = this.y;
        this.touchEnabled = true;
        e.preventDefault();
        this.buttons.touch.isDown = true;
        this.buttons.touch.isUp = false;
        let canvasRect = canvasElement.getBoundingClientRect();
        let scaleX = canvasElement.width / canvasRect.width;
        let scaleY = canvasElement.height / canvasRect.height;
        this.x = Math.min(Math.max(Math.floor((e.touches[0].clientX - canvasRect.left) * scaleX), 0), canvasElement.width);
        this.y = Math.min(Math.max(Math.floor((e.touches[0].clientY - canvasRect.top) * scaleY), 0), canvasElement.height);
      }, false
    );
    canvasElement.addEventListener(
      "touchmove", (e) => {
        this.lastX = this.x;
        this.lastY = this.y;
        this.touchEnabled = true;
        e.preventDefault();
        let canvasRect = canvasElement.getBoundingClientRect();
        let scaleX = canvasElement.width / canvasRect.width;
        let scaleY = canvasElement.height / canvasRect.height;
        this.x = Math.min(Math.max(Math.floor((e.touches[0].clientX - canvasRect.left) * scaleX), 0), canvasElement.width);
        this.y = Math.min(Math.max(Math.floor((e.touches[0].clientY - canvasRect.top) * scaleY), 0), canvasElement.height);
      }, false
    );
    canvasElement.addEventListener(
      "touchend", (e) => {
        this.touchEnabled = true;
        e.preventDefault();
        this.buttons.touch.isDown = false;
        this.buttons.touch.isUp = true;
      }, false
    );
  };
  isDown(button) {
    return this.buttons[button].isDown;
  };
  isUp(button) {
    return this.buttons[button].isUp;
  };
  reset() {
    this.buttons.left.isUp = false;
    this.buttons.middle.isUp = false;
    this.buttons.right.isUp = false;
    this.buttons.touch.isUp = false;
    this.buttons.wheel.isUp = false;
    this.buttons.wheel.isDown = false;
  };
};