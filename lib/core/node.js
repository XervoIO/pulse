/**
 * The base type for all objects added to the world.
 * @class
 */
PFPlay.Node = Class.extend({
  init: function() {
    // Default the name to something unique.
    this.name = "Node" + PFPlay.Node.nodeIdx++;

    /** 
     * Private properties of the visual node. Should not need or use these.
     * @type {object}
     */
    this._private = { };
  },

  /**
   * The name of the node.
   * @type {string}
   */
  name : null,

  /**
   * Update function called on each loop in the engine
   * @param {number} the elapsed time since last call in milliseconds
   */
  update : function(elapsed) {
    // Nothing is updated by default
    if(PFPlay.DEBUG) {
      console.log("node update");
    }
  }

});

// Static index that's incremented whenever a node is created.
// Used for uniquely naming nodes if a name is not specified.
PFPlay.Node.nodeIdx = 0;
