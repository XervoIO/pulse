/**
 * @author Richard Key
 *
 */

PFPlay.Sprite = function(src, options) 
{
  //Create an image for the spritesheet
  var sheet = new PFPlay.Image(src);
  
  //Check a list of properties
  CheckProperty(options, 'frameOffsetX', 0);
  CheckProperty(options, 'frameOffsetY', 0);
  CheckProperty(options, 'frameWidth', 0);
  CheckProperty(options, 'frameHeight', 0);

  /** The previous and current position of the sprite */
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

  /** Always returns the width of the frames of the given animation,
   * but if a new width is supplied (and it is a valid width) it will 
   * set the frame width to the supplied width.
   * @param {string} animation the animation
   * @param {number} newWidth the new width of the animation
   */
  this.frameWidth = function(newWidth) {
    if(newWidth != null && newWidth > 0 && newWidth < sheet.width())
        frameWidth = newWidth;
    
    return frameWidth;
  }
  
  /** Always returns the height of the frames in the given animation,
   * but if a new height is supplied (and it is a valid height) it will 
   * set the frame height to the supplied height.
   * @param {string} animation the animation
   * @param {number} newHeight the new height of the animation
   */
  this.frameHeight = function(newHeight) {
    if(newHeight != null && newHeight > 0 && newHeight < sheet.height())
        frameHeight = newHeight;
        
    return frameHeight;
  }

  this.setFrame = function(fx, fy) {
    framePrevious = frameCurrent;
    frameCurrent = {x : fx, y : fy};
  };
  
  /** Gets a single frame from the given animation.
   * @param {string} animation the animation to get the frame from
   * @param {number} frame the frame number to get 
   */
  this.getFrame = function(fx, fy) {
    return sheet.slice(
      (fx + frameOffsetX) * frameWidth, 
      (fy + frameOffsetY) * frameHeight, 
      frameWidth, 
      frameHeight
    );
  };
  
  /** returns the current frame from the current animation */
  this.getCurrentFrame = function() {    
    return this.getFrame(frameCurrent.x, frameCurrent.y);
  };
  
  /** returns the last set frame */
  this.getPreviousFrame = function() {    
    return this.getFrame(framePrevious.x, framePrevious.y);
  };
}