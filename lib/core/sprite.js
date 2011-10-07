/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * Sprites are the basic object for moving, animated graphics on
 * the screen. They have an image, the sprite sheet, which is a
 * collection of "frames" that can be played in succession to 
 * produce an animation.
 * @param {string} src the source of the sprites sheet
 * @param {string} name the name of the sprite
 * @param (object) options various other options you can set, but are not
 * required.
 * @author Richard Key
 * @class The sprite object.
 * @constructor
 */

PFPlay.Sprite = function(src, name, options) 
{
  //Create an image for the spritesheet
  var _sheet = new PFPlay.Image(src);
  
  var _name = CheckValue(name, 'sprite' + (Math.random() * 10000));

  /** The previous and current position of the sprite */
  this.posCurrent = {x : 0, y : 0};
  this.posPrevious = {x : 0, y : 0};
  
  var _animations = {};
  var _currentAnimation;
  var _previousAnimation = -1;

  this.updated = false;
  this.zindex = 0;
  
  /** Gets the name of the sprite */
  this.name = function(newName)
  {
      return _name;
  };

  /** Adds an animation to the collection. See the Animation object for
   * more information. */ 
  this.addAnimation = function(name, size, frames, frameRate, options)
  {
    var newAnimation;
    
    if(name instanceof PFPlay.Animation)
      newAnimation = name;
    else
    { 
      options = CheckProperty(options, 'offset', null);
      
      //Create an animation option
      newAnimation = new PFPlay.Animation(
        name, size, frames, frameRate,
        {
          'offset': options.offset,
          'bounds': new Point(_sheet.width(), _sheet.height()),
        }
      );
    }
    
    newAnimation.bounds(
      new Point(_sheet.width(), _sheet.height())
    );
    
    _animations[newAnimation.name()] = newAnimation;
    
    //If this is the first animation, make it the current one.
    if(GetObjectSize(_animations) == 1)
      _currentAnimation = newAnimation.name();
  };
  
  /** Moves the sprite by adding to the current position.
   * @param {number} x the value to add to the x position.
   * @param {number} y the value to add to the y position.
   */
  this.move = function(x, y)
  {
    this.posPrevious = this.posCurrent;
    this.posCurrent = {
      x: this.posCurrent.x + x, 
      y: this.posCurrent.y + y
    };
  };
  
  /** Returns an animation from the colleciton by name. 
   * @param {string} name The name of the animation to return.
   * @return {object} the animation.
   */
  this.getAnimation = function(name)
  {
    return _animations[name];
  };
  
  /** This sets the currently used animation.
   * @param {string} name the name of the animation to use.
   */
  this.setAnimation = function(name)
  {
    _previousAnimation = _currentAnimation;
    _currentAnimation = name;
  }
  
  /** Updates the current animation and checks if the sprite has moved. */
  this.update = function()
  {
    _animations[_currentAnimation].update();
    
    this.updated = false; 
    this.updated = _animations[_currentAnimation].updated;
    
    if(this.posPrevious.x != this.posCurrent.x
      || this.posPrevious.y != this.posCurrent.y)
    {
      this.updated = true;
    }      
  }
  /** Returns the current frame as a simple rectangle.
   * @return {object} the frame.
   */
  this.getCurrentBounds = function()
  {
    var size = _animations[_currentAnimation].size();
    
    return {
      x: this.posCurrent.x,
      y: this.posCurrent.y,
      width: size.x,
      height: size.y
    };
  }
  
  /** Returns the current frame as a canvas object, ready to draw.
   * @return {object} the frame. */
  this.getCurrentFrame = function() 
  {
    var frame = _animations[_currentAnimation].getCurrentFrame();
    
    return _sheet.slice(
      frame.x, frame.y,
      frame.width, frame.height
    );
  };
  
  /** Returns the bounds from the previous frame, even if the previous
   * frame is from a different animation, as a simple rectangle.
   * @return {object} the frame.
   */
  this.getPreviousBounds = function()
  {
    var size = _animations[_currentAnimation].size();
     
    if(_previousAnimation != -1)
      size = _animations[_previousAnimation].size();
    
    return {
      x: this.posPrevious.x,
      y: this.posPrevious.y,
      width: size.x,
      height: size.y
    };
  }
  
  /** Returns the previous frame as a canvas, ready to redraw.
   * @return {object} the frame. */
  this.getPreviousFrame = function() 
  {
    var frame = _animations[_currentAnimation].getCurrentFrame();
    
    //Reset the previous animation until it chnages again
    if(_previousAnimation != -1)
    {
      frame = _animations[_currentAnimation].getPreviousFrame();
    }
    
    return _sheet.slice(
      frame.x, frame.y,
      frame.width, frame.height
    );
  };
}