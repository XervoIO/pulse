var megaman = new PFPlay.Sprite('img/mario.png', 'mario');

var bg = new PFPlay.Image('img/Forest_blue.jpg');

var time = 0;

var test = new PFPlay.Animation(
  "test", 
  new Point(125, 125),
  4,
  400
);

function gameGo()
{     
  var w = document.getElementById('gameWindow');
  var cxt = w.getContext('2d');
  cxt.drawImage(bg.slice(), 0, 0);
  
  megaman.addAnimation(test);
  megaman.addAnimation({
    'name': 'a1',
    'size': new Point(125, 125),
    'frames': 4,
    'frameRate': 500,
    'offset': new Point(0, 2)
  });
  
  megaman.setAnimation('a1');
  megaman.getAnimation('a1').start();
  
  megaman.move(0, 350);
  
  PFPlay.tick = 50;
  setInterval("animate();", PFPlay.tick);
  //animate();
}

function animate()
{
  megaman.update();
    
  // if(megaman.posCurrent.x + 3 > bg.width())
    // megaman.move(-bg.width(), 0);
  // else
    // megaman.move(3, 0);
  
  var prevFrame = megaman.getPreviousFrame();
  
  var oldBGSlice = bg.slice(
    megaman.posPrevious.x, megaman.posPrevious.y,
    prevFrame.width, prevFrame.height
  );
        
  var mCurrent = megaman.getCurrentFrame();
  
  var w = document.getElementById('gameWindow');
  var cxt = w.getContext('2d');
  
  cxt.drawImage(oldBGSlice,
    megaman.posPrevious.x, megaman.posPrevious.y
  );
  
  cxt.drawImage(mCurrent,
    megaman.posCurrent.x, megaman.posCurrent.y
  );
  
  time = time + PFPlay.tick;
  
  var debugTime = document.getElementById('time');
  debugTime.innerText = time;
}