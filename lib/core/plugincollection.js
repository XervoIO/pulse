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
 * Holds a collection of plugins.
 * @author PFP
 * @class Plugin Collection
 * @copyright 2012 Paranoid Ferret Productions
 */
pulse.plugin.PluginCollection = PClass.extend({

  /** 
   * @constructs
   * @private
   */
  init: function() {
    this._private = {};
    this._private.plugins = Array();
  },

  /**
   * Adds a plugin to the collection.
   * @param {pulse.Plugin} plugin The plugin to add.
   */
  add: function(plugin) {
    this._private.plugins.push(plugin);
  },

  /**
   * Invokes every plugin with the supplied arguments.
   * @private
   */
  invoke: function() {
    for(var key in this._private.plugins) {
      this._private.plugins[key].invoke.apply(
        this._private.plugins[key], arguments);
    }
  }
});

pulse.plugins = pulse.plugins || new pulse.plugin.PluginCollection();