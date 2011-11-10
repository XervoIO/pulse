var font = new PFPlay.BitmapFont({filename:'../font/exotica.fnt'});

var world = new PFPlay.Layer({name: 'layer', x : 320, y : 240});
world.zindex = 2;

var bg = new PFPlay.Layer({name: 'bg', x : 320, y : 240});
var bgs = new PFPlay.Sprite({
  src: '../img/gray_bg.jpg', 
  name: 'bg'
});
bgs.position = {x: 320, y: 240};

bg.addNode(bgs);
bg.zindex = 1;

var cybertron = new PFPlay.Scene({name: 'cybertron'});

// pass in object to engine
var gw = document.getElementById('game');
var engine = new PFPlay.Engine({gameWindow: gw});

function loop(sceneManager)
{ 
  var debugTime = document.getElementById('time');
  debugTime.innerText = engine.masterTime;
}

function gameGo()
{
  var l = new PFPlay.BitmapLabel({font: font, text: 'hello'});
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