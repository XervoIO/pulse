// Namespace declaration
var tg = tg || { };

pulse.ready(function(){
  tg.skins = {};
  tg.skins.blue = new pulse.Texture({filename: '_/img/skin_blue_lines.png'});
  tg.skins.burgundy = new pulse.Texture({filename: '_/img/skin_burgundy_lines.png'});
  tg.skins.orange = new pulse.Texture({filename: '_/img/skin_orange_lines.png'});
  tg.skins.green = new pulse.Texture({filename: '_/img/skin_green_lines.png'});
  tg.skins.red = new pulse.Texture({filename: '_/img/skin_red_lines.png'});
  tg.skins.purple = new pulse.Texture({filename: '_/img/skin_purple_lines.png'});
  tg.skins.yellow = new pulse.Texture({filename: '_/img/skin_yellow_lines.png'});
  tg.skins.puzzles = new pulse.Texture({filename: '_/img/puzzles.png'});

  // The base engine object
  var engine = new pulse.Engine({
    gameWindow: 'tangram',
    size: {width: 600, height: 500}
  });

  var scene = new pulse.Scene();
  engine.scenes.addScene(scene);

  var gameManager = new tg.GameManager();

   // Shape holding layer
  var gameLayer = new pulse.Layer({
    name: 'gamelayer',
    size: {width: 600, height: 500}
  });
  gameLayer.anchor = {x: 0, y: 0};
  gameLayer.position = {x: 0, y: 0};
  scene.addLayer(gameLayer);

  var gameArea = new pulse.Sprite({
    src: '_/img/gbg.png',
    name: 'gamePlayArea',
    size : {width: 600, height: 500}
  });
  gameArea.dropAcceptEnabled = true;
  gameArea.anchor = {x: 0, y: 0};
  gameArea.position = {x: 0, y: 0};
  gameArea.events.bind('itemdropped', function(e) {
    // handle item snap here
    var p = null;
    var sender = e.sender;
    var closest = {};
    var dx = 0, dy = 0;
    var dist = 0;
    var pt1 = {}, pt2 = {};
    var min = 400;
    var pradius = 22500;

    for(var i = 0; i < gameManager.pieces.length; i++) {
      p = gameManager.pieces[i];
      // if same piece skip
      if(p == sender) {
        continue;
      }
      // if more than pradius apart skip
      dx = p.position.x - sender.position.x;
      dy = p.position.y - sender.position.y;
      dist = dx * dx + dy * dy;
      if(dist > pradius) {
        continue;
      }

      for(var j = 0; j < p.controlGlobalPoints.length; j++) {
        pt1 = p.controlGlobalPoints[j];
        for(var k = 0; k < sender.controlGlobalPoints.length; k++) {
          pt2 = sender.controlGlobalPoints[k];

          dx = pt1.x - pt2.x;
          dy = pt1.y - pt2.y;
          dist = dx * dx + dy * dy;
          if(dist < min) {
            closest = {
              target : pt1,
              sender : pt2
            };
            min = dist;
          }
        }
      }
    }

    // check if we have a point to snap to
    if(typeof closest.target !== "undefined") {
      dx = closest.target.x - closest.sender.x;
      dy = closest.target.y - closest.sender.y;

      sender.position.x += dx;
      sender.position.y += dy;
      sender.calculateProperties();
    }
  });
  gameLayer.addNode(gameArea);


  var puzzleArea = new pulse.Sprite({
    src: '_/img/puzzle_area_bg.png',
    size: {width: 176, height: 201}
  });
  puzzleArea.anchor = {x: 1.0, y: 0};
  puzzleArea.position = {x: 580, y: 20};
  gameLayer.addNode(puzzleArea);

  var lPuzzle = new pulse.Sprite({
    src: '_/img/left_button.png',
    size: {width: 36, height: 34}
  });
  lPuzzle.anchor = {x: 0, y: 1.0};
  lPuzzle.position = {x: 434, y: 210};
  lPuzzle.events.bind('click', function(e) {
    if(gameManager.selectedPuzzle === 0) {
      return;
    }
    gameManager.puzzles[gameManager.selectedPuzzle].visible = false;
    gameManager.selectedPuzzle--;
    gameManager.puzzles[gameManager.selectedPuzzle].visible = true;
  });
  gameLayer.addNode(lPuzzle);

  var rPuzzle = new pulse.Sprite({
    src: '_/img/right_button.png',
    size: {width: 36, height: 34}
  });
  rPuzzle.anchor = {x: 1.0, y: 1.0};
  rPuzzle.position = {x: 550, y: 210};
  rPuzzle.events.bind('click', function(e) {
    if(gameManager.selectedPuzzle === gameManager.puzzles.length - 1) {
      return;
    }
    gameManager.puzzles[gameManager.selectedPuzzle].visible = false;
    gameManager.selectedPuzzle++;
    gameManager.puzzles[gameManager.selectedPuzzle].visible = true;
  });
  gameLayer.addNode(rPuzzle);

  for(var i = 0; i < 10; i++) {
    var p = new pulse.Sprite({
      src: tg.skins.puzzles,
      size: {width: 140, height: 140}
    });
    p.textureFrame = {
      x: i * 140,
      y: 0,
      width: 140,
      height: 140
    };
    p.position = {x: 492, y: 93};
    if(i > 0) {
      p.visible = false;
    }
    gameManager.puzzles.push(p);
    gameLayer.addNode(p);
  }

  var tlPiece1 = new tg.pieces.TriangleLarge({
    src: tg.skins.green,
    gameManager: gameManager
  });
  tlPiece1.position = {x: 83, y: 354};
  tlPiece1.rotation = 135;
  gameLayer.addNode(tlPiece1);
  gameManager.pieces.push(tlPiece1);

  var tlPiece2 = new tg.pieces.TriangleLarge({
    src: tg.skins.orange,
    gameManager: gameManager
  });
  tlPiece2.position = {x: 180, y: 120};
  tlPiece2.rotation = 315;
  gameLayer.addNode(tlPiece2);
  gameManager.pieces.push(tlPiece2);

  var tmPiece1 = new tg.pieces.TriangleMedium({
    src: tg.skins.red,
    gameManager: gameManager
  });
  tmPiece1.position = {x: 470, y: 430};
  gameLayer.addNode(tmPiece1);
  gameManager.pieces.push(tmPiece1);

  var tsPiece1 = new tg.pieces.TriangleSmall({
    src: tg.skins.purple,
    gameManager: gameManager
  });
  tsPiece1.position = {x: 243, y: 440};
  gameLayer.addNode(tsPiece1);
  gameManager.pieces.push(tsPiece1);

  var tsPiece2 = new tg.pieces.TriangleSmall({
    src: tg.skins.burgundy,
    gameManager: gameManager
  });
  tsPiece2.position = {x: 510, y: 310};
  tsPiece2.rotation = 180;
  gameLayer.addNode(tsPiece2);
  gameManager.pieces.push(tsPiece2);

  var sqPiece1 = new tg.pieces.Square({
    src: tg.skins.yellow,
    gameManager: gameManager
  });
  sqPiece1.position = {x: 307, y: 250};
  gameLayer.addNode(sqPiece1);
  gameManager.pieces.push(sqPiece1);

  var tpPiece1 = new tg.pieces.Trapezoid({
    src: tg.skins.blue,
    gameManager: gameManager
  });
  tpPiece1.position = {x: 260, y: 335};
  tpPiece1.rotation = 90;
  gameLayer.addNode(tpPiece1);
  gameManager.pieces.push(tpPiece1);

  gameLayer.events.bind('keyup', function(e) {
    if(e.keyCode === 37 || e.keyCode === 65) {
      gameManager.rotateSelectedPiece(-45);
    }
    if(e.keyCode === 39 || e.keyCode === 68) {
      gameManager.rotateSelectedPiece(45);
    }
    if(e.keyCode === 70) {
      gameManager.flipSelectedPiece();
    }
  });

  function loop(sceneManager) {

  }

  engine.scenes.activateScene(scene);
  engine.go(50, loop);

});