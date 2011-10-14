var mario = new PFPlay.Sprite('img/mario.png', 'mario');
var luigi = new PFPlay.Sprite('img/luigi.png', 'luigi');
var cat = new PFPlay.Sprite('img/cat.jpg', 'cat');

var world = new PFPlay.Layer(640, 480, 0, 0);

var bg = document.createElement('canvas');
bg.width = 640;
bg.height = 480;
var bgcxt = bg.getContext('2d');
var bgimg = new Image();
bgimg.src = 'img/Forest_blue.jpg';
bgcxt.drawImage(bgimg, 0, 0);

var start = new Date().getTime();

var mAni = new PFPlay.Animation(
  "ma1", {x:125, y:125}, 4, 50
);

var scene = document.getElementById('sceneCan');
var sceneCxt = scene.getContext('2d');

window.addEventListener('click', windowClick, false);

function gameGo()
{
  mario.bind('click', function() { alert('clicked on mario!'); });
  mario.bind('click', function() { alert('clicked on mario, round 2!'); });
  
  world.addObject(mario);
  world.addObject(luigi);
  world.addObject(cat);
    
  world.getObject('mario').addAnimation(mAni);
  world.getObject('luigi').addAnimation(
    'la1', {x:125, y:125}, 4, 100,
    {'offset': {x:0, y:2}}
  );
  
  world.getObject('mario').getAnimation('ma1').start();
  world.getObject('luigi').getAnimation('la1').start();
  
  world.getObject('mario').move(0, 200);
  world.getObject('mario').zindex = 2;
  world.getObject('luigi').move(300, 0);
  
  PFPlay.tick = 50;
  setInterval("loop();", PFPlay.tick);
  //animate();
}

function loop()
{
  world.getObject('mario').move(10, 0);
  world.getObject('luigi').move(0, 10);
  world.getObject('cat').move(10, 0);
  
  if(world.getObject('mario').position.x > 640)
    world.getObject('mario').move(-630, 0);
    
  if(world.getObject('luigi').position.y > 480)
    world.getObject('luigi').move(0, -470);
  
  var catPos = world.getObject('cat').position.x;
  
  if(catPos > 640)
    world.getObject('cat').move(-630, 0);
    
  if((catPos > 100 && catPos < 200) || (catPos > 300 && catPos < 400))
    world.getObject('cat').visible = true;
  else
    world.getObject('cat').visible = false;
 
  world.update();
    
  //gWindow.appendChild(bg);
  sceneCxt.clearRect(0, 0, scene.width, scene.height);
  sceneCxt.drawImage(world.getCanvas(), 0, 0);
  
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
