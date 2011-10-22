PFPlay.EventManager = function(params)
{
  params = PFPlay.util.checkParams(params,
  {
    masterCallback: 0
  });
  
  var _events = {};
  var _masterCallback = params.masterCallback;
  
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
    
    if(typeof _masterCallback == 'function')
      _masterCallback(type, evt);
  };
}
