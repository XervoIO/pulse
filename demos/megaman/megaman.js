// Namespace declaration
var mm = mm || { };

/**
 * Pulse ready callback, makes sure the HTML content is loaded before starting
 * the game.
 */
pulse.ready(function() {
  // Ratio of Box2D physics to pulse
  mm.Box2DFactor = 0.01;

  /**
   * Create Box2D bounding box to learn more about Box2D Javascript
   * check out https://github.com/thinkpixellab/pl
   */
  var worldAABB = new b2AABB();
  worldAABB.lowerBound.Set(-10000.0, -10000.0);
  worldAABB.upperBound.Set(10000.0, 10000.0);

  // Setup gravity vector and world for Box2D
  var gravity = new b2Vec2(0.0, 7);
  var world = new b2World(worldAABB, gravity, true);

  // The base engine object for this demo with passed in id of game div
  var engine = new pulse.Engine({ 
    gameWindow: 'gameWindow', size: {width: 600, height: 400}});

  // The main scene for the demo
  var scene = new pulse.Scene();

  // Parallax background layers
  var bg1 = new pulse.Layer({size: { width: 6000, height: 300 }});
  bg1.anchor = { x: 0, y: 0 };
  bg1.position.y = 250;

  var bg2 = new pulse.Layer({size: { width: 6000, height: 600 }});
  bg2.anchor = { x: 0, y: 0 };
  bg2.position.y = -200;

  // Level layer object extends from layer see layer.js
  var level = new mm.Level({size: {width: 6000, height: 800}, world: world });
  level.anchor = { x: 0, y: 0 };
  level.position.y = -400;

  /**
   * The mm layer, he's on a seperate layer so we don't redraw everything
   * when he moves
   */
  var manLayer = new pulse.Layer({size: {width: 6000, height: 800}});
  manLayer.anchor = { x: 0, y: 0 };
  manLayer.position.y = -400;

  // Layer for the UI, text
  var uiLayer = new pulse.Layer({size: {width : 600, height: 400}});
  uiLayer.position = {x: 300, y: 200};

  // Texture for the mountain and for the clouds
  var bg1Texture = new pulse.Texture( { filename: 'mountain.png' });
  var bg2Texture = new pulse.Texture( { filename: 'clouds.png' });

  // Add 10 sprites to the background for multiple mountains and clouds
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

  // The man, along with initalized position
  var man = new mm.Megaman({
    b2world : world,
    position : {
      x : 75,
      y : 550
    }
  });
  manLayer.addNode(man);


  // Setup UI
  //var font = new pulse.BitmapFont({filename:'eboots.fnt'});
  //var l = new pulse.BitmapLabel({font: font, text: 'Built With Pulse'});
  //l.position = {x: 5, y: 5};
  //l.anchor = {x: 0, y: 0};
  //uiLayer.addNode(l);

  // Add the layers to our scene
  scene.addLayer(bg2);
  scene.addLayer(bg1);
  scene.addLayer(level);
  scene.addLayer(manLayer);
  scene.addLayer(uiLayer);

  // Add the scene to the engine scene manager and activate it
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);

  var arrowLeft = false;
  var arrowRight = false;
  var arrowUp = false;
  var arrowDown = false;

  var speed = 0.15;

  /**
   * Updates the camera and parallax backgrounds based on position of man
   */
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

  /**
   * Update callback from engine on each update loop
   * @param  {pulse.SceneManager} sceneManager scene manager for the engine
   * @param  {Number} elapsed the time since last update loop
   */
  function update(sceneManager, elapsed) {
    
    // update the Box2D physics world
    world.Step(elapsed / 1000, 10);
    
    /**
     * If the left arrow is down update the state of the man if needed
     */
    if(arrowLeft) {
      if(man.direction == mm.Megaman.Direction.Right) {
        man.direction = mm.Megaman.Direction.Left;
      }
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Running;
      }
      // Box2d wake up call
      man.b2body.WakeUp();
      // Gives the man a linear velocity in the direction on the move
      man.b2body.SetLinearVelocity(new b2Vec2(-2, man.b2body.GetLinearVelocity().y));
    }
    
    /**
     * If the right arrow is down update the state of the man if needed
     */
    if(arrowRight) {
      if(man.direction == mm.Megaman.Direction.Left) {
        man.direction = mm.Megaman.Direction.Right;
      }
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Running;
      }
      // Box2d wake up call
      man.b2body.WakeUp();
      // Gives the man a linear velocity in the direction on the move
      man.b2body.SetLinearVelocity(new b2Vec2(2, man.b2body.GetLinearVelocity().y));
    }

    // Update the camera based on the position of the man
    updateCamera();

    // If the man has fallen to his dealth reset set him
    if(man.position.y > 2000) {
      // Box2d wake up call
      man.b2body.WakeUp();
      // Set position and remove any linear velocity
      man.b2body.SetXForm(new b2Vec2(50 * mm.Box2DFactor, 600 * mm.Box2DFactor), 0);
      man.b2body.SetLinearVelocity(new b2Vec2(0, 0));
      // Set the man's state to beam him in
      man.state = mm.Megaman.State.Intro;
    }

    // If no arrow button is pressed than set the man to Idle
    if(!arrowLeft && !arrowRight) {
      if(man.state == mm.Megaman.State.Running) {
        man.state = mm.Megaman.State.Idle;
      }
    }
  }

  /**
   * Binds the key down event on this scene
   * We keep the state of the button in side the handler
   */
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
    // Special cases
    if(e.keyCode == 13) {
      man.state = mm.Megaman.State.Intro;
    }
    if(e.keyCode == 73) {
      man.state = mm.Megaman.State.Idle;
    }
    if(e.keyCode == 83) {
      man.state = mm.Megaman.State.Smile;
    }
    // Jump with space key
    if(e.keyCode == 32) {
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Jumping;
        // Apply an impulse in Box2D
        man.b2body.ApplyImpulse(new b2Vec2(0, -8), man.b2body.GetPosition());
      }
    }
  });

  /**
   * Update the state of the keys
   */
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

  // Start the game engine and tell it run at 50fps if possible
  engine.go(20, update);
});