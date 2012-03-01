pulse.ready(function(){

  mm.Box2DFactor = 0.01;

  // setup box2d stuff
  var worldAABB = new b2AABB();
  worldAABB.lowerBound.Set(-10000.0, -10000.0);
  worldAABB.upperBound.Set(10000.0, 10000.0);
  var gravity = new b2Vec2(0.0, 7);
  var world = new b2World(worldAABB, gravity, true);

  var groundBodyDef = new b2BodyDef();
  groundBodyDef.position.Set(3, 4);
  var groundBody = world.CreateBody(groundBodyDef);
  var groundShapeDef = new b2PolygonDef();
  groundShapeDef.restitution = 0.0;
  groundShapeDef.friction = 0.5;
  groundShapeDef.density = 1.0;
  groundBody.w = 6;
  groundBody.h = 1;
  groundShapeDef.SetAsBox(groundBody.w, groundBody.h);
  groundBody.CreateShape(groundShapeDef);
  groundBody.SynchronizeShapes();
  
  var engine = new pulse.Engine({gameWindow: 'gameWindow', width: 600, height: 400 });
  var scene = new pulse.Scene();
  
  var manlayer = new pulse.Layer({size: {width: 600, height: 400}});
  manlayer.anchor = { x: 0, y: 0 };

  scene.addLayer(manlayer);
  
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);

  var man = new mm.Megaman({
    b2world : world,
    position : {
      x : 300,
      y : 100
    }
  });
  manlayer.addNode(man);
  
  var arrowLeft = false;
  var arrowRight = false;
  
  var speed = 0.15;
  
  function update(sceneManager, elapsed) {
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
    else if(arrowLeft) {
      if(man.direction == mm.Megaman.Direction.Right) {
        man.direction = mm.Megaman.Direction.Left;
      }
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Running;
      }
      man.b2body.WakeUp();
      man.b2body.SetLinearVelocity(new b2Vec2(-2, man.b2body.GetLinearVelocity().y));
    } else {
      if(man.state == mm.Megaman.State.Running) {
        man.state = mm.Megaman.State.Idle;
      }
    }

    // physics stuff
    world.Step(elapsed / 1000, 10);
  }
  
  scene.events.bind('keydown', function(e) {
    if(e.keyCode == 37) {
      arrowLeft = true;
    }
    else if(e.keyCode == 39) {
      arrowRight = true;
    }
    else if(e.keyCode == 13) {
      man.state = mm.Megaman.State.Intro;
    }else if(e.keyCode == 73) {
      man.state = mm.Megaman.State.Idle;
    }
    else if(e.keyCode == 83) {
      man.state = mm.Megaman.State.Smile;
    }

    if(e.keyCode == 32) {
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Jumping;
        man.b2body.ApplyImpulse(new b2Vec2(0, -1), man.b2body.GetPosition());
      }
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
