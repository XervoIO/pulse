/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Animates a move of an object to new position over a period of time.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {pulse.Sprite} target the sprite for the action to be performed on
 * @config {string} [name] name of the node
 * @config {object} position the new position to move the target to, in
 * milliseconds
 * @config {number} duration the length of time to animate over
 * @author PFP
 * @class move action
 * @augments pulse.Action
 * @copyright 2012 Modulus
 */
pulse.MoveAction = pulse.Action.extend(
/** @lends pulse.MoveAction.prototype */
{
  /** @constructs */
  init : function(params) {

    this._super(params);

    // Check the params
    params = pulse.util.checkParams(params,
    {
      name : this.name,
      position : null,
      duration : 0,
      easing : pulse.util.easeInOutQuad
    });

    /**
     * The position the target is going to be moved to.
     * @type {point}
     */
    this.position = params.position;

    /**
     * The duration of the move animation. Shouldn't be changed once started.
     * @type {number}
     */
    this.duration = params.duration;

    /**
     * The easing function to use for position movement.
     * @type {function}
     */
    this.easingFunction = params.easing;

    /**
     * @private
     * The current time in playing the animtion.
     * @type {number}
     */
    this._private.playTime = 0;

    /**
     * @private
     * The starting position of the target for the animation.
     * @type {point}
     */
    this._private.startPosition = null;

    /**
     * @private
     * The difference in position that the target will move over the animation.
     * @type {object}
     */
    this._private.positionDiff = null;
  },

  /**
   * Starts the animation.
   * @param {rect} [oframe] original frame to return to
   */
  start : function(oframe) {
    this._super();

    if(!this.target) {
      return;
    }

    if(!this.isPaused) {
      this._private.playTime = 0;
      this._private.startPosition = {
        x: this.target.position.x,
        y: this.target.position.y
      };
      this._private.positionDiff = {
        x: this.position.x - this._private.startPosition.x,
        y: this.position.y - this._private.startPosition.y
      };
    }
  },

  /**
   * Pauses the animation.
   */
  pause : function() {
    this._super();
  },

  /**
   * Stops the animation.
   */
  stop : function() {
    this._super();
  },

  /**
   * Complete handler when the animation is complete.
   */
  complete : function() {
    this._super();
  },

  /**
   * This is the master update function for the animation. This will
   * update the target's position with the correct position.
   * @param {number} elapsed the elapsed time since last update call in
   * milliseconds
   */
  update : function(elapsed)
  {
    this._super();

    if(this.running === false)
    {
      return;
    }

    this._private.playTime += elapsed;

    var newPosition = { };

    if(this._private.playTime > this.duration) {
      this._private.playTime = this.duration;
      this.stop();
      this.complete();
    }

    newPosition = {
      x: this.easingFunction(
          this._private.playTime,
          this._private.startPosition.x,
          this._private.positionDiff.x,
          this.duration
        ),
      y: this.easingFunction(
          this._private.playTime,
          this._private.startPosition.y,
          this._private.positionDiff.y,
          this.duration
        )
    };

    this.target.position = newPosition;
  }
});