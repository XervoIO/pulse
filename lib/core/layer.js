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

PFPlay.Layer = function(params)
{
  params = PFPlay.util.checkParams(params,
  {
    name: 'layer' + (Math.random() * 10000),
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  
  var _name = params.name;
  this.zindex = 0;
  
  var _x = params.x;
  var _y = params.y;
  
  var _canvas = document.createElement('canvas');
  _canvas.width = params.width;
  _canvas.height = params.height;
  
  var _ctx = _canvas.getContext('2d');
  
  this.isDefaultSize = false;
  
  if(_canvas.width < 1 || _canvas.height < 1)
    this.isDefaultSize = true;
  
  var _objects = {};
  
  this.updated = true;
  
  this.name = function() { return _name; };
  
  this.resize = function(width, height)
  {
    _canvas.width = width;
    _canvas.height = height;
  };
  
  this.getBounds = function()
  {
    return {x: _x, y: _y, width: _canvas.width, height: _canvas.height};
  };
  
  /** Updates all the objects in the layer. */
  this.update = function(elapsed)
  {
    this.updated = false;
        
    for(var s in _objects)
    {
      if(_objects[s] instanceof PFPlay.Sprite)
      {
        _objects[s].update(elapsed);
        this.updated = true;
      }
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
  
  /** Draws all the sprites to the internal canvas. */
  var drawSprites = function()
  {    
    var isDirty = false;
    
    // Do any sprites need updated?
    for(var o in _objects) {
      if(_objects[o].updated) {
        isDirty = true;
        break;
      }
    }
    
    // If anything needs updated - just updated everything.
    if(isDirty) {
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
      
      for(var o in _objects) {
        
        if(_objects[o] instanceof PFPlay.Sprite)
        {
          if(_objects[o].visible && _objects[o].loaded()) {
            _ctx.drawImage(
              _objects[o].getCurrentFrame(),
              _objects[o].position.x,
              _objects[o].position.y
            );
          }
        }
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
          sprt1.updated = true;
          ordered[s] = sprt1;
          sprt2.updated = true;
          ordered[ss] = sprt2;
        }
      }
    }
    
    return ordered;
  };
  
  this.events = new PFPlay.EventManager({masterCallback:
    function(type, evt) {
      var sprites = getObjectsByType(PFPlay.Sprite);
      
      for(var s in sprites)
      {
        if(PFPlay.events[type] == 'mouse')
        {
          if(sprites[s].inCurrentBounds(evt.x, evt.y) 
            && sprites[s].events.hasEvent(type))
          {
            sprites[s].events.raiseEvent(type, evt);
          }
        }
        else
          sprites[s].events.raiseEvent(type, evt);
      }
  }});
};
