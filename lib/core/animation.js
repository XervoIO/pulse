/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * Animations are a collection of rectangles that represent pieces of
 * a larger rectangle, which change at a given rate, IE the frame
 * changes at a given interval.
 * @author Richard Key
 * @param {object} name the name of the animation or a full animation
 * object.
 * @param {object} size a point object that represents the size of the 
 * animation frames.
 * @param {number|array} frames a number representing the number of frames
 * or an array of frames representing the sequence in which to play the
 * frames.
 * @param {number} frameRate the number of miliseconds between a frame.
 * @param {object} options various other options you can set.
 * --offset: the tixel offset of the animation in respect to the sprite
 * sheet.
 * --bounds: the phyiscal bounds in which all frames must lie.
 * @class The animation object.
 * @constructor
 */
PFPlay.Animation = function(name, size, frames, frameRate, options)
{
  var _name = CheckValue(name, Math.random() * 1000000);
  
  frames = CheckValue(frames, 0);
  frameRate = CheckValue(frameRate, 999999);
  options = CheckProperty(options, 'offset', new Point(0, 0));
  
  /** Frame size */
  size = CheckValue(size, new Point(0, 0));
  var _frameWidth = size.x;
  var _frameHeight = size.y;
  
  /** The bounds in the which all frames must lie. */
  var _xBounds;
  var _yBounds;
  
  /** The number of frames or the sequence of frames in the animation. */
  var _frames = frames;
  
  var _frameRate = frameRate;
  
  /** The tixel offset of the frames on the image. */
  var _xOffset = options.offset.x;
  var _yOffset = options.offset.y;
  
  var _currentFrame = 0;
  
  var _isPlaying = false;
  var _start = 0;
  var _playTime = 0;
  
  this.updated = false;
  
  /** @return {string} The name of the animation */
  this.name = function()
  {
    return _name;
  }
  
  /** Returns the size of a frame for this animation. 
   * @return {object} The width and height of a frame. */
  this.size = function()
  {
    return new Point(_frameWidth, _frameHeight);
  }
  
  /** Gets or Sets the current outer bounds for the animation. The bounds
   * determine when to wrap frames to the next "line." Frames will always be
   * forced to lie without the set bounds.
   * @param {object} newBounds the new bounds of the animation
   * @return {object} the current bounds of the animation */
  this.bounds = function(newBounds)
  {
    if(newBounds == undefined || newBounds == null)
      return new Point(_xBounds, _yBounds);
  
    /** Bounds have to be greater than 0 to prevent an infinite loop
     * when checking for positions outside them. */
    if(newBounds.x <= 0)
      newBounds.x = 1;
    
    if(newBounds.y <= 0)
      newBounds.y = 1;
      
    _xBounds = newBounds.x;
    _yBounds = newBounds.y;
  };
  
  /** Set the initial bounds. */
  options = CheckProperty(options, 'bounds', new Point(1, 1));
  this.bounds(options.bounds);
  
  /** Start the animation. Starting a paused animation will reset the
   * current frame's playtime, essentially resetting the current frame.
   * However paused animations do no start back at frame 0. */
  this.start = function()
  {
    _start = PFPlay.masterTime;
    _isPlaying = true;
  };
  
  /** Pauses the animation */
  this.pause = function()
  {
    _isPlaying = false;
  }
  
  /** Stops the animation. Stopping the animation will also reset
   * the animation back to frame 0. */
  this.stop = function()
  {
    _isPlaying = false;
    _playTime = 0;
    _currentFrame = 0;
  }
  
  /** This is the master update function for the animation. */
  this.update = function()
  {
    if(_isPlaying == false)
    {
      this.updated = false;
      return;
    }
    
    _playTime = PFPlay.masterTime - _start;
    
    if(_playTime / _frameRate >= 1)
    {
      _currentFrame++;
      
      if(typeof _frames == 'number')
      {
        if(_currentFrame > _frames)
          _currentFrame = 0;
      }
      
      if(_frames instanceof Array)
      {
        if(_currentFrame >= _frames.length)
          _currentFrame = 0;
      }
      
      _start = PFPlay.masterTime;
      this.updated = true;
    }
    else
    {
      this.updated = false;
    }
  };
  
  /**@param {number} index the frame to retrieve. 
   * @return {object} a rectangle that represents the frame. */
  var getFrame = function(index)
  {
    var frame = CheckValue(index, _currentFrame);
    
    if(_frames instanceof Array)
      frame = _frames[_currentFrame];
    
    /** convert to a zero index */
    frame = frame - 1;
    
    var x = (frame + _xOffset) * _frameWidth;
    var y = _yOffset;
    
    /** If the x position is out of bounds, move the frame selection
     * down. */
    while(x >= _xBounds)
    {
      x = x - _xBounds;
      y++;
    }
      
    y = y * _frameHeight;
    
    if(y >= _yBounds)
      y = _yBounds - _frameHeight;
    
    return {x: x, y: y, width: _frameWidth, height: _frameHeight};
  };
  
  /** @return {object} a rectangle that represents the current frame */
  this.getCurrentFrame = function()
  {
    return getFrame();
  };
  
  /** @return {object} a rectangle that represents the previous frame */
  this.getPreviousFrame = function()
  {
    if((_currentFrame - 1) < 1)
      return getFrame(1);
    else
      return getFrame(_currentFrame - 1);
  };
};
