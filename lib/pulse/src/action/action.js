/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * The base class for actions.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {pulse.Sprite} target the sprite for the action to be performed on
 * @config {string} [name] name of the node
 * @class base action
 * @augments pulse.Node
 * @author PFP
 * @copyright 2012 Modulus
 */
pulse.Action = pulse.Node.extend(
/** @lends pulse.Action.prototype */
{
  /**
   * Event rose when action has completed.
   * @name pulse.Action#complete
   * @event
   * @param {object} data Object with action that rose the event.
   * @config {pulse.Action} action The action that rose the event.
   */

  /**
   * Initilization function
   * @param {object} params for this action must include target
   * @constructs
   */
  init: function(params) {
    this._super(params);

    if(params.target === '') {
      throw "Target must be included for action.";
    }

    /**
     * The target node for the action.
     * @type {pulse.Node}
     */
    this.target = params.target;

    /**
     * Whether this action is currently running or not.
     * @type {boolean}
     */
    this.isRunning = false;

    /**
     * Whether this action is currently paused or not.
     * @type {boolean}
     */
    this.isPaused = false;

    /**
     * Whether this action is completed or not.
     * @type {boolean}
     */
    this.isComplete = false;

    /**
     * Event manager for action. Used to raise events such as complete.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager();
  },

  /**
   * Starts the action.
   */
  start: function() {
    if(pulse.DEBUG) {
      console.log('action started');
    }
    if(this.target.runningActions) {
      this.target.runningActions[this.name] = this;
    }
    this.isComplete = false;
    this.isRunning = true;
    this.isPaused = false;
  },

  /**
   * Pauses the action.
   */
  pause: function() {
    if(pulse.DEBUG) {
      console.log('action paused');
    }
    this.isRunning = false;
    this.isPaused = true;
  },

  /**
   * Stops the action.
   */
  stop: function() {
    if(pulse.DEBUG) {
      console.log('action stopped');
    }
    if(this.target.runningActions) {
      delete this.target.runningActions[this.name];
    }
    this.isRunning = false;
    this.isPaused = false;
  },

  /**
   * Called when the action is complete.
   */
  complete: function() {
    if(pulse.DEBUG) {
      console.log('action complete');
    }
    if(this.target.runningActions) {
      delete this.target.runningActions[this.name];
    }
    this.isRunning = false;
    this.isComplete = true;
    this.events.raiseEvent('complete', {action : this});
  }
});