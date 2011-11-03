/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * This is a raw image with a few added
 * functions. It uses an Image object for the raw image,
 * then provides extra functionality via a canvas.
 * @author Richard Key
 * @class An extended image object.
 * @constructor
 */
PFPlay.Image = function(params)
{
  params = PFPlay.util.checkParams(params,
  {
    src: ''
  });
  
  //if the src is invalid, don't create anything
  if(params.src == "")
    throw "Invalid source for PFPlay image.";
  
  /** The actual "raw" image object */ 
  var _img = new Image();
  _img.src = params.src;
  
  /** The canvas object */
  var _imgCanvas = document.createElement('canvas');
  
  /** The last slice requested */
  var _lastSlice;
 
  var _isLoaded = false;
  
  this.scaleX = 1;
  this.scaleY = 1;
  this.rotation = 0;
  this.alpha = 100;
  
  /** @return {number} The width of the raw image */
  this.width = function()
  {
    return _img.width * this.scaleX;
  };
  
  /** @return {number} The height of the raw image */
  this.height = function()
  {
    return _img.height * this.scaleY;
  };

  /** @return {boolean} Whether image has been loaded */
  this.loaded = function()
  {
    return _isLoaded;
  };

  /** When the image loads, create a canvas
   * for it, which will allow access to
   * raw pixel data. */
  _img.onload = function()
  {
    //var tmpCanvas = document.createElement('canvas');
    //tmpCanvas.width = _img.width;
    //tmpCanvas.height = _img.height;
    
    //var cxt = tmpCanvas.getContext('2d');
    //cxt.drawImage(_img, 0, 0);
    
    //_imgCanvas = document.createElement('canvas');
    _lastSlice = {x: 0, y: 0, 
      width: _img.width * this.scaleX, 
      height: _img.height * this.scaleY,
      rotation: this.rotation, opacity: this.opacity
    };
    
    _isLoaded = true;
  };

  /** 
   * When the image fails to load due to error
   * 
   *
   */
   // TODO: better error throwing and documentation
   _img.onerror = function()
   {
     throw "image could not be loaded";
   }

  /* "Slices" a piece of the image, IE returns a cropped version.
   * @param {number} x the top-left corner of the crop rectangle
   * @param {number} y the top-left corner of the crop rectangle
   * @param {number} width the width of the crop rectangle
   * @param {number} height the height of the crop rectangle
   * @return {canvas} a canvas object with the sliced piece of the image
   */
  this.slice = function(x, y, width, height)
  {
    if(!_isLoaded)
      return null;
    
    if(x == _lastSlice.x && y == _lastSlice.y && 
       width == _lastSlice.width && height == _lastSlice.height &&
       this.rotation == _lastSlice.rotation && this.opacity == _lastSlice.opacity) {
      return _imgCanvas;
    }
    
    _lastSlice = {x: x, y: y, 
                  width: width * this.scaleX, height: height * this.scaleY, 
                  rotation: this.rotation, opacity: this.opacity}; 
    
    if(x == null || x < 0)
      x = 0;
    
    if(x > _img.width)
      x = _img.width;
    
    if(y == null || y < 0)
      y = 0;
    
    if(y > _img.height)
      y = height;
      
    if(width == null || width > _img.width)
      width = _img.width;
    
    //Trying to slice an area outside the image bounds  
    if((x + width) > _img.width)
      width = _img.width - x;
    
    if(height == null || height > _img.height)
      height = _img.height;
    
    //Trying to slice an area outside the image bounds  
    if((y + height) > _img.height)
      height = _img.height - y;
  
    // source image width and height
    var sWidth = width;
    var sHeight = height;

    // scaled image width and height
    var iWidth = sWidth * this.scaleX;
    var iHeight = sHeight * this.scaleY;
    
    // scaled canvas width and height
    var cWidth = iWidth;
    var cHeight = iHeight;

    if(this.rotation % 360 != 0)
    {
      //modify the destination width and height if rotation isn't 360
      cWidth = iWidth * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + 
               iHeight * Math.abs(Math.sin(Math.PI * this.rotation / 180));
      
      cHeight = iHeight * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + 
                iWidth * Math.abs(Math.sin(Math.PI * this.rotation / 180));
    }

    // setting the width clears the image canvas
    _imgCanvas.width = cWidth;
    _imgCanvas.height = cHeight;
   
    //Finally grab the slice
    var cxt = _imgCanvas.getContext('2d');
    cxt.save();
    
    var drawX = 0;
    var drawY = 0;
    if(this.rotation % 360 != 0)
    {
      drawX = (cWidth - iWidth) / 2;
      drawY = (cHeight - iHeight) / 2;
      var rotationX = cWidth / 2;
      var rotationY = cHeight / 2;
      cxt.translate(rotationX, rotationY);
      cxt.rotate((Math.PI * (this.rotation % 360)) / 180);
      cxt.translate(-rotationX, -rotationY);
    }
    
    cxt.globalAlpha = this.alpha / 100;
    cxt.drawImage(_img, 
      x, y, sWidth, sHeight,
      drawX, drawY, iWidth, iHeight
    );
    
    if(PFPlay.DEBUG) {
      cxt.strokeStyle = "#FF2200";
      cxt.strokeRect(drawX, drawY, iWidth, iHeight);
    }
    cxt.restore();

    if(PFPlay.DEBUG) {
      cxt.strokeStyle = "#FF2200";
      cxt.strokeRect(0, 0, _imgCanvas.width, _imgCanvas.height);
    }
    
    return _imgCanvas;
  };
}