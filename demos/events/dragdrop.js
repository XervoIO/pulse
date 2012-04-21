pulse.ready(function(){
  var engine = new pulse.Engine();
  var cybertron = new pulse.Scene({name: 'Cybertron'});

  var world = new pulse.Layer({name: 'layer', x : 320, y : 240});
  world.zindex = 2;
  world.events.bind('mousemove', function(evt) {
    var debugPos = document.getElementById('mousep');
    debugPos.innerText = evt.world.x + ', ' + evt.world.y;
  });

  world.events.bind('keydown', function(evt) {
    var debugKey = document.getElementById('kdown');
    debugKey.innerText = evt.key + '[' + evt.keyCode + ']';
  });

  var dropArea = new pulse.Sprite({src: 'img/grid.png'});
  dropArea.dropAcceptEnabled = true;
  dropArea.events.bind('dragenter', function(evt) {
    var console = document.getElementById('console2');
    WriteLine("Drag Enter - " + evt.world.x + " " + evt.world.y);
  });
  dropArea.events.bind('dragover', function(evt) {
    var console = document.getElementById('console2');
    WriteLine("Drag Over - " + evt.world.x + " " + evt.world.y);
  });
  dropArea.events.bind('dragexit', function(evt) {
    var console = document.getElementById('console2');
    WriteLine("Drag Exit - " + evt.world.x + " " + evt.world.y);
  });

  var dragBox = new pulse.Sprite({src: 'img/blue_square.png'});
  dragBox.dragDropEnabled = true;
  dragBox.events.bind('dragstart', function(evt) {
    var console = document.getElementById('console');
    WriteLine("Drag Start - " + evt.world.x + " " + evt.world.y);
  });
  dragBox.events.bind('dragdrop', function(evt) {
    var console = document.getElementById('console');
    WriteLine("Drag Drop - " + evt.world.x + " " + evt.world.y);
  });

  var dragAccept = new pulse.Sprite({src: 'img/green_square.png'});
  var dragRevoke = new pulse.Sprite({src: 'img/red_square.png'});

  function loop(sceneManager)
  {
    var debugTime = document.getElementById('time');
    debugTime.innerText = engine.masterTime;
  }

  function gameGo()
  {
    dragBox.position = {x: 35, y: 325};
    dragBox.dragMoveEnabled = true;
    dropArea.position = {x: 400, y: 150};
    dragAccept.visible = false;
    dragRevoke.visible = false;

    world.addNode(dropArea);
    world.addNode(dragBox);
    world.addNode(dragAccept);
    world.addNode(dragRevoke);

    cybertron.addLayer(world);

    engine.scenes.addScene(cybertron);
    engine.scenes.activateScene(cybertron);

    engine.go(20, loop);
  }
  gameGo();
});