/**
 * @author Neo
 */

PFPlay.Engine = function()
{
  var me = this;
  
  this.scenes = new PFPlay.SceneManager();
  
  var _loopLogic = null;
  
  this.getWindowOffset = function()
  {
    var offX = PFPlay.gameWindow.offsetLeft;
    var offY = PFPlay.gameWindow.offsetTop;
    
    if(PFPlay.gameWindow.offsetParent)
    {
      var parent = PFPlay.gameWindow.offsetParent;
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
  
  var bindEvents = function()
  {
    for(var e in PFPlay.events)
    {
      window.addEventListener(e, me.windowEvent, false);
    }
  };
  
  this.go = function(tick, loop)
  {
    PFPlay.activeEngine = this;
    bindEvents();
    _loopLogic = loop;
    setInterval(this.loop, tick);
  };
  
  this.loop = function()
  {
    var eng = PFPlay.activeEngine;
    var off = eng.getWindowOffset();
    
    _loopLogic(eng.scenes);
    
    var activeScenes = eng.scenes.getScenes(true);
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      activeScenes[s].update();
    }
    
    PFPlay.masterTime = new Date().getTime() - start;
  };
  
  this.windowEvent = function(rawEvt)
  {
    var eng = PFPlay.activeEngine;
    
    var activeScenes = eng.scenes.getScenes(true);
    var offset = eng.getWindowOffset();
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      var x = rawEvt.clientX - offset.x;
      var y = rawEvt.clientY - offset.y;
      
      activeScenes[s].raiseEvent(rawEvt.type, {x: x, y: y});
    }
  };
}
