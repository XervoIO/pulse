pulse.ready(function() {

  var font = new pulse.BitmapFont({filename:'font/heln.fnt'});

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

  // pass in object to engine
  var gw = document.getElementById('game');
  var engine = new pulse.Engine({gameWindow: gw});

  function loop(sceneManager)
  {
    var debugTime = document.getElementById('time');
    debugTime.innerText = engine.masterTime;
  }

  function gameGo()
  {
    var l = new pulse.BitmapLabel({font: font, text: 'hello'});
    l.position = {x: 320, y: 240};
    l.rotation = 45;
    world.addNode(l);

    var gui = new dat.GUI();
    gui.add(l, 'text');
    gui.add(l, 'rotation', 0, 360);
    gui.add(l, 'alpha', 0, 100);

    cybertron.addLayer(world);
    cybertron.addLayer(bg);

    engine.scenes.addScene(cybertron);
    engine.scenes.activateScene(cybertron);

    engine.go(16.67, loop);
  }

  gameGo();

});