/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Engine handles starting the game, generating the game loop and
 * handling the base game window. Also adds debugging code to the standard
 * update loop.
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
 * @augments pulse.Engine
 * @author PFP
 * @copyright 2012 Paranoid Ferret Productions
 */
pulse.debug.Engine = pulse.Engine.extend(
/** @lends pulse.debug.Engine.prototype */
{
  /** @constructs */
  init : function(params)
  {
    this._super(params);

    pulse.DebugManager = new pulse.debug.DebugManager();
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
    this.masterTime += elapsed;

     if(elapsed < this.tick) {
      return;
    }

    if(pulse.DebugManager) {
      pulse.DebugManager.markFPS();
      pulse.DebugManager.startUpdate();
    }

    if(this.loopLogic) {
      this.loopLogic(this.scenes, elapsed);
    }

    var activeScenes = this.scenes.getScenes(true);

    for(var su = 0; su < activeScenes.length; su++)
    {
      activeScenes[su].update(elapsed);
    }

    if(pulse.DebugManager) {
      pulse.DebugManager.stopUpdate();
      pulse.DebugManager.resetDraws();
      pulse.DebugManager.startDraw();
    }

    for(var sd = 0; sd < activeScenes.length; sd++)
    {
      activeScenes[sd].draw();
    }

    if(pulse.DebugManager) {
      pulse.DebugManager.stopDraw();
      pulse.DebugManager.update(elapsed);
    }

    this._private.lastTime = this._private.currentTime;
  }
});