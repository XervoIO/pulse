var tg = tg || { };

tg.TanPiece = tg.MaskedSprite.extend({
  init : function(params) {
    this._super(params);

    this.controlLocalPoints = [];
    this.controlGlobalPoints = [];

    this.shadowEnabled = true;
    this.shadowOffsetX = 1;
    this.shadowOffsetY = 2;
    this.shadowBlur = 5;
    this.shadowColor = "rgba(0, 0, 0, 0.23)";
  },

  calculateProperties : function(elapsed) {
    this._super(elapsed);

    //update control points
    var pt = {};
    for(var i = 0; i < this.controlLocalPoints.length; i++) {
      pt = this.controlLocalPoints[i];
      this.controlGlobalPoints[i] = this.convertPointLocalToGlobal(pt.x, pt.y);
    }
  },

  convertPointLocalToGlobal : function(x, y) {
    if(this.rotation !== 0) {
      // calculate local center
      var ax = this.size.width / 2;
      var ay = this.size.height / 2;

      // need to rotate point to local coords
      var dx = x - ax;
      var dy = y - ay;
      var r = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx) + Math.PI / 2;

      x = r * Math.sin(angle + this.rotation * Math.PI / 180) + ax;
      y = ay - r * Math.cos(angle + this.rotation * Math.PI / 180);
    }

    x += this.bounds.x;
    y += this.bounds.y;

    return {
      x : x,
      y : y
    };
  },

  convertPointGlobalToLocal : function(x, y) {

    x -= this.bounds.x;
    y -= this.bounds.y;

    if(this.rotation !== 0) {
      // calculate local center
      var ax = this.size.width / 2;
      var ay = this.size.height / 2;

      // need to rotate point to local coords
      var dx = x - ax;
      var dy = y - ay;
      var r = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx) + Math.PI / 2;

      x = r * Math.sin(angle - this.rotation * Math.PI / 180) + ax;
      y = ay - r * Math.cos(angle - this.rotation * Math.PI / 180);
    }

    return {
      x : x,
      y : y
    };
  },

  draw : function(ctx) {
    this._super(ctx);

    // ctx.save();
    // ctx.fillStyle = "#8A33C2";
    // var cpt = {};
    // for(var index in this.controlGlobalPoints) {
    //   cpt = this.controlGlobalPoints[index];
    //   ctx.beginPath();
    //   ctx.arc(cpt.x, cpt.y, 3, 0, Math.PI * 2, true);
    //   ctx.closePath();
    //   ctx.fill();
    // }
    // ctx.restore();
  }

});