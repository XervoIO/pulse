pulse.ready(function() {
  var texture = new pulse.Texture({filename:'img/green_square.png'});
  
  var world = new pulse.Layer({name: 'layer', x : 320, y : 240});
  world.zindex = 2;
  
  var bg = new pulse.Layer({name: 'bg', x : 320, y : 240});
  var bgs = new pulse.Sprite({
    src: 'img/gray_bg.jpg', 
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};
  
  bg.addNode(bgs);
  bg.zindex = 1;
  
  var cybertron = new pulse.Scene({name: 'cybertron'});
  var engine = null;
  
  function loop(sceneManager)
  { 
    var debugTime = document.getElementById('time');
    debugTime.innerText = debugTime.textContent = engine.masterTime;
  }
  
  function gameGo()
  {
    // pass in object to engine
    var gw = document.getElementById('game');
    engine = new pulse.Engine({gameWindow: gw});
  
    var s = new pulse.Sprite({src: texture});
    s.position = {x: 320, y: 240};
    s.events.bind('mousewheel', function(e) {
      WriteLine('Delta: ' + e.scrollDelta);
    });
    world.addNode(s);
  
    cybertron.addLayer(world);
    cybertron.addLayer(bg);
    
    engine.scenes.addScene(cybertron);
    engine.scenes.activateScene(cybertron);
    
    engine.go(16.67, loop);
  }
  gameGo();
});