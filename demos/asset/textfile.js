pulse.ready(function() {

  var textfile = new pulse.TextFile({filename:'text/list.txt'});

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

  var printed = false;

  // pass in object to engine
  var gw = document.getElementById('gameWindow');
  var engine = new pulse.Engine({gameWindow: gw});

  function loop(sceneManager)
  {
    var debugTime = document.getElementById('time');
    debugTime.innerText = engine.masterTime;

    if(textfile.percentLoaded === 100 && printed === false) {
      WriteLine('File Contents:');
      WriteLine(textfile.text);
      printed = true;
    }
  }

  function gameGo()
  {
    cybertron.addLayer(world);
    cybertron.addLayer(bg);

    engine.scenes.addScene(cybertron);
    engine.scenes.activateScene(cybertron);

    engine.go(16.67, loop);
  }

  gameGo();

});