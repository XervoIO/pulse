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
  this.rotation = 90;
  this.opacity = 100;
  
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
      height: _img.height * this.scaleY
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
    
    if(x == _lastSlice.x && y == _lastSlice.y
      && width == _lastSlice.width && height == _lastSlice.height) {
      return _imgCanvas;
    }
    
    _lastSlice = {x: x, y: y, width: width, height: height}; 
    
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
    
    var oWidth = width;
    var oHeight = height;
    width = width * this.scaleX;
    height = height * this.scaleY;
    
    _imgCanvas.width = width;
    _imgCanvas.height = height;
    
    /*
    if(this.rotation % 360 != 0)
    {
      _imgCanvas.width = width * 
        Math.abs(Math.cos(Math.PI * this.rotation / 180))
        + height * Math.abs(Math.sin(Math.PI * this.rotation / 180));
      
      _imgCanvas.height = 
        height * Math.abs(Math.cos(Math.PI * this.rotation / 180))
        + width * Math.abs(Math.sin(Math.PI * this.rotation / 180));
    }
    */
   
    //Finally grab the slice
    var cxt = _imgCanvas.getContext('2d');
    cxt.restore();
    cxt.clearRect(0,0, width, height);
    
    var drawX = 0;
    var drawY = 0;
    if(this.rotation % 360 != 0)
    {
      cxt.translate(oWidth / 2, oHeight / 2);
      cxt.rotate((Math.PI * (this.rotation % 360)) / 180);
      drawX = Math.floor((oWidth / 2) - width);
      drawY = Math.floor((oHeight / 2) - height);
    }
    
    cxt.fillRect(drawX, drawY, width, height);
    
    cxt.drawImage(_img, 
      x, y, oWidth, oHeight,
      drawX, drawY, width, height
    );
    
    if(this.rotation % 360 != 0)
    {
      cxt.translate(-1 * oWidth / 2, -1 * oHeight / 2);
    }
    
    return _imgCanvas;
  };
}