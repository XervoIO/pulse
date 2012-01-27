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
 * @config {number} [width] the width of the layer
 * @config {number} [height] the height of the layer
 * @config (number) [x] the horizontal position of the layer, relative to the
 * scene bounds.
 * @config {number} [y] the vertical position of the layer, relative to the
 * scene.
 * @author PFP
 * @class The layer object.
 * @augments pulse.Visual
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.Layer = pulse.Visual.extend(
/** @lends pulse.Layer.prototype */
{
  /** @constructs */
  init : function(params) {

    // Call the base constructor.
    this._super(params);

    params = pulse.util.checkParams(params, {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    });

    this.position.x = params.x;
    this.position.y = params.y;

    this.size.width = params.width;
    this.size.height = params.height;

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

    /**
     * Event manager for this layer, handles passing events down to it's
     * children.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager({
      owner : this,
      masterCallback : this.eventsCallback
    });
  },

  /**
   * Adds a node to this layer.
   * @param {object} obj the object to add
   */
  addNode : function(obj) {
    if(obj instanceof pulse.Visual) {
      if(!this.objects.hasOwnProperty(obj.name)) {
        this.objects[obj.name] = obj;
        this._private.orderedKeys = pulse.util.getOrderedKeys(this.objects);
      } else {
        pulse.error.DuplicateName(obj.name);
      }
    }
  },

  /**
   * Removes an object from the layer.
   * @param {string} name the name of the object to remove
   */
  removeObject : function(name) {
    if(this.objects.hasOwnProperty(name)) {
      if(this.objects[name] instanceof pulse.Sprite) {
        var clear = this.objects[name].boundsPrevious;
        this._private.context.clearRect(
          clear.x, clear.y,
          clear.width, clear.height
        );
      }
      delete this.objects[name];
    }
  },

  /**
   * Returns the sprite with the given name.
   * @param {string} name the name of the sprite to return.
   * @return {object} the node by name
   */
  getObject : function(name) {
    return this.objects[name];
  },

  /**
   * Get child nodes based on the type
   * @param {object} type the type of nodes to retrieve
   * @return {object} associative array of objects
   */
  getObjectsByType : function(type) {
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
    var reorder = false;

    for(var s in this.objects) {
      if(this.objects[s] instanceof pulse.Visual) {
        if(this.objects[s].shuffled === true) {
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
  },

  /**
   * Draws all the visual nodes to the layer's canvas. Then draw's this layer
   * to the passed in context.
   * @param {CanvasRenderingContext2D} ctx the context in which to draw this
   * canvas on
   */
  draw : function(ctx) {
    var isDirty = false;

    // Do any sprites need updated?
    for(var o in this.objects) {
      if(this.objects[o].updated) {
        isDirty = true;
        break;
      }
    }

    // If anything needs updated - just updated everything.
    if(isDirty) {
      this._private.context.clearRect(0, 0, this.size.width, this.size.height);

      for(var ok = 0; ok < this._private.orderedKeys.length; ok++) {

        var obj = this.objects[this._private.orderedKeys[ok]];

        if(obj instanceof pulse.Visual) {
          if(obj.visible) {
            obj.draw(this._private.context);
          }
        }
      }
    }

    this._super(ctx);
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
    evt.parent.x = evt.position.x;
    evt.parent.y = evt.position.y;

    var sprites = this.getObjectsByType(pulse.Sprite);
    var sprite;
    for(var s in sprites) {
      sprite = sprites[s];
      if(pulse.events[type] === 'mouse') {
        var sBounds = sprite.bounds;

        evt.position.x = evt.parent.x - sBounds.x;
        evt.position.y = evt.parent.y - sBounds.y;
        evt.sender = sprite;

        if(sprite.handleAllEvents ||
           sprite.inCurrentBounds(evt.parent.x, evt.parent.y)) {
          sprite.events.raiseEvent(type, evt);
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
                sprite.events.raiseEvent('dragenter', evt);
              } else {
                evt.sender = sprite;
                sprite.events.raiseEvent('dragover', evt);
              }
            } else if(sprite.draggedOverItems[id]) {
              delete sprite.draggedOverItems[id];
              evt.target = obj;
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