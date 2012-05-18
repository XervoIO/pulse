pulse.debug.plugin = new pulse.plugin.Plugin();
pulse.debug.manager = new pulse.debug.DebugManager();
pulse.debug.log = function(message, type) {
	if(type === 'error') {
		pulse.debug.manager.logError(message);
	} else if(type === 'warning') {
		pulse.debug.manager.logWarning(message);
	} else {
		pulse.debug.manager.logDebug(message);
	}
};


pulse.debug.plugin.subscribe(
	'pulse.Engine',
	'loop',
	pulse.plugin.PluginCallbackTypes.onEnter,
	function(params) {
		if(pulse.debug.manager.running === false) {
			pulse.debug.manager.setEngine(this);
			pulse.debug.manager.running = true;
		}
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Engine',
	'update',
	pulse.plugin.PluginCallbackTypes.onEnter,
	function(params) {
		pulse.debug.manager.markFPS();
		pulse.debug.manager.startUpdate();
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Engine',
	'update',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.stopUpdate();
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Engine',
	'draw',
	pulse.plugin.PluginCallbackTypes.onEnter,
	function(params) {
		pulse.debug.manager.resetDraws();
		pulse.debug.manager.startDraw();
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Engine',
	'draw',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.stopDraw();
		pulse.debug.manager.update(this.masterTime);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Visual',
	'draw',
	pulse.plugin.PluginCallbackTypes.onEnter,
	function(params) {
		if(this.updated === true) {
			pulse.debug.manager.incrementDraws();
		}
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Layer',
	'addnode',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.addNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Layer',
	'removenode',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.removeNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Scene',
	'addlayer',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.addNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Scene',
	'removelayer',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.removeNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.SceneManager',
	'addscene',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.addNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.SceneManager',
	'removescene',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.removeNode(params);
	}
);

pulse.plugins.add(pulse.debug.plugin);

pulse.ready(function(){
	
});