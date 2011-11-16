pulse.ready(function() {
  var ballTexture = new pulse.Image({src:'../pong/ball.png'});
  
  var world = new pulse.Layer({name: 'layer', x : 320, y : 240});
  world.zindex = 2;
  
  var bg = new pulse.Layer({name: 'bg', x : 320, y : 240});
  var bgs = new pulse.Sprite({
    src: '../img/gray_bg.jpg', 
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};
  
  bg.addNode(bgs);
  bg.zindex = 1;
  
  var cybertron = new pulse.Scene({name: 'cybertron'});
  
  var engine = new pulse.Engine();

  var balls = [];
  var b;
  for(var i = 0; i < 800; i++) {
    b = new Ball({src : ballTexture});
    b.position = {
      x : Math.random() * 640,
      y : Math.random() * 480
    }; 
    world.addNode(b);
  }
  
  cybertron.addLayer(world);
  cybertron.addLayer(bg);
  
  engine.scenes.addScene(cybertron);
  engine.scenes.activateScene(cybertron);

  var bodyElement = document.getElementsByTagName('body')[0];

  var stats = new Stats();

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '700px';
  stats.domElement.style.top = '10px';

  bodyElement.appendChild(stats.domElement);

  function loop(sm, elapsed) {
    stats.update();
  }
  
  engine.go(16.67, loop);
});