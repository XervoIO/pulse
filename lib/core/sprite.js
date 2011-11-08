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
  init: function(params) {
    
    // Call the base constructor.
    this._super(params);

    /**
     * Object to act as associative array of the actions for this sprite.
     * @type {object}
     */
    this.actions = {};

    /**
     * Actions being run on this sprite at this time.
     * @type {object}
     */
    this.runningActions = [];

    /**
     * The texture being used for this sprite.
     * @type {PFPlay.Image}
     */
    this.texture = null;

    /**
     * The current frame slice for this sprite.
     * @type {rect}
     */
    this.textureFrame = {
      x : 0,
      y : 0,
      width : 0,
      height : 0,
    };
    
    params = PFPlay.util.checkParams(params, {
      src : '',
      size : null
    });

    if(params.size != null) {
      this.size = params.size;
    }

    //Create an image for the spritesheet
    if(typeof params.src == 'object') {
      this.texture = params.src;
      if(this.texture.loaded() && this.size == null) {
        this.size = {
          width: this.texture.width(), 
          height: this.texture.height()
        };
      }
    } else {
      this.texture = new PFPlay.Image({
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
    return this.texture.loaded();
  },
  
  /** 
   * Returns an animation from the colleciton by name.
   * @param {string} name The name of the action to return.
   * @return {object} the action.
   */
  getAction : function(name) {
    return this.actions[name];
  },

  /**
   * Starts and returns an action. Setting the target of the action to 
   * this sprite.
   * @param {string} name The name of the action to start 
   * @return {PFPlay.Action} The action that was started
   */
  runAction : function(name) {
    var action = this.getAction(name);
    action.target = this;
    action.start(); 
    return action;
  },

  /** 
   * Adds an action to this sprite. The params passed in must either be 
   * an Action or the constructor params for an AnimateAction. 
   * See the AnimateAction object for more information.
   * @param {object} options for the new animation
   */
  addAction : function(params) {
    var newAction;

    if(params instanceof PFPlay.Action) {
      newAction = params;
    } else {
      //Create an animation option
      newAction = new PFPlay.AnimateAction({
        target : this,
        name : params.name,
        size : params.size,
        frames : params.frames,
        frameRate : params.frameRate,
        offset : params.offset
      });
    }

    newAction.bounds({
      x : this.texture.width(),
      y : this.texture.height()
    });

    this.actions[newAction.name] = newAction;
  },

  /**
   * Checks if the x and y position passed in is a point inside 
   * of this sprite.
   * @param {number} x position to check
   * @param {number} y position to check
   * @return {boolean} true if point passed is inside this sprite 
   */
  inCurrentBounds : function(x, y) {
    if(x > this.bounds.x && x < (this.bounds.x + this.bounds.width) && 
       y > this.bounds.y && y < (this.bounds.y + this.bounds.height)) {
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
    if(rect.x > this.bounds.x && 
      (rect.x + rect.width) < (this.bounds.x + this.bounds.width) && 
      rect.y > this.bounds.y && 
      (rect.y + rect.height) < (this.bounds.y + this.bounds.height)) {
      return true;
    }

    return false;
  },

  /** 
   * Returns the current frame as a canvas object, ready to draw.
   * @return {object} the frame. 
   */
  getCurrentFrame : function() {
    return this.texture.slice(
      this.textureFrame.x,
      this.textureFrame.y,
      this.textureFrame.width,
      this.textureFrame.height
    );
  },

  /**
   * Sprite's update function calculates the size based on current
   * image or animation and then calls the super update.
   * @param {number} time elapsed since last update call in milliseconds 
   */
  update : function(elapsed) {
    // not great code need to find a better spot to do this
    if(this.texture.loaded() && 
       this.size.width == 0 && this.size.height == 0) {
      this.size = {
        width: this.texture.width(), 
        height: this.texture.height()
      };
      this.textureFrame.width = this.texture.width();
      this.textureFrame.height = this.texture.height();
    }

    for(var i = 0; i < this.runningActions.length; i++) {
      this.runningActions[i].update(elapsed);
    }

    this._super(elapsed);
  },

  /**
   * Draws this sprite to passed in context
   * @param {CanvasRenderingContext2D} context in which to draw visual on
   */
  draw : function(ctx) {
    
    // skip if we're not loaded
    if(!this.texture.loaded() || 
       this.textureFrame.width == 0 ||
       this.textureFrame.height == 0) {
      return;
    }

    // Clear my canvas
    this._private.context.clearRect(
      0, 0, 
      this.canvas.width, this.canvas.height
    );

    var slice = this.getCurrentFrame(
      this.textureFrame.x,
      this.textureFrame.y,
      this.textureFrame.width,
      this.textureFrame.height
    );

    // All modification to the underlying image should be done here
    this._private.context.drawImage(
      slice, 
      0, 0, 
      this.size.width, this.size.height
    );

    this._super(ctx);
  },

  /**
   * Sets the texture frame width and height.
   */
  calculateProperties : function() {
    this._super();

    this.textureFrame.width = this.size.width;
    this.textureFrame.height = this.size.height;
  }
});