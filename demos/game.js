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

function gameGo()
{
  world.addObject(mario);
  world.addObject(luigi);
  world.addObject(cat);
    
  world.getSprite('mario').addAnimation(mAni);
  world.getSprite('luigi').addAnimation(
    'la1', {x:125, y:125}, 4, 100,
    {'offset': {x:0, y:2}}
  );
  
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
  world.getSprite('cat').move(10, 0);
  
  if(world.getSprite('mario').position.x > 640)
    world.getSprite('mario').move(-630, 0);
    
  if(world.getSprite('luigi').position.y > 480)
    world.getSprite('luigi').move(0, -470);
  
  var catPos = world.getSprite('cat').position.x;
  
  if(catPos > 640)
    world.getSprite('cat').move(-630, 0);
    
  if((catPos > 100 && catPos < 200) || (catPos > 300 && catPos < 400))
    world.getSprite('cat').visible = true;
  else
    world.getSprite('cat').visible = false;
 
  world.update();
  
  var gWindow = document.getElementById('gameWindow');
  
  while (gWindow.hasChildNodes()) {
    gWindow.removeChild(gWindow.lastChild);
  }
  
  gWindow.appendChild(bg);
  gWindow.appendChild(world.getCanvas());
  
  PFPlay.masterTime = new Date().getTime() - start;
  
  var debugTime = document.getElementById('time');
  debugTime.innerText = PFPlay.masterTime;
}