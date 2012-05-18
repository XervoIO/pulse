/**
 * Timer class that handles tracking time between events.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the timer
 * @class The debug timer class
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.Timer = PClass.extend(
/** @lends pulse.debug.Timer.prototype */
{
  /** @constructs */
  init : function(params) {

    params = pulse.util.checkParams(params, {
      name : "Timer" + pulse.debug.Timer.timerIdx++
    });

    /**
     * The name of the timer.
     * @type {string}
     */
    this.name = params.name;

    /**
     * The current time of the timer in milliseconds.
     * @type {number}
     */
    this.timeCurrent = null;

    /**
     * Array of marks in the timer by elapsed (in milliseconds).
     * @type {array}
     */
    this.marks = [];

    /**
     * Max number of marks to keep.
     * @type {number}
     */
    this.marksMax = 300;

    /**
     * Current marked elapsed time. Updated when a new mark is created.
     * @type {number}
     */
    this.markCurrent = -1;
  },

  /**
   * Starts the timer.
   */
  start : function() {
    this.timeCurrent = new Date().getTime();
  },

  /**
   * Marks the current time elapsed since last mark or start.
   */
  mark : function () {
    var now = new Date().getTime();
    if(this.marks.length >= this.marksMax) {
      this.marks.shift();
    }
    this.markCurrent = now - this.timeCurrent;
    this.marks.push(this.markCurrent);
    this.timeCurrent = now;
  }
});

// Static index that's incremented whenever a timer is created.
// Used for uniquely naming timers if a name is not specified.
pulse.debug.Timer.timerIdx = 0;