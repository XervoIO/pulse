/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Animations are a collection of rectangles that represent pieces of
 * a larger rectangle, which change at a given rate, IE the frame
 * changes at a given interval.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {pulse.Sprite} target the sprite for the action to be performed on
 * @config {string} [name] name of the node
 * @config {object} [size] a point object that represents the size of the
 * animation frames
 * @config {number|array} [frames] a number representing the number of frames
 * or an array of frames representing the sequence in which to play the
 * frames
 * @config {number} [frameRate] the number of frames per second
 * @config {point} [offset] the pixel offset of the animation in respect to the
 * sprite sheet
 * @config {size} [bounds] the phyiscal bounds in which all frames must lie
 * @config {number} [plays] the number of times the animation should loop, if
 * less than 0 it will loop continuously
 * @author PFP
 * @class animation action
 * @augments pulse.Action
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.AnimateAction = pulse.Action.extend(
/** @lends pulse.AnimateAction.prototype */
{
  /** @constructs */
  init : function(params) {

    this._super(params);

    // Check the params
    params = pulse.util.checkParams(params,
    {
      name : this.name,
      size : {width:0, height:0},
      frames : 0,
      frameRate : 0,
      offset : {x:0, y:0},
      bounds : {width:1, height:1},
      plays : -1
    });

    /**
     * The size of the frame for the animation.
     * @type {size}
     */
    this.size = params.size;

    /**
     * @private
     * The original frame of the texture when started.
     * @type {size}
     */
    this._private.frameOriginal = {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    };

    /**
     * @private
     * The bounds in which all frames must lie.
     * @type {size}
     */
    this._private.bounds = params.bounds;

    /**
     * @private
     * The number of frames in the sequence.
     * @type {number}
     */
    this._private.frames = params.frames;

    /**
     * @private
     * The frame rate that the animation should play at.
     * @type {number}
     */
    this._private.frameRate = params.frameRate;

    /**
     * @private
     * The pixel offset for the frames on the original image.
     * @type {point}
     */
    this._private.offset = params.offset;

    /**
     * @private
     * The number of play throughs if it's equal to less than one it loops.
     * @type {number}
     */
    this._private.plays = params.plays;

    /**
     * @private
     * The current play through number.
     * @type {number}
     */
    this._private.currentPlay = 1;

    /**
     * @private
     * The current frame of the animation. Zero indexed.
     * @type {number}
     */
    this._private.currentFrame = 0;

    /**
     * @private
     * The start time for the animation.
     * @type {number}
     */
    this._private.start = 0;

    /**
     * @private
     * The current play time of the animation.
     * @type {number}
     */
    this._private.playTime = 0;
  },

  /**
   * Gets or Sets the current outer bounds for the animation. The bounds
   * determine when to wrap frames to the next "line." Frames will always be
   * forced to lie without the set bounds.
   * @param {object} newBounds the new bounds of the animation
   * @return {object} the current bounds of the animation
   */
  bounds : function(newBounds)
  {
    if(typeof newBounds === 'undefined' || newBounds === null) {
      return this._private.bounds;
    }

    /** Bounds have to be greater than 0 to prevent an infinite loop
     * when checking for positions outside them. */
    if(newBounds.width <= 0) {
      newBounds.width = 1;
    }

    if(newBounds.height <= 0) {
      newBounds.height = 1;
    }

    this._private.bounds = newBounds;
  },

  /**
   * Gets a frame of the animation based on the passed in index or
   * the current frame.
   * @param {number} index the frame to retrieve
   * @return {object} a rectangle that represents the frame
   */
  getFrame : function(index)
  {
    var frame = pulse.util.checkValue(index, this._private.currentFrame);

    if(this._private.frames instanceof Array) {
      frame = this._private.frames[this._private.currentFrame];
    }

    var x = (frame + this._private.offset.x) * this.size.width;
    var y = this._private.offset.y;

    /** If the x position is out of bounds, move the frame selection
     * down. */
    while(x >= this._private.bounds.width)
    {
      x = x - this._private.bounds.width;
      y++;
    }

    y = y * this.size.height;

    if(y >= this._private.bounds.height) {
      y = this._private.bounds.height - this.size.height;
    }

    return {x: x, y: y, width: this.size.width, height: this.size.height};
  },

  /**
   * Starts the animation.
   * @param {rect} [oframe] original frame to return to
   */
  start : function(oframe) {
    this._super();
    this._private.currentPlay = 1;
    this._private.playTime = 1 / this._private.frameRate * 1000;
    if(oframe) {
      this._private.frameOriginal = oframe;
    } else {
      this._private.frameOriginal = null;
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
    this._private.currentFrame = 0;
    this._private.playTime = 0;
    if(this._private.frameOriginal) {
      this.target.textureFrame = this._private.frameOriginal;
      this.target.updated = true;
    }
  },

  /**
   * Complete handler when the animation is complete.
   */
  complete : function() {
    this._super();
    if(this._private.frameOriginal) {
      this.target.textureFrame = this._private.frameOriginal;
      this.target.updated = true;
    }
  },

  /**
   * This is the master update function for the animation. This will
   * update the target's texture with the correct frame.
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

    var updated = false;

    this._private.playTime += elapsed;

    if(this._private.playTime >= (1 / this._private.frameRate * 1000))
    {
      this._private.currentFrame++;

      var length = this._private.frames.length || this._private.frames;

      if(this._private.currentFrame >= length) {
        this._private.currentFrame = 0;
        this._private.currentPlay++;
        if(this._private.plays > 0 &&
           this._private.currentPlay > this._private.plays) {
          this.stop();
          this.complete();
          return;
        }
      }

      this._private.playTime = 0;
      updated = true;
    }

    if(updated) {
      // update the targets texture
      var frame = this.getFrame();
      this.target.textureFrame = frame;
      this.target.updated = true;
    }
  }
});