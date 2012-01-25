pulse.ready(function() {

	var engine = new pulse.Engine();
	var scene = new pulse.Scene();
	var layer = new pulse.physics.Layer();

  var running = true;
  layer.events.bind('click', function(e) {
    running = !running;
  });

  var addSprite = function() {
    // Create sprite.
    var sprite = null;

    if(/*count++ % 2 == 0*/true) {
      sprite = new pulse.physics.Sprite( { src: '../img/physics_circle.png ', shape: 'circle'});
    }
    else {
      sprite = new pulse.physics.Sprite( { src: '../img/physics_square.png' });
    }

    sprite.size = { width: 12, height: 12 };
    sprite.position = { x: Math.random() * 100 + 150, y: 100 };
    layer.addNode(sprite);
  };

  var ground = new pulse.physics.Sprite( { src: '../img/physics_ground.png ', isStatic: true });
  ground.position = { x: 280, y: 300 };

  var wallA = new pulse.physics.Sprite( { src: '../img/physics_wall.png ', isStatic: true });
  wallA.position = { x: 30, y: 300 };

  var wallB = new pulse.physics.Sprite( { src: '../img/physics_wall.png ', isStatic: true });
  wallB.position = { x: 530, y: 300 };

	layer.anchor = {x:0, y:0};

  layer.addNode(ground);
  layer.addNode(wallA);
  layer.addNode(wallB);

	scene.addLayer(layer);
	engine.scenes.addScene(scene);
	engine.scenes.activateScene(scene);

  var total = 0;
  var update = function(sceneManager, elapsed) {
    if(!running) {
      return;
    }

    total += elapsed;

    if(total > 100) {
      addSprite();
      total = 0;
    }
  };

	engine.go(30, update);
});