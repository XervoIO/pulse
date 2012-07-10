/*global PClass:true */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Scene manager for adding, activating, and deactivating scenes.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {DOMElement} [gameWindow] the game window element to use
 * @class scene manager class
 * @author PFP
 * @copyright 2012 Modulus
 */
pulse.SceneManager = PClass.extend(
/** @lends pulse.SceneManager.prototype */
{
  /** @constructs */
  init : function(params) {

    params = pulse.util.checkParams(params, {
      gameWindow: document.getElementsByTagName('body')[0]
    });

    /**
     * Associative array (object) of scenes available.
     * @type {objec}
     */
    this.scenes = {};

    /**
     * The parent of this object.  Typically a pulse.Engine instance.
     * @type {object}
     */
    this.parent = null;

    /**
     * The game window element in the html dom.
     * @type {DOMElement}
     */
    this.gameWindow = params.gameWindow;
  },

  /**
   * Adds a scene to the scene manager.
   * @param {pulse.Scene} scene the scene to add
   */
  addScene : function(scene) {
    // Plugin support.
    pulse.plugins.invoke(
      'pulse.SceneManager',
      'addScene',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    if(scene instanceof pulse.Scene &&
      !this.scenes.hasOwnProperty(scene.name))
    {

      // Set the scene's parent to the this object's parent - the pulse.Engine instance.
      scene.parent = this.parent;

      var width = this.gameWindow.clientWidth;
      var height = this.gameWindow.clientHeight;

      if(width === 0 && this.gameWindow.style.width) {
        width = parseInt(this.gameWindow.style.width);
      }
      if(height === 0 && this.gameWindow.style.height) {
        height = parseInt(this.gameWindow.style.height);
      }

      scene.setDefaultSize(width, height);

      this.scenes[scene.name] = scene;
    }

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.SceneManager',
      'addScene',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Removes a scene from this scene manager by name.
   * @param {string} name the scene name
   */
  removeScene : function(name) {
    // Plugin support.
    pulse.plugins.invoke(
      'pulse.SceneManager',
      'removeScene',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    if(name instanceof pulse.Scene) {
      name = name.name;
    }

    if(this.scenes.hasOwnProperty(name)) {
      delete this.scenes[name];
    }

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.SceneManager',
      'removeScene',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Activates a scene in this scene manager by name.
   * @param {string} name the scene name
   */
  activateScene : function(name) {
    if(name instanceof pulse.Scene) {
      name = name.name;
    }

    if(this.scenes.hasOwnProperty(name))
    {
      this.scenes[name].active = true;
      this.gameWindow.appendChild(this.scenes[name].getSceneContainer());
    }
  },

  /**
   * Deactivate a scene in this scene manager by name.
   * @param {string} name the scene name
   */
  deactivateScene : function(name) {
    if(name instanceof pulse.Scene) {
      name = name.name;
    }

    if(this.scenes.hasOwnProperty(name) && this.scenes[name].active)
    {
      this.scenes[name].active = false;
      this.gameWindow.removeChild(this.scenes[name].getSceneContainer());
    }
  },

  /**
   * Returns a scene from the scene manager by name.
   * @param {string} name the scene name
   * @return {pulse.Scene} scene from the scenes object by name
   */
  getScene : function(name) {
    return this.scenes[name];
  },

  /**
   * Gets scenes from the scene manager by whether they are active.
   * @param {boolean} active the active state to retrieve
   * @return {array} array of the active scenes
   */
  getScenes : function(active)
  {
    var scenes = [];

    for(var s in this.scenes) {
      if(active === true) {
        if(this.scenes[s].active === true) {
          scenes.push(this.scenes[s]);
        }
      } else {
        scenes.push(this.scenes[s]);
      }
    }

    return scenes;
  }
});