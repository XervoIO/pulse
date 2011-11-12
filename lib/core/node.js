/**
 * The base type for all objects added to the world.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the node
 * @class The base node object.
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

PFPlay.Node = PClass.extend(
/** @lends PFPlay.Node.prototype */
{
  /** @constructs */
  init: function(params) {

    params = PFPlay.util.checkParams(params, {
      name : "Node" + PFPlay.Node.nodeIdx++
    });

    /**
     * The name of the node.
     * @type {string}
     */
    this.name = params.name;

    /** 
     * @private
     * Private properties of the node. Should not need or use these.
     * @type {object}
     */
    this._private = { };
  },

  /**
   * Update function called on each loop in the engine
   * @param {number} elapsed the elapsed time since last call in 
   * milliseconds
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
