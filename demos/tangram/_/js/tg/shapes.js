var tg = tg || { };
tg.pieces = tg.pieces || { };

tg.pieces.TriangleLarge = tg.TanPiece.extend({
  init : function(params) {
    this._super(params);

    this.size = {width: 76, height: 152};

    this.maskCanvas = document.createElement('canvas');
    var ctx = this.maskCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(76,76);
    ctx.lineTo(0,152);
    ctx.lineTo(0,0);
    ctx.fill();

    this.hitTestType = pulse.Sprite.HIT_TEST_CONVEX;
    this.hitTestPoints = [{x: 0, y: 0}, {x: 76, y: 76}, {x: 0, y: 152}];
    this.controlLocalPoints = [
      {x: 0, y: 0},
      {x: 19, y: 19},
      {x: 38, y: 38},
      {x: 56, y: 56},
      {x: 76, y: 76},
      {x: 56, y: 95},
      {x: 38, y: 114},
      {x: 19, y: 133},
      {x: 0, y: 152},
      {x: 0, y: 114},
      {x: 0, y: 76},
      {x: 0, y: 38}
    ];
  }
});

tg.pieces.TriangleMedium = tg.TanPiece.extend({
  init : function(params) {
    this._super(params);

    this.size = {width: 76, height: 76};

    this.maskCanvas = document.createElement('canvas');
    var ctx = this.maskCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(76,76);
    ctx.lineTo(0,76);
    ctx.lineTo(0,0);
    ctx.fill();

    this.hitTestType = pulse.Sprite.HIT_TEST_CONVEX;
    this.hitTestPoints = [{x: 0, y: 0}, {x: 76, y: 76}, {x: 0, y: 76}];
    this.controlLocalPoints = [
      {x: 0, y: 0},
      {x: 38, y: 38},
      {x: 76, y: 76},
      {x: 38, y: 76},
      {x: 0, y: 76},
      {x: 0, y: 38}
    ];
  }
});

tg.pieces.TriangleSmall = tg.TanPiece.extend({
  init : function(params) {
    this._super(params);

    this.size = {width: 38, height: 76};

    this.maskCanvas = document.createElement('canvas');
    var ctx = this.maskCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(38,38);
    ctx.lineTo(0,76);
    ctx.lineTo(0,0);
    ctx.fill();

    this.hitTestType = pulse.Sprite.HIT_TEST_CONVEX;
    this.hitTestPoints = [{x: 0, y: 0}, {x: 38, y: 38}, {x: 0, y: 76}];
    this.controlLocalPoints = [
      {x: 0, y: 0},
      {x: 19, y: 19},
      {x: 38, y: 38},
      {x: 19, y: 56},
      {x: 0, y: 76},
      {x: 0, y: 38}
    ];
  }
});

tg.pieces.Square = tg.TanPiece.extend({
  init : function(params) {
    this._super(params);

    this.size = {width: 76, height: 76};

    this.maskCanvas = document.createElement('canvas');
    var ctx = this.maskCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(38,0);
    ctx.lineTo(76,38);
    ctx.lineTo(38,76);
    ctx.lineTo(0,38);
    ctx.lineTo(38,0);
    ctx.fill();

    this.hitTestType = pulse.Sprite.HIT_TEST_CONVEX;
    this.hitTestPoints = [{x: 38, y: 0}, {x: 76, y: 38}, {x: 38, y: 76}, {x: 0, y: 38}];
    this.controlLocalPoints = [
      {x: 38, y: 0},
      {x: 56, y: 19},
      {x: 76, y: 38},
      {x: 56, y: 56},
      {x: 38, y: 76},
      {x: 19, y: 56},
      {x: 0, y: 38},
      {x: 19, y: 19}
    ];
  }
});

tg.pieces.Trapezoid = tg.TanPiece.extend({
  init : function(params) {
    this._super(params);

    this.size = {width: 38, height: 114};

    this.maskCanvas = document.createElement('canvas');
    var ctx = this.maskCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(38,0);
    ctx.lineTo(38,76);
    ctx.lineTo(0,114);
    ctx.lineTo(0,38);
    ctx.lineTo(38,0);
    ctx.fill();

    this.hitTestType = pulse.Sprite.HIT_TEST_CONVEX;
    this.hitTestPoints = [{x: 38, y: 0}, {x: 38, y: 76}, {x: 0, y: 114}, {x: 0, y: 38}];
    this.controlLocalPoints = [
      {x: 38, y: 0},
      {x: 38, y: 38},
      {x: 38, y: 76},
      {x: 19, y: 95},
      {x: 0, y: 114},
      {x: 0, y: 76},
      {x: 19, y: 19},
      {x: 0, y: 38}
    ];

    this.flipMask = document.createElement('canvas');
    ctx = this.flipMask.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,76);
    ctx.lineTo(38,114);
    ctx.lineTo(38,38);
    ctx.lineTo(0,0);
    ctx.fill();

    this.flippedHitPoints = [{x: 0, y: 0}, {x: 0, y: 76}, {x: 38, y: 114}, {x: 38, y: 38}];
    this.flippedControlPoints = [
      {x: 0, y: 0},
      {x: 0, y: 38},
      {x: 0, y: 76},
      {x: 19, y: 95},
      {x: 38, y: 114},
      {x: 38, y: 76},
      {x: 19, y: 19},
      {x: 38, y: 38}
    ];

    this.oldHitPoints = [];
    this.oldControlPoints = [];
    this.oldMask = [];
  },

  flip : function() {
    this.oldMask = this.maskCanvas;
    this.maskCanvas = this.flipMask;
    this.flipMask = this.oldMask;

    this.oldHitPoints = this.hitTestPoints;
    this.hitTestPoints = this.flippedHitPoints;
    this.flippedHitPoints = this.oldHitPoints;

    this.oldControlPoints = this.controlLocalPoints;
    this.controlLocalPoints = this.flippedControlPoints;
    this.flippedControlPoints = this.oldControlPoints;

    this.calculateProperties();
    this.textureUpdated = true;
    this.updated = true;
  }
});