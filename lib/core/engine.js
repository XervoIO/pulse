/**
 * @author Neo
 */

PFPlay.Engine = function(params)
{
  params = PFPlay.util.checkParams(params,
  {
    gameWindow: 'gameWindow',
    width: 0,
    height: 0
  });
  
  var _width = params.width;
  var _height = params.height;
  
  var _start = 0;
  var _gameWindow = document.getElementById(params.gameWindow);

  this.masterTime = 0;
  this.tick = 100;

  var _lastTime = 0;
  
  // Attempt to get the width from the specified container.
  if(_width == 0 || _height == 0) {
    if(_gameWindow) {
      var parentWidth = parseInt(_gameWindow.style.width);
      var parentHeight = parseInt(_gameWindow.style.height);
      
      if(parentWidth && parentHeight) {
        _width = parentWidth;
        _height = parentHeight;
      }
    }
  }
  
  // Width and height not found anywhere - default to something.
  if(_width == 0 || _height == 0) {
    _width = 640;
    _height = 480;
  }
  
  // Create a div within the supplied container to hold each layer.
  // This prevents issues based on the unknown parameters of the
  // user-supplied container element.
  var _mainDiv = document.createElement('div');
  _mainDiv.style.position = 'absolute';
  _mainDiv.style.width = _width + 'px';
  _mainDiv.style.height = _height + 'px';
  _mainDiv.style.overflow = 'hidden';
  _gameWindow.appendChild(_mainDiv);
  
  this.scenes = new PFPlay.SceneManager({gameWindow: _mainDiv});
  
  var _loopLogic = null;
  
  this.getWindowOffset = function()
  {
    var offX = _mainDiv.offsetLeft;
    var offY = _mainDiv.offsetTop;
    
    if(_mainDiv.offsetParent)
    {
      var parent = _mainDiv.offsetParent;
      do {
          offX += parent.offsetLeft;
          offY += parent.offsetTop;
      } while (parent = parent.offsetParent);
    }
    
    return {x: offX, y: offY};
  };
  
  this.bindEvents = function()
  {
    var eng = this;
    
    for(var e in PFPlay.events)
    {
      window.addEventListener(e, 
        function(evt) { eng.windowEvent(eng, evt) }, false);
    }
  };
  
  this.go = function(tick, loop)
  {
    var eng = this;
    this.bindEvents();
    
    if(!loop)
      _loopLogic = function() {};
    else
      _loopLogic = loop;
      
    setInterval(function() { eng.loop(eng); }, this.tick);
    _start = new Date().getTime();
  };
  
  this.loop = function(eng)
  {
    this.masterTime = new Date().getTime() - _start;

    var elapsed = this.masterTime - _lastTime;

    var off = eng.getWindowOffset();

    _loopLogic(eng.scenes);
    
    var activeScenes = eng.scenes.getScenes(true);
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      activeScenes[s].update(elapsed);
    }
    
    _lastTime = this.masterTime;
  };
  
  this.windowEvent = function(eng, rawEvt)
  {    
    var activeScenes = eng.scenes.getScenes(true);
    var offset = eng.getWindowOffset();
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      var x = rawEvt.clientX - offset.x + document.body.scrollLeft;
      var y = rawEvt.clientY - offset.y + document.body.scrollTop;
      
      var evtProps = {x: x, y: y};
      
      if(PFPlay.events[rawEvt.type] == 'keyboard')
      {
        var code;
        if(rawEvt.charCode) code = rawEvt.charCode;
        else if (rawEvt.keyCode) code = rawEvt.keyCode;
        else if (rawEvt.which) code = rawEvt.which;
        
        evtProps['keyCode'] = code;
        evtProps['key'] = String.fromCharCode(code);
      }
      
      activeScenes[s].events.raiseEvent(rawEvt.type, evtProps);
    }
  };
}
