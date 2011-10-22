var mario = new PFPlay.Sprite('img/mario.png', 'mario');
var luigi = new PFPlay.Sprite('img/luigi.png', 'luigi');
var cat = new PFPlay.Sprite('img/cat.jpg', 'cat');

var world = new PFPlay.Layer('myLayer');
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

var bg = new PFPlay.Layer('bg');
var bgs = new PFPlay.Sprite('img/Forest_blue.jpg', 'bg');
bg.addObject(bgs);
bg.zindex = 1;

var mAni = new PFPlay.Animation(
  "ma1", {x:125, y:125}, 4, 50
);

var cybertron =  new PFPlay.Scene('Cybertron');

var myEngine = new PFPlay.Engine('gameWindow');

function loop(sceneManager)
{
  var wLayer = sceneManager.getScene('Cybertron').getLayer('myLayer');
  
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
  
  var debugTime = document.getElementById('time');
  debugTime.innerText = PFPlay.masterTime;
}

function gameGo()
{
  mario.events.bind('click', function() { alert('clicked on mario!'); });
  mario.addAnimation(mAni);
  mario.getAnimation('ma1').start();
  mario.move(0, 200);
  mario.zindex = 2;
  
  luigi.events.bind('click', function() { alert('clicked on luigi!'); });
  luigi.addAnimation(
    'la1', {x:125, y:125}, 4, 100,
    {'offset': {x:0, y:2}}
  );
  luigi.getAnimation('la1').start();
  luigi.move(300, 0);
  
  cat.events.bind('click', function() { alert('clicked on cat!'); });
  
  world.addObject(mario);
  world.addObject(luigi);
  world.addObject(cat);
  
  cybertron.addLayer(world);
  cybertron.addLayer(bg);
  
  myEngine.scenes.add(cybertron);
  myEngine.scenes.activate('Cybertron');
  
  myEngine.go(50, loop);
}
