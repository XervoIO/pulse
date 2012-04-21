pulse.ready(function() {
  var gw = document.getElementById('game');
  var engine = new pulse.Engine({gameWindow: gw});
  var cybertron = new pulse.Scene({name: 'cybertron'});

  var sound = new pulse.Sound({filename: 'media/wheel_spin', type : 'html5'});

  var bg = new pulse.Layer({name: 'bg', x : 320, y : 240});
  var bgs = new pulse.Sprite({
    src: 'img/gray_bg.jpg',
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};

  bg.addNode(bgs);
  bg.zindex = 1;

  cybertron.addLayer(bg);

  var world = new pulse.Layer({name: 'layer', x : 320, y : 240});
  world.zindex = 2;

  cybertron.addLayer(world);

  var play = new pulse.Sprite({src: 'img/play_btn.png'});
  play.position = {x: 145, y: 300};
  play.events.bind('click', function(){
    sound.play();
  });
  world.addNode(play);

  var pause = new pulse.Sprite({src: 'img/pause_btn.png'});
  pause.position = {x: 320, y: 300};
  pause.events.bind('click', function(){
    sound.pause();
  });
  world.addNode(pause);

  var stop = new pulse.Sprite({src: 'img/stop_btn.png'});
  stop.position = {x: 495, y: 300};
  stop.events.bind('click', function(){
    sound.stop();
  });
  world.addNode(stop);

  engine.scenes.addScene(cybertron);
  engine.scenes.activateScene(cybertron);

  var gui = new dat.GUI();
  gui.add(sound, 'loop');

  function loop(sceneManager)
  {
    var debugTime = document.getElementById('time');
    debugTime.innerText = engine.masterTime;
  }

  engine.go(50, loop);
});