/**
 * The base type for all visual elements added to the world.
 * @class
 */
PFPlay.Visual = PFPlay.Node.extend({
  init : function() {
    this._super();

    /** 
     * Signifies it's the first update for the visual node.
     * @type {boolean}
     */
    this._private.firstUpdate = true;
  },

  /** 
   * The current position of the visual node.
   * @type {point}
   */
  position : {
    x : 0,
    y : 0
  },

  /** 
   * The previous position of the visual node, previous position gets
   * updated in the update function.
   * @type {point}
   */
  positionPrevious : {
    x : 0,
    y : 0
  },

  /** 
   * The current size of the visual node.
   * @type {size}
   */
  size : {
    width : 0,
    height : 0
  },

  /** 
   * The previous size of the visual node, previous size gets
   * updated in the update function.
   * @type {size}
   */
  sizePrevious : {
    width : 0,
    height : 0
  },

  /**
   * The current position anchor of the visual node, the position on the visual
   * node sets the position of the anchor.
   * @type {point}
   */
  anchor : {
    x : 0.5,
    y : 0.5
  },

  /**
   * The previous position anchor of the visual node, previous anchor gets 
   * updated in the update function.
   * @type {point}
   */
  anchorPrevious : {
    x : 0.5,
    y : 0.5
  },

  /**
   * The radius from the center of the visual node to the anchor point.
   * @type {float}
   */
  anchorRadius : 0,

  /**
   * The angle of the anchor to the center of the visual node in degrees.
   * @type {float}
   */
  anchorAngle : 0,

  /** 
   * The current scale of the visual node.
   * @type {point}
   */
  scale : {
    x : 1.0,
    y : 1.0
  },

  /** 
   * The previous scale of the visual node, this is updated in the update
   * function.
   * @type {point}
   */
  scalePrevious : {
    x : 1.0,
    y : 1.0
  },

  /**
   * The rotation of the visual node, in degrees.
   * @type {number}
   */
  rotation : 0,

  /**
   * The previous rotation of the visual node, in degrees. This is updated in 
   * the update function.
   * @type {number}
   */
  rotationPrevious : 0,

  /**
   * The position of the upper left of the visual node based on the 
   * position and anchor.
   * @type {point}
   */
  positionTopLeft : {
    x : 0,
    y : 0
  },

  /**
   * The previous position of the upper left of the visual node, previous
   * top left gets updated in update function.
   * @type {point}
   */
  positionTopLeftPrevious : {
    x : 0,
    y : 0
  },

  /**
   * This signifies whether the visual node needs to have certain size 
   * properties recalculated.
   * @type {boolean}
   */
  invalidProperties : true,

  /**
   * The zindex of the visual node. Higher zindex means the visual object
   * is on top of lower zindex nodes.
   * @type {number}
   */
  zindex : 0,

  /**
   * The zindex of the visual node. Higher zindex means the visual object
   * is on top of lower zindex nodes.
   * @type {number}
   */
  zindexPrevious : 0,

  /**
   * This signifies that the visual node has changed sort order.
   * @type {boolean}
   */
  shuffled : false,

  /**
   * The alpha transparency of the visual from 0-100.
   * @type {number}
   */
  alpha : 100,

  /**
   * The previous alpha transparency of the visual from 0-100.
   * @type {number}
   */
  alphaPrevious : 100,

  /**
   * This signifies whether the visual node is visible at the time, if false
   * the node's draw function will not be called.
   * @type {boolean}
   */
  visible : true,

  /**
   * The previous state of visible, this value is updated in the update function.
   * @type {number}
   */
  visiblePrevious : true,

  /**
   * This signifies whether the object needs to be redrawn on next draw phase.
   * @type {boolean}
   */
  updated : true,

  /**
   * Updates visual node properities by checking to see if they have 
   * changed.
   * @param {number} time elapsed since last update call in milliseconds 
   */
  update : function(elapsed) {
    // call the super update
    this._super(elapsed);

    if(this._private.firstUpdate) {
      this._private.firstUpdate = false;
      this.invalidProperties = true;
    }

    this.updated = false;

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
   * Calculates the updated top left position and anchor radius.
   */
  calculateProperties : function() {

    // calculate new anchor radius based on size and scale
    var sw = this.size.width * this.scale.x;
    var sh = this.size.height * this.scale.y;
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

    // calculate the new top left
    var cw = sw * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + 
             sh * Math.abs(Math.sin(Math.PI * this.rotation / 180));
    var ch = sh * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + 
             sw * Math.abs(Math.sin(Math.PI * this.rotation / 180));

    var ox = cw / 2;
    var oy = ch / 2;
    var xpos = this.position.x - 
               Math.sin(Math.PI * -(this.rotation + this.anchorAngle) / 180) * 
               this.anchorRadius - ox;
    var ypos = this.position.y - 
               Math.cos(Math.PI * -(this.rotation + this.anchorAngle) / 180) * 
               this.anchorRadius - oy;
    
    this.positionTopLeft = {
      x: xpos, 
      y: ypos
    };

    this.invalidProperties = false;
  }
});