var mario = new PFPlay.Sprite('img/mario.png', 'mario');
var luigi = new PFPlay.Sprite('img/luigi.png', 'luigi');

var world = new PFPlay.Layer(640, 480, 0, 0);

var bg = document.createElement('canvas');
bg.width = 640;
bg.height = 480;
var bgcxt = bg.getContext('2d');
var bgimg = new Image();
bgimg.src = 'img/Forest_blue.jpg';
bgcxt.drawImage(bgimg, 0, 0);

var time = 0;

var mAni = new PFPlay.Animation(
  "ma1", new Point(125, 125), 4, 50
);

function gameGo()
{     
  world.addObject(mario);
  world.addObject(luigi);
    
  world.getSprite('mario').addAnimation(mAni);
  world.getSprite('luigi').addAnimation({
    'name': 'la1',
    'size': new Point(125, 125),
    'frames': 4,
    'frameRate': 100,
    'offset': new Point(0, 2)
  });
  
  world.getSprite('mario').getAnimation('ma1').start();
  world.getSprite('luigi').getAnimation('la1').start();
  
  world.getSprite('mario').move(0, 200);
  world.getSprite('mario').zindex = 2;
  world.getSprite('luigi').move(300, 0);
  
  
  PFPlay.tick = 50;
  setInterval("loop();", PFPlay.tick);
  //animate();
}

function loop()
{
  world.getSprite('mario').move(10, 0);
  world.getSprite('luigi').move(0, 10);
  
  if(world.getSprite('mario').posPrevious.x > 640)
    world.getSprite('mario').move(-630, 0);
    
  if(world.getSprite('luigi').posPrevious.y > 480)
    world.getSprite('luigi').move(0, -470);
 
  world.update();
  
  var gWindow = document.getElementById('gameWindow');
  
  while (gWindow.hasChildNodes()) {
    gWindow.removeChild(gWindow.lastChild);
  }
  
  gWindow.appendChild(bg);
  gWindow.appendChild(world.getCanvas());
  
  time = time + PFPlay.tick;
  
  var debugTime = document.getElementById('time');
  debugTime.innerText = time;
}