/**
 * Frame per second class that handles tracking frames per second
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the fps tracker
 * @class The debug fps class
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.FPS = pulse.debug.Timer.extend(
/** @lends pulse.debug.FPS.prototype */
{
  /** @constructs */
  init : function(params) {
    this._super(params);

    /**
     * The time that we started calculating frames per second.
     * @type {number}
     */
    this.timeStart = 0;

    /**
     * Number of frames recorded.
     * @type {number}
     */
    this.frames = 0;

    /**
     * Frames per second update interval. This is how often it will recalculate
     * the frames per second.
     * @type {number}
     */
    this.fpsUpdateInterval = 100;

    /**
     * Current number of frames per second.
     * @type {number}
     */
    this.fps = 0;

    /**
     * Array of fps marks for the samples taken. A max number of samples will
     * be kept.
     * @type {array}
     */
    this.fpsMarks = [];

    /**
     * @private
     * Private properties of the node. Should not need or use these.
     * @type {object}
     */
    this._private = { };

    /**
     * @private
     * Last recorded time fps was calculated.
     * @type {number}
     */
    this._private.timeLastSecond = -1;
  },

  /**
   * Starts the timer.
   */
  start : function() {
    this._super();

    this._private.timeLastSecond = this.timeCurrent;
    this.timeStart = this.timeCurrent;
    this.frames = 0;
    this.fps = 0;
  },

  /**
   * Marks the current time elapsed since last mark or start.
   */
  mark : function () {
    this._super();

    this.frames++;

    // one second sample
    if (this.timeCurrent >
        this._private.timeLastSecond + this.fpsUpdateInterval) {
      var cfps = Math.round((this.frames * 1000) /
                            (this.timeCurrent - this._private.timeLastSecond));
      var pfps1 = this.fpsMarks[this.fpsMarks.length - 1] || 0;
      var pfps2 = this.fpsMarks[this.fpsMarks.length - 2] || 0;
      var pfps3 = this.fpsMarks[this.fpsMarks.length - 3] || 0;
      var pfps4 = this.fpsMarks[this.fpsMarks.length - 4] || 0;
      this.fps = Math.round(
        cfps * 0.6 +
        pfps1 * 0.2 +
        pfps2 * 0.1 +
        pfps3 * 0.05 +
        pfps4 * 0.05
      );
      if(this.fpsMarks.length >= this.marksMax) {
        this.fpsMarks.shift();
      }
      this.fpsMarks.push(this.fps);
      this._private.timeLastSecond = this.timeCurrent;
      this.frames = 0;
    }
  }
});