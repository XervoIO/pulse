PFPlay.ready(function(){
  
  var engine = new PFPlay.Engine({gameWindow: 'gameWindow', width: 600, height: 400 });
  var scene = new PFPlay.Scene();
  
  var manlayer = new PFPlay.Layer({width: 600, height: 400});
  manlayer.anchor = { x: 0, y: 0 };

  scene.addLayer(manlayer);
  
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);

  var man = new mm.Megaman();
  man.position = {x: 300, y : 200};
  manlayer.addNode(man);
  
  var arrowLeft = false;
  var arrowRight = false;
  
  var speed = .15;
  
  function update(sceneManager, elapsed) {
    if(arrowRight) {
      if(man.direction == mm.Megaman.Direction.Left) {
        man.direction = mm.Megaman.Direction.Right;
      }
      man.state = mm.Megaman.State.Running;
    }
    else if(arrowLeft) {
      if(man.direction == mm.Megaman.Direction.Right) {
        man.direction = mm.Megaman.Direction.Left;
      }
      man.state = mm.Megaman.State.Running;
    } else {
      if(man.state == mm.Megaman.State.Running) {
        man.state = mm.Megaman.State.Idle;
      }
      
    }
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
    }
    else if(e.keyCode == 32) {
      man.state = mm.Megaman.State.Jumping;
    }
    else if(e.keyCode == 73) {
      man.state = mm.Megaman.State.Idle;
    }
    else if(e.keyCode == 83) {
      man.state = mm.Megaman.State.Smile;
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
