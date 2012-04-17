var tg = tg || { };

tg.MaskedSprite = pulse.Sprite.extend({
  init : function(params) {
    this._super(params);

    this.gameManager = params.gameManager;

    this.dragDropEnabled = true;
    this.dragMoveEnabled = true;

    var self = this;

    this.events.bind('dragstart', function(e) {
      self.gameManager.selectedPiece = self;
      self.zindex = 100;
    });
    this.events.bind('dragdrop', function(e) {
      self.gameManager.selectedPiece = null;
      self.zindex = 10;
    });

    // Mask canvas
    this.maskCanvas = null;
  },

  draw : function(ctx) {
    if(this.texture.percentLoaded < 100 ||
       this.size.width === 0 ||
       this.size.height === 0) {
      return;
    }

    // Only redraw this canvas if the texture coords or texture changed.
    if(this.textureUpdated && this.maskCanvas !== null) {
      // Clear my canvas
      this._private.context.clearRect(
        0, 0,
        this.canvas.width, this.canvas.height
      );

      this._private.context.save();

      var slice = this.getCurrentFrame();

      this._private.context.drawImage(
        this.maskCanvas,
        0, 0,
        this.maskCanvas.width, this.maskCanvas.height
      );

      this._private.context.globalCompositeOperation = "source-atop";

      // Draws the masking texture to this visual's canvas
      this._private.context.drawImage(
        slice,
        0, 0,
        this.size.width, this.size.height
      );

      this._private.context.restore();
    }

    this.textureUpdated = false;

    this._super(ctx);
  }
});