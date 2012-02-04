// Namespace declaration
var tg = tg || { };

pulse.ready(function(){

  //pulse.DEBUG = true;

  var skin = new pulse.Texture({filename: '_/img/skin.png'});

  var gameManager = new tg.GameManager();

  // The base engine object
  var engine = new pulse.Engine({
    gameWindow: 'tangram',
    width: 760,
    height: 600
  });

  // Test game scene
  var scene = new pulse.Scene();
  engine.scenes.addScene(scene);

  // Shape holding layer
  var gameLayer = new pulse.Layer({
    name: '',
    width: 760,
    height: 600
  });
  gameLayer.anchor = {x: 0, y: 0};
  gameLayer.position = {x: 0, y: 0};
  scene.addLayer(gameLayer);

  var gamePlayArea = new pulse.Sprite({
    src: '_/img/grid_area.png',
    name: 'gamePlayArea'
  });
  gamePlayArea.dropAcceptEnabled = true;
  gamePlayArea.anchor = {x: 0, y: 0};
  gamePlayArea.position = {x: 0, y: 0};
  gamePlayArea.events.bind('itemdropped', function(e) {
    // handle item snap here
    var piece = e.sender;
    piece.position.x = round2(piece.position.x);
    piece.position.y = round2(piece.position.y);
  });
  gameLayer.addNode(gamePlayArea);

  var catTest = new pulse.Sprite({src: '_/img/cat_test.png'});
  catTest.position = {x: 372, y: 250};
  gameLayer.addNode(catTest);

  var drawerBg = new pulse.Sprite({src: '_/img/drawer_bg.png'});
  drawerBg.anchor = {x: 0, y: 1};
  drawerBg.position = {x: 0, y: 600};
  gameLayer.addNode(drawerBg);

  var tlPiece1 = new tg.pieces.TriangleLarge({
    src: skin,
    gameManager: gameManager
  });
  tlPiece1.position = {x: 90, y: 550};
  tlPiece1.rotation = 90;
  gameLayer.addNode(tlPiece1);

  var tlPiece2 = new tg.pieces.TriangleLarge({
    src: skin,
    gameManager: gameManager
  });
  tlPiece2.position = {x: 670, y: 550};
  tlPiece2.rotation = 270;
  gameLayer.addNode(tlPiece2);

  var tmPiece1 = new tg.pieces.TriangleMedium({
    src: skin,
    gameManager: gameManager
  });
  tmPiece1.position = {x: 220, y: 550};
  gameLayer.addNode(tmPiece1);

  var tsPiece1 = new tg.pieces.TriangleSmall({
    src: skin,
    gameManager: gameManager
  });
  tsPiece1.position = {x: 290, y: 550};
  gameLayer.addNode(tsPiece1);

  var tsPiece2 = new tg.pieces.TriangleSmall({
    src: skin,
    gameManager: gameManager
  });
  tsPiece2.position = {x: 560, y: 550};
  tsPiece2.rotation = 180;
  gameLayer.addNode(tsPiece2);

  var sqPiece1 = new tg.pieces.Square({
    src: skin,
    gameManager: gameManager
  });
  sqPiece1.position = {x: 490, y: 550};
  gameLayer.addNode(sqPiece1);

  var tpPiece1 = new tg.pieces.Trapezoid({
    src: skin,
    gameManager: gameManager
  });
  tpPiece1.position = {x: 380, y: 550};
  tpPiece1.rotation = 90;
  gameLayer.addNode(tpPiece1);

  gameLayer.events.bind('keyup', function(e) {
    if(e.keyCode === 37 || e.keyCode === 65) {
      gameManager.rotateSelectedPiece(-45);
    }
    if(e.keyCode === 39 || e.keyCode === 68) {
      gameManager.rotateSelectedPiece(45);
    }
  });

  function loop(sceneManager) {

  }

  engine.scenes.activateScene(scene);
  engine.go(50, loop);

  function round5(x) {
    return (x % 5) >= 2.5 ? parseInt(x / 5, 10) * 5 + 5 : parseInt(x / 5, 10) * 5;
  }

  function round2(x) {
    return (x % 2) >= 1 ? parseInt(x / 2, 10) * 2 + 2 : parseInt(x / 2, 10) * 2;
  }

});