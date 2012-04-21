pulse.ready(function() {
  WriteLine("Touch Supported? " + pulse.support.touch);
  
  var textures = [];
  textures.push(new pulse.Texture({filename:'img/green_square.png'}));
  textures.push(new pulse.Texture({filename:'img/blue_square.png'}));
  textures.push(new pulse.Texture({filename:'img/red_square.png'}));

  var world = new pulse.Layer({name: 'layer', x : 320, y : 240});
  world.zindex = 2;
  
  world.events.bind('gestureend', function(e) {
    var cns = document.getElementById('console');
    WriteLine("Gesture End " + e.gestureRotation + ',' +  e.gestureScale);
  });
  
  var bg = new pulse.Layer({name: 'bg', x : 320, y : 240});
  var bgs = new pulse.Sprite({
    src: 'img/gray_bg.jpg',
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};
  
  bg.addNode(bgs);
  bg.zindex = 1;

  var cybertron = new pulse.Scene({name: 'cybertron'});

  var engine = new pulse.Engine();

  function loop(sceneManager)
  {
    var debugTime = document.getElementById('time');
    debugTime.innerText = engine.masterTime;
  }

  function gameGo()
  {
    var s;
    for(var i = 0; i < 9; i++) {
      s = new pulse.Sprite({name: 'Box' + i, src: textures[i%3]});
      s.anchor = {x: i % 3 * 0.5, y: Math.floor(i / 3) * 0.5};
      s.position = {x: 106 + (i % 3 * 213), y: 35 + Math.floor(i / 3) * 120};
      s.events.bind('click', function(e){
        WriteLine(e.sender.name + " box clicked");
      });
      world.addNode(s);
    }

    cybertron.addLayer(bg);

    engine.scenes.addScene(cybertron);
    engine.scenes.activateScene(cybertron);

    cybertron.addLayer(world);

    engine.go(16.67, loop);
  }

  gameGo();
});