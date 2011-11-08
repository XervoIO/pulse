/**
 * Copyright 2011 Paranoid Ferret Productions
 *
 * The base type for all visual elements added to the world.
 * @author Charlie Key
 * @class visual node
 * @augments PFPlay.Node
 */
 
PFPlay.Visual = PFPlay.Node.extend(
/** @lends PFPlay.Visual.prototype */
{
  /** @constructs */
  init : function(params) {
    this._super(params);

    /**
     * The html canvas element that represents this visual node.
     * @type {HTMLCanvas}
     */
    this.canvas = document.createElement('canvas');

    /** 
     * 2d context for the canvas element for this visual node.
     * @type {CanvasRenderingContext2D}
     */
    this._private.context = this.canvas.getContext('2d');

    /** 
     * Signifies it's the first update for the visual node.
     * @type {boolean}
     */
    this._private.firstUpdate = true;

    /** 
     * The current position of the visual node.
     * @type {point}
     */
    this.position = { 
      x : 0, 
      y : 0
    };

    /** 
     * The previous position of the visual node, previous position gets
     * updated in the update function.
     * @type {point}
     */
    this.positionPrevious = {
      x : 0,
      y : 0
    };

    /** 
     * The current size of the visual node.
     * @type {size}
     */
    this.size = {
      width : 0,
      height : 0
    };

    /** 
     * The previous size of the visual node, previous size gets
     * updated in the update function.
     * @type {size}
     */
    this.sizePrevious = {
      width : 0,
      height : 0
    };

    /**
     * The bounds of this visual node, updated based on size and position.
     * @type {rect}
     */
    this.bounds = {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    };

    /**
     * The previous bounds of this visual node.
     * @type {rect}
     */
    this.boundsPrevious = {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    };

    /**
     * The current position anchor of the visual node, the position on the 
     * visual node sets the position of the anchor.
     * @type {point}
     */
    this.anchor = {
      x : 0.5,
      y : 0.5
    };

    /**
     * The previous position anchor of the visual node, previous anchor gets 
     * updated in the update function.
     * @type {point}
     */
    this.anchorPrevious = {
      x : 0.5,
      y : 0.5
    };

    /**
     * The radius from the center of the visual node to the anchor point.
     * @type {float}
     */
    this.anchorRadius = 0;

    /**
     * The angle of the anchor to the center of the visual node in degrees.
     * @type {float}
     */
    this.anchorAngle = 0;

    /** 
     * The current scale of the visual node.
     * @type {point}
     */
    this.scale = {
      x : 1.0,
      y : 1.0
    };

    /** 
     * The previous scale of the visual node, this is updated in the update
     * function.
     * @type {point}
     */
    this.scalePrevious = {
      x : 1.0,
      y : 1.0
    };

    /**
     * The rotation of the visual node, in degrees.
     * @type {number}
     */
    this.rotation = 0;

    /**
     * The previous rotation of the visual node, in degrees. This is updated in 
     * the update function.
     * @type {number}
     */
    this.rotationPrevious = 0;

    /**
     * The position of the upper left of the visual node based on the 
     * position and anchor.
     * @type {point}
     */
    this.positionTopLeft = {
      x : 0,
      y : 0
    };

    /**
     * The previous position of the upper left of the visual node, previous
     * top left gets updated in update function.
     * @type {point}
     */
    this.positionTopLeftPrevious = {
      x : 0,
      y : 0
    };

    /**
     * This signifies whether the visual node needs to have certain size 
     * properties recalculated.
     * @type {boolean}
     */
    this.invalidProperties = true;

    /**
     * The zindex of the visual node. Higher zindex means the visual object
     * is on top of lower zindex nodes.
     * @type {number}
     */
    this.zindex = 0;

    /**
     * The previous zindex of the visual node. Higher zindex means the 
     * visual object is on top of lower zindex nodes.
     * @type {number}
     */
    this.zindexPrevious = 0;

    /**
     * This signifies that the visual node has changed sort order.
     * @type {boolean}
     */
    this.shuffled = false;

    /**
     * The alpha transparency of the visual from 0-100.
     * @type {number}
     */
    this.alpha = 100;

    /**
     * The previous alpha transparency of the visual from 0-100.
     * @type {number}
     */
    this.alphaPrevious = 100;

    /**
     * This signifies whether the visual node is visible at the time, if false
     * the node's draw function will not be called.
     * @type {boolean}
     */
    this.visible = true;

    /**
     * The previous state of visible, this value is updated in the 
     * update function.
     * @type {number}
     */
    this.visiblePrevious = true;

    /**
     * This signifies whether the object needs to be redrawn on next draw phase.
     * @type {boolean}
     */
    this.updated = true;
  },

  /**
   * Sets the previous position, used to clear the previous frame from
   * a layer.
   * @param {number} x the horizontal previous position of the sprite
   * @param (number) y the vertical  previous position of the sprite
   */
  setPreviousPosition : function(x, y) {
    this.positionPrevious = {
      x : x,
      y : y
    }
  },

  /**
   * Moves the visual node by adding passed in parameters to the 
   * current position.
   * @param {number} x the value to add to the x position.
   * @param {number} y the value to add to the y position.
   */
  move : function(x, y) {
    this.position = {
      x : this.position.x + x,
      y : this.position.y + y
    };
  },

  /**
   * Updates visual node properities by checking to see if they have 
   * changed.
   * @param {number} elapsed time elapsed since last update call in 
   * milliseconds 
   */
  update : function(elapsed) {
    // call the super update
    this._super(elapsed);

    if(this._private.firstUpdate) {
      this._private.firstUpdate = false;
      this.invalidProperties = true;
    }

    if(this.position.x != this.positionPrevious.x ||
       this.position.y != this.positionPrevious.y) {
      this.positionPrevious = this.position;
      this.invalidProperties = true; 
    }

    if(this.size.width != this.sizePrevious.width ||
       this.size.height != this.sizePrevious.height) {
      this.sizePrevious = this.size;
      this.invalidProperties = true; 
    }

    if(this.anchor.x != this.anchorPrevious.x ||
       this.anchor.y != this.anchorPrevious.y) {
      this.anchorPrevious = this.anchor;
      this.invalidProperties = true;
    }

    if(this.scale.x != this.scalePrevious.x ||
       this.scale.y != this.scalePrevious.y) {
      this.scalePrevious = this.scale;
      this.invalidProperties = true;
    }

    if(this.rotation != this.rotationPrevious) {
      this.rotationPrevious = this.rotation;
      this.invalidProperties = true;
    }

    if(this.zindex != this.zindexPrevious) {
      this.zindexPrevious = this.zindex;
      this.shuffled = true;
      this.updated = true;
    }

    if(this.alpha != this.alphaPrevious) {
      this.alphaPrevious = this.alpha;
      this.updated = true;
    }

    if(this.visible != this.visiblePrevious) {
      this.visiblePrevious = this.visible;
      this.updated = true;
    }

    if(this.invalidProperties) {
      this.calculateProperties();
      this.updated = true; 
    }
  },

  /**
   * Draws this visual node to passed in context. This is draw the canvas
   * for this visual node on the context applying rotation, scale, and
   * alpha.
   * @param {CanvasRenderingContext2D} ctx the context in which to draw 
   * visual on
   */
  draw : function(ctx) {
    if(PFPlay.DEBUG) {
      console.log('visual node draw');
    }

    ctx.save();

    if(PFPlay.DEBUG) {
      ctx.save();
      ctx.fillStyle = "#CCDE42";
      ctx.beginPath();
      ctx.arc(
        this.positionTopLeft.x + this.canvas.width / 2, 
        this.positionTopLeft.y + this.canvas.height / 2, 
        3, 0, Math.PI * 2, true
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } 

    if(PFPlay.DEBUG) {
      ctx.strokeStyle = "#0022FF";
      ctx.strokeRect(
        this.positionTopLeft.x, this.positionTopLeft.y, 
        this.canvas.width, this.canvas.height
      );
    }

    // apply the alpha for this visual node
    ctx.globalAlpha = this.alpha / 100;

    // apply the rotation if needed
    if(this.rotation > 0) {
      var rotationX = this.positionTopLeft.x + 
                      this.size.width * this.scale.x / 2;
      var rotationY = this.positionTopLeft.y + 
                      this.size.height * this.scale.y / 2;

      ctx.translate(rotationX, rotationY);
      ctx.rotate((Math.PI * (this.rotation % 360)) / 180);
      ctx.translate(-rotationX, -rotationY);
    }

    // apply the scale
    ctx.scale(this.scale.x, this.scale.y);

    // draw the canvas
    ctx.drawImage(
      this.canvas, 
      this.positionTopLeft.x / this.scale.x, 
      this.positionTopLeft.y / this.scale.y
    );

    if(PFPlay.DEBUG) {
      ctx.strokeStyle = "#22FF33";
      ctx.strokeRect(
        this.positionTopLeft.x / this.scale.x, 
        this.positionTopLeft.y / this.scale.y,
        this.canvas.width, 
        this.canvas.height
      );
    }  
    ctx.restore();

    if(PFPlay.DEBUG) {
      ctx.save();
      ctx.fillStyle = "#FF3300";
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, 3, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    this.updated = false;
  },

  /**
   * Calculates new anchor radius and angle based on the size of the 
   * visual node and anchor position. It will then calculate a new top left
   * position for this node by calculating canvas width and height based on
   * the rotation of this node and position. Lastly, it sets the 
   * width and height of this node's canvas.
   */
  calculateProperties : function() {

    // calculate new anchor radius based on size and scale
    var sw = this.size.width;
    var sh = this.size.height;
    var sx = sw / 2, sy = sh / 2;
    var ix = this.anchor.x * sw, iy = this.anchor.y * sh;
    var dx = ix - sx, dy = iy - sy;
    this.anchorRadius = Math.sqrt(dx * dx + dy * dy);
    this.anchorAngle = Math.atan2(dy, dx) * 180 / Math.PI - 90;
    if(isNaN(this.anchorAngle)) {
     this.anchorAngle = 0;
    }

    // save previous top left
    this.positionTopLeftPrevious = this.positionTopLeft;

    var ox = this.size.width * this.scale.x / 2;
    var oy = this.size.height * this.scale.y / 2;
    var xpos = this.position.x - 
               Math.sin(Math.PI * -(this.rotation + this.anchorAngle) / 180) * 
               this.anchorRadius - ox;
    var ypos = this.position.y - 
               Math.cos(Math.PI * -(this.rotation + this.anchorAngle) / 180) * 
               this.anchorRadius - oy;
    
    this.positionTopLeft = {
      x : xpos, 
      y : ypos
    };

    // update the canvas element
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;

    // update the bounds
    this.boundsPrevious = this.bounds;
    this.bounds = {
      x : this.positionTopLeft.x,
      y : this.positionTopLeft.y,
      width : this.size.width * this.scale.x,
      height : this.size.height * this.scale.y
    };

    this.invalidProperties = false;
  }
});