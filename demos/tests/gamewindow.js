var texture = new PFPlay.Image({src:'../img/green_square.png'});

var world = new PFPlay.Layer({name: 'layer'});
world.zindex = 2;

var bg = new PFPlay.Layer({name: 'bg'});
var bgs = new PFPlay.Sprite({
  src: '../img/gray_bg.jpg', 
  name: 'bg'
});
bgs.position = {x: 320, y: 240};

bg.addObject(bgs);
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
  var s = new PFPlay.Sprite({src: texture});
  s.position = {x: 320, y: 240};
  world.addObject(s);

  cybertron.addLayer(world);
  cybertron.addLayer(bg);
  
  engine.scenes.add(cybertron);
  engine.scenes.activate(cybertron);
  
  engine.go(16.67, loop);
}