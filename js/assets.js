'use strict';

class ImageAsset {
  constructor(filePath) {
    this.filePath = filePath;
    this.fullImage = document.createElement("canvas");
    this.loaded = false;
    // Load Image
    let newImage = new Image();
    //newImage.crossOrigin = "Anonymous";
    newImage.imageAsset = this;
    newImage.onload = function() {
      this.imageAsset.fullImage.width = this.width;
      this.imageAsset.fullImage.height = this.height;
      let ctx = this.imageAsset.fullImage.getContext("2d");
      ctx.drawImage(
        this,
        0,0,
        this.width,this.height,
        0,0,
        this.imageAsset.fullImage.width,this.imageAsset.fullImage.height
      );
      this.imageAsset.loaded = true;
      console.log(`Image Loaded: ${this.imageAsset.filePath}`);
    };
    newImage.src = this.filePath;
  };
  cut(x, y, width, height) {
    if (!this.loaded) {
      console.log("ERROR: Image not fully loaded.");
      return;
    }
    let tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    let tempCtx = tempCanvas.getContext("2d");
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(
      this.fullImage
      ,x, y
      ,width,height
      ,0,0
      ,width,height
    );
    return tempCanvas;
  };
  toList(tileWidth, tileHeight) {
    let list = [];
    let xCount = Math.floor(this.fullImage.width / tileWidth);
    let yCount = Math.floor(this.fullImage.height / tileHeight);
    for (let y = 0; y < yCount; y++) {
      for (let x = 0; x < xCount; x++) {
        list.push(this.cut(
          x * tileWidth
          ,y * tileHeight
          ,tileWidth
          ,tileHeight
        ));
      }
    }
    return list;
  };
};

class SoundAsset {
  constructor(filePath) {
    this.filePath = filePath;
    this.sound = undefined;
    this.loaded = false;
  };
};

class AssetContainer {
  constructor() {
    this.images = [];
    this.sounds = [];
  };
  loadImage(filePath) {
    let ia = new ImageAsset(filePath);
    this.images.push(ia);
    return ia;
  };
  loadSound(filePath) {
    let sa = new SoundAsset(filePath);
    this.sounds.push(sa);
    return sa;
  };
  isLoaded() {
    for (let i = 0; i < this.images.length; i++) {
      if (!this.images[i].loaded) return false;
    }
    for (let i = 0; i < this.sounds.length; i++) {
      if (!this.sounds[i].loaded) return false;
    }
    return true;
  };
};