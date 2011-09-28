/**
 * @author Richard Key
 * This provides a low-level image
 * object, so we can get an image
 * pixel by pixel if we want to.
 */
function pfImage(src)
{
  var error;
  
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
      
    if(height == null)
      height = imgCanvas.height;
      
    if(width > img.width)
      width = img.width;
    
    //Trying to slice an area outside the image bounds  
    if((x + width) > img.width)
      width = img.width - x;
    
    if(height > img.height)
      height = img.height;
    
    //Trying to slice an area outside the image bounds  
    if((y + height) > img.height)
      height = img.height - y;
    
    imgCanvas = document.createElement('canvas');
    imgCanvas.width = width;
    imgCanvas.height = height;
    
    var cxt = imgCanvas.getContext('2d');
    cxt.drawImage(img, 
      x, y, width, height,
      0, 0, width, height
    );
    
    return imgCanvas;
  };
}