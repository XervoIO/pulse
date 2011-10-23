var myEngine = new PFPlay.Engine();
var cybertron = new PFPlay.Scene({name: 'Cybertron'});

var world = new PFPlay.Layer({name: 'layer'});
world.zindex = 2;
world.events.bind('mousemove', function(evt) { 
  var debugPos = document.getElementById('mousep');
  debugPos.innerText = evt.x + ', ' + evt.y;
});

world.events.bind('keydown', function(evt) {
  var debugKey = document.getElementById('kdown');
  debugKey.innerText = evt.key + '[' + evt.keyCode + ']';
});

var dragBox = new PFPlay.Sprite({src: '../img/blue_square.png'});
var dropArea = new PFPlay.Sprite({src: '../img/grid.png'});
var dragAccept = new PFPlay.Sprite({src: '../img/green_square.png'});
var dragRevoke = new PFPlay.Sprite({src: '../img/red_square.png'});

function loop(sceneManager)
{ 
  var debugTime = document.getElementById('time');
  debugTime.innerText = PFPlay.masterTime;
}

function gameGo()
{
  dragBox.position = {x: 10, y: 300};
  dropArea.position = {x: 200, y: 50};
  dragAccept.visible = false;
  dragRevoke.visible = false;

  world.addObject(dragBox);
  world.addObject(dropArea);
  world.addObject(dragAccept);
  world.addObject(dragRevoke);
  
  cybertron.addLayer(world);
  
  myEngine.scenes.add(cybertron);
  myEngine.scenes.activate(cybertron);
  
  myEngine.go(50, loop);
}