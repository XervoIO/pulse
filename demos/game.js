var mario = new PFPlay.Sprite('img/mario.png', 'mario');
var luigi = new PFPlay.Sprite('img/luigi.png', 'luigi');
var cat = new PFPlay.Sprite('img/cat.jpg', 'cat');

var world = new PFPlay.Layer('myLayer', 0, 0, 640, 480);
world.zindex = 2;

var bg = new PFPlay.Layer('bg', 0, 0, 640, 480);
var bgs = new PFPlay.Sprite('img/Forest_blue.jpg', 'bg');
bg.addObject(bgs);
bg.zindex = 1;

var start = new Date().getTime();

var mAni = new PFPlay.Animation(
  "ma1", {x:125, y:125}, 4, 50
);

window.addEventListener('click', windowClick, false);

var cybertron =  new PFPlay.Scene('Cybertron');

function gameGo()
{
  mario.bind('click', function() { alert('clicked on mario!'); });
  mario.bind('click', function() { alert('clicked on mario, round 2!'); });
  mario.addAnimation(mAni);
  mario.getAnimation('ma1').start();
  mario.move(0, 200);
  mario.zindex = 2;
  
  luigi.addAnimation(
    'la1', {x:125, y:125}, 4, 100,
    {'offset': {x:0, y:2}}
  );
  luigi.getAnimation('la1').start();
  luigi.move(300, 0);
  
  world.addObject(mario);
  world.addObject(luigi);
  world.addObject(cat);
  
  cybertron.addLayer(world);
  cybertron.addLayer(bg);
  
  document.getElementById('gameWindow').appendChild(cybertron.getScene());
  
  PFPlay.tick = 50;
  setInterval("loop();", PFPlay.tick);
}

function loop()
{
  var wLayer = cybertron.getLayer('myLayer');
  
  wLayer.getObject('mario').move(10, 0);
  wLayer.getObject('luigi').move(0, 10);
  wLayer.getObject('cat').move(10, 0);
  
  if(wLayer.getObject('mario').position.x > 640)
    wLayer.getObject('mario').move(-630, 0);
    
  if(wLayer.getObject('luigi').position.y > 480)
    wLayer.getObject('luigi').move(0, -470);
  
  var catPos = wLayer.getObject('cat').position.x;
  
  if(catPos > 640)
    wLayer.getObject('cat').move(-630, 0);
    
  if((catPos > 100 && catPos < 200) || (catPos > 300 && catPos < 400))
    wLayer.getObject('cat').visible = true;
  else
    wLayer.getObject('cat').visible = false;
 
  cybertron.update();
  
  PFPlay.masterTime = new Date().getTime() - start;
  
  var debugTime = document.getElementById('time');
  debugTime.innerText = PFPlay.masterTime;
}

function windowClick(evt)
{
  var offX = scene.offsetLeft;
  var offY = scene.offsetTop;
  
  if(scene.offsetParent)
  {
    var parent = scene.offsetParent;
    do {
        offX += parent.offsetLeft;
        offY += parent.offsetTop;
    } while (parent = parent.offsetParent);
  }
  
  var x = evt.clientX - offX;
  var y = evt.clientY - offY;
  
  if(x >= 0 && x < scene.width && y >= 0 && y < scene.height)
    world.raiseEvent('click', {x: x, y: y});
  else
    alert('im over here!');
}
