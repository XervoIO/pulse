/**
 * @author Neo
 */

PFPlay.Engine = function(gameWindow)
{
  var _start = 0;
  var _gameWindow = document.getElementById(gameWindow);
  
  this.scenes = new PFPlay.SceneManager(_gameWindow);
  
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
  
  this.find = function(name)
  {
    var objects = new Array();
    var searchScenes = this.scenes.getScenes();
    
    for(var s = 0; s < searchScenes.length; s++)
    {
      
    }
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
    //PFPlay.activeEngine = this;
    this.bindEvents();
    _loopLogic = loop;
    setInterval(function() { eng.loop(eng); }, tick);
    _start = new Date().getTime();
  };
  
  this.loop = function(eng)
  {
    var off = eng.getWindowOffset();
    
    _loopLogic(eng.scenes);
    
    var activeScenes = eng.scenes.getScenes(true);
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      activeScenes[s].update();
    }
    
    PFPlay.masterTime = new Date().getTime() - _start;
  };
  
  this.windowEvent = function(eng, rawEvt)
  {    
    var activeScenes = eng.scenes.getScenes(true);
    var offset = eng.getWindowOffset();
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      var x = rawEvt.clientX - offset.x;
      var y = rawEvt.clientY - offset.y;
      
      activeScenes[s].events.raiseEvent(rawEvt.type, {x: x, y: y});
    }
  };
}
