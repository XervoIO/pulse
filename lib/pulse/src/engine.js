/*global PClass:true, requestAnimFrame:false */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Engine handles starting the game, generating the game loop and
 * handling the base game window
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string|DOMElement} gameWindow the dom element to use as the main
 * game window, if a string it will pull the element by id, if it's a element
 * it will simply use it as is
 * @config {size} [size] initial size width and height
 * to use for the engine's game window.
 * @class Main engine class
 * @author PFP
 * @copyright 2012 Modulus
 */
pulse.Engine = PClass.extend(
/** @lends pulse.Engine.prototype */
{
  /** @constructs */
  init : function(params)
  {
    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Engine',
      'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    params = pulse.util.checkParams(params,
    {
      gameWindow: 'gameWindow',
      size: {width: 0, height: 0}
    });

    /**
     * The game window element.
     * @type {DOMElement}
     */
    this.gameWindow = null;


    this.focused = false;

    /**
     * Whether the game is currently hidden and should ignore window events.
     * @type {Boolean}
     * @default false
     */
    this.hidden = false;

    //Create game window
    if(typeof params.gameWindow === 'object') {
      this.gameWindow = params.gameWindow;
    } else {
      this.gameWindow = document.getElementById(params.gameWindow);
    }

    /**
     * The current size of the game.
     * @type {size}
     */
    this.size = params.size;

    // Attempt to get the width from the specified container.
    if((this.size.width === 0 || this.size.width === undefined) ||
       (this.size.height === 0 || this.size.height === undefined)) {
      if(this.gameWindow) {
        var parentWidth = parseInt(this.gameWindow.style.width, 10);
        var parentHeight = parseInt(this.gameWindow.style.height, 10);

        if(parentWidth) {
          this.size.width = parentWidth;
        }

        if(parentHeight) {
          this.size.height = parentHeight;
        }
      }
    }

    // If the width still isn't set, set it to 640
    if(this.size.width === 0) {
      this.size.width = 640;
    }

    // If the height still isn't set, set it to 480
    if(this.size.height === 0) {
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
    this._private.mainDiv.tabIndex = 1;

    this.gameWindow.appendChild(this._private.mainDiv);

    /**
     * Scene manager handles adding, remove, activating, and deactivating
     * scenes.
     * @type {pulse.SceneManager}
     */
    this.scenes = new pulse.SceneManager({
      gameWindow: this._private.mainDiv
    });

    this.scenes.parent = this;

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

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.Engine',
      'init',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * The current game window offset from the main html window.
   * @return {point} point that includes the x and y of the offset
   */
  getWindowOffset : function() {

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
   * Binds the events from pulse.events to the window for event handling.
   */
  bindEvents : function() {

    var eng = this;

    for(var e in pulse.events)
    {
      window.addEventListener(e, function(evt) {
          eng.windowEvent.call(eng, evt);
        }, false);

      if(e === "mousewheel") {
        // special event for firefox
        window.addEventListener('DOMMouseScroll', function(evt) {
          eng.windowEvent.call(eng, evt);
        }, false);
      }
    }
  },

  /**
   * Starts the game engine and kicks off the game loop.
   * @param {number} tick the time, in milliseconds, between frames
   * @param {function} [loop] the game loop callback
   */
  go : function(tick, loop) {

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
  loop : function(autoContinue) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Engine.PLUGIN_TYPE,
      pulse.Engine.PLUGIN_LOOP,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    var eng = this;

    if(autoContinue || (autoContinue === undefined)) {
      requestAnimFrame(function(){eng.loop.call(eng);}, this._private.mainDiv);
    }

    this._private.currentTime = new Date().getTime();

    var elapsed = this._private.currentTime - this._private.lastTime;

    if(elapsed < this.tick) {
      return;
    }

    // Shoot for 30 fps.  If the elapsed time is longer than that
    // subdivide the update so animation and other logic receive
    // a reasonable amount of updates for a given time span.
    var increments = Math.floor(elapsed / 30);
    if(increments === 0) {
      increments = 1;
    }

    // If there are more than 20 subdivisions, just skip the update.
    // This can be caused if the tab has not been selected.  Animation
    // frames will not be requested on inactive tabs.
    if(increments < 20) {
      elapsed /= increments;

      for(var incrementIdx = 0; incrementIdx < increments; incrementIdx++) {
        if(this.loopLogic) {
          this.loopLogic(this.scenes, elapsed);
        }

        this.update(elapsed);
        this.draw();

        this.masterTime += elapsed;
      }
    }

    this._private.lastTime = this._private.currentTime;

    // Plugin support.
    pulse.plugins.invoke(
      pulse.Engine.PLUGIN_TYPE,
      pulse.Engine.PLUGIN_LOOP,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  update : function(elapsed) {
    pulse.plugins.invoke(
      pulse.Engine.PLUGIN_TYPE,
      pulse.Engine.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    var activeScenes = this.scenes.getScenes(true);

    for(var s = 0; s < activeScenes.length; s++)
    {
      activeScenes[s].update(elapsed);
    }

    pulse.plugins.invoke(
      pulse.Engine.PLUGIN_TYPE,
      pulse.Engine.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  draw : function() {
    pulse.plugins.invoke(
      pulse.Engine.PLUGIN_TYPE,
      pulse.Engine.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    var activeScenes = this.scenes.getScenes(true);

    for(var s = 0; s < activeScenes.length; s++)
    {
      activeScenes[s].draw();
    }

    pulse.plugins.invoke(
      pulse.Engine.PLUGIN_TYPE,
      pulse.Engine.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * @private
   * Main event handler for all events for an engine.
   * @param {event} rawEvt the browser event caught from the window
   */
  windowEvent : function(rawEvt)
  {
    // if hidden skip handling window events
    if(this.hidden) {
      return;
    }

    if (!rawEvt) {
      rawEvt = window.event;
    }

    var etype = rawEvt.type;

    var activeScenes = this.scenes.getScenes(true);
    var offset = this.getWindowOffset();

    var scrollX = 0;
    var scrollY = 0;
    if(window.pageXOffset && window.pageYOffset) {
      scrollX = window.pageXOffset;
      scrollY = window.pageYOffset;
    } else {
      scrollX = document.body.scrollLeft;
      scrollY = document.body.scrollTop;
    }
    
    var evtProps = new pulse.MouseEvent();
    
    var x = rawEvt.clientX - offset.x + scrollX;
    var y = rawEvt.clientY - offset.y + scrollY;
    
    var isTouch = false;
    if(pulse.events[etype] === 'touch'
      || pulse.events[etype] === 'touchgesture') {
      isTouch = true;
      
      evtProps = new pulse.TouchEvent();
      
      if(rawEvt.touches && rawEvt.touches.length > 0) {
        x = rawEvt.touches[0].clientX - offset.x + scrollX;
        y = rawEvt.touches[0].clientY - offset.y + scrollY;
        
        evtProps.touches = rawEvt.touches;
      }
      
      if(rawEvt.changedTouches && rawEvt.changedTouches.length > 0) {
        evtProps.changedTouches = rawEvt.changedTouches;
        
        //touchend events do not have touches, so we need to get the postion
        //from the changed touches.
        if(etype === 'touchend') {
          x = rawEvt.changedTouches[0].clientX - offset.x + scrollX;
          y = rawEvt.changedTouches[0].clientY - offset.y + scrollY;
        }
      }
      
      if(rawEvt.targetTouches && rawEvt.targetTouches.length > 0) {
        evtProps.targetTouches = rawEvt.changedTouches;
      }
      
      if(rawEvt.scale && rawEvt.rotation) {
        evtProps.gestureScale = rawEvt.scale;
        evtProps.gestureRotation = rawEvt.rotation;
      }
      
      //The event will not be raised unless you force the focus bit.
      this.focused = true;
    }

    evtProps.window.x = rawEvt.clientX;
    evtProps.window.y = rawEvt.clientY;
    evtProps.world.x = x;
    evtProps.world.y = y;

    var eventInsideGame = false;
    if(x > 0 && x < parseInt(this._private.mainDiv.style.width, 10) &&
       y > 0 && y < parseInt(this._private.mainDiv.style.height, 10)) {
      eventInsideGame = true;
    }

    var eventInsideScene = false;

    for(var s = 0; s < activeScenes.length; s++) {
      evtProps.parent.x = evtProps.window.x;
      evtProps.parent.y = evtProps.window.y;
      evtProps.position.x = x;
      evtProps.position.y = y;

      // Check to see if this event is inside the game window.
      if(eventInsideGame) {
        if(rawEvt.preventDefault && isTouch === false) {
          rawEvt.preventDefault();
        }

        //Blur the current active element and focus the div
        if(document.activeElement !== this._private.mainDiv &&
          rawEvt.type.toLowerCase() === 'click') {
          document.activeElement.blur();
          this._private.mainDiv.focus();
        }

        if(rawEvt.type.toLowerCase() === 'mousedown') {
          this.focused = true;
        }
      }
      else {
        if(rawEvt.type.toLowerCase() === 'mousedown') {
          this.focused = false;
        }

        activeScenes[s].events.raiseEvent('mouseout', evtProps);
      }

      if(rawEvt.type.toLowerCase() === "mousewheel" ||
         rawEvt.type.toLowerCase() === "dommousescroll") {
        var delta = 0;

        if (rawEvt.wheelDelta) {
          delta = rawEvt.wheelDelta/120;
        } else if (rawEvt.detail) {
          delta = -rawEvt.detail/3;
        }

        evtProps.scrollDelta = delta;
        etype = "mousewheel";
      }

      if(pulse.events[rawEvt.type] === 'keyboard') {
        var code;
        if(rawEvt.charCode) {
          code = rawEvt.charCode;
        }
        else if (rawEvt.keyCode) {
          code = rawEvt.keyCode;
        }
        else if (rawEvt.which) {
          code = rawEvt.which;
        }

        evtProps['keyCode'] = code;
        evtProps['key'] = String.fromCharCode(code);
      }

      if(this.focused) {
        evtProps.sender = activeScenes[s];
        activeScenes[s].events.raiseEvent(etype, evtProps);
      }
    }

    //Stop all drag events if you are outside the game window
    if(rawEvt.type.toLowerCase() === 'mouseup' && !eventInsideGame) {
      for(var di in pulse.EventManager.DraggedItems) {
        if(di.indexOf('sprite') === 0) {
          pulse.EventManager.DraggedItems[di].killDrag(evtProps);
        }
      }
    }
  },

  /**
   * Adds a scene to this engine's scene manager.
   * @param {pulse.Scene} scene the scene to add
   */
  addScene : function(scene) {
    if(this.scenes && this.scenes.addScene) {
      this.scenes.addScene(scene);
    }
  },

  /**
   * Removes a scene from this engine's scene manager by name.
   * @param {pulse.Scene|string} scene the scene or name of scene
   */
  removeScene : function(scene) {
    if(this.scenes && this.scenes.addScene) {
      this.scenes.removeScene(scene);
    }
  },

  /**
   * Activates a scene in this engine's scene manager by name.
   * @param {pulse.Scene|string} scene the scene or name of scene
   */
  activateScene : function(scene) {
    if(this.scenes && this.scenes.addScene) {
      this.scenes.activateScene(scene);
    }
  },

  /**
   * Deactivate a scene in this engine's scene manager by name.
   * @param {pulse.Scene|string} scene the scene or name of scene
   */
  deactivateScene : function(scene) {
    if(this.scenes && this.scenes.addScene) {
      this.scenes.deactivateScene(scene);
    }
  }

});

pulse.Engine.PLUGIN_TYPE = "pulse.Engine";
pulse.Engine.PLUGIN_LOOP = "loop";
pulse.Engine.PLUGIN_UPDATE = "update";
pulse.Engine.PLUGIN_DRAW = "draw";