/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Sprites are the basic object for moving, animated graphics on
 * the screen. They have an image, the sprite sheet, which is a
 * collection of "frames" that can be played in succession to
 * produce an animation.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string|pulse.Texture} src the texture filename to use or a
 * pulse.Texture to use
 * @config {string} [name] name of the node
 * @config {size} [size] initial size width and height to use for the sprite
 * @author PFP
 * @class The sprite object.
 * @augments pulse.Visual
 * @copyright 2012 Modulus
 */
pulse.Sprite = pulse.Visual.extend(
/** @lends pulse.Sprite.prototype */
{
  /**
   * Event rose when mouse button is pressed down while pointer is over
   * this node.
   * @name pulse.Sprite#mousedown
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse button is released while pointer is over this node.
   * @name pulse.Sprite#mouseup
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse button is clicked while pointer is over this node.
   * @name pulse.Sprite#click
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

    /**
   * Event rose when mouse pointer enters this node.
   * @name pulse.Sprite#mouseover
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse leaves this node.
   * @name pulse.Sprite#mouseout
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse is moved while pointer is over this node.
   * @name pulse.Sprite#mousemove
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse wheel is scrolled while pointer is over this node.
   * @name pulse.Sprite#mousewheel
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when this node is starting to be dragged.
   * @name pulse.Sprite#dragstart
   * @event
   * @param {pulse.MouseEvent} evt The mouse event that started the drag.
   */

  /**
   * Event rose when this node is dropped after being dragged.
   * @name pulse.Sprite#dragdrop
   * @event
   * @param {pulse.MouseEvent} evt The mouse event that ended the drag.
   */

  /**
   * Event rose when a dragged node is just beginning to be on top of this
   * node. In order to recieve these events a node must have dropEnabled
   * set to true.
   * @name pulse.Sprite#dragenter
   * @event
   * @param {pulse.MouseEvent} evt The mouse event for the dragged node.
   */

  /**
   * Event rose when a dragged node is over top of this node. In order to
   * recieve these events a node must have dropEnabled set to true.
   * @name pulse.Sprite#dragover
   * @event
   * @param {pulse.MouseEvent} evt The mouse event for the dragged node.
   */

  /**
   * Event rose when a dragged node is no longer over top of this node. In
   * order to recieve these events a node must have dropEnabled set to true.
   * @name pulse.Sprite#dragexit
   * @event
   * @param {pulse.MouseEvent} evt The mouse event for the dragged node.
   */

  /**
   * Event rose when a node is dropped on top of this node. In order to
   * recieve these events a node must have dropEnabled set to true.
   * @name pulse.Sprite#itemdropped
   * @event
   * @param {pulse.MouseEvent} evt The mouse event for dropped node.
   * @config {pulse.Sprite} target The target is set to the node being dropped
   * upon.
   */

  /**
   * Event rose when the user presses down on the node.
   * @name pulse.Sprite#touchstart
   * @event
   * @param {pulse.TouchEvent} evt The touch event for dropped node.
   */

  /**
   * Event rose when the user scrolls while tapping on the node.
   * @name pulse.Sprite#touchmove
   * @event
   * @param {pulse.TouchEvent} evt The touch event for dropped node.
   */

  /**
   * Event rose when the user releases their touch on the node.
   * @name pulse.Sprite#touchend
   * @event
   * @param {pulse.TouchEvent} evt The touch event for dropped node.
   */

  /** @constructs */
  init: function(params) {
    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Sprite',
      'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    // Call the base constructor.
    this._super(params);

    /**
     * The texture being used for this sprite.
     * @type {pulse.Texture}
     */
    this.texture = null;

    /**
     * The previous texture being used for this sprite.
     * @type {pulse.Texture}
     */
    this.texturePrevious = null;

    /**
     * The current frame slice for this sprite.
     * @type {rect}
     */
    this.textureFrame = {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    };

    /**
     * The previous texture frame slice for this sprite.
     * @type {rect}
     */
    this.textureFramePrevious = {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    };

    /**
     * Whether the texture frame or texture has been updated.
     * @type {boolean}
     */
    this.textureUpdated = true;

    params = pulse.util.checkParams(params, {
      src: '',
      size : { }
    });

    this.size = params.size;

    //Create an image for the spritesheet
    if(typeof params.src === 'object') {
      this.texture = params.src;
    } else {
      this.texture = new pulse.Texture({
        'filename' : params.src
      });
    }

    /**
     * @private
     * Whether this sprite is being dragged or not.
     * @type {boolean}
     */
    this._private.isDragging = false;

    /**
     * @private
     * The current drag position of this sprite.
     * @type {point}
     */
    this._private.dragPos = false;

    /**
     * The type of hit testing to use.
     * @type {string}
     */
    this.hitTestType = pulse.Sprite.HIT_TEST_RECT;

    /**
     * The points to check against for checking if point is in bounds. If
     * rectangular points order is top left, bottom right. If convex
     * shape start in upper left and move clockwise.
     * @type {array}
     */
    this.hitTestPoints = null;

    /**
     * Determines if object can be drag and dropped
     * @type {boolean}
     */
    this.dragDropEnabled = false;

    /**
     * Determines if the object actually moves when being dragged and dropped
     * @type {boolean}
     */
    this.dragMoveEnabled = false;

    /**
     * Determines if object can be dropped on this object
     * @type {boolean}
     */
    this.dropAcceptEnabled = false;

    /**
     * The current items that are being dragged over this object
     * @type {object}
     */
    this.draggedOverItems = {};

    /**
     * Property that signifies if this sprite should handle all events.
     * @type {boolean}
     */
    this.handleAllEvents = false;

    // TODO: Hate this implementation of handling dropped items
    var self = this;
    /**
     * Item dropped callback
     */
    this.itemDroppedCallback = function(e) {
      e.target = self;
      self.events.raiseEvent('itemdropped', e);
    };

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Sprite',
      'init',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Returns true if the image for this sprite has been loaded
   * @return {boolean} Whether image has been loaded
   */
  loaded : function() {
    return this.texture.loaded();
  },

  /**
   * Adds an action to this sprite. The params passed in must either be
   * an Action or the constructor params for an AnimateAction.
   * See the AnimateAction object for more information.
   * @param {object} options for the new animation
   */
  addAction : function(params) {
    var newAction;

    if(params instanceof pulse.Action) {
      newAction = params;
      newAction.target = this;
    } else {
      //Create an animation option
      newAction = new pulse.AnimateAction({
        target : this,
        name : params.name,
        size : params.size,
        frames : params.frames,
        frameRate : params.frameRate,
        offset : params.offset
      });
    }

    newAction.bounds({
      x : this.texture.width(),
      y : this.texture.height()
    });

    this.actions[newAction.name] = newAction;
  },

  /**
   * Checks if the x and y position passed in is a point inside of this
   * sprite. This function will calculate the inclusion using one three
   * methods based on the hitTestType property on this object. If the type
   * is set to "rect" then will check the x and y against a rectangle of
   * either the 2 corners set in hitTestPoints or the bounds of this object
   * if there are no points set. The second type "convex" will be tested using
   * PNPOLY (Point Inclusion in Polygon Test) from W. Randolph Franklin (WRF).
   * See http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
   * for more information on the algorithm.
   * @param {number} x position to check
   * @param {number} y position to check
   * @return {boolean} true if point passed is inside this sprite
   */
  inCurrentBounds : function(x, y) {

    // transform x and y to local coordinate system
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

    if(this.hitTestType === pulse.Sprite.HIT_TEST_RECT) {
      if(this.hitTestPoints && this.hitTestPoints.length > 0) {
        // Check if the point is in set rectangle corners
        if(x >= this.hitTestPoints[0].x && x <= this.hitTestPoints[1].x &&
           y >= this.hitTestPoints[0].y && y <= this.hitTestPoints[1].y) {
          return true;
        }
      } else {
        // Check if point is in this object's bounds
        if(x >= 0 && x <= this.bounds.width &&
           y >= 0 && y <= this.bounds.height) {
          return true;
        }
      }
    } else if(this.hitTestType === pulse.Sprite.HIT_TEST_CONVEX) {
      // Make sure that there are verticies set and there are enough to create
      // a polygon
      if(this.hitTestPoints && this.hitTestPoints.length >= 3) {
        var pcount = this.hitTestPoints.length;
        var retval = false;
        var vert1 = {};
        var vert2 = {};
        // Check if point is in polygon
        for(var i = 0, j = pcount - 1; i < pcount; j = i++) {
          vert1 = this.hitTestPoints[i];
          vert2 = this.hitTestPoints[j];
          if(((vert1.y > y) != (vert2.y > y)) &&
             (x < (vert2.x - vert1.x) * (y - vert1.y) / (vert2.y - vert1.y) + vert1.x)) {
            retval = !retval;
          }
        }
        return retval;
      }
    }

    return false;
  },

  /**
   * Returns the current frame as a canvas object, ready to draw.
   * @return {object} the frame.
   */
  getCurrentFrame : function() {
    if(this.texture.percentLoaded < 100) {
      return;
    }

    var tw = this.texture.width();
    if(this.textureFrame.width !== 0) {
      tw = this.textureFrame.width;
    }

    var th = this.texture.height();
    if(this.textureFrame.height !== 0) {
      th = this.textureFrame.height;
    }

    return this.texture.slice(
      this.textureFrame.x,
      this.textureFrame.y,
      tw,
      th
    );
  },

  /**
   * Sprite's update function calculates the size based on current
   * image or animation and then calls the super update.
   * @param {number} time elapsed since last update call in milliseconds
   */
  update : function(elapsed) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Sprite.PLUGIN_TYPE,
      pulse.Sprite.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    if(this.texture !== this.texturePrevious) {
      this.texturePrevious = this.texture;
      this.textureUpdated = true;
      this.updated = true;
    }

    // not great code need to find a better spot to do this
    if(this.texture.percentLoaded === 100) {
      if(this.size === null) {
        this.size = { };
      }
      if(!this.size.width) {
        this.size.width = this.texture.width();
      }
      if(!this.size.height) {
        this.size.height = this.texture.height();
      }
    }

    if(this.textureFrame.x !== this.textureFramePrevious.x ||
       this.textureFrame.y !== this.textureFramePrevious.y ||
       this.textureFrame.width !== this.textureFramePrevious.width ||
       this.textureFrame.height !== this.textureFramePrevious.height) {
      this.textureFramePrevious.x = this.textureFrame.x;
      this.textureFramePrevious.y = this.textureFrame.y;
      this.textureFramePrevious.width = this.textureFrame.width;
      this.textureFramePrevious.height = this.textureFrame.height;
      this.textureUpdated = true;
      this.updated = true;
    }

    this._super(elapsed);

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Sprite.PLUGIN_TYPE,
      pulse.Sprite.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Draws this sprite to passed in context
   * @param {CanvasRenderingContext2D} ctx the context in which to draw this
   * visual on
   */
  draw : function(ctx) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Sprite.PLUGIN_TYPE,
      pulse.Sprite.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    // skip if we're not loaded
    if(this.texture.percentLoaded < 100 ||
       this.size.width === 0 ||
       this.size.height === 0) {
      return;
    }

    // Only redraw this canvas if the texture coords or texture changed.
    if(this.textureUpdated) {
      // Clear my canvas
      this._private.context.clearRect(
        0, 0,
        this.canvas.width, this.canvas.height
      );

      var slice = this.getCurrentFrame();

      // Draws the texture to this visual's canvas
      this._private.context.drawImage(
        slice,
        0, 0,
        this.size.width, this.size.height
      );

      this.textureUpdated = false;
    }


    this._super(ctx);

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Sprite.PLUGIN_TYPE,
      pulse.Sprite.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Sets the texture frame width and height.
   */
  calculateProperties : function() {
    this._super();
  },

  /**
   * Ends dragging for this sprite.
   * @param {HTMLEvent} evt the raw event from the browser
   */
  killDrag : function(evt) {
    if(this._private.isDragging) {
      this._private.isDragging = false;
      this.handleAllEvents = false;
      evt.sender = this;
      this.events.raiseEvent('dragdrop', evt);
      delete pulse.EventManager.DraggedItems['sprite:' + this.name];
    }
  },

  /**
   * Handles all events sent to this object. If event is mousedown then a
   * potential drag and drop action is handled.
   * @param {string} type the type of event raised
   * @param {object} evt the event object with properties on the event
   */
  eventsCallback : function(type, evt) {
    if(type === "mousedown" && this.dragDropEnabled) {
      this._private.isDragging = true;
      this._private.dragPos = {
        x : evt.world.x,
        y : evt.world.y
      };
      this.handleAllEvents = true;
      evt.sender = this;
      this.events.raiseEvent('dragstart', evt);
      pulse.EventManager.DraggedItems['sprite:' + this.name] = this;
    }
    if((type === "mousemove" || type === "mouseup") &&
       this._private.isDragging) {
      var posDiff = {
        x : evt.world.x - this._private.dragPos.x,
        y : evt.world.y - this._private.dragPos.y
      };
      if(this.dragMoveEnabled) {
        this.position = {
          x : this.position.x + posDiff.x,
          y : this.position.y + posDiff.y
        };
      }
      this._private.dragPos = {
        x : evt.world.x,
        y : evt.world.y
      };
    }

    if(type === "mouseup") {
      this.killDrag(evt);
    }

    if(type == 'mousemove') {
      this._private.mousein = true;
    }
  }
});

/**
 * Definition for hit test constant for rectangle checking.
 * @static
 * @type {string}
 */
pulse.Sprite.HIT_TEST_RECT = "rect";

/**
 * Definition for hit test constant for convex shape checking.
 * @static
 * @type {string}
 */
pulse.Sprite.HIT_TEST_CONVEX = "convex";

pulse.Sprite.PLUGIN_TYPE = "pulse.Sprite";
pulse.Sprite.PLUGIN_DRAW = "draw";
pulse.Sprite.PLUGIN_UPDATE = "update";