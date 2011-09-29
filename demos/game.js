var megaman = new PFPlay.Sprite('img/mario.png', {
  frameWidth: 115,
  frameHeight: 130,
  frameOffsetX: 1,
  frameOffsetY: 2
});

var bg = new PFPlay.Image('img/Forest_blue.jpg');

var frame = 0;

function gameGo()
{     
  var w = document.getElementById('gameWindow');
  var cxt = w.getContext('2d');
  cxt.drawImage(bg.slice(), 0, 0);
  
  megaman.move(0, 350);
  setInterval("animate();", 100);
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
  
  frame = frame + 1;
}