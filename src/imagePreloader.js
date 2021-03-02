
class ImagePreloader {

  constructor() {
    this._imageCache = null;
    this.images = null;

    this._reset();
  }

  load(imageUrls) {
    return new Promise((resolve) => {
      for(const imageUrl of imageUrls) {
        const image = new Image();
        this._imageCache.push(image);

        image.addEventListener('load', () => {
          this._flush();
          resolve(this.images);
          this._reset();
        });
        image.src = imageUrl;
      }
      if(imageUrls.length === 0) {
        this._flush();
        resolve(this.images);
        this._reset();
      }
    });
  }

  _flush() {
    this.images = this._imageCache;
    this._imageCache = [];
  }

  _reset() {
    this.images = [];
    this._imageCache = [];
  }

  _allImagesLoaded() {
    for(const image of this._imageCache) {
      if(!image.complete) {
        return false;
      }
    }
    return true;
  }

}

export default ImagePreloader;