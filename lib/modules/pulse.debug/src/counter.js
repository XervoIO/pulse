/**
 * Counter class that handles tracks counting event occurances.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the timer
 * @class The debug counter class
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.Counter = PClass.extend(
/** @lends pulse.debug.Counter.prototype */
{
  /** @constructs */
  init : function(params) {
    params = pulse.util.checkParams(params, {
      name : "Counter" + pulse.debug.Counter.counterIdx++
    });

    /**
     * The name of the timer.
     * @type {string}
     */
    this.name = params.name;

    /**
     * Current count of this counter.
     * @type {number}
     */
    this.count = 0;
  },

  /**
   * Resets the counter.
   */
  reset : function() {
    this.count = 0;
  },

  /**
   * Increments the counter.
   */
  increment : function () {
    this.count++;
  },

  /**
   * Decrements the counter.
   */
  decrement : function () {
    this.count--;
  }
});

// Static index that's incremented whenever a timer is created.
// Used for uniquely naming timers if a name is not specified.
pulse.debug.Counter.counterIdx = 0;