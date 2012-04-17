/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * copyright 2012 Paranoid Ferret Productions
 *
 * Scenes are collections of layers that the basis of all
 * things visual in the engine.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the node
 * @class scene class
 * @augments pulse.Node
 * @copyright 2012 Paranoid Ferret Productions
 */
pulse.Scene = pulse.Node.extend(
/** @lends pulse.Scene.prototype */
{
  /**
   * Event rose when mouse button is pressed down while this scene is active.
   * @name pulse.Scene#mousedown
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse button is released while this scene is active.
   * @name pulse.Scene#mouseup
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse button is clicked while this scene is active.
   * @name pulse.Scene#click
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse is moved while this scene is active.
   * @name pulse.Scene#mousemove
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when mouse wheel is scrolled while this scene is active.
   * @name pulse.Scene#mousemove
   * @event
   * @param {pulse.MouseEvent} evt The mouse event.
   */

  /**
   * Event rose when a key is pushed down while this scene is active.
   * @name pulse.Scene#keydown
   * @event
   * @param {pulse.Event} evt The keyboard event.
   */

  /**
   * Event rose when a key is released while this scene is active.
   * @name pulse.Scene#keyup
   * @event
   * @param {pulse.Event} evt The keyboard event.
   */

  /**
   * Event rose when a key is pressed while this scene is active.
   * @name pulse.Scene#keypress
   * @event
   * @param {pulse.Event} evt The keyboard event.
   */

  /** @constructs */
  init : function(params) {

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Scene',
      'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    // Call the super constructor
    this._super(params);

    /**
     * HTML element container for this scene, will hold the canvas element.
     * @type {HTMLElement}
     */
    this.container = null;

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

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Scene',
      'init',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
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
      if(typeof zindex === 'number') {
        layer.zindex = zindex;
      }

      var appendToEnd = false;

      // If the zindex was not set, default it to the number of items + 1.
      if(isNaN(layer.zindex)) {
        layer.zindex = this._private.orderedKeys.length + 1;
      }

      if(layer.zindex === this._private.orderedKeys.length + 1) {
        appendToEnd  = true;
      }

      if(layer.size.width < 1) {
        layer.size.width = this._private.defaultSize.width;
      }

      if(layer.size.height < 1) {
        layer.size.height = this._private.defaultSize.height;
      }

      this.layers[layer.name] = layer;
      this._private.orderedKeys = pulse.util.getOrderedKeys(this.layers);

      //If the scene is already active, add the layer to the container
      if(this.active === true) {
        this._private.liveLayers[layer.name] = this.getLiveCanvas(layer);

        if(appendToEnd === true) {
          this.container.appendChild(
            this._private.liveLayers[layer.name].canvas);
        } else {
          //If the layer is not the back layer, updated the canvas' positions
          this.updateLiveLayers();
        }
      }
    }
  },

  /**
   * Removes a layer from this scene by name.
   * @param {string} name the name of the layer to remove
   */
  removeLayer : function(name) {
    if(typeof name === 'string' && this.layers.hasOwnProperty(name)) {
      delete this.layers[name];
      delete this._private.liveLayers[name];
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
   * Gets a live canvas for the layer passed in.
   * @param {string} layer the layer to create the canvas/context for
   */
  getLiveCanvas : function(layer) {
    var liveCanvas = document.createElement('canvas');
    liveCanvas.width = this._private.defaultSize.width;
    liveCanvas.height = this._private.defaultSize.height;
    liveCanvas.style.position = 'absolute';
    liveCanvas.id = 'live:' + layer.name;
    var ctx = liveCanvas.getContext('2d');

    return { canvas: liveCanvas, context: ctx };
  },

  /**
   * Updates the scene's container with correctly ordered live canvases.
   */
  updateLiveLayers : function() {
    //Clear the container
    while (this.container.hasChildNodes()) {
      this.container.removeChild(this.container.lastChild);
    }

    for(var l = 0; l < this._private.orderedKeys.length; l++)
    {
      if(!this.layers[this._private.orderedKeys[l]]) {
        continue;
      }

      var layer = this.layers[this._private.orderedKeys[l]];

      //Check the layer size, setting it if necessary
      if(layer.size.width < 1) {
        layer.size.width = this._private.defaultSize.width;
      }

      if(layer.size.height < 1) {
        layer.size.height = this._private.defaultSize.height;
      }

      if(!this._private.liveLayers.hasOwnProperty(layer.name)) {
        this._private.liveLayers[layer.name] = this.getLiveCanvas(layer);
      }

      this.container.appendChild(this._private.liveLayers[layer.name].canvas);
    }
  },

  /**
   * Gets the container for this scene, a DOM div element.
   * @return {DOMElement} returns the div container for this scene
   */
  getSceneContainer : function() {
    if(!this.container) {
      this.container = document.createElement('div');
      this.container.style.position = 'absolute';
      this.container.id = this.name;

      this.updateLiveLayers();
    }

    return this.container;
  },

  /**
   * Updates the layers and then draws them.
   * @param {number} elapsed time elapsed since last update call in
   * milliseconds
   */
  update : function(elapsed) {

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Scene',
      'update',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    this._super(elapsed);

    var reorder = false;

    /** Reorder the layers, if necessary, before drawing */
    for(var l in this.layers)
    {
      if(this.layers[l].shuffled === true) {
        reorder = true;
      }
    }

    if(reorder === true) {
      this._private.orderedKeys = pulse.util.getOrderedKeys(this.layers);
    }

    // update layers
    for(var ul in this.layers)
    {
      this.layers[ul].update(elapsed);
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

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Scene',
      'update',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
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

      if(pulse.events[type] === 'mouse' || pulse.events[type] === 'touch') {
        var lBounds = this.layers[l].bounds;

        // Adjust the event params based on the layer's position.
        evt.parent.x = evt.position.x;
        evt.parent.y = evt.position.y;
        evt.position.x = evt.world.x - lBounds.x;
        evt.position.y = evt.world.y - lBounds.y;

        evt.sender = this.layers[l];

        if(this.layers[l].pointInBounds(evt.world))
        {
          if((type === 'mousemove' || type === 'touchmove') 
            && this.layers[l].mousein === false) {
            this.layers[l].mousein = true;
            this.layers[l].events.raiseEvent('mouseover', evt);
          }

          this.layers[l].events.raiseEvent(type, evt);
        } else {
         if(this.layers[l].mousein === true) {
           this.layers[l].mousein = false;
           this.layers[l].events.raiseEvent('mouseout', evt);
         }
        }
      } else {
        evt.sender = this.layers[l];

        this.layers[l].events.raiseEvent(type, evt);
      }
    }
  }

});