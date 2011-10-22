PFPlay.gameWindow = document.getElementById('gameWindow');

var start = new Date().getTime();

function initGame() {
  
  var rows = 5;
  var columns = 5;
  
  var tileWidth = 100;
  var tileHeight = 50;
  
  var width = 640;
  var height = 480;
  
  var offsetX = width - (tileWidth * columns) - (tileWidth / 2);
  var offsetY = ((height - (tileHeight * rows)) / 2) + ((tileHeight * rows) / 2) - (tileHeight / 2);
  
  var engine = new PFPlay.Engine();
  var scene = new PFPlay.Scene('bbb');
  var layer = new PFPlay.Layer('Blah', 0, 0, width, height);
  
  // Create and layout tiles.
  for(var rowIdx = 0; rowIdx < rows; rowIdx++) {
    for(var colIdx = 0; colIdx < columns; colIdx++) {
      var tile = new PFPlay.Sprite('tile.png');
      
      var x = colIdx * (tileWidth / 2) + (rowIdx * (tileWidth / 2)) + offsetX;
      var y = colIdx * (tileHeight / 2) - (rowIdx * (tileHeight / 2)) + offsetY;
      
      tile.move(x, y);
      
      layer.addObject(tile);
    }
  }
  
  var go = function() {
    scene.addLayer(layer);
    engine.scenes.add(scene);
    engine.scenes.activate('bbb');
    engine.go(50, loop);
  }
  
  window.setTimeout(go, 1000);
}

function loop(sceneManager) {
  var debugTime = document.getElementById('time');
  debugTime.innerText = PFPlay.masterTime;
}
