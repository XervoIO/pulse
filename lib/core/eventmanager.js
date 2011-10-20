PFPlay.EventManager = function(masterCallback)
{
  var _events = {};
  var _masterCallback = masterCallback;
  
  this.bind = function(type, callback)
  {
    if(!_events.hasOwnProperty(type))
    { 
      _events[type] = new Array();
      _events[type].push(callback);
    }
    else
      _events[type].push(callback);
  };
  
  this.unbind = function(type)
  {
    if(_events.hasOwnProperty(type))
    {
      delete _events[type];
    }
  };
  
  this.hasEvent = function(type)
  {
    if(_events.hasOwnProperty(type))
      return true;
      
    return false;
  };
  
  this.raiseEvent = function(type, evt)
  {
    if(this.hasEvent(type))
    {
      for(var e = 0; e < _events[type].length; e++)
        _events[type][e](evt);
    }
    
    if(_masterCallback != null)
      _masterCallback(type, evt);
  };
}
