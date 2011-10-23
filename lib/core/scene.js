/**
 * @author Neo
 */

PFPlay.Scene = function(params)
{
  params = PFPlay.util.checkParams(params,
  {
    name: 'scene' + (Math.random() * 10000)
  });
  
  var _name = params.name;
  
  var _layers = {};
  var _defaultSize = {width: 0, height: 0};
  
  this.active = false;
  
  this.name = function() { return _name; };
  
  this.setDefaultSize = function(width, height)
  {
    for(var l in _layers)
    {
      var bounds = _layers[l].getBounds();
      if(_layers[l].isDefaultSize == true)
        _layers[l].resize(width, height);
    }
    
    _defaultSize = {width: width, height: height};
  };
  
  this.addLayer = function(layer, zindex)
  {
    if(layer instanceof PFPlay.Layer 
      && !_layers.hasOwnProperty(layer.name()))
    {
      if(typeof zindex == 'number')
        layer.zindex = zindex;
      
      if(layer.isDefaultSize == true)
        layer.resize(_defaultSize.width, _defaultSize.height);
      
      _layers[layer.name()] = layer;
    }
  };
  
  this.removeLayer = function(name)
  {
    if(typeof name == 'string' && _layers.hasOwnProperty(name))
      delete _layers[name];
  };
  
  this.getLayer = function(name)
  {
    if(_layers.hasOwnProperty(name))
      return _layers[name];
    else
      return null;
  };
  
  this.getLiveLayer = function(name)
  {
    if(_layers.hasOwnProperty(name))
      return document.getElementById(_layers[name] + 'Live');
  };
  
  this.getScene = function()
  {
    var sDiv = document.createElement('div');
    sDiv.id = _name;
    
    var oLayers = PFPlay.util.orderObjects(_layers);
    
    for(var l = 0; l < oLayers.length; l++)
    {
      if(!oLayers[l]) {
        continue;
      }
      var liveCanvas = oLayers[l].getCanvas().cloneNode(true);
      liveCanvas.id = oLayers[l].name() + 'Live';
      
      sDiv.appendChild(liveCanvas);
    }
    
    return sDiv;
  };
  
  this.update = function(elapsed)
  {
    for(var l in _layers)
    {
      _layers[l].update(elapsed);
      
      if(_layers[l].updated)
      {
        var live = document.getElementById(_layers[l].name() + 'Live');
        var cxt = live.getContext('2d');
        
        cxt.clearRect(0, 0, live.width, live.height);
        cxt.drawImage(_layers[l].getCanvas(), 0, 0);
      }
    }
  }
  
  this.events = new PFPlay.EventManager({ masterCallback:
    function(type, evt)
    {
      for(var l in _layers)
      {
        var lBounds = _layers[l].getBounds();
        
        if(PFPlay.events[type] == 'mouse')
        {
          var x = evt.x;
          var y = evt.y;
          
          if(x > lBounds.x && x < (lBounds.x + lBounds.width)
            && y > lBounds.y && y < (lBounds.y + lBounds.height))
          {
            // Adjust the event params based on the layer's position.
            x -= lBounds.x;
            y -= lBounds.y;
        
            _layers[l].events.raiseEvent(type, {x: x, y: y});
          }
        }
        else
          _layers[l].events.raiseEvent(type, evt);
      }
  }});
};
