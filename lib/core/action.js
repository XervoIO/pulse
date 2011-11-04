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

    /**
     * The target node for the action.
     * @type {PFPlay.Node} 
     */
    this.target = target;

    /**
     * Whether the action is completed or not.
     * @type {boolean}
     */
    this.complete = false;

    /**
     * Event manager for action. Used to raise events such as complete.
     * @type {PFPlay.EventManager}
     */
    this.events = new PFPlay.EventManager();
  },

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