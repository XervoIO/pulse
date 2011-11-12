var mm = mm || { };

PFPlay.ready(function(){
  
  var engine = new PFPlay.Engine( { gameWindow: 'gameWindow', width: 600, height: 400 });
  var scene = new PFPlay.Scene();
  
  var bg1 = new PFPlay.Layer({ width: 6000, height: 300 });
  bg1.anchor = { x: 0, y: 0 };
  bg1.position.y = 250;
  var bg2 = new PFPlay.Layer({ width: 6000, height: 600 });
  bg2.anchor = { x: 0, y: 0 };
  bg2.position.y = -200;
  var level = new mm.Level({ width: 6000, height: 800 });
  level.anchor = { x: 0, y: 0 };
  level.position.y = -400;
  
  var bg1Texture = new PFPlay.Image( { src: 'mountain.png' });
  var bg2Texture = new PFPlay.Image( { src: 'clouds.png' });
  
  for(var i = 0; i < 10; i++) {
    var bgTile = new PFPlay.Sprite( { src: bg1Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 700 * i - 1;
    
    bg1.addNode(bgTile);
    
    bgTile = new PFPlay.Sprite( { src: bg2Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 600 * i;
    
    bg2.addNode(bgTile);
  }
  
  scene.addLayer(bg2);
  scene.addLayer(bg1);
  scene.addLayer(level);
  
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);
  
  var arrowLeft = false;
  var arrowRight = false;
  var arrowUp = false;
  var arrowDown = false;
  
  var speed = .15;
  
  function update(sceneManager, elapsed) {
    if(arrowLeft) {
      level.position.x += speed * elapsed;
      bg1.position.x += (speed / 2) * elapsed;
      bg2.position.x += (speed / 3) * elapsed;
    }
    
    if(arrowRight) {
      level.position.x -= speed * elapsed;
      bg1.position.x -= (speed / 2) * elapsed;
      bg2.position.x -= (speed / 3) * elapsed;
    }
    if(arrowUp) {
      level.position.y += speed * elapsed;
      bg1.position.y += (speed / 2) * elapsed;
      bg2.position.y += (speed / 3) * elapsed;
    }
    if(arrowDown) {
      level.position.y -= speed * elapsed;
      bg1.position.y -= (speed / 2) * elapsed;
      bg2.position.y -= (speed / 3) * elapsed;
    }
  }
  
  scene.events.bind('keydown', function(e) {
    if(e.keyCode == 37) {
      arrowLeft = true;
    }
    if(e.keyCode == 39) {
      arrowRight = true;
    }
    if(e.keyCode == 38) {
      arrowUp = true;
    }
    if(e.keyCode == 40) {
      arrowDown = true;
    }
  });
  
  scene.events.bind('keyup', function(e) {
    if(e.keyCode == 37) {
      arrowLeft = false;
    }
    if(e.keyCode == 39) {
      arrowRight = false;
    }
    if(e.keyCode == 38) {
      arrowUp = false;
    }
    if(e.keyCode == 40) {
      arrowDown = false;
    }
  });
  
  engine.go(30, update);
});
