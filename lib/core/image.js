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
  var _imgCanvas;
  
  /** The last slice requested */
  var _lastSlice;
 
  var _isLoaded = false;

  /** @return {number} The width of the raw image */
  this.width = function()
  {
    return _img.width;
  };
  
  /** @return {number} The height of the raw image */
  this.height = function()
  {
    return _img.height;
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
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = _img.width;
    tmpCanvas.height = _img.height;
    
    var cxt = tmpCanvas.getContext('2d');
    cxt.drawImage(_img, 0, 0);
    
    _imgCanvas = tmpCanvas;
    _lastSlice = {x: 0, y: 0, width: _img.width, height: _img.height};
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
      return;
    
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
    
    if(width == null)
      width = _imgCanvas.width;
      
    if(width > _img.width)
      width = _img.width;
    
    //Trying to slice an area outside the image bounds  
    if((x + width) > _img.width)
      width = _img.width - x;
    
    if(height == null)
      height = _imgCanvas.height;
    
    if(height > _img.height)
      height = _img.height;
    
    //Trying to slice an area outside the image bounds  
    if((y + height) > _img.height)
      height = _img.height - y;
    
    _imgCanvas.width = width;
    _imgCanvas.height = height;
    
    //Finally grab the slice
    var cxt = _imgCanvas.getContext('2d');
    cxt.clearRect(0,0, width, height);
    
    cxt.drawImage(_img, 
      x, y, width, height,
      0, 0, width, height
    );
    
    return _imgCanvas;
  };
}