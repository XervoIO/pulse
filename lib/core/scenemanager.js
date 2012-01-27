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
 * @copyright 2011 Paranoid Ferret Productions
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
    if(scene instanceof pulse.Scene &&
      !this.scenes.hasOwnProperty(scene.name))
    {
      scene.setDefaultSize(
        this.gameWindow.clientWidth,
        this.gameWindow.clientHeight);

      this.scenes[scene.name] = scene;
    }
  },

  /**
   * Removes a scene from this scene manager by name.
   * @param {string} name the scene name
   */
  removeScene : function(name) {
    if(this.scenes.hasOwnProperty(name)) {
      delete this.scenes[name];
    }
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