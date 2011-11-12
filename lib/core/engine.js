/**
 * Engine handles starting the game, generating the game loop and 
 * handling the base game window
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string|DOMElement} gameWindow the dom element to use as the main
 * game window, if a string it will pull the element by id, if it's a element
 * it will simply use it as is
 * @config {number} [width] width of the base game window
 * @config {number} [height] height of the base game window
 * @config {boolean} [iframe] whether or not the engine is placed in an iframe,
 * defaults to false
 * @class Main engine class
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

PFPlay.Engine = Class.extend(
/** @lends PFPlay.Engine.prototype */
{
  /** @constructs */
  init : function(params)
  {
    params = PFPlay.util.checkParams(params,
    {
      gameWindow: 'gameWindow',
      width: 0,
      height: 0,
      iframe: false,
    });

    /**
     * The game window element.
     * @type {DOMElement}
     */
    this.gameWindow = null;

    //Create game window 
    if(typeof params.gameWindow == 'object') {
      this.gameWindow = params.gameWindow;
    } else {
      this.gameWindow = document.getElementById(params.gameWindow);
    }

    /** 
     * The current size of the game.
     * @type {size}
     */
    this.size = { };
    this.size.width = params.width;
    this.size.height = params.height;

    // Attempt to get the width from the specified container.
    if(this.width == 0 || this.height == 0) {
      if(this.gameWindow) {
        var parentWidth = parseInt(this.gameWindow.style.width);
        var parentHeight = parseInt(this.gameWindow.style.height);

        if(parentWidth) {
          this.size.width = parentWidth;
        }

        if(parentHeight) {
          this.size.width = parentHeight;
        }
      }
    }

    // If the width still isn't set, set it to 640
    if(this.size.width == 0) {
      this.size.width = 640;
    }

    // If the height still isn't set, set it to 480
    if(this.size.height == 0) {
      this.size.height = 480;
    }
    
    /** 
     * @private
     * Private properties of the visual node. Should not need or use these.
     * @type {object}
     */
    this._private = { };

    /**
     * @private
     * A div to hold scenes. Prevents issues based on unknown parameters
     * of the user-supplied container element.
     * @type {HTMLDiv}
     */
    this._private.mainDiv = document.createElement('div');
    this._private.mainDiv.style.position = 'absolute';
    this._private.mainDiv.style.width = this.size.width + 'px';
    this._private.mainDiv.style.height = this.size.height + 'px';
    this._private.mainDiv.style.overflow = 'hidden';
    
    // The child to add to the main game window.  This is reset to the
    // iframe if the user specified the iframe option.
    var child = this._private.mainDiv;
    
    this._private.useIFrame = params.iframe;
    if(this._private.useIFrame) {
      /**
       * @private
       * An iframe used to hold the main game div.
       * @type {HTMLIFrame}
       */
      this._private.innerFrame = PFPlay.util.getIFrame(this.gameWindow);
      this._private.innerFrame.style.overflow = 'hidden';
      this._private.innerFrame.style.border = '0';
      this._private.innerFrame.style.width = this._private.mainDiv.style.width;
      this._private.innerFrame.style.height = this._private.mainDiv.style.height;
      this._private.innerFrame.doc.body.appendChild(this._private.mainDiv);
      this._private.innerFrame.doc.body.style.overflow = 'hidden';
      child = this._private.innerFrame;
    }
    
    this.gameWindow.appendChild(child);
    
    /**
     * Scene manager handles adding, remove, activating, and deactivating
     * scenes.
     * @type {PFPlay.SceneManager}
     */
    this.scenes = new PFPlay.SceneManager({
      gameWindow: this._private.mainDiv
    });

    /**
     * Master time of the engine. This holds how long the engine has been 
     * running.
     * @type {number}
     */
    this.masterTime = 0;

    /**
     * The length of time inbetween setInterval calls.
     * @type {number}
     */
    this.tick = 100;

    /**
     * External loop callback that will be called once every game loop.
     * @type {function}
     */
    this.loopLogic = null;

    /**
     * @private
     * The current time in milliseconds since epoch.
     * @type {number}
     */
    this._private.currentTime = new Date().getTime();

    /**
     * @private
     * The last time the game loop was called in milliseconds since epoch.
     * @type {number}
     */
    this._private.lastTime = this._private.currentTime;
  },

  /**
   * The current game window offset from the main html window.
   * @return {point} point that includes the x and y of the offset
   */
  getWindowOffset : function()
  {
    var offX = this._private.mainDiv.offsetLeft;
    var offY = this._private.mainDiv.offsetTop;
    
    if(this._private.mainDiv.offsetParent)
    {
      var parent = this._private.mainDiv.offsetParent;
      do {
          offX += parent.offsetLeft;
          offY += parent.offsetTop;
      } while (parent = parent.offsetParent);
    }
    
    return {x: offX, y: offY};
  },
  
  /**
   * @private
   * Binds the events from PFPlay.events to the window for event handling.
   */
  bindEvents : function()
  {
    var eng = this;
    
    for(var e in PFPlay.events)
    {
      // Get the correct window for hooking events.  Either the iframe
      // or the current window.
      var wnd = this._private.useIFrame ? 
        this._private.innerFrame.doc.defaultView : window;
        
      wnd.addEventListener(e, function(evt) { 
        eng.windowEvent.call(eng, evt) 
      },
      false);

      if(e == "mousewheel") {
        // special event for firefox
        wnd.addEventListener('DOMMouseScroll', function(evt) { 
          eng.windowEvent.call(eng, evt) 
        },
        false);
      }
    }
  },

  /**
   * Starts the game engine and kicks off the game loop.
   * @param {number} tick the tick length for the game loop
   * @param {function} [loop] the game loop callback
   */
  go : function(tick, loop)
  {
    this.tick = tick;
    var eng = this;

    this.bindEvents();
    
    if(loop) {
      this.loopLogic = loop;
    }
    requestAnimFrame(function(){eng.loop.call(eng);}, this._private.mainDiv);
  },
  
  /**
   * The engine's game loop, handles updating active scenes.
   */
  loop : function()
  {
    var eng = this;

    requestAnimFrame(function(){eng.loop.call(eng);}, this._private.mainDiv);

    this._private.currentTime = new Date().getTime();

    var elapsed = this._private.currentTime - this._private.lastTime;

    if(elapsed < this.tick) {
      return;
    }
    
    if(this.loopLogic)
      this.loopLogic(this.scenes, elapsed);

    var activeScenes = this.scenes.getScenes(true);
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      activeScenes[s].update(elapsed);
    }
    
    this._private.lastTime = this._private.currentTime;

    this.masterTime += elapsed;
  },
  
  /**
   * @private
   * Main event handler for all events for an engine. 
   * @param {event} rawEvt the browser event caught from the window
   */
  windowEvent : function(rawEvt)
  {    
    if (!rawEvt) {
      rawEvt = window.event;
    }

    var etype = rawEvt.type;

    var activeScenes = this.scenes.getScenes(true);
    var offset = this.getWindowOffset();
    
    var eventInsideScene = false;
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      var scrollX = 0;
      var scrollY = 0;
      if(window.pageXOffset != undefined && window.pageYOffset != undefined) {
        scrollX = window.pageXOffset;
        scrollY = window.pageYOffset;
      }
      else {
        scrollX = document.body.scrollLeft;
        scrollY = document.body.scrollTop;
      }
      var x = rawEvt.clientX - offset.x + scrollX;
      var y = rawEvt.clientY - offset.y + scrollY;
      
      var evtProps = new PFPlay.MouseEvent();
      evtProps.window.x = rawEvt.clientX;
      evtProps.window.y = rawEvt.clientY;
      evtProps.world.x = x;
      evtProps.world.y = y;
      evtProps.parent.x = evtProps.window.x;
      evtProps.parent.y = evtProps.window.y;
      evtProps.position.x = x;
      evtProps.position.y = y;

      if(rawEvt.type.toLowerCase() == "mousewheel" || 
         rawEvt.type.toLowerCase() == "dommousescroll") {
        var delta = 0;
          
        if (rawEvt.wheelDelta) { 
          delta = rawEvt.wheelDelta/120;
        } else if (rawEvt.detail) { 
          delta = -rawEvt.detail/3;
        }

        evtProps.scrollDelta = delta;
        etype = "mousewheel";
      }
      
      if(PFPlay.events[rawEvt.type] == 'keyboard') {
        var code;
        if(rawEvt.charCode) code = rawEvt.charCode;
        else if (rawEvt.keyCode) code = rawEvt.keyCode;
        else if (rawEvt.which) code = rawEvt.which;
        
        evtProps['keyCode'] = code;
        evtProps['key'] = String.fromCharCode(code);
      }
      evtProps.sender = activeScenes[s];
      activeScenes[s].events.raiseEvent(etype, evtProps);
      
      // Check to see if this event is within a layer.
      for(var idx in activeScenes[s].layers) {
        if(activeScenes[s].layers[idx].pointInBounds(evtProps.world)) {
          if(rawEvt.preventDefault) {
            rawEvt.preventDefault();
          }
        }
      }
    }
  }
});
