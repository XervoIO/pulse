/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
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
 * @augments PFPlay.Visual
 */

PFPlay.Layer = PFPlay.Visual.extend(
/** @lends PFPlay.Layer.prototype */
{
  /** @constructs */
  init : function(params) {
    
    // Call the base constructor.
    this._super(params);
    
    params = PFPlay.util.checkParams(params, {
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
     * Whether to use the default size or not. Default size is 640x480.
     * @type {boolean}
     */
    this.isDefaultSize = false;

    // checks for canvas size
    if(this.canvas.width < 1 || this.canvas.height < 1) {
      this.isDefaultSize = true;
    }
      
    /**
     * Associative array (object) of the nodes in this layer.
     * @type {object}
     */
    this.objects = {};

    /**
     * The ordered keys of the child nodes.
     * @type {array}
     */
    this._private.orderedKeys = new Array();

    /**
     * Event manager for this layer, handles passing events down to it's
     * children.
     * @type {PFPlay.EventManager}
     */
    this.events = new PFPlay.EventManager({
      owner : this,
      masterCallback : this.eventsCallback
    });
  },
  
  /**
   * Resizes the layer and underlying canvas.
   * @param {number} width the new width of the layer
   * @param {number} height the new height of the layer
   */
  resize : function(width, height) {
    this.size.width = width;
    this.size.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  },

  /** 
   * Adds a node to this layer.
   * @param {object} obj the object to add
   */
  addNode : function(obj) {
    if(obj instanceof PFPlay.Sprite) {
      if(!this.objects.hasOwnProperty(obj.name)) {
        this.objects[obj.name] = obj;
        this._private.orderedKeys = PFPlay.util.getOrderedKeys(this.objects);
      } else
        PFPlay.error.DuplicateName(obj.name);
    }
  },

  /**
   * Removes an object from the layer.
   * @param {string} name the name of the object to remove
   */
  removeObject : function(name) {
    if(this.objects.hasOwnProperty(name)) {
      if(this.objects[name] instanceof PFPlay.Sprite) {
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
      if(this.objects[o] instanceof type)
        ret[o] = this.objects[o];
    }

    return ret;
  },

  /**
   * Updates layer's child nodes.
   * @param {number} elapsed time elapsed since last update call in 
   * milliseconds 
   */
  update : function(elapsed) {
    this.updated = false;

    var reorder = false;

    for(var s in this.objects) {
      if(this.objects[s] instanceof PFPlay.Sprite) {
        if(this.objects[s].shuffled == true) {
          reorder = true;
        }

        this.objects[s].update(elapsed);
        this.updated = true;
      }
    }

    if(reorder) {
      this._private.orderedKeys = PFPlay.util.getOrderedKeys(this.objects);
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

      for(var o = 0; o < this._private.orderedKeys.length; o++) {

        var obj = this.objects[this._private.orderedKeys[o]];

        if(obj instanceof PFPlay.Sprite) {
          if(obj.visible) {
            obj.draw(this._private.context);
          }
        }
      }
    }
    
    this._super(ctx);
  },

  /**
   * Updates the position of the canvas for the layer based on the
   * top left position.
   */
  calculateProperties : function() {
    this._super();

    this.canvas.style.top = this.positionTopLeft.y + 'px';
    this.canvas.style.left = this.positionTopLeft.x + 'px';
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

    var sprites = this.getObjectsByType(PFPlay.Sprite);
    var sprite;
    for(var s in sprites) {
      sprite = sprites[s];
      if(PFPlay.events[type] == 'mouse') {
        var sBounds = sprite.bounds;

        evt.position.x = evt.parent.x - sBounds.x;
        evt.position.y = evt.parent.y - sBounds.y;

        if(sprite.handleAllEvents || 
           sprite.inCurrentBounds(evt.parent.x, evt.parent.y)) {
          sprite.events.raiseEvent(type, evt);
        }
        // handle dragged objects
        if(sprite.dropAcceptEnabled) {
          for(var id in PFPlay.EventManager.DraggedItems) {
            var obj = PFPlay.EventManager.DraggedItems[id];
            // check if object is inside sprite
            if(sprite.inCurrentBounds(evt.parent.x, evt.parent.y)) {
              // if object overlapped check to see if sprite already knows
              // about it
              evt.target = obj;
              if(!sprite.draggedOverItems[id]) {
                sprite.draggedOverItems[id] = obj;
                sprite.events.raiseEvent('dragenter', evt);
              } else {
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
        sprite.events.raiseEvent(type, evt);
      }
    }
  }
});