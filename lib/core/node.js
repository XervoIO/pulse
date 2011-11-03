/**
 * The base type for all objects added to the world.
 * @class
 */
PFPlay.Node = Class.extend({
   init: function() {
      // Default the name to something unique.
      this.name = "Node" + PFPlay.Node.nodeIdx++;
   }
});

/**
 * The name of the node.
 * @type {string}
 */
PFPlay.Node.prototype.name = null;

// Static index that's incremented whenever a node is created.
// Used for uniquely naming nodes if a name is not specified.
PFPlay.Node.nodeIdx = 0;
