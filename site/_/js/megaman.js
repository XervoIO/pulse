var mm = mm || { };

var bodyLoaded = function() {
  mm.Box2DFactor = .01;

  var worldAABB = new b2AABB();
  worldAABB.lowerBound.Set(-10000.0, -10000.0);
  worldAABB.upperBound.Set(10000.0, 10000.0);
  var gravity = new b2Vec2(0.0, 7);
  var world = new b2World(worldAABB, gravity, true);

  var engine = new pulse.Engine( { gameWindow: 'gameWindow', width: 600, height: 400 });
  var scene = new pulse.Scene();

  var bg1 = new pulse.Layer({ width: 6000, height: 300 });
  bg1.anchor = { x: 0, y: 0 };
  bg1.position.y = 250;
  var bg2 = new pulse.Layer({ width: 6000, height: 600 });
  bg2.anchor = { x: 0, y: 0 };
  bg2.position.y = -200;
  var level = new mm.Level({ width: 6000, height: 800, world: world });
  level.anchor = { x: 0, y: 0 };
  level.position.y = -400;
  var manLayer = new pulse.Layer({ width: 6000, height: 800});
  manLayer.anchor = { x: 0, y: 0 };
  manLayer.position.y = -400;
  var uiLayer = new pulse.Layer({width : 600, height: 400});
  uiLayer.position = {x: 300, y: 200};

  var bg1Texture = new pulse.Texture( { filename: '_/img/mountain.png' });
  var bg2Texture = new pulse.Texture( { filename: '_/img/clouds.png' });

  for(var i = 0; i < 10; i++) {
    var bgTile = new pulse.Sprite( { src: bg1Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 700 * i - 1;
    
    bg1.addNode(bgTile);
    
    bgTile = new pulse.Sprite( { src: bg2Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 600 * i;
    
    bg2.addNode(bgTile);
  }

  // Create test man.
  var man = new mm.Megaman({
    b2world : world,
    position : {
      x : 75,
      y : 550
    }
  });
  manLayer.addNode(man);


  // Setup ui
  var font = new pulse.BitmapFont({filename:'_/img/eboots.fnt'});
  var l = new pulse.BitmapLabel({font: font, text: 'Built With Pulse'});
  l.position = {x: 5, y: 5};
  l.anchor = {x: 0, y: 0};
  uiLayer.addNode(l);

  scene.addLayer(bg2);
  scene.addLayer(bg1);
  scene.addLayer(level);
  scene.addLayer(manLayer);
  scene.addLayer(uiLayer);

  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);

  var arrowLeft = false;
  var arrowRight = false;
  var arrowUp = false;
  var arrowDown = false;

  var speed = .15;

  function updateCamera() {
    var nx = 300 - Math.max(man.position.x, 300);
    var dx = level.position.x - nx;
    var ny = 200 - Math.min(man.position.y, 600);
    var dy = level.position.y - ny;

    level.position.x -= dx;
    manLayer.position.x -= dx;
    bg1.position.x -= dx / 2;
    bg2.position.x -= dx / 3;

    level.position.y -= dy;
    manLayer.position.y -= dy;
    bg1.position.y -= dy / 2;
    bg2.position.y -= dy / 3;
  }

  function update(sceneManager, elapsed) {
    
    world.Step(elapsed / 1000, 10);
    
    if(arrowLeft) {
      if(man.direction == mm.Megaman.Direction.Right) {
        man.direction = mm.Megaman.Direction.Left;
      }
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Running;
      }
      man.b2body.WakeUp();
      man.b2body.SetLinearVelocity(new b2Vec2(-2, man.b2body.GetLinearVelocity().y));
    }
    
    if(arrowRight) {
      if(man.direction == mm.Megaman.Direction.Left) {
        man.direction = mm.Megaman.Direction.Right;
      }
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Running;
      }
      man.b2body.WakeUp();
      man.b2body.SetLinearVelocity(new b2Vec2(2, man.b2body.GetLinearVelocity().y));
    }

    updateCamera();

    if(man.position.y > 2000) {
      man.b2body.WakeUp();
      man.b2body.SetXForm(new b2Vec2(50 * mm.Box2DFactor, 600 * mm.Box2DFactor), 0);
      man.b2body.SetLinearVelocity(new b2Vec2(0, 0));
      man.state = mm.Megaman.State.Intro;
    }

    if(!arrowLeft && !arrowRight) {
      if(man.state == mm.Megaman.State.Running) {
        man.state = mm.Megaman.State.Idle;
      } 
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
    if(e.keyCode == 13) {
      man.state = mm.Megaman.State.Intro;
    }
    if(e.keyCode == 73) {
      man.state = mm.Megaman.State.Idle;
    }
    if(e.keyCode == 83) {
      man.state = mm.Megaman.State.Smile;
    }
    if(e.keyCode == 32) {
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Jumping;
        man.b2body.ApplyImpulse(new b2Vec2(0, -8), man.b2body.GetPosition());
      }
    }
  });

  scene.events.bind('keyup', function(e) {
    if(e.keyCode == 37) {
      man.b2body.SetLinearVelocity(new b2Vec2(0, man.b2body.GetLinearVelocity().y));
      arrowLeft = false;
    }
    if(e.keyCode == 39) {
      man.b2body.SetLinearVelocity(new b2Vec2(0, man.b2body.GetLinearVelocity().y));
      arrowRight = false;
    }
    if(e.keyCode == 38) {
      arrowUp = false;
    }
    if(e.keyCode == 40) {
      arrowDown = false;
    }
  });

  engine.go(20, update);
}
