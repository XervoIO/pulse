var tg = tg || { };
tg.pieces = tg.pieces || { };

tg.pieces.TriangleLarge = tg.MaskedSprite.extend({
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
  }
});

tg.pieces.TriangleMedium = tg.MaskedSprite.extend({
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
  }
});

tg.pieces.TriangleSmall = tg.MaskedSprite.extend({
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
  }
});

tg.pieces.Square = tg.MaskedSprite.extend({
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
  }
});

tg.pieces.Trapezoid = tg.MaskedSprite.extend({
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
  }
});