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
PFPlay.Image = function(src)
{
  //if the src is invalid, don't create anything
  if(src == null || src == "")
    throw "Invalid source for PFPlay image.";
  
  /** The actual "raw" image object */ 
  var img = new Image();
  img.src = src;
  
  /** The canvas object */
  var imgCanvas;

  /** @return {number} The width of the raw image */
  this.width = function()
  {
    return img.width;
  };
  
  /** @return {number} The height of the raw image */
  this.height = function()
  {
    return img.height;
  };

  /** When the image loads, create a canvas
   * for it, which will allow access to
   * raw pixel data. */
  img.onload = function()
  {
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width  = img.width;
    tmpCanvas.height = img.height;
    
    var cxt = tmpCanvas.getContext('2d');
    cxt.drawImage(img, 0, 0);
    
    imgCanvas = tmpCanvas;
  };

  /* "Slices" a piece of the image, IE returns a cropped version.
   * @param {number} x the top-left corner of the crop rectangle
   * @param {number} y the top-left corner of the crop rectangle
   * @param {number} width the width of the crop rectangle
   * @param {number} height the height of the crop rectangle
   * @return {canvas} a canvas object with the sliced piece of the image
   */
  this.slice = function(x, y, width, height)
  {
    if(x == null || x < 0)
      x = 0;
    
    if(x > img.width)
      x = img.width;
    
    if(y == null || y < 0)
      y = 0;
    
    if(y > img.height)
      y = height;
    
    if(width == null)
      width = imgCanvas.width;
      
    if(width > img.width)
      width = img.width;
    
    //Trying to slice an area outside the image bounds  
    if((x + width) > img.width)
      width = img.width - x;
    
    if(height == null)
      height = imgCanvas.height;
    
    if(height > img.height)
      height = img.height;
    
    //Trying to slice an area outside the image bounds  
    if((y + height) > img.height)
      height = img.height - y;
    
    imgCanvas = document.createElement('canvas');
    imgCanvas.width = width;
    imgCanvas.height = height;
    
    //Finally grab the slice
    var cxt = imgCanvas.getContext('2d');
    cxt.drawImage(img, 
      x, y, width, height,
      0, 0, width, height
    );
    
    return imgCanvas;
  };
}