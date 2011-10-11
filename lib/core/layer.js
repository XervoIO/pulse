/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * Layers are the heart of the engine, as they are base canvas for drawing
 * objects. Tney are literally a collection of sprites that are drawn within
 * a specific area. A collection of layers make up each scene.
 * @param {number} width the width of the layer
 * @param {number} height the height of the layer
 * @param (number) x the horizontal position of the layer, relative to the 
 * scene bounds.
 * @param {number} y the vertical position of the layer, relative to the
 * scene.
 * @author Richard Key
 * @class The layer object.
 * @constructor
 */

PFPlay.Layer = function(width, height, x, y)
{
  x = PFPlay.util.checkValue(x, 0);
  y = PFPlay.util.checkValue(y, 0);
  
  var _canvas = document.createElement('canvas');
  _canvas.width = PFPlay.util.checkValue(width, 0);
  _canvas.height = PFPlay.util.checkValue(height, 0);
  
  var _objects = {};
  
  /** Updates all the objects in the layer. */
  this.update = function()
  {
    for(var s in _objects)
    {
      if(_objects[s] instanceof PFPlay.Sprite)
        _objects[s].update();
    }
  };
  
  /** Adds an object to the layer. 
   * @param {object} obj the object to add.
   */
  this.addObject = function(obj)
  {
    if(obj instanceof PFPlay.Sprite)
    {
      if(!_objects.hasOwnProperty(obj.name()))
        _objects[obj.name()] = obj;
      else
        PFPlay.error.DuplicateName(obj.name());
    }
  };
  
  this.removeObject = function(name)
  {
    if(_objects.hasOwnProperty(name))
    {
      if(_objects[name] instanceof PFPlay.Sprite)
      {
        var cxt = _canvas.getContext('2d');
        var clear = _objects[name].getPreviousBounds();
        cxt.clearRect(clear.x, clear.y, clear.width, clear.height);
      }
      
      delete _objects[name];
    }
  };
  
  /** Returns a complete, filled canvas. 
   * @return {object} the canvas for the layer.
   */
  this.getCanvas = function()
  {
    drawSprites();
    return _canvas;
  };
  
  /** Returns the sprite with the given name.
   * @param {string} name the name of the sprite to return.
   * @return {object} the sprite.
   */
  this.getObject = function(name)
  {
    return _objects[name];
  };
  
  var getObjectsByType = function(type)
  {
    var ret = {};
    
    for(var o in _objects)
    {
      if(_objects[o] instanceof type)
        ret[o] = _objects[o];
    }
    
    return ret;
  };
  
  /** Reorders the sprites so that they are layered according to their 
   * zindexes. Any sprites that do not have a set z-position will fill the 
   * first "open" spot on the layer.
   * @return {array} an array of sprites, ordered from bottom (0) to top (0).
   */
  var orderSprites = function()
  {
    var sprites = getObjectsByType(PFPlay.Sprite);
    var ordered = new Array(PFPlay.util.getLength(sprites));
    
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
  };
  
  /** Draws all the sprites to the internal canvas. */
  var drawSprites = function()
  {
    var cxt = _canvas.getContext('2d');
    
    //Set up an ordered list of sprites
    var oSprites = orderSprites();
    var oSprites = updateForOverlap(oSprites);
    
    //Clear old regions
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
      if(oSprites[d].updated && oSprites[d].visible)
      {
        var clear = oSprites[d].getPreviousBounds();
        cxt.drawImage(
          oSprites[d].getCurrentFrame(), 
          oSprites[d].position.x,
          oSprites[d].position.y
        );
        
        oSprites[d].setPreviousPosition(
          oSprites[d].position.x,
          oSprites[d].position.y
        );
      }
    }
  };
  
  /** This checks a collection of ordered sprites to see if any overlapping
   * sprites need to be updated. If a sprite is updated, and is overlapped
   * by another sprite, the overlapping sprite also needs to be redrawn.
   * @param {array} the array of ordered sprites.
   * @return {array} the updated array of ordered sprites.
   */
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
        
        if(PFPlay.util.intersects(sprt1Current, sprt2Current) 
          || PFPlay.util.intersects(sprt1Previous, sprt2Current))
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
