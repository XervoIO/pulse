pulse.ready(function() {
  var seconds = new pulse.Texture({filename:'img/hex_rounded.png'});
  var minutes = new pulse.Texture({filename:'img/diamond.png'});
  var hours = new pulse.Texture({filename:'img/triangle_rounded.png'});

  var world = new pulse.Layer({name: 'layer', x : 320, y : 240});
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
  var bgs = new pulse.Sprite({
    src: 'img/yellow_bg.jpg',
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};

  bg.addNode(bgs);
  bg.zindex = 1;

  var cybertron = new pulse.Scene({name: 'cybertron'});

  var engine = new pulse.Engine();

  var s = new pulse.Sprite({src: seconds});
  s.move(320, 240);
  world.addNode(s);

  var m = new pulse.Sprite({src: minutes});
  m.anchor = {x:0.5, y:2.0};
  m.move(320, 240);
  world.addNode(m);

  var h = new pulse.Sprite({src: hours});
  h.anchor = {x: 0.5, y:5.3};
  h.move(320, 240);
  world.addNode(h);

  function loop(sceneManager, elapsed)
  {
    var debugTime = document.getElementById('time');
    debugTime.innerText = engine.masterTime;

    s.rotation += 36 * (elapsed / 1000);
    m.rotation += 6 * (elapsed / 1000);
    h.rotation += 0.1 * (elapsed / 1000);
  }

  function gameGo()
  {
    cybertron.addLayer(world);
    cybertron.addLayer(bg);

    engine.addScene(cybertron);
    engine.activateScene(cybertron);

    engine.go(50, loop);
  }

  gameGo();
});