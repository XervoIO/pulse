/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Layers are the heart of the engine, as they are base canvas for drawing
 * objects. Tney are literally a collection of sprites that are drawn within
 * a specific area. A collection of layers make up each scene.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the node
 * @config {size} [size] initial size, width and height, to use for the layer
 * @config (number) [x] the horizontal position of the layer, relative to the
 * scene bounds.
 * @config {number} [y] the vertical position of the layer, relative to the
 * scene.
 * @author PFP
 * @class The layer object.
 * @augments pulse.Visual
 * @copyright 2012 Modulus
 */
pulse.Layer = pulse.Visual.extend(
/** @lends pulse.Layer.prototype */
{

  /**
   * Event rose when mouse button is pressed down while pointer is over
   * this layer.
   * @name pulse.Layer#mousedown
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse button is released while pointer is over this layer.
   * @name pulse.Layer#mouseup
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse button is clicked while pointer is over this layer.
   * @name pulse.Layer#click
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse pointer enters this layer.
   * @name pulse.Layer#mouseover
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse leaves this layer.
   * @name pulse.Layer#mouseout
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse is moved while pointer is over this layer.
   * @name pulse.Layer#mousemove
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse wheel is scrolled while pointer is over this layer.
   * @name pulse.Layer#mousewheel
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when the user presses down on the node.
   * @name pulse.Layer#touchstart
   * @event
   * @param {pulse.TouchEvent} evt The touch event for dropped node.
   */

  /**
   * Event rose when the user scrolls while tapping on the node.
   * @name pulse.Layer#touchmove
   * @event
   * @param {pulse.TouchEvent} evt The touch event for dropped node.
   */

  /**
   * Event rose when the user releases their touch on the node.
   * @name pulse.Layer#touchend
   * @event
   * @param {pulse.TouchEvent} evt The touch event for dropped node.
   */

  /** @constructs */
  init : function(params) {

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Layer',
      'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    // Call the base constructor.
    this._super(params);

    params = pulse.util.checkParams(params, {
      x : 0,
      y : 0,
      size: {width: 0, height: 0}
    });

    this.position.x = params.x;
    this.position.y = params.y;

    this.size = params.size;

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;

    this.canvas.style.position = 'absolute';

    /**
     * Associative array (object) of the nodes in this layer.
     * @type {object}
     */
    this.objects = {};

    /**
     * The ordered keys of the child nodes.
     * @type {array}
     */
    this._private.orderedKeys = [];

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Layer',
      'init',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Adds a node to this layer.
   * @param {object} obj the object to add
   */
  addNode : function(obj) {
    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Layer',
      'addNode',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);


    if(obj instanceof pulse.Visual) {
      // z-index was not set, set it to the number of items + 1.
      if(isNaN(obj.zindex)) {
        obj.zindex = this._private.orderedKeys.length + 1;
      }

      if(!this.objects.hasOwnProperty(obj.name)) {
        this.objects[obj.name] = obj;
        obj.parent = this;
        obj.updated = true;
        this._private.orderedKeys = pulse.util.getOrderedKeys(this.objects);
      } else {
        pulse.error.DuplicateName(obj.name);
      }
    }

    pulse.plugins.invoke(
      'pulse.Layer',
      'addNode',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Removes a node from this layer.
   * @param {string} name the name of the node to remove
   */
  removeNode : function(name) {
    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Layer',
      'removeNode',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    var spriteName = name;
    if(name instanceof pulse.Visual) {
      spriteName = name.name;
    }

    if(this.objects.hasOwnProperty(spriteName)) {
      if(this.objects[spriteName] instanceof pulse.Visual) {
        var clear = this.objects[spriteName].boundsPrevious;
        this._private.context.clearRect(
          clear.x, clear.y,
          clear.width, clear.height
        );
      }
      this.objects[spriteName].parent = null;
      delete this.objects[spriteName];
    }

    pulse.plugins.invoke(
      'pulse.Layer',
      'removeNode',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Returns the node with the given name.
   * @param {string} name the name of the sprite to return.
   * @return {object} the node by name
   */
  getNode : function(name) {
    return this.objects[name];
  },

  /**
   * Get child nodes based on the type
   * @param {object} type the type of nodes to retrieve
   * @return {object} associative array of objects
   */
  getNodesByType : function(type) {
    var ret = {};

    for(var o in this.objects) {
      if(this.objects[o] instanceof type) {
        ret[o] = this.objects[o];
      }
    }

    return ret;
  },

  /**
   * Updates layer's child nodes.
   * @param {number} elapsed time elapsed since last update call in
   * milliseconds
   */
  update : function(elapsed) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Layer.PLUGIN_TYPE,
      pulse.Layer.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    var reorder = false;

    for(var s in this.objects) {
      if(this.objects[s] instanceof pulse.Visual) {
        if(this.objects[s].shuffled === true) {
          this.objects[s].shuffled = false;
          reorder = true;
        }

        this.objects[s].update(elapsed);

        // If the objects needs redrawn, mark the layer as needing redrawn.
        if(this.objects[s].updated) {
          this.updated = true;
        }
      }
    }

    if(reorder) {
      this._private.orderedKeys = pulse.util.getOrderedKeys(this.objects);
    }

    this._super(elapsed);

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Layer.PLUGIN_TYPE,
      pulse.Layer.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Draws all the visual nodes to the layer's canvas. Then draw's this layer
   * to the passed in context.
   * @param {CanvasRenderingContext2D} ctx the context in which to draw this
   * canvas on
   */
  draw : function(ctx) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Layer.PLUGIN_TYPE,
      pulse.Layer.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    var isDirty = false;

    // Do any sprites need updated?
    for(var s in this.objects) {
      if(this.objects[s].updated) {
        isDirty = true;
        break;
      }
    }

    // If anything needs updated - just update everything.
    if(isDirty) {
      var engine = this.parent;
      while(engine !== null && !(engine instanceof pulse.Engine)) {
        engine = engine.parent;
      }

      // Something strange happened and this object does not have
      // a pulse.Engine as a parent.  Just skip the draw.
      if(engine === null) {
        return;
      }

      this._private.context.clearRect(-this.positionTopLeft.x, -this.positionTopLeft.y, engine.size.width, engine.size.height);

      for(var ok = 0; ok < this._private.orderedKeys.length; ok++) {

        var obj = this.objects[this._private.orderedKeys[ok]];

        if(obj instanceof pulse.Visual) {
          if(obj.visible) {
            obj.draw(this._private.context);
          } else {
            obj.updated = false;
          }
        }
      }
    }

    this._super(ctx);

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Layer.PLUGIN_TYPE,
      pulse.Layer.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /*
   * Determins if a point, in world coordinates, lies within the layer.
   * @param {object} point the x and y coordinates of the point.
   */
  pointInBounds : function(point) {
    return point.x > this.bounds.x &&
      point.x < (this.bounds.x + this.bounds.width) &&
      point.y > this.bounds.y &&
      point.y < (this.bounds.y + this.bounds.height);
  },

  /**
   * Handles all events sent to this layer. It will check to see if any of the
   * child sprites need to be notified about the event. If so it will pass it
   * to them.
   * @param {string} type the type of event raised
   * @param {object} evt the event object with properties on the event
   */
  eventsCallback : function(type, evt) {
    if(typeof evt === 'undefined' || typeof evt.position === 'undefined') {
      return;
    }

    evt.parent.x = evt.position.x;
    evt.parent.y = evt.position.y;

    var sprites = this.getNodesByType(pulse.Sprite);
    var sprite;
    for(var s in sprites) {
      sprite = sprites[s];
      if(!sprite.visible) {
        continue;
      }

      if(pulse.events[type] === 'mouse' || pulse.events[type] === 'touch') {

        var sBounds = sprite.bounds;

        evt.position.x = evt.parent.x - sBounds.x;
        evt.position.y = evt.parent.y - sBounds.y;
        evt.sender = sprite;

        if(sprite.handleAllEvents ||
           sprite.inCurrentBounds(evt.parent.x, evt.parent.y)) {

          if(sprite.inCurrentBounds(evt.parent.x, evt.parent.y) &&
             sprite.mousein === false) {
            sprite.mousein = true;
            sprite.events.raiseEvent('mouseover', evt);
          }

          sprite.events.raiseEvent(type, evt);
        }

        if(!sprite.inCurrentBounds(evt.parent.x, evt.parent.y) &&
           sprite.mousein === true) {
          sprite.mousein = false;
          sprite.events.raiseEvent('mouseout', evt);
        }

        // handle dragged objects
        if(sprite.dropAcceptEnabled) {
          for(var id in pulse.EventManager.DraggedItems) {
            var obj = pulse.EventManager.DraggedItems[id];
            // check if object is inside sprite
            if(sprite.inCurrentBounds(evt.parent.x, evt.parent.y)) {
              // if object overlapped check to see if sprite already knows
              // about it
              evt.target = obj;
              if(!sprite.draggedOverItems[id]) {
                sprite.draggedOverItems[id] = obj;

                // TODO: look for a better way than this
                obj.events.bind('dragdrop', sprite.itemDroppedCallback);

                // Raise drag entered event
                sprite.events.raiseEvent('dragenter', evt);
              } else {
                evt.sender = sprite;
                sprite.events.raiseEvent('dragover', evt);
              }
            } else if(sprite.draggedOverItems[id]) {
              delete sprite.draggedOverItems[id];
              evt.target = obj;

              // TODO: look for a better solution than dynamic functions
              obj.events.unbindFunction('dragdrop', sprite.itemDroppedCallback);

              // Raise drag exited event
              sprite.events.raiseEvent('dragexit', evt);
            }
          }
        }
      } else {
        evt.sender = sprite;
        sprite.events.raiseEvent(type, evt);
      }
    }
  }
});

pulse.Layer.PLUGIN_TYPE = "pulse.Layer";
pulse.Layer.PLUGIN_DRAW = "draw";
pulse.Layer.PLUGIN_UPDATE = "update";