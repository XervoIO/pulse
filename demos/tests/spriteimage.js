var tileImg = new PFPlay.Image({src:'../Isometric/tile.png'});

var world = new PFPlay.Layer({name: 'myLayer'});
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

var bg = new PFPlay.Layer({name: 'bg'});
var bgs = new PFPlay.Sprite(
  {
    src: '../img/Forest_blue.jpg', 
    name: 'bg'
});

bg.addObject(bgs);
bg.zindex = 1;

var cybertron = new PFPlay.Scene({name: 'Cybertron'});

var myEngine = new PFPlay.Engine();

var testSprites = [];

function loop(sceneManager)
{ 
  var debugTime = document.getElementById('time');
  debugTime.innerText = PFPlay.masterTime;
}

function gameGo()
{
  var s;
  for(var i = 0; i < 550; i++) {
    s = new PFPlay.Sprite({src: tileImg});
    s.move(Math.floor(Math.random() * 610), Math.floor(Math.random() * 450));
    s.zindex = i;
    world.addObject(s);
  }
  
  cybertron.addLayer(world);
  cybertron.addLayer(bg);
  
  myEngine.scenes.add(cybertron);
  myEngine.scenes.activate(cybertron);
  
  myEngine.go(50, loop);
}