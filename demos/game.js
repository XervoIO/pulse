var megaman = new PFPlay.Sprite('img/mario.png', {
  frameWidth: 115,
  frameHeight: 130,
  frameOffsetX: 1,
  frameOffsetY: 2
});

var bg = new PFPlay.Image('img/Forest_blue.jpg');

var frame = 0;
var time = 0;

var test = new PFPlay.Animation(
  "test", 
  new Point(10, 10),
  new Point(30, 30),
  [5,3,1,4,9,4,6],
  200 
);

function gameGo()
{     
  var w = document.getElementById('gameWindow');
  var cxt = w.getContext('2d');
  cxt.drawImage(bg.slice(), 0, 0);
  
  megaman.move(0, 350);
  
  PFPlay.tick = 50;
  setInterval("animate();", PFPlay.tick);
  //animate();
}

function animate()
{
  if(frame > 2)
   frame = 0;
  
  if(megaman.posCurrent.x + 3 > bg.width())
    megaman.move(-bg.width(), 0);
  else
    megaman.move(3, 0);
  
  megaman.setFrame(frame, 0);
  
  var oldBGSlice = bg.slice(
    megaman.posPrevious.x, megaman.posPrevious.y,
    megaman.frameWidth(), megaman.frameHeight()
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
  
  test.update();
  
  if(test.updated == true)
  {
    var testFrame = test.getFrame();
    var debugFrame = document.getElementById('frame');
    debugFrame.innerText = 
      testFrame.fx + "|" + testFrame.fy + "|" +
      testFrame.width + "|" + testFrame.height;
  }
  
  frame = frame + 1;
}