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
  
  this.update = function()
  {
    for(var s in sprites)
    {
      sprites[s].update();
    }
  };
  
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
    return canvas;
  };
  
  this.getSprite = function(name)
  {
    return sprites[name];
  }
  
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
    var cxt = canvas.getContext('2d');
    
    //Set up an ordered list of sprites
    var oSprites = orderSprites();
    var oSprites = updateForOverlap(oSprites);
    
    //Clear updated regions
    for(var c = 0; c < oSprites.length; c++)
    {
      if(oSprites[c].updated)
      {
        var clear = oSprites[c].getPreviousBounds();
        cxt.clearRect(clear.x, clear.y, clear.width, clear.height);
      }
    }
    
    //Draw updated regions
    for(var d = 0; d < oSprites.length; d++)
    {
      if(oSprites[d].updated)
      {
        var clear = oSprites[d].getPreviousBounds();
        cxt.drawImage(
          oSprites[d].getCurrentFrame(), 
          oSprites[d].posCurrent.x,
          oSprites[d].posCurrent.y
        );
      }
    }
  };
  
  var updateForOverlap = function(ordered)
  {
    var sCount = ordered.length;
    
    for(var s = 0; s < sCount - 1; s++)
    {
      var sprt1 = ordered[s];
      
      if(!sprt1 instanceof PFPlay.Sprite)
        continue;
      
      for(var ss = s + 1; ss < sCount; ss++)
      {
        var sprt2 = ordered[ss];
        
        if(!sprt1 instanceof PFPlay.Sprite)
          continue;
          
        var sprt1Current = sprt1.getCurrentBounds();
        var sprt1Previous = sprt1.getPreviousBounds();
        var sprt2Current = sprt2.getCurrentBounds();
        
        if(intersects(sprt1Current, sprt2Current) 
          || intersects(sprt1Previous, sprt2Current))
        {
          sprt.updated = true;
          ordered[s] = sprt;
          sprt2.updated = true;
          ordered[ss] = sprt2;
        }
      }
    }
    
    return ordered;
  };
};
