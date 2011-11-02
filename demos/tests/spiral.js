var stars = [];
stars.push(new PFPlay.Image({src:'../img/star_1.png'}));
stars.push(new PFPlay.Image({src:'../img/star_2.png'}));
stars.push(new PFPlay.Image({src:'../img/star_3.png'}));
stars.push(new PFPlay.Image({src:'../img/star_4.png'}));
stars.push(new PFPlay.Image({src:'../img/star_5.png'}));

var world = new PFPlay.Layer({name: 'layer'});
world.zindex = 2;

var bg = new PFPlay.Layer({name: 'bg'});
var bgs = new PFPlay.Sprite({
  src: '../img/gray_bg.jpg', 
  name: 'bg'
});

bg.addObject(bgs);
bg.zindex = 1;

var cybertron = new PFPlay.Scene({name: 'cybertron'});

var engine = new PFPlay.Engine();

var sprites = [];

function loop(sceneManager)
{ 
  var debugTime = document.getElementById('time');
  debugTime.innerText = engine.masterTime;

  for(var i = 0; i < sprites.length; i++)
  {
    sprites[i].rotation += 0.5;
  }
}

function gameGo()
{
  var s;
  var p;
  var y = 0;
  var ye = 230;
  var max = 92;
  for(var i = 0; i < max; i++) 
  {
    p = stars[Math.floor(Math.random() * 5)];
    s = new PFPlay.Sprite({src: p});
    y = i / max * ye / p.height() + 1.0;
    s.rotation = i * 18;
    s.anchor = {x: Math.random(), y: y};
    s.position = {x: 320, y: 240};
    sprites.push(s);
    world.addObject(s);
  }

  cybertron.addLayer(world);
  cybertron.addLayer(bg);
  
  engine.scenes.add(cybertron);
  engine.scenes.activate(cybertron);
  
  engine.go(16.67, loop);
}