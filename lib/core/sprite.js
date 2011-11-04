/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * Sprites are the basic object for moving, animated graphics on
 * the screen. They have an image, the sprite sheet, which is a
 * collection of "frames" that can be played in succession to 
 * produce an animation.
 * @param {object} options various other options you can set, but are not
 * required.
 * @author Richard Key
 * @class The sprite object.
 */

PFPlay.Sprite = PFPlay.Visual.extend(
/** @lends PFPlay.Sprite.prototype */
{
  /** @constructs */
  init : function(params) {
    
    // Call the base constructor.
    this._super();

    /**
     * Object to act as associative array of the animations for this sprite.
     * @type {object}
     */
    this.animations = {};

    /**
     * Current animation being used for this sprite.
     * @type {PFPlay.Animation}
     */
    this._private.animation = null;

    /**
     * Previous animation used for this sprite.
     * @type {PFPlay.Animation}
     */
    this._private.animationPrevious = null;

    /**
     * The image being used for this sprite.
     * @type {PFPlay.Image}
     */
    this._private.sheet = null;
    
    params = PFPlay.util.checkParams(params, {
      name : null,
      src : ''
    });

    if(params.name != null) {
      this.name = params.name;
    }

    //Create an image for the spritesheet
    if(typeof params.src == 'object') {
      this._private.sheet = params.src;
    } else {
      this._private.sheet = new PFPlay.Image({
        'src' : params.src
      });
    }

    var _self = this;
    
    /**
     * Drag and drop event code
     */

    var _isDragging = false;
    var _dragPos = null;

    /**
     * Determines if object can be drag and dropped
     * @type {boolean}
     */
    this.dragDropEnabled = false;

    /**
     * Determines if the object actually moves when being dragged and dropped
     * @type {boolean}
     */
    this.dragMoveEnabled = false;

    /**
     * Determines if object can be dropped on this object
     * @type {boolean}
     */
    this.dropAcceptEnabled = false;

    /**
     * Handles all events sent to this object
     * If event is mousedown then a potential drag and drop action is happens
     *
     * @param {string} type the type of event raised
     * @param {object} evt the event object with properties on the event
     */
    this.eventsCallback = function(type, evt) {
      if(type == "mousedown" && _self.dragDropEnabled) {
        _isDragging = true;
        _dragPos = {
          x : evt.world.x,
          y : evt.world.y
        };
        _self.handleAllEvents = true;
        _self.events.raiseEvent('dragstart', evt);
        PFPlay.EventManager.DraggedItems['sprite:' + _self.name] = _self;
      }
      if((type == "mousemove" || type == "mouseup") && _isDragging) {
        var posDiff = {
          x : evt.world.x - _dragPos.x,
          y : evt.world.y - _dragPos.y
        };
        if(_self.dragMoveEnabled) {
          _self.position = {
            x : _self.position.x + posDiff.x,
            y : _self.position.y + posDiff.y
          };
        }
        _dragPos = {
          x : evt.world.x,
          y : evt.world.y
        };
      }
      if(type == "mouseup" && _isDragging) {
        _isDragging = false;
        _self.handleAllEvents = false;
        _self.events.raiseEvent('dragdrop', evt);
        delete PFPlay.EventManager.DraggedItems['sprite:' + _self.name];
      }
    }
    
    /**
     * The current items that are being dragged over this object
     * @type {object}
     */
    this.draggedOverItems = {};

    /**
     * Property that signifies if this sprite should handle all events.
     * @type {boolean}
     */
    this.handleAllEvents = false;

    /**
     * Event handler for this sprite.
     * @type {PFPlay.EventManager}
     */
    this.events = new PFPlay.EventManager({
      masterCallback : this.eventsCallback
    });
  },

  /** 
   * Returns true if the image for this sprite has been loaded
   * @return {boolean} Whether image has been loaded 
   */
  loaded : function() {
    return this._private.sheet.loaded();
  },
  
  /** 
   * Returns an animation from the colleciton by name.
   * @param {string} name The name of the animation to return.
   * @return {object} the animation.
   */
  getAnimation : function(name) {
    return this.animations[name];
  },
  
  /** 
   * This sets the currently used animation.
   * @param {string} name the name of the animation to use.
   */
  setAnimation : function(name) {
    this._private.animationPrevious = this._private.animation;
    this._private.animation = name;
  },

  /** 
   * Adds an animation to this sprite. See the Animation object for
   * more information. 
   * @param {object} options for the new animation
   */
  addAnimation : function(params) {
    var newAnimation;

    if( params instanceof PFPlay.Animation)
      newAnimation = params;
    else {
      //Create an animation option
      newAnimation = new PFPlay.Animation({
        name : params.name,
        size : params.size,
        frames : params.frames,
        frameRate : params.frameRate,
        offset : params.offset
      });
    }

    newAnimation.bounds({
      x : this._private.sheet.width(),
      y : this._private.sheet.height()
    });

    this.animations[newAnimation.name()] = newAnimation;

    //If this is the first animation, make it the current one.
    if(this._private.animation == null)
      this._private.animation = newAnimation.name();
  },

  /**
   * Checks if the x and y position passed in is a point inside 
   * of this sprite.
   * @param {number} x position to check
   * @param {number} y position to check
   * @return {boolean} true if point passed is inside this sprite 
   */
  inCurrentBounds : function(x, y) {
    var bounds = this.getCurrentBounds();

    if(x > bounds.x && x < (bounds.x + bounds.width) && 
       y > bounds.y && y < (bounds.y + bounds.height)) {
      return true;
    }

    return false;
  },
  
  /**
   * Returns whether the passed in rectangular dimensions
   * are inside this sprite.
   * @param {object} rectangle object, x, y, width, height
   * @returns {boolean} whether the rect in this sprite bounds
   */
  rectInCurrentBounds : function(rect) {
    var bounds = this.getCurrentBounds();

    if(rect.x > bounds.x && 
      (rect.x + rect.width) < (bounds.x + bounds.width) && 
      rect.y > bounds.y && 
      (rect.y + rect.height) < (bounds.y + bounds.height)) {
      return true;
    }

    return false;
  },
  
  /** 
   * Returns the current bounds of this sprite as a simple rectangle.
   * @return {object} the bounds
   */
  getCurrentBounds : function() {
    if(PFPlay.util.getLength(this.animations) > 0) {
      var size = this.animations[this._private.animation].size();

      return {
        x : this.positionTopLeft.x,
        y : this.positionTopLeft.y,
        width : size.x * this.scale.x,
        height : size.y * this.scale.y
      };
    } else {
      return {
        x : this.positionTopLeft.x,
        y : this.positionTopLeft.y,
        width : this._private.sheet.width() * this.scale.x,
        height : this._private.sheet.height() * this.scale.y
      }
    }
  },

  /**
   * Returns the bounds from the previous frame, even if the previous
   * frame is from a different animation, as a simple rectangle.
   * @return {object} the frame.
   */
  getPreviousBounds : function() {
    if(PFPlay.util.getLength(this.animations) > 0) {
      var size = this.animations[this._private.animation].size();

      if(this._private.animationPrevious != -1)
        size = this.animations[this._private.animationPrevious].size();

      return {
        x : this.positionTopLeftPrevious.x,
        y : this.positionTopLeftPrevious.y,
        width : size.x * this.scale.x,
        height : size.y * this.scale.y
      };
    } else {
      return {
        x : this.positionTopLeftPrevious.x,
        y : this.positionTopLeftPrevious.y,
        width : this._private.sheet.width() * this.scale.x,
        height : this._private.sheet.height() * this.scale.y
      };
    }
  },

  /** 
   * Returns the current frame as a canvas object, ready to draw.
   * @return {object} the frame. 
   */
  getCurrentFrame : function() {
    if(PFPlay.util.getLength(this.animations) > 0) {
      var frame = this.animations[this._private.animation].getCurrentFrame();
      return this._private.sheet.slice(
        frame.x, frame.y, 
        frame.width, frame.height
      );
    } else {
      return this._private.sheet.slice();
    }
  },

  /**
   * Sprite's update function calculates the size based on current
   * image or animation and then calls the super update.
   * @param {number} time elapsed since last update call in milliseconds 
   */
  update : function(elapsed) {
    // not great code need to find a better spot to do this
    if(PFPlay.util.getLength(this.animations) > 0) {
      var size = this.animations[this._private.animation].size();
      this.size.width = size.width;
      this.size.height = size.height;
    } else {
      this.size.width = this._private.sheet.width();
      this.size.height = this._private.sheet.height();
    }

    this._super(elapsed);

    if(PFPlay.util.getLength(this.animations) > 0) {
      this.animations[this._private.animation].update(elapsed);
      this.updated = this.animations[this._private.animation].updated;
    }
  },

  /**
   * Draws this sprite to passed in context
   * @param {CanvasRenderingContext2D} context in which to draw visual on
   */
  draw : function(ctx) {
    
    // Clear my canvas
    this._private.context.clearRect(
      0, 0, 
      this.canvas.width, this.canvas.height
    );

    this._private.sheet.rotation = this.rotation;
    var slice = this.getCurrentFrame();
    var drawX = (this.canvas.width - slice.width) / 2;
    var drawY = (this.canvas.height - slice.height) / 2;

    // All modification to the underlying image should be done here
    this._private.context.drawImage(slice, drawX, drawY);

    this._super(ctx);
  }
});