pulse.ready(function() {
  var tileImg = new pulse.Texture({filename:'../Isometric/tile.png'});
  
  var world = new pulse.Layer({name: 'myLayer', x : 320, y : 240});
  world.zindex = 2;
  world.events.bind('mousemove', 
    function(evt) 
    { 
      var debugPos = document.getElementById('mousep');
      debugPos.innerText = evt.world.x + ', ' + evt.world.y;
  });
  
  world.events.bind('keydown', function(evt) {
    var debugKey = document.getElementById('kdown');
    debugKey.innerText = evt.key + '[' + evt.keyCode + ']';
  });
  
  var bg = new pulse.Layer({name: 'bg', x : 320, y : 240});
  
  var bgs = new pulse.Sprite( {
    src: '../img/Forest_blue.jpg', 
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};
  
  bg.addNode(bgs);
  bg.zindex = 1;
  
  var cybertron = new pulse.Scene({name: 'Cybertron'});
  
  var myEngine = new pulse.Engine();
  
  var testSprites = [];
  
  function loop(sceneManager)
  { 
    var debugTime = document.getElementById('time');
    debugTime.innerText = pulse.masterTime;
  }
  
  function gameGo()
  {
    var s;
    for(var i = 0; i < 550; i++) {
      s = new pulse.Sprite({src: tileImg});
      s.move(Math.floor(Math.random() * 610) + 15, Math.floor(Math.random() * 450) + 15);
      s.zindex = i;
      world.addNode(s);
    }
    
    cybertron.addLayer(world);
    cybertron.addLayer(bg);
    
    myEngine.scenes.addScene(cybertron);
    myEngine.scenes.activateScene(cybertron);
    
    myEngine.go(50, loop);
  }
  gameGo();
});