/**
 * Sprites are the basic object for moving, animated graphics on
 * the screen. They have an image, the sprite sheet, which is a
 * collection of "frames" that can be played in succession to 
 * produce an animation.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string|pulse.Texture} src the texture filename to use or a 
 * pulse.Texture to use
 * @config {string} [name] name of the node
 * @config {size} [size] initial size width and height to use for the sprite
 * @author PFP
 * @class The sprite object.
 * @augments pulse.Visual
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.Sprite = pulse.Visual.extend(
/** @lends pulse.Sprite.prototype */
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
    this.runningActions = {};

    /**
     * The texture being used for this sprite.
     * @type {pulse.Image}
     */
    this.texture = null;

    /**
     * The previous texture being used for this sprite.
     * @type {pulse.Image}
     */
    this.texturePrevious = null;

    /**
     * The current frame slice for this sprite.
     * @type {rect}
     */
    this.textureFrame = {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    };

    /**
     * The previous texture frame slice for this sprite.
     * @type {rect}
     */
    this.textureFramePrevious = {
      x : 0,
      y : 0,
      width : 0,
      height : 0
    };

    /**
     * Whether the texture frame or texture has been updated.
     * @type {boolean}
     */
    this.textureUpdated = true;
    
    params = pulse.util.checkParams(params, {
      src : '',
      size : { }
    });

    this.size = params.size;

    //Create an image for the spritesheet
    if(typeof params.src == 'object') {
      this.texture = params.src;
    } else {
      this.texture = new pulse.Image({
        'src' : params.src
      });
    }

    /**
     * @private
     * Whether this sprite is being dragged or not.
     * @type {boolean}
     */
    this._private.isDragging = false;

    /**
     * @private
     * The current drag position of this sprite.
     * @type {point}
     */
    this._private.dragPos = false;

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
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager({
      owner : this,
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
   * @param {rect} [oframe] original frame to return to
   * @return {pulse.Action} The action that was started
   */
  runAction : function(name, oframe) {
    oframe = oframe || null;
    var action = this.getAction(name);
    action.target = this;
    action.start(oframe); 
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

    if(params instanceof pulse.Action) {
      newAction = params;
      newAction.target = this;
    } else {
      //Create an animation option
      newAction = new pulse.AnimateAction({
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
    var tw = this.texture.width();
    if(this.textureFrame.width != 0) {
      tw = this.textureFrame.width;
    }

    var th = this.texture.height();
    if(this.textureFrame.height != 0) {
      th = this.textureFrame.height;
    }

    return this.texture.slice(
      this.textureFrame.x,
      this.textureFrame.y,
      tw,
      th  
    );
  },

  /**
   * Sprite's update function calculates the size based on current
   * image or animation and then calls the super update.
   * @param {number} time elapsed since last update call in milliseconds 
   */
  update : function(elapsed) {
    if(this.texture != this.texturePrevious) {
      this.texturePrevious = this.texture;
      this.textureUpdated = true;
      this.updated = true;
    }

    // not great code need to find a better spot to do this
    if(this.texture.loaded()) {
      if(this.size == null) {
        this.size = { };
      }
      if(!this.size.width) {
        this.size.width = this.texture.width();
      }
      if(!this.size.height) {
        this.size.height = this.texture.height();
      }
    }

    if(this.textureFrame.x != this.textureFramePrevious.x ||
       this.textureFrame.y != this.textureFramePrevious.y ||
       this.textureFrame.width != this.textureFramePrevious.width ||
       this.textureFrame.height != this.textureFramePrevious.height) {
      this.textureFramePrevious.x = this.textureFrame.x;
      this.textureFramePrevious.y = this.textureFrame.y;
      this.textureFramePrevious.width = this.textureFrame.width;
      this.textureFramePrevious.height = this.textureFrame.height;
      this.textureUpdated = true;
      this.updated = true; 
    }

    for(var n in this.runningActions) {
      this.runningActions[n].update(elapsed);
    }

    this._super(elapsed);
  },

  /**
   * Draws this sprite to passed in context
   * @param {CanvasRenderingContext2D} ctx the context in which to draw this 
   * visual on
   */
  draw : function(ctx) {
    
    // skip if we're not loaded
    if(!this.texture.loaded() || 
       this.size.width == 0 || 
       this.size.height == 0) {
      return;
    }

    // Only redraw this canvas if the texture coords or texture changed.
    if(this.textureUpdated) {
      // Clear my canvas
      this._private.context.clearRect(
        0, 0, 
        this.canvas.width, this.canvas.height
      );

      var slice = this.getCurrentFrame();

      // Draws the texture to this visual's canvas
      this._private.context.drawImage(
        slice, 
        0, 0, 
        this.size.width, this.size.height
      );

      this.textureUpdated = false;
    }
    

    this._super(ctx);
  },

  /**
   * Sets the texture frame width and height.
   */
  calculateProperties : function() {
    this._super();
  },

  /**
   * Handles all events sent to this object. If event is mousedown then a 
   * potential drag and drop action is handled.
   * @param {string} type the type of event raised
   * @param {object} evt the event object with properties on the event
   */
  eventsCallback : function(type, evt) {
    if(type == "mousedown" && this.dragDropEnabled) {
      this._private.isDragging = true;
      this._private.dragPos = {
        x : evt.world.x,
        y : evt.world.y
      };
      this.handleAllEvents = true;
      evt.sender = this;
      this.events.raiseEvent('dragstart', evt);
      pulse.EventManager.DraggedItems['sprite:' + this.name] = this;
    }
    if((type == "mousemove" || type == "mouseup") && this._private.isDragging) {
      var posDiff = {
        x : evt.world.x - this._private.dragPos.x,
        y : evt.world.y - this._private.dragPos.y
      };
      if(this.dragMoveEnabled) {
        this.position = {
          x : this.position.x + posDiff.x,
          y : this.position.y + posDiff.y
        };
      }
      this._private.dragPos = {
        x : evt.world.x,
        y : evt.world.y
      };
    }
    if(type == "mouseup" && this._private.isDragging) {
      this._private.isDragging = false;
      this.handleAllEvents = false;
      evt.sender = this;
      this.events.raiseEvent('dragdrop', evt);
      delete pulse.EventManager.DraggedItems['sprite:' + this.name];
    }
  }
});