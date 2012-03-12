pulse.ready(function() {
  var engine = new pulse.Engine({ 
    gameWindow: 'gameWindow', 
    size: {width: 760, height: 480}
  });
  
  var scene = new pulse.Scene(); 
  var layer = new pulse.Layer();
  
  var score = new Score( { text: "0 | 0" } );
  score.position.x = 300;
  score.position.y = 200;
  
  var ball = new Ball({ src: 'ball.png', size: {width: 16, height: 16}});
  ball.position.x = 300;
  ball.position.y = 200;
  ball.velocity.x = .25;
  ball.velocity.y = .25;
  ball.score = score;
  layer.addNode(ball);
  
  var paddle = new Paddle({ src: 'paddle.png' });
  paddle.ball = ball;
  paddle.position.x = 20;
  paddle.position.y = 150;
  
  var aiPaddle = new Paddle({ src: 'paddle.png' });
  aiPaddle.ball = ball;
  aiPaddle.position.x = 730;
  aiPaddle.position.y = 150;
  aiPaddle.auto = true;
  
  layer.addNode(paddle);
  layer.addNode(aiPaddle);
  layer.addNode(score);
  
  layer.anchor.x = 0;
  layer.anchor.y = 0;
  
  scene.addLayer(layer);
  
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);
  
  function loop(sceneManager)
  { 
    var debugTime = document.getElementById('time');
    debugTime.innerText = debugTime.textContent = engine.masterTime;
  }
  
  engine.go(20, loop);
});
