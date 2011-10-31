var seconds = new PFPlay.Image({src:'../img/hex_rounded.png'});
var minutes = new PFPlay.Image({src:'../img/diamond.png'});
var hours = new PFPlay.Image({src:'../img/triangle_rounded.png'});

var world = new PFPlay.Layer({name: 'layer'});
world.zindex = 2;
world.events.bind('mousemove', 
  function(evt) 
  { 
    var debugPos = document.getElementById('mousep');
    debugPos.innerText = evt.x + ', ' + evt.y;
});

world.events.bind('keydown', function(evt) {
  var debugKey = document.getElementById('kdown');
  debugKey.innerText = evt.key + '[' + evt.keyCode + ']';
});

var bg = new PFPlay.Layer({name: 'bg'});
var bgs = new PFPlay.Sprite({
  src: '../img/yellow_bg.jpg', 
  name: 'bg'
});

bg.addObject(bgs);
bg.zindex = 1;

var cybertron = new PFPlay.Scene({name: 'cybertron'});

var engine = new PFPlay.Engine();

var s = new PFPlay.Sprite({src: seconds});
s.move(320 - 75, 240 - 75);
world.addObject(s);

var m = new PFPlay.Sprite({src: minutes});
m.move(320 - 31, 85);
world.addObject(m);

var h = new PFPlay.Sprite({src: hours});
h.move(320 - 22, 45);
world.addObject(h);

function loop(sceneManager)
{ 
  var debugTime = document.getElementById('time');
  debugTime.innerText = engine.masterTime;
}

function gameGo()
{
  cybertron.addLayer(world);
  cybertron.addLayer(bg);
  
  engine.scenes.add(cybertron);
  engine.scenes.activate(cybertron);
  
  engine.go(50, loop);
}