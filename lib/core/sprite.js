/**
 * @author Richard Key
 *
 */

function Sprite(pSheetSRC, pFrameWidth, pFrameHeight) {
  var sheet = new pfImage(pSheetSRC);

  this.posCurrent = {x : 0, y : 0};
  this.posPrevious = {x : 0, y : 0};

  this.frameWidth = pFrameWidth;
  this.frameHeight = pFrameHeight;

  var frameCurrent = {x : 0, y : 0};
  var framePrevious = {x : 0, y : 0};

  this.move = function(px, py)
  {
    this.posPrevious = this.posCurrent;
    this.posCurrent = {
      x: this.posCurrent.x + px, 
      y: this.posCurrent.y + py
    };
  };

  this.setFrame = function(fx, fy) {
    framePrevious = frameCurrent;
    frameCurrent = {x : fx, y : fy};
  };
  
  this.getFrame = function(fx, fy) {
    return sheet.slice(
      fx * this.frameWidth, fy * this.frameHeight, 
      this.frameWidth, this.frameHeight
    );
  };
  
  this.getCurrentFrame = function() {
    var fx = frameCurrent.x;
    var fy = frameCurrent.y;
    
    return this.getFrame(fx, fy);
  };
  
  this.getPreviousFrame = function() {
    var fx = framePrevious.x;
    var fy = framePrevious.y;
    
    return this.getFrame(fx, fy);
  };
  
  this.draw = function(buffer) {
    var bgPixels = buffer.getImageData(
      posCurrent.x, posCurrent.y, 
      frameWidth, frameHeight);

    var newPixels = sheet.slice(
      frameCurrent.x * frameWidth, frameCurrent.y * frameHeight, 
      frameWidth, frameHeight);

    for(var p = 0; p < newPixels.data.length; p += 4) {
      if(newPixels.data[p + 3] == 0) {
        newPixels.data[p] = bgPixels.data[p];
        newPixels.data[p + 1] = bgPixels.data[p + 1];
        newPixels.data[p + 2] = bgPixels.data[p + 2];
        newPixels.data[p + 3] = bgPixels.data[p + 3];
      }
    }

    buffer.clearRect(posCurrent.x, posCurrent.y, frameWidth, frameHeight);

    buffer.putImageData(newPixels, posCurrent.x, posCurrent.y);
  };
}