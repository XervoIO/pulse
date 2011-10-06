/**
 * @author Neo
 */
PFPlay.Animation = function(name, size, pFrames, pFrameRate, options)
{
  //Setup defaults if necessary
  name = CheckValue(name, Math.random() * 1000000);
  size = CheckValue(size, new Point(0, 0));
  
  pFrames = CheckValue(pFrames, 0);
  pFrameRate = CheckValue(pFrameRate, 999999);
  options = CheckProperty(options, 'offset', new Point(0, 0));
  
  //Setup the variables
  var frameWidth = size.x;
  var frameHeight = size.y;
  
  var xBounds;
  var yBounds;
  
  var frames = pFrames;
  
  var frameRate = pFrameRate;
  
  var xOffset = options.offset.x;
  var yOffset = options.offset.y;
  
  var currentFrame = 0;
  
  var isPlaying = false;
  var start = 0;
  var playTime = 0;
  
  this.updated = false;
  
  this.name = function()
  {
    return name;
  }
  
  this.frameWidth = function()
  {
    return frameWidth;
  }
  
  this.frameHeight = function()
  {
    return frameHeight;
  }
  
  this.bounds = function(newBounds)
  {
    if(newBounds == undefined || newBounds == null)
      return new Point(xBounds, yBounds);
  
    /** Bounds have to be greater than 0 to prevent an infinite loop
     * when checking for positions outside them. */
    if(newBounds.x <= 0)
      newBounds.x = 1;
    
    if(newBounds.y <= 0)
      newBounds.y = 1;
      
    xBounds = newBounds.x;
    yBounds = newBounds.y;
  };
  
  //Set the initial bounds
  options = CheckProperty(options, 'bounds', new Point(0, 0));
  this.bounds(options.bounds);
  
  this.start = function()
  {
    start = PFPlay.masterTime;
    isPlaying = true;
  };
  
  this.pause = function()
  {
    isPlaying = false;
  }
  
  this.stop = function()
  {
    isPlaying = false;
    playTime = 0;
    currentFrame = 0;
  }
  
  this.update = function()
  {
    if(isPlaying == false)
    {
      this.updated = false;
      return;
    }
    
    playTime = PFPlay.masterTime - start;
    
    if(playTime / frameRate >= 1)
    {
      currentFrame++;
      
      if(typeof frames == 'number')
      {
        if(currentFrame > frames)
          currentFrame = 0;
      }
      
      if(frames instanceof Array)
      {
        if(currentFrame >= frames.length)
          currentFrame = 0;
      }
      
      start = PFPlay.masterTime;
      this.updated = true;
    }
    else
    {
      this.updated = false;
    }
  };
  
  var getFrame = function(index)
  {
    var frame = CheckValue(index, currentFrame);
    
    if(frames instanceof Array)
      frame = frames[currentFrame];
    
    /** convert to a zero index */
    frame = frame - 1;
    
    var x = (frame + xOffset) * frameWidth;
    var y = yOffset;
    
    /** If the x position is out of bounds, move the frame selection
     * down. */
    while(x >= xBounds)
    {
      x = x - xBounds;
      y++;
    }
      
    y = y * frameHeight;
    
    if(y >= yBounds)
      y = yBounds - frameHeight;
    
    return {fx: x, fy: y, width: frameWidth, height: frameHeight};
  };
  
  this.getCurrentFrame = function()
  {
    return getFrame();
  };
  
  this.getPreviousFrame = function()
  {
    if((currentFrame - 1) < 1)
      return getFrame(1);
    else
      return getFrame(currentFrame - 1);
  };
};
