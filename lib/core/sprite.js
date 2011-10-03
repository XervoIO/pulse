/**
 * @author Richard Key
 *
 */

PFPlay.Sprite = function(src, options) 
{
  //Create an image for the spritesheet
  var sheet = new PFPlay.Image(src);

  /** The previous and current position of the sprite */
  this.posCurrent = {x : 0, y : 0};
  this.posPrevious = {x : 0, y : 0};
  
  var animations = {};
  var currentAnimation;
  var previousAnimation = -1;

  this.addAnimation = function(options)
  {
    var newAnimation;
    
    if(options instanceof PFPlay.Animation)
    {
      animations[options.name()] = options;
      animations[options.name()].bounds(
        new Point(sheet.width(), sheet.height())
      );
      
      newAnimation = options.name();
    }
    else
    {
      //Make sure all the necessary properties at least exist
      options = CheckProperty(options, 'name', Math.random() * 1000000);
      options = CheckProperty(options, 'size', null);
      options = CheckProperty(options, 'frames', null);
      options = CheckProperty(options, 'frameRate', null);
      options = CheckProperty(options, 'offset', null)
      
      //Create an animation option
      var a = new PFPlay.Animation(
        options.name, 
        options.size,
        options.frames,
        options.frameRate,
        { 
          'offset': options.offset,
          'bounds': new Point(sheet.width(), sheet.height()),
        }
      );
      
      animations[options.name] = a;
      newAnimation = options.name;
    }
    
    if(GetObjectSize(animations) == 1)
      currentAnimation = newAnimation;
  };

  this.move = function(px, py)
  {
    this.posPrevious = this.posCurrent;
    this.posCurrent = {
      x: this.posCurrent.x + px, 
      y: this.posCurrent.y + py
    };
  };
  
  this.getAnimation = function(name)
  {
    return animations[name];
  };
  
  this.setAnimation = function(name)
  {
    previousAnimation = currentAnimation;
    currentAnimation = name;
  }
  
  this.update = function()
  {
    animations[currentAnimation].update();
  }
  
  /** returns the current frame from the current animation */
  this.getCurrentFrame = function() {
    var frame = animations[currentAnimation].getCurrentFrame();
    
    return sheet.slice(
      frame.fx, frame.fy,
      frame.width, frame.height
    );
  };
  
  /** returns the last set frame */
  this.getPreviousFrame = function() {
    var frame = animations[currentAnimation].getPreviousFrame();
    if(previousAnimation != -1)
    {
      frame = animations[previousAnimation].getCurrentFrame();
      
      //Reset the previous animation until it chnages again
      previousAnimation = -1;
    }
    
    return sheet.slice(
      frame.fx, frame.fy,
      frame.width, frame.height
    );
  };
}