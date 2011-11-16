pulse.ready(function() {
  var stars = [];
  stars.push(new pulse.Texture({filename:'../img/star_1.png'}));
  stars.push(new pulse.Texture({filename:'../img/star_2.png'}));
  stars.push(new pulse.Texture({filename:'../img/star_3.png'}));
  stars.push(new pulse.Texture({filename:'../img/star_4.png'}));
  stars.push(new pulse.Texture({filename:'../img/star_5.png'}));
  
  var world = new pulse.Layer({name: 'layer', x : 320, y : 240});
  world.zindex = 2;
  
  var bg = new pulse.Layer({name: 'bg', x : 320, y : 240});
  var bgs = new pulse.Sprite({
    src: '../img/gray_bg.jpg', 
    name: 'bg'
  });
  bgs.position = {x: 320, y: 240};
  
  bg.addNode(bgs);
  bg.zindex = 1;
  
  var cybertron = new pulse.Scene({name: 'cybertron'});
  
  var engine = new pulse.Engine();
  
  var sprites = [];
  
  function loop(sceneManager)
  { 
    var debugTime = document.getElementById('time');
    debugTime.innerText = engine.masterTime;
  
    for(var i = 0; i < sprites.length; i++)
    {
      sprites[i].rotation += 0.5;
    }
  }
  
  function gameGo()
  {
    var s;
    var p;
    var y = 0;
    var ye = 230;
    var max = 92;
    for(var i = 0; i < max; i++) 
    {
      p = stars[Math.floor(Math.random() * 5)];
      s = new pulse.Sprite({src: p});
      y = i / max * ye / p.height() + 1.2;
      s.rotation = i * 18;
      s.anchor = {x: Math.random(), y: y};
      s.position = {x: 320, y: 240};
      sprites.push(s);
      world.addNode(s);
    }
  
    cybertron.addLayer(world);
    cybertron.addLayer(bg);
    
    engine.scenes.addScene(cybertron);
    engine.scenes.activateScene(cybertron);
    
    engine.go(33, loop);
  }
  gameGo();
});