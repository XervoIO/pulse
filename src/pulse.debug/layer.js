/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Layers are the heart of the engine, as they are base canvas for drawing
 * objects. Tney are literally a collection of sprites that are drawn within
 * a specific area. A collection of layers make up each scene. Debug version
 * adds node counting to nodes in layer.
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
 * @augments pulse.Layer
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.debug.Layer = pulse.Layer.extend(
/** @lends pulse.debug.Layer.prototype */
{
  /**
   * Adds a node to this layer.
   * @param {object} obj the object to add
   */
  addNode : function(obj) {
    var beforeCount = pulse.util.getLength(this.objects);

    this._super(obj);

    var afterCount = pulse.util.getLength(this.objects);
    var diff = afterCount - beforeCount;

    for (var i = 0; i < diff; i++) {
      if(pulse.DebugManager) {
        pulse.DebugManager.incrementNodes();
      }
    }
  },

  /**
   * Removes an object from the layer.
   * @param {string} name the name of the object to remove
   */
  removeObject : function(name) {
    var beforeCount = pulse.util.getLength(this.objects);

    this._super(name);

    var afterCount = pulse.util.getLength(this.objects);
    var diff = beforeCount - afterCount;

    for (var i = 0; i < diff; i++) {
      if(pulse.DebugManager) {
        pulse.DebugManager.decrementNodes();
      }
    }
  }
});