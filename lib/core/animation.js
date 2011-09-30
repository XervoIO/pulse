/**
 * @author Neo
 */
PFPlay.Animation = function(name, size, bounds, pFrames, pFrameRate, options)
{
  //Setup defaults if necessary
  name = CheckValue(name, Math.random() * 1000000);
  size = CheckValue(size, new Point(0, 0));
  
  bounds = CheckValue(bounds, new Point(1, 1));
  
  if(bounds.x <= 0)
    bounds.x = 1;
  
  if(bounds.y <= 0)
    bounds.y = 1;
  
  pFrames = CheckValue(pFrames, 0);
  pFrameRate = CheckValue(pFrameRate, 0);
  options = CheckProperty(options, 'offset', new Point(0, 0));
  
  //Setup the variables
  var frameWidth = size.x;
  var frameHeight = size.y;
  
  var xBounds = bounds.x;
  var yBounds = bounds.y;
  
  var frames = pFrames;
  
  var frameRate = pFrameRate;
  
  var xOffset = options.offset.x;
  var yOffset = options.offset.y;
  
  var currentFrame = 0;
  
  var isPlaying = false;
  var playTime = 0;
  
  this.updated = false;
  
  this.update = function()
  {
    playTime = playTime + PFPlay.tick;
    
    if(playTime % frameRate == 0)
    {
      currentFrame++;
      
      if(typeof frames == 'number')
      {
        if(currentFrame = frames)
          currentFrame = 0;
      }
      
      if(frames instanceof Array)
      {
        if(currentFrame >= frames.length)
          currentFrame = 0;
      }
      
      this.updated = true;
    }
    else
      this.updated = false;
  };
  
  this.getFrame = function()
  {
    var frame = currentFrame;
    
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
};
