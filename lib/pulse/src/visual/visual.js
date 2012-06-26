/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * The base type for all visual elements added to the world.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the visual node
 * @author PFP
 * @class visual node
 * @augments pulse.Node
 * @copyright 2012 Modulus
 */
pulse.Visual = pulse.Node.extend(
/** @lends pulse.Visual.prototype */
{
  /** @constructs */
  init : function(params) {

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Visual',
      'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

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
    this.zindex = Number.NaN;

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
     * Whether the shadow this visual is enabled.
     * @type {boolean}
     */
    this.shadowEnabled = false;

    /**
     * The previous state of shadow enabled.
     * @type {boolean}
     */
    this.shadowEnabledPrevious = false;

    /**
     * The x offset for the shadow for this visual.
     * @type {number}
     */
    this.shadowOffsetX = 2;

    /**
     * The y offset for the shadow for this visual.
     * @type {number}
     */
    this.shadowOffsetY = 2;

    /**
     * The shadow blur value for this visual's shadow if enabled.
     * @type {number}
     */
    this.shadowBlur = 2;

    /**
     * The shadow color for this visual's shadow, if enabled.
     * @type {string}
     */
    this.shadowColor = "rgba(0, 0, 0, 0.5)";

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
     * Object to act as associative array of the actions for this visual.
     * @type {object}
     */
    this.actions = {};

    /**
     * Actions being run on this visual at this time.
     * @type {object}
     */
    this.runningActions = {};

    /**
     * This signifies whether the object needs to be redrawn on next draw phase.
     * @type {boolean}
     */
    this.updated = true;

    /**
     * Event manager for this visual, handles passing events down to it's
     * children.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager({
      owner : this,
      masterCallback : this.eventsCallback
    });

    /**
     * Whether this visual has the mouse pointer over it.
     * @type {boolean}
     */
    this.mousein = false;

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Visual',
      'init',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Moves the visual node by adding passed in parameters to the
   * current position.
   * @param {number} x the value to add to the x position.
   * @param {number} y the value to add to the y position.
   */
  move : function(x, y) {
    this.position.x += x;
    this.position.y += y;
  },

  /**
   * Returns an animation from the collection by name.
   * @param {string} name The name of the action to return.
   * @return {object} the action.
   */
  getAction : function(name) {
    return this.actions[name];
  },

  /**
   * Starts and returns an action. Setting the target of the action to
   * this visual.
   * @param {string} name The name of the action to start
   * @param {rect} [oframe] original frame to return to
   * @return {pulse.Action} The action that was started
   */
  runAction : function(name, oframe) {
    oframe = oframe || null;
    var action = this.getAction(name);
    action.target = this;
    action.start(oframe);
    return action;
  },

  /**
   * Adds an action to this visual.
   * @param {pulse.Action} action the action to be added to this visual
   */
  addAction : function(action) {
    action.target = this;

    this.actions[action.name] = action;
  },

  /**
   * Updates visual node properities by checking to see if they have
   * changed.
   * @param {number} elapsed time elapsed since last update call in
   * milliseconds
   */
  update : function(elapsed) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Visual.PLUGIN_TYPE,
      pulse.Visual.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    // call the super update
    this._super(elapsed);

    for(var n in this.runningActions) {
      this.runningActions[n].update(elapsed);
    }

    if(this._private.firstUpdate) {
      this._private.firstUpdate = false;
      this.invalidProperties = true;
    }

    if(this.position.x !== this.positionPrevious.x ||
       this.position.y !== this.positionPrevious.y) {
      this.positionPrevious.x = this.position.x;
      this.positionPrevious.y = this.position.y;
      this.invalidProperties = true;
    }

    if(this.size.width !== this.sizePrevious.width ||
       this.size.height !== this.sizePrevious.height) {
      this.sizePrevious.width = this.size.width;
      this.sizePrevious.height = this.size.height;
      this.invalidProperties = true;
    }

    if(this.anchor.x !== this.anchorPrevious.x ||
       this.anchor.y !== this.anchorPrevious.y) {
      this.anchorPrevious.x = this.anchor.x;
      this.anchorPrevious.y = this.anchor.y;
      this.invalidProperties = true;
    }

    if(this.scale.x !== this.scalePrevious.x ||
       this.scale.y !== this.scalePrevious.y) {
      this.scalePrevious.x = this.scale.x;
      this.scalePrevious.y = this.scale.y;
      this.invalidProperties = true;
    }

    if(this.rotation !== this.rotationPrevious) {
      this.rotationPrevious = this.rotation;
      this.invalidProperties = true;
    }

    if(this.zindex !== this.zindexPrevious) {
      this.zindexPrevious = this.zindex;
      this.shuffled = true;
      this.updated = true;
    }

    if(this.alpha !== this.alphaPrevious) {
      this.alphaPrevious = this.alpha;
      this.updated = true;
    }

    if(this.visible !== this.visiblePrevious) {
      this.visiblePrevious = this.visible;
      this.updated = true;
    }

    if(this.shadowEnabled !== this.shadowEnabledPrevious) {
      this.shadowEnabledPrevious = this.shadowEnabled;
      this.updated = true;
    }

    if(this.invalidProperties) {
      this.calculateProperties();
      this.updated = true;
    }

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Visual.PLUGIN_TYPE,
      pulse.Visual.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Draws this visual node to passed in context. This is draw the canvas
   * for this visual node on the context applying rotation, scale, and
   * alpha.
   * @param {CanvasRenderingContext2D} ctx the context in which to draw
   * visual on
   */
  draw : function(ctx) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Visual.PLUGIN_TYPE,
      pulse.Visual.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    if(this.canvas.width === 0 || this.canvas.height === 0) {
      return;
    }

    ctx.save();

    // apply the alpha for this visual node
    ctx.globalAlpha = this.alpha / 100;

    // apply the rotation if needed
    if(this.rotation !== 0) {
      var rotationX = this.positionTopLeft.x +
                      this.size.width * Math.abs(this.scale.x) / 2;
      var rotationY = this.positionTopLeft.y +
                      this.size.height * Math.abs(this.scale.y) / 2;

      ctx.translate(rotationX, rotationY);
      ctx.rotate((Math.PI * (this.rotation % 360)) / 180);
      ctx.translate(-rotationX, -rotationY);
    }

    // apply the scale
    ctx.scale(this.scale.x, this.scale.y);

    var px = this.positionTopLeft.x / this.scale.x;
    if(this.scale.x < 1) {
      px -= this.size.width;
    }
    var py = this.positionTopLeft.y / this.scale.y;
    if(this.scale.y < 1) {
      py -= this.size.height;
    }

    if(this.shadowEnabled) {
      ctx.shadowOffsetX = this.shadowOffsetX;
      ctx.shadowOffsetY = this.shadowOffsetY;
      ctx.shadowBlur = this.shadowBlur;
      ctx.shadowColor = this.shadowColor;
    }

    // draw the canvas
    ctx.drawImage(
      this.canvas,
      px,
      py
    );

    ctx.restore();

    this.updated = false;

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Visual.PLUGIN_TYPE,
      pulse.Visual.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
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

    var ox = this.size.width * Math.abs(this.scale.x) / 2;
    var oy = this.size.height * Math.abs(this.scale.y) / 2;
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
    if(this.canvas.width !== this.size.width) {
      this.canvas.width = this.size.width;
    }
    if(this.canvas.height !== this.size.height) {
      this.canvas.height = this.size.height;
    }

    // update the bounds
    this.boundsPrevious = this.bounds;
    this.bounds = {
      x : this.positionTopLeft.x,
      y : this.positionTopLeft.y,
      width : this.size.width * Math.abs(this.scale.x),
      height : this.size.height * Math.abs(this.scale.y)
    };

    this.invalidProperties = false;
  },

  /**
   * Convenience function that will bind a callback to an event type.
   * @param {string} type the event type to bind
   * @param {function} callback the function callback to bind to the event
   */
  on : function (type, callback) {
    this.events.bind(type, callback);
  },

  /**
   * Handles all events sent to this visual object. This base callback is
   * meant to be overridden and does nothing by default.
   * @param {string} type the type of event raised
   * @param {object} evt the event object with properties on the event
   */
  eventsCallback : function(type, evt) {
    //Nothing by default
  }
});

pulse.Visual.PLUGIN_TYPE = "pulse.Visual";
pulse.Visual.PLUGIN_DRAW = "draw";
pulse.Visual.PLUGIN_UPDATE = "update";