/**
 * @author Neo
 */

PFPlay.Engine = function(params)
{
  params = PFPlay.util.checkParams(params,
  {
    gameWindow: 'gameWindow'
  });

  this.masterTime = 0;
  this.tick = 100;
  
  var _gameWindow = document.getElementById(params.gameWindow);

  var _currentTime = new Date().getTime();
  var _lastTime = _currentTime;
  
  this.scenes = new PFPlay.SceneManager({gameWindow: _gameWindow});
  
  var _loopLogic = null;
  
  this.getWindowOffset = function()
  {
    var offX = _gameWindow.offsetLeft;
    var offY = _gameWindow.offsetTop;
    
    if(_gameWindow.offsetParent)
    {
      var parent = _gameWindow.offsetParent;
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
    this.tick = tick;
    var eng = this;

    this.bindEvents();
    
    if(!loop)
      _loopLogic = function() {};
    else
      _loopLogic = loop;
    
    console.log(this.tick);
    setInterval(function() { eng.loop(eng); }, this.tick);
  };
  
  this.loop = function(eng)
  {
    _currentTime = new Date().getTime();

    var elapsed = _currentTime - _lastTime;

    var off = eng.getWindowOffset();

    _loopLogic(eng.scenes);
    
    var activeScenes = eng.scenes.getScenes(true);
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      activeScenes[s].update(elapsed);
    }
    
    _lastTime = _currentTime;

    this.masterTime += elapsed;
  };
  
  this.windowEvent = function(eng, rawEvt)
  {    
    var activeScenes = eng.scenes.getScenes(true);
    var offset = eng.getWindowOffset();
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      var x = rawEvt.clientX - offset.x;
      var y = rawEvt.clientY - offset.y;
      
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
