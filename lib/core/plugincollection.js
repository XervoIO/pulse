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

pulse.plugin.PluginCollection = PClass.extend({
  init: function() {
    this._private = {};
    this._private.plugins = Array();
  },

  add: function(plugin) {
    this._private.plugins.push(plugin);
  },

  invoke: function() {
    for(var key in this._private.plugins) {
      this._private.plugins[key].invoke.apply(
        this._private.plugins[key], arguments);
    }
  }
});

pulse.plugins = pulse.plugins || new pulse.plugin.PluginCollection();