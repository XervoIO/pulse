pulse.ready(function(){
  var mario = new pulse.Sprite({
    src: 'img/mario.png', 
    name : 'mario',
    size : {
      width : 125,
      height : 125
    }
  });
  mario.scale = {x : 1.5, y : 0.75};
  mario.rotation = 45;
  
  var luigi = new pulse.Sprite({
    src: 'img/luigi.png', 
    name: 'luigi',
    size : {
      width : 125,
      height : 125
    }
  });
  
  var cat = new pulse.Sprite({
    src: 'img/cat.jpg', 
    name: 'cat'
  });
  
  var world = new pulse.Layer({name: 'myLayer', x : 320, y : 240});
  world.zindex = 2;
  world.events.bind('mousemove', function(evt) { 
    var debugPos = document.getElementById('mousep');
    debugPos.innerText = evt.world.x + ', ' + evt.world.y;
  });
  
  world.events.bind('keydown', function(evt) {
    var debugKey = document.getElementById('kdown');
    debugKey.innerText = evt.key + '[' + evt.keyCode + ']';
  });
  
  var bg = new pulse.Layer({name: 'bg', x : 320, y : 240});
  var bgs = new pulse.Sprite({
    src: 'img/Forest_blue.jpg', 
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};
  
  bg.addNode(bgs);
  bg.zindex = 1;
  
  var mAni = new pulse.AnimateAction({
    name: 'ma1', 
    size: {width:125, height:125}, 
    frames: 4, 
    frameRate: 5
  });
  
  var cybertron =  new pulse.Scene({name: 'Cybertron'});
  
  var myEngine = null;
  
  function loop(sceneManager)
  {
    var wLayer = sceneManager.getScene('Cybertron').getLayer('myLayer');
    var mario = wLayer.getObject('mario');
    var luigi = wLayer.getObject('luigi');
    var cat = wLayer.getObject('cat');
    
    mario.move(10, 0);
    luigi.move(0, 10);
    cat.move(10, 0);
    
    luigi.scaleX = luigi.scaleX + 0.1;
    luigi.scaleY = luigi.scaleY - 0.01;
    
    if(mario.position.x > 640)
      mario.move(-630, 0);
      
    if(luigi.position.y > 480)
    {
      luigi.move(0, -430);
      luigi.scaleX = 1;
      luigi.scaleY = 1;
    }
    
    var catPos = cat.position.x;
    
    if(catPos > 640)
      cat.move(-630, 0);
      
    if((catPos > 100 && catPos < 200) || (catPos > 300 && catPos < 400))
      cat.visible = true;
    else
      cat.visible = false;
  
    var debugTime = document.getElementById('time');
    debugTime.innerText = myEngine.masterTime;
  }
  
  function gameGo()
  {
    myEngine = new pulse.Engine();
  
    mario.events.bind('click', function() { alert('clicked on mario!'); });
    mario.addAction(mAni);
    mario.runAction('ma1');
    mario.move(100, 200);
    mario.zindex = 2;
    
    luigi.events.bind('click', function() { alert('clicked on luigi!'); });
    luigi.addAction({
      name: 'la1', 
      size: {width:125, height:125}, 
      frames: 4, 
      frameRate: 5,
      offset: {x:0, y:2}
    });
    luigi.getAction('la1').start();
    luigi.move(300, 60);
    
    cat.alpha = 35;
    cat.move(25, 25);
    cat.events.bind('click', function() { alert('clicked on cat!'); });
    
    world.addNode(mario);
    world.addNode(luigi);
    world.addNode(cat);
    
    cybertron.addLayer(world);
    cybertron.addLayer(bg);
    
    myEngine.scenes.addScene(cybertron);
    myEngine.scenes.activateScene(cybertron);
    
    myEngine.go(100, loop);
  }
  gameGo();
});
