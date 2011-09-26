/**
 * @author Richard Key
 * This provides a low-level image
 * object, so we can get an image
 * pixel by pixel if we want to.
 */
function pfImage(src)
{
  var rawPixels;
  
  var img = new Image();
  img.src = src;
  
  var imgCanvas;

  this.width = function()
  {
    return img.width;
  };
  
  this.height = function()
  {
    return img.height;
  };

  /* When the image loads, create a canvas
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

  /* "Slices" a piece of the image and returns
   * the pixel data for it.*/
  this.slice = function(x, y, width, height)
  {
    if(x == null)
      x = 0;
    
    if(y == null)
      y = 0;
    
    if(width == null)
      width = imgCanvas.width;
      
    if(height == null)
      height = imgCanvas.height;
    
    var cxt = imgCanvas.getContext('2d');
    return cxt.getImageData(x, y, width, height); 
  };
}