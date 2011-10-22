PFPlay.gameWindow = document.getElementById('gameWindow');

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
  var scene = new PFPlay.Scene();
  var layer = new PFPlay.Layer({width: 640, height: 480});
  
  var tiles = { };
  
  // Create and layout tiles.
  for(var rowIdx = 0; rowIdx < rows; rowIdx++) {
    for(var colIdx = 0; colIdx < columns; colIdx++) {
      
      var tile = new GameTile();
      
      var x = colIdx * (tileWidth / 2) + (rowIdx * (tileWidth / 2)) + offsetX;
      var y = colIdx * (tileHeight / 2) - (rowIdx * (tileHeight / 2)) + offsetY;

      tile.setWorldCoords(x, y);
      
      tile.gridX = colIdx;
      tile.gridY = rowIdx;
      
      if(!tiles[rowIdx])
        tiles[rowIdx] = {};
      tiles[rowIdx][colIdx] = tile;
      
      layer.addObject(tile.normalSprite);
      layer.addObject(tile.overSprite);
    }
  }
  
  var hoveredTile = null;
  
  layer.events.bind('mousemove', 
    function(pos) {
      var isoPos = worldToIso(pos.x, pos.y);
      if(tiles[isoPos.x] && tiles[isoPos.x][isoPos.y]) {
        var tile = tiles[isoPos.x][isoPos.y];

        if(tile != hoveredTile) {
          tile.mouseenter();
          if(hoveredTile) {
            hoveredTile.mouseleave();
          }
          
          hoveredTile = tile;
        }
      }
    });
  
  function worldToIso(posX, posY) {
    dx = posX - offsetX - tileWidth;
    dy = posY - offsetY + (tileHeight / 2);
    isoY = Math.floor((dy + dx / 2) * (2 / 2) / (tileWidth / 2)); 
    isoX = -Math.floor((dy - dx / 2) * (2 / 2) / (tileWidth / 2)) + 1;
    return {x:isoX, y:isoY};
  }
  
  var go = function() {
    scene.addLayer(layer);
    engine.scenes.add(scene);
    engine.scenes.activate(scene);
    engine.go(50, loop);
  }
  
  window.setTimeout(go, 500);
}

function loop(sceneManager) {
  var debugTime = document.getElementById('time');
  debugTime.innerText = PFPlay.masterTime;
}
