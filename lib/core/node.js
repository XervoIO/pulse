/**
 * The base type for all objects added to the world.
 * @class
 */
var Node = Class.extend({
   init: function() {
      // Default the name to something unique.
      this.name = "Node" + Node.nodeIdx++;
   }
});

/**
 * The name of the node.
 * @type {string}
 */
Node.prototype.name = null;

// Static index that's incremented whenever a node is created.
// Used for uniquely naming nodes if a name is not specified.
Node.nodeIdx = 0;
