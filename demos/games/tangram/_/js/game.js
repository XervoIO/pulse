// Namespace declaration
var tg = tg || { };

pulse.ready(function(){

  tg.skins = {};
  tg.skins.blue = new pulse.Texture({filename: '_/img/skin_blue_lines.png'});
  tg.skins.burgundy = new pulse.Texture({filename: '_/img/skin_burgundy_lines.png'});
  tg.skins.orange = new pulse.Texture({filename: '_/img/skin_orange_lines.png'});
  tg.skins.green = new pulse.Texture({filename: '_/img/skin_green_lines.png'});
  tg.skins.red = new pulse.Texture({filename: '_/img/skin_red.png_lines'});
  tg.skins.purple = new pulse.Texture({filename: '_/img/skin_purple_lines.png'});
  tg.skins.yellow = new pulse.Texture({filename: '_/img/skin_yellow_lines.png'});

  var level = eval('(' + '[[{"x" : 145, "y" : 220}, {"x" : 38, "y" : 220}, {"x" : 38, "y" : 113}], [{"x" : 37, "y" : 220}, {"x" : 145, "y" : 220}, {"x" : 145, "y" : 327}], [{"x" : 66, "y" : 252}, {"x" : 142, "y" : 328}, {"x" : 66, "y" : 328}], [{"x" : 0, "y" : 0}, {"x" : 38, "y" : 38}, {"x" : 0, "y" : 76}], [{"x" : 76, "y" : 75}, {"x" : 38, "y" : 37}, {"x" : 76, "y" : -1}], [{"x" : 38, "y" : 37}, {"x" : 76, "y" : 75}, {"x" : 38, "y" : 113}, {"x" : 0, "y" : 75}], [{"x" : 119, "y" : 194}, {"x" : 119, "y" : 118}, {"x" : 157, "y" : 80}, {"x" : 157, "y" : 156}]]' + ')');

  var gameManager = new tg.GameManager();

  // The base engine object
  var engine = new pulse.Engine({
    gameWindow: 'tangram',
    size: {width: 760, height: 600}
  });

  // Test game scene
  var scene = new pulse.Scene();
  engine.scenes.addScene(scene);

  // Shape holding layer
  var gameLayer = new pulse.Layer({
    name: '',
    size: {width: 760, height: 600}
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

    // check win conditions
    checkWinConditions();
    //calculateSilhoutte();
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
    src: tg.skins.green,
    gameManager: gameManager
  });
  tlPiece1.position = {x: 90, y: 550};
  tlPiece1.rotation = 90;
  gameLayer.addNode(tlPiece1);
  gameManager.pieces.push(tlPiece1);

  var tlPiece2 = new tg.pieces.TriangleLarge({
    src: tg.skins.orange,
    gameManager: gameManager
  });
  tlPiece2.position = {x: 670, y: 550};
  tlPiece2.rotation = 270;
  gameLayer.addNode(tlPiece2);
  gameManager.pieces.push(tlPiece2);

  var tmPiece1 = new tg.pieces.TriangleMedium({
    src: tg.skins.red,
    gameManager: gameManager
  });
  tmPiece1.position = {x: 220, y: 550};
  gameLayer.addNode(tmPiece1);
  gameManager.pieces.push(tmPiece1);

  var tsPiece1 = new tg.pieces.TriangleSmall({
    src: tg.skins.purple,
    gameManager: gameManager
  });
  tsPiece1.position = {x: 290, y: 550};
  gameLayer.addNode(tsPiece1);
  gameManager.pieces.push(tsPiece1);

  var tsPiece2 = new tg.pieces.TriangleSmall({
    src: tg.skins.burgundy,
    gameManager: gameManager
  });
  tsPiece2.position = {x: 560, y: 550};
  tsPiece2.rotation = 180;
  gameLayer.addNode(tsPiece2);
  gameManager.pieces.push(tsPiece2);

  var sqPiece1 = new tg.pieces.Square({
    src: tg.skins.yellow,
    gameManager: gameManager
  });
  sqPiece1.position = {x: 490, y: 550};
  gameLayer.addNode(sqPiece1);
  gameManager.pieces.push(sqPiece1);

  var tpPiece1 = new tg.pieces.Trapezoid({
    src: tg.skins.blue,
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
    if(e.keyCode === 70) {
      gameManager.flipSelectedPiece();
    }
  });

  function loop(sceneManager) {

  }

  engine.scenes.activateScene(scene);
  engine.go(50, loop);

  function checkWinConditions() {
    var p = null;
    var bl = {x: 10000, y: 10000};
    var list = [];
    var item = null;
    var pt = {};

    for(var i = 0; i < gameManager.pieces.length; i++) {
      p = gameManager.pieces[i];
      item = [];
      for(var j = 0; j < p.hitTestPoints.length; j++) {
        pt = p.hitTestPoints[j];
        pt = p.convertPointLocalToGlobal(pt.x, pt.y);
        if(pt.y < bl.y && pt.x < bl.x) {
          bl.x = pt.x;
          bl.y = pt.y;
        }
        item.push(pt);
      }

      list.push(item);
    }

    var inside = false;
    var outside = [];
    var lp = 0;

    for(var k = 0; k < list.length; k++) {
      item = list[k];
      for(var l = 0; l < item.length; l++) {
        inside = false;
        pt = item[l];
        npt = {};
        pt.x -= bl.x;
        pt.y -= bl.y;
        pt.x = Math.round(pt.x);
        pt.y = Math.round(pt.y);

        // check to see if point is inside any of the polys
        for(lp = 0; lp < level.length; lp++) {
          if(checkPointInPoly(pt.x, pt.y, level[lp])) {
            inside = true;
          }
        }
        if(!inside && !pointInArray(pt, outside)) {
          outside.push(pt);
        }
      }
    }

    var dx = 0, dy = 0;
    var max = 32;
    var dist = 0;
    var cpt = {};
    var poly = [];
    var cont = false;

    // check outside points see if they are within 2 pixels of level verts
    for(var oi = outside.length - 1; oi >= 0; oi--) {
      pt = outside[oi];
      cont = false;
      for(lp = 0; lp < level.length; lp++) {
        poly = level[lp];
        for(var vi = 0; vi < poly.length; vi++) {
          cpt = poly[vi];
          dx = pt.x - cpt.x;
          dy = pt.y - cpt.y;
          dist = dx * dx + dy * dy;
          if(dist < max) {
            cont = true;
            break;
          }
        }
        if(cont) {
          outside.splice(oi, 1);
          break;
        }
      }
    }


    if(outside.length === 0) {
      console.log('level complete');
    }
  }

  function pointInArray(pt, points) {
    var cpt = {};
    for(var i in points) {
      cpt = points[i];
      if(cpt.x === pt.x && cpt.y === pt.y) {
        return true;
      }
    }
    return false;
  }

  function checkPointInPoly(x, y, verts) {
    var pcount = verts.length;
    var retval = false;
    var vert1 = {};
    var vert2 = {};

    if(pcount < 3) {
      return false;
    }

    // Check if point is in polygon
    for(var i = 0, j = pcount - 1; i < pcount; j = i++) {
      vert1 = verts[i];
      vert2 = verts[j];
      if(((vert1.y > y) != (vert2.y > y)) &&
         (x < (vert2.x - vert1.x) * (y - vert1.y) / (vert2.y - vert1.y) + vert1.x)) {
        retval = !retval;
      }
    }

    return retval;
  }

  function calculateSilhoutte() {
    var p = null;
    var bl = {x: 10000, y: 10000};
    var list = [];
    var item = null;
    var pt = {};

    for(var i = 0; i < gameManager.pieces.length; i++) {
      p = gameManager.pieces[i];

      item  = [];

      for(var j = 0; j < p.hitTestPoints.length; j++) {
        pt = p.hitTestPoints[j];
        pt = p.convertPointLocalToGlobal(pt.x, pt.y);
        if(pt.y < bl.y && pt.x < bl.x) {
          bl.x = pt.x;
          bl.y = pt.y;
        }
        item.push(pt);
      }

      list.push(item);
    }

    var str = "[";

    for(var k = 0; k < list.length; k++) {
      item = list[k];

      if(k === 0) {
        str += "[";
      } else {
        str += ", [";
      }

      for(var l = 0; l < item.length; l++) {
        pt = item[l];
        pt.x -= bl.x;
        pt.y -= bl.y;
        pt.x = Math.round(pt.x);
        pt.y = Math.round(pt.y);
        if(l === 0) {
          str += '{"x" : ' + pt.x + ', "y" : ' + pt.y + '}';
        } else {
          str += ',  {"x" : ' + pt.x + ', "y" : ' + pt.y + '}';
        }
      }
      str += "]";
    }

    str += "]";

    console.dir(list);
    console.log(str);
  }

});