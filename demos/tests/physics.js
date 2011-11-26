pulse.ready(function() {

	var engine = new pulse.Engine();
	var scene = new pulse.Scene();
	var layer = new pulse.physics.Layer();

  layer.events.bind('click', function(e) {
    // Create sprite.
    var sprite = new pulse.physics.Sprite( { src: '../img/physics_circle.png ', shape: 'circle'});
      sprite.position = e.position;
      layer.addNode(sprite);
  });

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
	engine.go(30);
});