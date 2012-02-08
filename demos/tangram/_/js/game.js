// Namespace declaration
var tg = tg || { };

pulse.ready(function(){

  //pulse.DEBUG = true;

  tg.skins = {};
  tg.skins.test = new pulse.Texture({filename: '_/img/skin.png'});

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
    var p = null;
    var sender = e.sender;
    var closest = {};
    var dx = 0, dy = 0;
    var dist = 0;
    var pt1 = {}, pt2 = {};
    var min = 400;
    var pradius = 22500;

    sender.position.x = parseInt(sender.position.x, 10);
    sender.position.y = parseInt(sender.position.y, 10);

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
    }


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
    src: tg.skins.test,
    gameManager: gameManager
  });
  tlPiece1.position = {x: 90, y: 550};
  tlPiece1.rotation = 90;
  gameLayer.addNode(tlPiece1);
  gameManager.pieces.push(tlPiece1);

  var tlPiece2 = new tg.pieces.TriangleLarge({
    src: tg.skins.test,
    gameManager: gameManager
  });
  tlPiece2.position = {x: 670, y: 550};
  tlPiece2.rotation = 270;
  gameLayer.addNode(tlPiece2);
  gameManager.pieces.push(tlPiece2);

  var tmPiece1 = new tg.pieces.TriangleMedium({
    src: tg.skins.test,
    gameManager: gameManager
  });
  tmPiece1.position = {x: 220, y: 550};
  gameLayer.addNode(tmPiece1);
  gameManager.pieces.push(tmPiece1);

  var tsPiece1 = new tg.pieces.TriangleSmall({
    src: tg.skins.test,
    gameManager: gameManager
  });
  tsPiece1.position = {x: 290, y: 550};
  gameLayer.addNode(tsPiece1);
  gameManager.pieces.push(tsPiece1);

  var tsPiece2 = new tg.pieces.TriangleSmall({
    src: tg.skins.test,
    gameManager: gameManager
  });
  tsPiece2.position = {x: 560, y: 550};
  tsPiece2.rotation = 180;
  gameLayer.addNode(tsPiece2);
  gameManager.pieces.push(tsPiece2);

  var sqPiece1 = new tg.pieces.Square({
    src: tg.skins.test,
    gameManager: gameManager
  });
  sqPiece1.position = {x: 490, y: 550};
  gameLayer.addNode(sqPiece1);
  gameManager.pieces.push(sqPiece1);

  var tpPiece1 = new tg.pieces.Trapezoid({
    src: tg.skins.test,
    gameManager: gameManager
  });
  tpPiece1.position = {x: 380, y: 550};
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