PFPlay.ready(function(){
  
  var engine = new PFPlay.Engine( { gameWindow: 'gameWindow', width: 600, height: 400 });
  var scene = new PFPlay.Scene();
  
  var bg1 = new PFPlay.Layer( { width: 6000, height: 400 });
  bg1.anchor = { x: 0, y: 0 };
  var bg2 = new PFPlay.Layer({ width: 6000, height: 400 });
  bg2.anchor = { x: 0, y: 0 };
  
  var bg1Texture = new PFPlay.Image( { src: 'bg1.png' });
  var bg2Texture = new PFPlay.Image( { src: 'bg2.png' });
  
  for(var i = 0; i < 10; i++) {
    var bgTile = new PFPlay.Sprite( { src: bg1Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 600 * i;
    
    bg1.addNode(bgTile);
    
    bgTile = new PFPlay.Sprite( { src: bg2Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 600 * i;
    
    bg2.addNode(bgTile);
  }
  
  scene.addLayer(bg2);
  scene.addLayer(bg1);
  
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);
  
  var arrowLeft = false;
  var arrowRight = false;
  
  var speed = .15;
  
  function update(sceneManager, elapsed) {
    if(arrowRight) {
      bg1.position.x += speed * elapsed;
      bg2.position.x += (speed / 2) * elapsed;
    }
    else if(arrowLeft) {
      bg1.position.x -= speed * elapsed;
      bg2.position.x -= (speed / 2) * elapsed;
    }
  }
  
  scene.events.bind('keydown', function(e) {
    if(e.keyCode == 37) {
      arrowLeft = true;
    }
    else if(e.keyCode == 39) {
      arrowRight = true;
    }
  });
  
  scene.events.bind('keyup', function(e) {
    if(e.keyCode == 37) {
      arrowLeft = false;
    }
    else if(e.keyCode == 39) {
      arrowRight = false;
    }
  });
  
  engine.go(30, update);
});
