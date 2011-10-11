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
  
  var _name = PFPlay.util.checkValue(
    name, 'sprite' + (Math.random() * 10000));

  /** The previous and current position of the sprite */
  this.position = {x : 0, y : 0};
  var _previousPosition = {x : 0, y : 0};
  
  var _animations = {};
  var _currentAnimation;
  var _previousAnimation = -1;

  this.updated = false;
  this.zindex = 0;
  
  this.visible = true;
  
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
      options = PFPlay.util.checkProperty(options, 'offset', null);
      
      //Create an animation option
      newAnimation = new PFPlay.Animation(
        name, size, frames, frameRate,
        {
          'offset': options.offset
        }
      );
    }
    
    newAnimation.bounds(
      {x:_sheet.width(), y:_sheet.height()}
    );
    
    _animations[newAnimation.name()] = newAnimation;
    
    //If this is the first animation, make it the current one.
    if(PFPlay.util.getLength(_animations) == 1)
      _currentAnimation = newAnimation.name();
  };
  
  /** Moves the sprite by adding to the current position.
   * @param {number} x the value to add to the x position.
   * @param {number} y the value to add to the y position.
   */
  this.move = function(x, y)
  {
    this.position = {
      x: this.position.x + x, 
      y: this.position.y + y
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
    this.updated = false; 
    
    if(PFPlay.util.getLength(_animations) > 0)
    {
      _animations[_currentAnimation].update();
      this.updated = _animations[_currentAnimation].updated;
    }
    
    if(_previousPosition.x != this.position.x
      || _previousPosition.y != this.position.y)
    {
      this.updated = true;
    }      
  }
  /** Returns the current frame as a simple rectangle.
   * @return {object} the frame.
   */
  this.getCurrentBounds = function()
  {
    if(PFPlay.util.getLength(_animations) > 0)
    {
      var size = _animations[_currentAnimation].size();
      
      return {
        x: this.position.x,
        y: this.position.y,
        width: size.x,
        height: size.y
      };
    }
    else
    {
      return {
        x: this.position.x,
        y: this.position.y,
        width: _sheet.width(),
        height: _sheet.height()
      }
    }
  };
  
  /** Returns the current frame as a canvas object, ready to draw.
   * @return {object} the frame. */
  this.getCurrentFrame = function() 
  {
    if(PFPlay.util.getLength(_animations) > 0)
    {
      var frame = _animations[_currentAnimation].getCurrentFrame();
      
      return _sheet.slice(
        frame.x, frame.y,
        frame.width, frame.height
      );
    }
    else
    {
      return _sheet.slice();
    }
  };
  
  /** Sets the previous position, used to clear the previous frame from
   * a layer.
   * @param {number} x the horizontal previous position of the sprite
   * @param (number) y the vertical  previous position of the sprite
   */
  this.setPreviousPosition = function(x, y)
  {
    _previousPosition = {x: x, y: y}
  }
  
  /** Returns the bounds from the previous frame, even if the previous
   * frame is from a different animation, as a simple rectangle.
   * @return {object} the frame.
   */
  this.getPreviousBounds = function()
  {
    if(PFPlay.util.getLength(_animations) > 0)
    {
      var size = _animations[_currentAnimation].size();
       
      if(_previousAnimation != -1)
        size = _animations[_previousAnimation].size();
      
      return {
        x: _previousPosition.x,
        y: _previousPosition.y,
        width: size.x,
        height: size.y
      };
    }
    else
    {
      return {
        x: _previousPosition.x,
        y: _previousPosition.y,
        width: _sheet.width(),
        height: _sheet.height()
      };
    }
  };
};