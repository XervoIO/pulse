function initGame() {
  
  var rows = 25;
  var columns = 25;
  
  var tileWidth = 30;
  var tileHeight = 15;
  
  var width = 760;
  var height = 480;
  
  var engine = new PFPlay.Engine({ gameWindow: 'gameWindow', width: 760, height: 480 });
  var scene = new PFPlay.Scene();
  var layer = new PFPlay.Layer({y: 50});
  
  var uiLayer = new PFPlay.Layer({width: 500, height:100, x:130,  y:350});
  
  var offsetY = rows * tileHeight;
  
  var tiles = { };
  
  // Create and layout tiles.
  for(var rowIdx = 0; rowIdx < rows; rowIdx++) {
    for(var colIdx = 0; colIdx < columns; colIdx++) {
      
      var tile = new GameTile();
      
      var x = colIdx * (tileWidth / 2) + (rowIdx * (tileWidth / 2));
      var y = colIdx * (tileHeight / 2) - (rowIdx * (tileHeight / 2)) + (offsetY / 2);

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
  
  // Create UI.
  var creepA = new PFPlay.Sprite({ src: 'creepA.png' });
  var creepB = new PFPlay.Sprite({ src: 'creepB.png' });
  var creepC = new PFPlay.Sprite({ src: 'creepC.png' });
  var creepD = new PFPlay.Sprite({ src: 'creepD.png' });
  
  creepA.position = { x: 10, y: 25 };
  creepB.position = { x: 70, y: 25 };
  creepC.position = { x: 130, y: 25 };
  creepD.position = { x: 190, y: 25 };
  
  creepA.events.bind('click',
    function() {
      console.log('Creep A clicked');
    });
  
  uiLayer.addObject(creepA);
  uiLayer.addObject(creepB);
  uiLayer.addObject(creepC);
  uiLayer.addObject(creepD);
  
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
    dx = posX - tileWidth;
    dy = posY + (tileHeight / 2) - (offsetY / 2);
    isoY = Math.floor((dy + dx / 2) * (2 / 2) / (tileWidth / 2)); 
    isoX = -Math.floor((dy - dx / 2) * (2 / 2) / (tileWidth / 2)) + 1;
    return {x:isoX, y:isoY};
  }
  
  var go = function() {
    scene.addLayer(layer);
    scene.addLayer(uiLayer);
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
