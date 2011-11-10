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
      height: 0
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

    this._private.mainDiv .style.position = 'absolute';
    this._private.mainDiv .style.width = this.size.width + 'px';
    this._private.mainDiv .style.height = this.size.height + 'px';
    this._private.mainDiv .style.overflow = 'hidden';
    this.gameWindow.appendChild(this._private.mainDiv);
    
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
      window.addEventListener(e, function(evt) { 
        eng.windowEvent.call(eng, evt) 
      },
      false);

      if(e == "mousewheel") {
        // special event for firefox
        window.addEventListener('DOMMouseScroll', function(evt) { 
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
    
    setInterval(function() {eng.loop.call(eng);}, this.tick);
  },
  
  /**
   * The engine's game loop, handles updating active scenes.
   */
  loop : function()
  {
    this._private.currentTime = new Date().getTime();

    var elapsed = this._private.currentTime - this._private.lastTime;
    
    this.loopLogic(this.scenes);
    
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
    
    for(var s = 0; s < activeScenes.length; s++)
    {
      var x = rawEvt.clientX - offset.x + document.body.scrollLeft;
      var y = rawEvt.clientY - offset.y + document.body.scrollTop;
      
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

        if (rawEvt.preventDefault) {
          rawEvt.preventDefault();
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
      
      activeScenes[s].events.raiseEvent(etype, evtProps);
    }
  }
});
