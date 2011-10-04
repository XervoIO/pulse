/**
 * @author Neo
 */

PFPlay.Layer = function(pWidth, pHeight, x, y)
{
  pWidth = CheckValue(pWidth, 0);
  pHeight = CheckValue(pHeight, 0);
  x = CheckValue(x, 0);
  y = CheckValue(y, 0);
  
  var canvas = document.createElement('canvas');
  canvas.width = pWidth;
  canvas.height = pHeight;
  
  var sprites = {};
  
  this.addObject = function(obj)
  {
    if(obj instanceof PFPlay.Sprite)
    {
      sprites[obj.name()] = obj;
    }
  };
  
  this.getCanvas = function()
  {
    drawSprites();
  };
  
  var orderSprites = function()
  {
    var ordered = new Array(GetObjectSize(sprites));
    for(var s in sprites)
    {
      var sprt = sprites[s];
      var i = sprt.zindex - 1;
      
      
      var nextEmpty = 0;
      while(ordered[nextEmpty] != null && nextEmpty < ordered.length)
        nextEmpty++;
      
      if(i < 0)
        i = nextEmpty;
      
      if(ordered[i] == null)
        ordered[i] = sprt;
      else
        ordered[nextEmpty] = sprt;
    }
    
    return ordered;
  }
  
  var drawSprites = function()
  {
    //Set up an ordered list of sprites
    var oSprites = orderSprites();
  };
};
