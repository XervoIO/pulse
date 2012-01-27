/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Copyright 2011 Paranoid Ferret Productions
 *
 * Scenes are collections of layers that the basis of all
 * things visual in the engine.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the node
 * @class scene class
 * @augments pulse.Node
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.Scene = pulse.Node.extend(
/** @lends pulse.Scene.prototype */
{
  /** @constructs */
  init : function(params) {

    // Call the super constructor
    this._super(params);

    /**
     * Associative array (object) of the layers for this scene.
     * @type {object}
     */
    this.layers = {};

    /**
     * @private
     * Associative array (object) actual canvases for the layers.
     * @type {object}
     */
    this._private.liveLayers = {};

    /**
     * @private
     * Array of the ordered keys for the layers.
     * @type {array}
     */
    this._private.orderedKeys = [];

    /**
     * @private
     * The default size for layers
     * @type {size}
     */
    this._private.defaultSize = {
      width : 0,
      height : 0
    };

    /**
     * Whether this scene is active.
     * @type {boolean}
     */
    this.active = false;

    /**
     * The event manager for this scene, handles all events.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager({
      owner : this,
      masterCallback : this.eventsCallback
    });
  },

  /**
   * Changes the default size of the scene. This will update all the
   * default layers sizes too.
   * @param {number} width the new default width
   * @param {number} height the new default height
   */
  setDefaultSize : function(width, height) {
    for(var l in this.layers)
    {
      if(this.layers[l].size.width < 1) {
        this.layers[l].size.width = width;
      }

      if(this.layers[l].size.height < 1) {
        this.layers[l].size.height = height;
      }
    }

    this._private.defaultSize = {width: width, height: height};
  },

  /**
   * Adds a new layer to this scene.
   * @param {pulse.Layer} layer to add
   * @param {number} zindex the zindex of the new layer
   */
  addLayer : function(layer, zindex) {
    if(layer instanceof pulse.Layer &&
       !this.layers.hasOwnProperty(layer.name))
    {
      if(typeof zindex == 'number') {
        layer.zindex = zindex;
      }

      if(layer.size.width < 1) {
        layer.size.width = this._private.defaultSize.width;
      }

      if(layer.size.height < 1) {
        layer.size.height = this._private.defaultSize.height;
      }

      this.layers[layer.name] = layer;
      this._private.orderedKeys = pulse.util.getOrderedKeys(this.layers);
    }
  },

  /**
   * Removes a layer from this scene by name.
   * @param {string} name the name of the layer to remove
   */
  removeLayer : function(name) {
    if(typeof name == 'string' && this.layers.hasOwnProperty(name)) {
      delete _layers[name];
    }
  },

  /**
   * Gets a layer from this scene by name.
   * @param {string} name the name of the layer to get
   */
  getLayer : function(name) {
    if(this.layers.hasOwnProperty(name)) {
      return this.layers[name];
    }
    return null;
  },

  /**
   * Gets a live canvas for a layer in this scene.
   * @param {string} name the name of the layer
   */
  getLiveLayer : function(name) {
    if(this.layers.hasOwnProperty(name)) {
      return this._private.liveLayers[name];
    }
    return null;
  },

  /**
   * Gets the container for this scene, a DOM div element.
   * @return {DOMElement} returns the div container for this scene
   */
  getSceneContainer : function() {
    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.id = this.name;

    for(var l = 0; l < this._private.orderedKeys.length; l++)
    {
      if(!this.layers[this._private.orderedKeys[l]]) {
        continue;
      }

      var layer = this.layers[this._private.orderedKeys[l]];

      var liveCanvas = document.createElement('canvas');
      liveCanvas.width = this._private.defaultSize.width;
      liveCanvas.height = this._private.defaultSize.height;
      liveCanvas.style.position = 'absolute';
      liveCanvas.id = 'live:' + layer.name;
      var ctx = liveCanvas.getContext('2d');

      this._private.liveLayers[layer.name] = { canvas: liveCanvas, context: ctx };

      container.appendChild(liveCanvas);
    }

    return container;
  },

  /**
   * Updates the layers and then draws them.
   * @param {number} elapsed time elapsed since last update call in
   * milliseconds
   */
  update : function(elapsed) {

    this._super(elapsed);

    var reorder = false;

    /** Reorder the layers, if necessary, before drawing */
    for(var l in this.layers)
    {
      if(this.layers[l].shuffled == true) {
        reorder = true;
      }
    }

    if(reorder == true) {
      this._private.orderedKeys = pulse.util.getOrderedKeys(this.layers);
    }

    // update layers
    for(var l in this.layers)
    {
      this.layers[l].update(elapsed);
    }

    // draw layers
    for(var o = 0; o < this._private.orderedKeys.length; o++) {
      var layer = this.layers[this._private.orderedKeys[o]];

      if(layer.updated) {
        var name = layer.name;
        var canvas = this._private.liveLayers[layer.name].canvas;
        var ctx = this._private.liveLayers[layer.name].context;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        layer.draw(ctx);
      }
    }
  },

  /**
   * Handles all events sent to this scene. It will check to see if any of the
   * events occur inside of one of it's layers and if so then passes the event
   * to that layer.
   * @param {string} type the type of event raised
   * @param {object} evt the event object with properties on the event
   */
  eventsCallback : function(type, evt) {
    for(var l in this.layers) {

      if(pulse.events[type] == 'mouse') {
        var lBounds = this.layers[l].bounds;
        if(this.layers[l].pointInBounds(evt.world))
        {
          // Adjust the event params based on the layer's position.
          evt.parent.x = evt.position.x;
          evt.parent.y = evt.position.y;
          evt.position.x = evt.world.x - lBounds.x;
          evt.position.y = evt.world.y - lBounds.y;

          evt.sender = this.layers[l];

          this.layers[l].events.raiseEvent(type, evt);
        }
      } else {
        evt.sender = this.layers[l];

        this.layers[l].events.raiseEvent(type, evt);
      }
    }
  }

});