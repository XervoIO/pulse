/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

pulse.PluginManager = PClass.extend(
{
	init : function() {
		this._private = { };
		this._private.types = { };

		this.callbackTypes = { onEnter : 'onEnter', onExit : 'onExit' };
	},

	subscribe : function(type, source, callbackType, callback) {
		if(this._private.types[type] == undefined) {
			this._private.types[type] = { };
		}

		if(this._private.types[type][source] == undefined) {
			this._private.types[type][source] = { };
		}

		if(this._private.types[type][source][callbackType] == undefined) {
			this._private.types[type][source][callbackType] = new Array();
		}

		this._private.types[type][source][callbackType].push(callback);
	},

	invoke : function(type, source, callbackType, sender, params) {
		if(this._private.types[type] != undefined &&
			this._private.types[type][source] != undefined &&
			this._private.types[type][source][callbackType] != undefined) {
			
			for(var key in this._private.types[type][source][callbackType]) {
				this._private.types[type][source][callbackType][key].apply(sender, params);
			}		
		}
	}

});

pulse.plugin = new pulse.PluginManager();