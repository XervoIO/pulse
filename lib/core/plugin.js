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
* @copyright 2012 Paranoid Ferret Productions
*/
pulse.plugin.Plugin = PClass.extend(
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
  * Update function called on each loop in the engine
  * @param {string} objectType The object type to subscribe functions 
  * callbacks to (e.g. 'pulse.Sprite')
  * @param {string} functionName The name of the function, that when called, 
  * will invoke the specified callback
  * @param {string} callbackType The type of callback to hook.  Callbacks can
  * occur when the function enters or immediately before it exits.
  * Available types are defined in pulse.plugin.PluginCallbackTypes.
  * @param {function} callback The callback to invoke whenever the specified 
  * function is called on the specified object type 
  * TODO: returns
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
      this._private.types[objectType][functionName][callbackType] = new Array();
    }

    this._private.types[objectType][functionName][callbackType].push(pluginCallback);

    return pluginCallback;
  },

  invoke: function (objectType, functionName, callbackType, sender, params) {
    if (this._private.types[objectType] != undefined &&
            this._private.types[objectType][functionName] != undefined &&
            this._private.types[objectType][functionName][callbackType] != undefined) {

      for (var key in this._private.types[objectType][functionName][callbackType]) {
        this._private.types[objectType][functionName][callbackType][key].callback.apply(sender, params);
      }
    }
  },

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

pulse.plugin.PluginCallback = PClass.extend(
{
  init: function (params) {
    this.objectType = params.objectType;
    this.functionName = params.functionName;
    this.callbackType = params.callbackType;
    this.callback = params.callback;
  }
});


pulse.plugin.PluginCallbackTypes = { onEnter: 'onEnter', onExit: 'onExit' };