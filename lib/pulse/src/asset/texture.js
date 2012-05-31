/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Raw 2d image, represented as a canvas object.
 * @param {object} params parameters that can be set as initialized options
 * on the texture.
 * @config {string} filename the path to the raw image.
 * @author PFP
 * @class Basic 2d image
 * @constructor
 * @copyright 2012 Modulus
 */
pulse.Texture = pulse.Asset.extend(
/** @lends pulse.Texture.prototype */
{
  /** @constructs */
  init: function(params) {

    //Call the base constructor
    this._super(params);

    //if the src is invalid, don't create anything
    if(params.filename === '') {
      pulse.error.InvalidSource();
    }

    /**
     * @private
     * The HTML Image object.
     * @type {HTML Image}
     */
    this._private.image = new Image();

    /**
     * @private
     * The canvas that the raw image is drawn on.
     * @type {HTML Canvas}
     */
    this._private.imgCanvas = document.createElement('canvas');

    if(this.autoLoad === true) {
      this._private.image.src = this.filename;
    }

    /**
     * The x-axis scale factor. 1 represents normal scale.
     * @type {integer}
     */
    this.scaleX = 1;

    /**
     * The y-axis scale factor. 1 represents normal scale.
     * @type {integer}
     */
    this.scaleY = 1;

    /**
     * The rotation of the image. 360 represents a full rotation.
     * @type {integer}
     */
    this.rotation = 0;

    /**
     * The transparency of the image, on a scale from 0 to 100, 100 being
     * completely opaque.
     * @type {integer}
     */
    this.alpha = 100;

    /**
     * @private
     * The HTML Image object.
     * @type {HTML Image}
     */
    this._private.lastSlice = null;

    var _self = this;

    /**
     * This sets the loaded bit and percent loaded when the image has
     * completely loaded.
     */
    this._private.image.onload = function()
    {
      _self.percentLoaded = 100;

      var evt = { asset: _self.name };

      _self.complete();

      //Set the last slice to the default values.
      _self._private.lastSlice = {x: -1, y: -1,
        width: _self._private.image.width * _self.scaleX,
        height: _self._private.image.height * _self.scaleY,
        rotation: _self.rotation, alpha: _self.alpha
      };
    };

    this._private.image.onerror = function() {
      _self.error = true;
    };
  },

  /*
   * This forces the image to load, if autoload is not turned on.
   */
  load: function() {
    if(this.autoLoad === true) {
      return;
    }

    this._private.image.src = this.filename;
  },

  /**
   * Get the calculated width of the raw image.
   * @return {number} The width of the raw image
   */
  width: function() {
    return this._private.image.width * this.scaleX;
  },

  /**
   * Get the calculated height of the raw image.
   * @return {number} The height of the raw image
   */
  height: function() {
    return this._private.image.height * this.scaleY;
  },

  /* Returns a cropped version of the image as a canvas object.
   * @param {number} x the top-left corner of the crop rectangle
   * @param {number} y the top-left corner of the crop rectangle
   * @param {number} width the width of the crop rectangle
   * @param {number} height the height of the crop rectangle
   * @return {canvas} a canvas object with the sliced piece of the image
   */
  slice: function(x, y, width, height) {
    if(this.percentLoaded !== 100) {
      return null;
    }

    if(x === this._private.lastSlice.x &&
       y === this._private.lastSlice.y &&
       width === this._private.lastSlice.width &&
       height === this._private.lastSlice.height &&
       this.rotation === this._private.lastSlice.rotation &&
       this.alpha === this._private.lastSlice.alpha)
    {
      return this._private.imgCanvas;
    }

    this._private.lastSlice = {x: x, y: y,
          width: width * this.scaleX, height: height * this.scaleY,
          rotation: this.rotation, alpha: this.alpha};

    if(x === null || x < 0) {
      x = 0;
    }

    if(x > this._private.image.width) {
      x = this._private.image.width;
    }

    if(y === null || y < 0) {
      y = 0;
    }

    if(y > this._private.image.height) {
      y = height;
    }

    if(width === null || width > this._private.image.width) {
      width = this._private.image.width;
    }

    //Trying to slice an area outside the image bounds
    if((x + width) > this._private.image.width) {
      width = this._private.image.width - x;
    }

    if(height === null || height > this._private.image.height) {
      height = this._private.image.height;
    }

    //Trying to slice an area outside the image bounds
    if((y + height) > this._private.image.height) {
      height = this._private.image.height - y;
    }

    // source image width and height
    var sWidth = width;
    var sHeight = height;

    // scaled image width and height
    var iWidth = sWidth * this.scaleX;
    var iHeight = sHeight * this.scaleY;

    //scaled canvas width and height
    var cWidth = iWidth;
    var cHeight = iHeight;

    if(this.rotation % 360 !== 0)
    {
      //modify the destination width and height if rotation isn't 360
      cWidth = iWidth * Math.abs(Math.cos(Math.PI * this.rotation / 180)) +
               iHeight * Math.abs(Math.sin(Math.PI * this.rotation / 180));

      cHeight = iHeight * Math.abs(Math.cos(Math.PI * this.rotation / 180)) +
                iWidth * Math.abs(Math.sin(Math.PI * this.rotation / 180));
    }

    // setting the width clears the image canvas
    this._private.imgCanvas.width = cWidth;
    this._private.imgCanvas.height = cHeight;

    //Finally grab the slice
    var ctx = this._private.imgCanvas.getContext('2d');
    ctx.save();

    var drawX = 0;
    var drawY = 0;
    if(this.rotation % 360 !== 0)
    {
      drawX = (cWidth - iWidth) / 2;
      drawY = (cHeight - iHeight) / 2;
      var rotationX = cWidth / 2;
      var rotationY = cHeight / 2;
      ctx.translate(rotationX, rotationY);
      ctx.rotate((Math.PI * (this.rotation % 360)) / 180);
      ctx.translate(-rotationX, -rotationY);
    }

    ctx.globalAlpha = this.alpha / 100;
    ctx.drawImage(this._private.image,
      x, y, sWidth, sHeight,
      drawX, drawY, iWidth, iHeight
    );

    if(pulse.DEBUG) {
      ctx.save();
      ctx.fillStyle = "#42CCDE";
      ctx.beginPath();
      ctx.arc(
        this._private.imgCanvas.width / 2,
        this._private.imgCanvas.height / 2,
        3, 0, Math.PI * 2, true
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    if(pulse.DEBUG) {
      ctx.strokeStyle = "#FF2200";
      ctx.strokeRect(drawX, drawY, iWidth, iHeight);
    }
    ctx.restore();

    return this._private.imgCanvas;
  }
});