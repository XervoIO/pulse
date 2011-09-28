/**
 * @author Richard Key
 *
 */

function Sprite(src, options) 
{
  if(src == null || src == "")
    return;

  var sheet = new pfImage(src);

  CheckProperty(options, 'frameOffsetX', 0);
  CheckProperty(options, 'frameOffsetY', 0);
  CheckProperty(options, 'frameWidth', 0);
  CheckProperty(options, 'frameHeight', 0);

  this.posCurrent = {x : 0, y : 0};
  this.posPrevious = {x : 0, y : 0};

  var frameWidth = options.frameWidth;
  var frameHeight = options.frameHeight;

  var frameCurrent = {x : 0, y : 0};
  var framePrevious = {x : 0, y : 0};
  var frameOffsetX = options.frameOffsetX;
  var frameOffsetY = options.frameOffsetY;

  this.move = function(px, py)
  {
    this.posPrevious = this.posCurrent;
    this.posCurrent = {
      x: this.posCurrent.x + px, 
      y: this.posCurrent.y + py
    };
  };

  this.frameWidth = function()
  {
    return frameWidth;
  }
  
  this.frameHeight = function()
  {
    return frameHeight;
  }

  this.setFrame = function(fx, fy) {
    framePrevious = frameCurrent;
    frameCurrent = {x : fx, y : fy};
  };
  
  this.getFrame = function(fx, fy) {
    return sheet.slice(
      (fx + frameOffsetX) * frameWidth, 
      (fy + frameOffsetY) * frameHeight, 
      frameWidth, 
      frameHeight
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
}