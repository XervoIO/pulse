/**
 * The base class for actions.
 * @class
 */
PFPlay.Action = PFPlay.Node.extend({
  /**
   * Initilization function
   * @param {PFPlay.Node} target for the action to run against
   */ 
  init: function(target) {
    this.super();

    this.target = target;
    this.complete = false;
  },

  /**
   * The target node for the action.
   * @type {PFPlay.Node} 
   */
  target: null,

  /**
   * Whether the action is completed or not.
   * @type {boolean}
   */
  complete: false,

  /**
   * Starts the action.
   */
  start: function() {
    if(PFPlay.DEBUG) {
      console.log('action started');
    }
  },

  /**
   * Starts the action.
   */
  stop: function() {
    if(PFPlay.DEBUG) {
      console.log('action stopped');
    }
  }
});