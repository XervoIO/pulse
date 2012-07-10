/*global PClass:true */

/**
* Namespace declaration if needed.
* @namespace
*/
var pulse = pulse || {};

/**
* Namespace declaration if needed.
* @namespace
*/
pulse.plugin = pulse.plugin || {};

/**
* Manages the subscribing and invoking of plugin callbacks.
* @class Plugin
* @author PFP
* @copyright 2012 Modulus
*/
pulse.plugin.Plugin = PClass.extend(
/** @lends pulse.plugin.Plugin.prototype */
{
  /** @constructs */
  init: function () {

    /**
    * @private
    * Private properties of the plugin manager.
    * @type {object}
    */
    this._private = {};
    this._private.types = {};
  },

  /**
  * Subscribes a callback to a function and type.
  * @param {string} objectType The object type to subscribe functions
  * callbacks to (e.g. 'pulse.Sprite')
  * @param {string} functionName The name of the function, that when called,
  * will invoke the specified callback
  * @param {string} callbackType The type of callback to hook.  Callbacks can
  * occur when the function enters or immediately before it exits.
  * Available types are defined in pulse.plugin.PluginCallbackTypes.
  * @param {function} callback The callback to invoke whenever the specified
  * function is called on the specified object type
  * @returns {pulse.plugin.PluginCallback} A callback object that can be used to manage the callback.
  */
  subscribe: function (objectType, functionName, callbackType, callback) {

    var pluginCallback = new pulse.plugin.PluginCallback({
      objectType: objectType,
      functionName: functionName,
      callbackType: callbackType,
      callback: callback,
      pluginManager: this
    });

    if (this._private.types[objectType] == undefined) {
      this._private.types[objectType] = {};
    }

    if (this._private.types[objectType][functionName] == undefined) {
      this._private.types[objectType][functionName] = {};
    }

    if (this._private.types[objectType][functionName][callbackType] == undefined) {
      this._private.types[objectType][functionName][callbackType] = [];
    }

    this._private.types[objectType][functionName][callbackType].push(pluginCallback);

    return pluginCallback;
  },

  /**
   * Invokes a callback.
   * @param {string} objectType The object type.
   * @param {string} functionName The name of the function.
   * @param {string} callbackType The type of callback (enter, exit).
   * @param {object} sender The instance that caused the callback.
   * @param {arguments} params Argument array that contains the arguments passed into the source function.
   * @private
   */
  invoke: function (objectType, functionName, callbackType, sender, params) {
    if ((typeof this._private.types[objectType] !== pulse.plugin._UNDEFINED) &&
            (typeof this._private.types[objectType][functionName] !== pulse.plugin._UNDEFINED) &&
            (typeof this._private.types[objectType][functionName][callbackType] !== pulse.plugin._UNDEFINED)) {

      var len = this._private.types[objectType][functionName][callbackType].length;
      for(var i = 0; i < len; i++) {
        this._private.types[objectType][functionName][callbackType][i].callback.apply(sender, params);
      }
    }
  },

  /**
   * Unscribes a callback.
   * @param {pulse.plugin.PluginCallback} pluginCallback The callback to unsubscribe.
   */
  unsubscribe: function (pluginCallback) {
    if (this._private.types[pluginCallback.objectType] != undefined &&
            this._private.types[pluginCallback.objectType][pluginCallback.functionName] != undefined &&
            this._private.types[pluginCallback.objectType][pluginCallback.functionName][pluginCallback.callbackType] != undefined) {

      var callbacks = this._private.types[pluginCallback.objectType][pluginCallback.functionName][pluginCallback.callbackType];
      // Find the callback and remove it.
      for (var key in callbacks) {
        if (callbacks[key] == pluginCallback) {
          callbacks.splice(key, 1);
        }
      }
    }
  }

});

/**
 * Represents a single callback.
 * @class Plugin Callback
 * @author PFP
 * @copyright 2012 Modulus
 */
pulse.plugin.PluginCallback = PClass.extend(
/** @lends pulse.plugin.PluginCallback.prototype */
{
  /**
   * @constructs
   * @private
   */
  init: function (params) {
    this.objectType = params.objectType;
    this.functionName = params.functionName;
    this.callbackType = params.callbackType;
    this.callback = params.callback;
  }
});

/**
 * The available types of callbacks that can be hooked.
 * @static
 */
pulse.plugin.PluginCallbackTypes = { onEnter: 'onEnter', onExit: 'onExit' };
pulse.plugin._UNDEFINED = 'undefined';