
/**
 * Image preloader class used for copying <i>n</i> images into browser memory
 * and providing direct access to image instances.
 */
class ImagePreloader {

  /**
   * Create an image preloader.
   */
  constructor() {
    this._imageCache = null;

    /**
     * Images pre-loaded or null before {@link ImagePreloader#load} is callled.
     * @member {Image[]|null} 
     */
    this.images = null;

    this._reset();
  }

  /**
   * Starts the pre-loading asynchronously.
   * 
   * @example
   * let imageUrls = [ ... ];
   * let preloader = new ImagePreloader();
   * let images = await preloader.load(imageUrls);
   * 
   * @param {string[]} imageUrls The image URLs to be preloaded.
   * @returns {Promise<Image[]>} A promise that resolves to the pre-loaded
   * images.
   */
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

  /**
   * Flush image cache to public access once complete.
   * 
   * @private
   */
  _flush() {
    this.images = this._imageCache;
    this._imageCache = [];
  }

  /**
   * Reset the cache and image store for re-use.
   * 
   * @private
   */
  _reset() {
    this.images = [];
    this._imageCache = [];
  }

  /**
   * Invoked when an image loads to check if pre-loading has completed.
   * @returns {boolean} True if pre-loading is complete.
   * 
   * @private
   */
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