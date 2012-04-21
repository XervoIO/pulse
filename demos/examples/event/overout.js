pulse.ready(function(){
  var width = 640;
  var height = 480;
  
  var engine = new pulse.Engine({ 
    gameWindow: 'gameWindow', 
    size: {width: 640, height: 480} 
  });
  
  var scene = new pulse.Scene();
  var layer = new pulse.Layer({
    name: 'layer', 
    x : 320, y : 240,
    size: {width: width, height: height}
  });
  
  layer.events.bind('mouseover', function(evt){
    WriteLine("Mouse Over!  " + evt.sender.name + " [" +
        evt.position.x + ',' + evt.position.y + "]");
  });
  
  layer.events.bind('mouseout', function(evt){
    WriteLine("Mouse Out!  " + evt.sender.name + " [" +
        evt.position.x + ',' + evt.position.y + "]");
  });
  
  var texture = new pulse.Texture({ 
    filename: 'img/red_square.png'
  });
 
  var node;
  for(var s = 0;s < 10;s++) {
    layer.addNode(new pulse.Sprite({
      name: 'star' + s,
      src: texture
    }));
    
    node = layer.getNode('star' + s);
    node.position = {
      x: Math.random() * width + 40, 
      y: Math.random() * height + 40
    };
    
    node.events.bind('mouseover', function(evt) {
      WriteLine("Mouse Over!  " + evt.sender.name + " [" +
        evt.position.x + ',' + evt.position.y + "]");
    });
    
    node.events.bind('mouseout', function(evt) {
      WriteLine("Mouse Out!  " + evt.sender.name + " [" +
        evt.position.x + ',' + evt.position.y + "]");
    });
  }
 
  scene.addLayer(layer);
  
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);
  
  engine.go(50, function() {});
});
