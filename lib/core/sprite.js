/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * Sprites are the basic object for moving, animated graphics on
 * the screen. They have an image, the sprite sheet, which is a
 * collection of "frames" that can be played in succession to 
 * produce an animation.
 * @param {string} src the source of the sprites sheet
 * @param {string} name the name of the sprite
 * @param (object) options various other options you can set, but are not
 * required.
 * @author Richard Key
 * @class The sprite object.
 * @constructor
 */

// Static counter used to generate unique sprite names.
PFPlay.Sprite.spriteIdx = 0;

PFPlay.Sprite = Node.extend({
   init: function(params) 
   {
      this._super();
     params = PFPlay.util.checkParams(params,
     {
       name: null,
       src: ''
     });
     
     if(params.name != null)
      this.name = params.name;
     
     //Create an image for the spritesheet
     var _sheet = null;
     if(typeof params.src == 'object') {
       _sheet = params.src;
     } else {
       _sheet = new PFPlay.Image({'src': params.src});
     }
   
     /** The previous and current position of the sprite */
     this.position = {x : 0, y : 0};
     var _previousPosition = {x : 0, y : 0};
   
     /** The previous and current anchor position of the sprite */
     this.anchor = {x: 0.5, y: 0.5};
     var _previousAnchor = {x: 0.5, y: 0.5};
     this.anchorRadius = 0;
     this.anchorAngle = 0;
   
     /** The current top left position based on the position and anchor */
     this.topLeft = {x: 0, y: 0};
     
     var _animations = {};
     var _currentAnimation;
     var _previousAnimation = -1;
   
     this.updated = true;
     
     this.zindex = 0;
     var _prevZIndex = 0;
     this.shuffled = false;
     
     this.visible = true;
     var _preVisible = null;
     
     var _firstUpdate = true;
   
     this.scaleX = 1;
     var _prevScaleX = 1;
     
     this.scaleY = 1;
     var _prevScaleY = 1;
   
     /** The previous and current position of the sprite */
     this.rotation = 0;
     var _previousRotation = 0;
   
     var _self = this;
   
     /** @return {boolean} Whether image has been loaded */
     this.loaded = function()
     {
       return _sheet.loaded();
     }
   
     /** Adds an animation to the collection. See the Animation object for
      * more information. */ 
     this.addAnimation = function(params)
     {
       var newAnimation;
       
       if(params instanceof PFPlay.Animation)
         newAnimation = params;
       else
       {
         //Create an animation option
         newAnimation = new PFPlay.Animation(
         {
           name: params.name, 
           size: params.size, 
           frames: params.frames, 
           frameRate: params.frameRate,
           offset: params.offset
         });
       }
       
       newAnimation.bounds(
         {x:_sheet.width(), y:_sheet.height()}
       );
       
       _animations[newAnimation.name()] = newAnimation;
       
       //If this is the first animation, make it the current one.
       if(PFPlay.util.getLength(_animations) == 1)
         _currentAnimation = newAnimation.name();
     };
     
     /** 
      * Moves the sprite by adding to the current position.
      * @param {number} x the value to add to the x position.
      * @param {number} y the value to add to the y position.
      */
     this.move = function(x, y)
     {
       this.position = {
         x: this.position.x + x, 
         y: this.position.y + y
       };
     };
     
     /** Returns an animation from the colleciton by name. 
      * @param {string} name The name of the animation to return.
      * @return {object} the animation.
      */
     this.getAnimation = function(name)
     {
       return _animations[name];
     };
     
     /** This sets the currently used animation.
      * @param {string} name the name of the animation to use.
      */
     this.setAnimation = function(name)
     {
       _previousAnimation = _currentAnimation;
       _currentAnimation = name;
     }
     
     /** Updates the current animation and checks if the sprite has moved. */
     this.update = function(elapsed)
     {
       if(_firstUpdate)
       {
         _firstUpdate = false;
         this.calculateAnchorRadius();
         return;
       }
       
       this.updated = false; 
       
       if(PFPlay.util.getLength(_animations) > 0)
       {
         _animations[_currentAnimation].update(elapsed);
         this.updated = _animations[_currentAnimation].updated;
         this.calculateAnchorRadius();
       }
       
       if(_previousPosition.x != this.position.x
         || _previousPosition.y != this.position.y)
       {
         _previousPosition = this.position;
         this.topLeft = this.getTopLeftPosition();
         this.updated = true;
       }
   
       if(_previousAnchor.x != this.anchor.x
         || _previousAnchor.y != this.anchor.y)
       {
         _previousAnchor = this.anchor;
         this.calculateAnchorRadius();
         this.topLeft = this.getTopLeftPosition();
         this.updated = true;
       }
       
       if(this.visible != _preVisible)
       {
         _preVisible = this.visible;
         this.updated = true;
       }
       
       if(this.zindex != _prevZIndex)
       {
         _prevZIndex = this.zindex;
         this.shuffled = true;
       }
       
       if(this.scaleX != _prevScaleX)
       {
         _sheet.scaleX = this.scaleX;
         _prevScaleX = this.scaleX;
         this.calculateAnchorRadius();
         this.updated = true;
       }
       
       if(this.scaleY != _prevScaleY)
       {
         _sheet.scaleY = this.scaleY;
         _prevScaleY = this.scaleY;
         this.calculateAnchorRadius();
         this.updated = true;
       }
   
       if(this.rotation != _previousRotation)
       {
         _sheet.rotation = this.rotation;
         this._previousRotation = this.rotation;
         this.topLeft = this.getTopLeftPosition();
         this.updated = true;
       }
     }
   
     /**
      * Draw's this sprite to the passed in context
      * 
      * @param {object} 2D canvas context to be used for drawing
      */
     this.draw = function(ctx) 
     {
       ctx.drawImage(
         this.getCurrentFrame(),
         this.topLeft.x,
         this.topLeft.y
       );
       
       if(PFPlay.DEBUG) 
       {
         ctx.save();
         ctx.fillStyle = "#FF3300";
         ctx.beginPath();
         ctx.arc(this.position.x, this.position.y, 3, 0, Math.PI*2, true); 
         ctx.closePath();
         ctx.fill();
         ctx.restore();  
       } 
     }
     
     /**
      *
      *
      */
     // TODO: check these when rotated with crazy anchor
     this.inCurrentBounds = function(x, y)
     {
       var bounds = this.getCurrentBounds();
       
       if(x > bounds.x && x < (bounds.x + bounds.width)
         && y > bounds.y && y < (bounds.y + bounds.height))
       {
         return true;
       }
       
       return false;
     }
   
     /**
      * Returns whether the passed in rectangular dimensions
      * are inside this sprite
      * @returns {boolean} whether the rect in this sprite bounds
      */
     this.rectInCurrentBounds = function(rect)
     {
       var bounds = this.getCurrentBounds();
   
       if(rect.x > bounds.x && (rect.x + rect.width) < (bounds.x + bounds.width) &&
          rect.y > bounds.y && (rect.y + rect.height) < (bounds.y + bounds.height))
       {
         return true;
       }
       
       return false;
     }
     
     /** Returns the current frame as a simple rectangle.
      * @return {object} the frame.
      */
     this.getCurrentBounds = function()
     {
       if(PFPlay.util.getLength(_animations) > 0)
       {
         var size = _animations[_currentAnimation].size();
         
         return {
           x: this.topLeft.x,
           y: this.topLeft.y,
           width: size.x,
           height: size.y
         };
       }
       else
       {
         return {
           x: this.topLeft.x,
           y: this.topLeft.y,
           width: _sheet.width(),
           height: _sheet.height()
         }
       }
     };
     
     /** Returns the current frame as a canvas object, ready to draw.
      * @return {object} the frame. */
     this.getCurrentFrame = function() 
     {    
       if(PFPlay.util.getLength(_animations) > 0)
       {
         var frame = _animations[_currentAnimation].getCurrentFrame();
         
         return _sheet.slice(
           frame.x, frame.y,
           frame.width, frame.height
         );
       }
       else
       {
         return _sheet.slice();
       }
     };
     
     /** 
      * Sets the previous position, used to clear the previous frame from
      * a layer.
      * @param {number} x the horizontal previous position of the sprite
      * @param (number) y the vertical  previous position of the sprite
      */
     this.setPreviousPosition = function(x, y)
     {
       _previousPosition = {x: x, y: y}
     }
     
     /** 
      * Returns the bounds from the previous frame, even if the previous
      * frame is from a different animation, as a simple rectangle.
      * @return {object} the frame.
      */
     this.getPreviousBounds = function()
     {
       if(PFPlay.util.getLength(_animations) > 0)
       {
         var size = _animations[_currentAnimation].size();
          
         if(_previousAnimation != -1)
           size = _animations[_previousAnimation].size();
         
         return {
           x: _previousPosition.x,
           y: _previousPosition.y,
           width: size.x,
           height: size.y
         };
       }
       else
       {
         return {
           x: _previousPosition.x,
           y: _previousPosition.y,
           width: _sheet.width(),
           height: _sheet.height()
         };
       }
     };
   
     /**
      * Calculates the anchor radius
      * 
      */
     this.calculateAnchorRadius = function()
     {
       var sw = _sheet.width() * _sheet.scaleX;
       var sh = _sheet.height() * _sheet.scaleY;
       var sx = sw / 2, sy = sh / 2;
       var ix = this.anchor.x * sw, iy = this.anchor.y * sh;
       var dx = ix - sx, dy = iy - sy;
       this.anchorRadius = Math.sqrt(dx * dx + dy * dy);
       this.anchorAngle = Math.atan2(dy, dx) * 180 / Math.PI - 90;
       if(isNaN(this.anchorAngle)) {
         this.anchorAngle = 0;
       }
     }
   
     /**
      * Returns the top left position of the sprite based on it's
      * position and anchor
      * @return {point} Point where top left of sprite should be drawn
      */
     this.getTopLeftPosition = function()
     {
       var sw = _sheet.width() * _sheet.scaleX;
       var sh = _sheet.height() * _sheet.scaleY;
       var cw = sw * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + 
                sh * Math.abs(Math.sin(Math.PI * this.rotation / 180));
       var ch = sh * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + 
                sw * Math.abs(Math.sin(Math.PI * this.rotation / 180));
   
       var ox = cw / 2;
       var oy = ch / 2;
       var xpos = this.position.x - Math.sin(Math.PI * -(this.rotation + this.anchorAngle) / 180) * this.anchorRadius - ox;
       var ypos = this.position.y - Math.cos(Math.PI * -(this.rotation + this.anchorAngle) / 180) * this.anchorRadius - oy;
       return {x: xpos, y: ypos};
     }
   
     /**
      * Drag and drop event code
      */
   
     var _isDragging = false;
     var _dragPos = null;
   
     /** 
      * Determines if object can be drag and dropped
      */
     this.dragDropEnabled = false;
   
     /**
      * Determines if the object actually moves when being dragged and dropped
      */ 
     this.dragMoveEnabled = false;
   
     /**
      * Determines if object can be dropped on this object
      */
     this.dropAcceptEnabled = false;
   
     /**
      * Handles all events sent to this object
      * If event is mousedown then a potential drag and drop action is happens
      * 
      * @param {string} type the type of event raised
      * @param {object} evt the event object with properties on the event
      */
     this.eventsCallback = function(type, evt) 
     {
       if(type == "mousedown" && _self.dragDropEnabled) {
         _isDragging = true;
         _dragPos = {x: evt.world.x, y: evt.world.y};
         _self.handleAllEvents = true;
         _self.events.raiseEvent('dragstart', evt);
         PFPlay.EventManager.DraggedItems['sprite:' + _name] = _self;
       }
       if((type == "mousemove" || type == "mouseup") && _isDragging) {
         var posDiff = {x: evt.world.x - _dragPos.x, y: evt.world.y - _dragPos.y};
         if(_self.dragMoveEnabled) 
         {
           _self.position = {x: _self.position.x + posDiff.x, 
                             y: _self.position.y + posDiff.y};
         }
         _dragPos = {x: evt.world.x, y: evt.world.y};
       }
       if(type == "mouseup" && _isDragging) {
         _isDragging = false;
         _self.handleAllEvents = false;
         _self.events.raiseEvent('dragdrop', evt);
         delete PFPlay.EventManager.DraggedItems['sprite:' + _name];
       }
     }
   
     /**
      * The current items that are being dragged over this object
      */
     this.draggedOverItems = {};
   
     /**
      *
      */
     this.handleAllEvents = false;
   
     /**
      * Event handler
      */
     this.events = new PFPlay.EventManager({masterCallback: this.eventsCallback});
   }
});