/**
 * Whether or not to globally draw debug information
 * on visual nodes.
 * @type {boolean}
 */
pulse.debug.visualDebug = false;

/**
 * The colors to use for visual debugging.
 * @type {array}
 */
pulse.debug.visualDebugColors = [
	'000000', //Default/Undefined
	'808080', //Layer
	'800080', //Sprite
	'FF0000', //CanvasLabel
	'FFFF00'  //BitmapLabel
];

pulse.debug.manager = new pulse.debug.DebugManager();
pulse.debug.plugin = new pulse.plugin.Plugin();

var loopCallback = pulse.debug.plugin.subscribe(
	'pulse.Engine',
	'loop',
	pulse.plugin.PluginCallbackTypes.onEnter,
	function(params) {
		pulse.debug.manager.setEngine(this);

		//Only need to set the engine once.
		pulse.debug.plugin.unsubscribe(loopCallback);
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
	function(ctx) {
		if(this.updated === true) {
			pulse.debug.manager.incrementDraws();
		}
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Visual',
	'draw',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(ctx) {
		//Draw the visual debugging information if requested
		if(this.debugging === true || pulse.debug.visualDebug === true){
			var color = '#';
			if(this instanceof pulse.Layer) {
				color += pulse.debug.visualDebugColors[1];
			} else if(this instanceof pulse.Sprite) {
				color += pulse.debug.visualDebugColors[2];
			} else if(this instanceof pulse.CanvasLabel) {
				color += pulse.debug.visualDebugColors[3];
			} else if(this instanceof pulse.BitmapLabel) {
				color += pulse.debug.visualDebugColors[4];
			} else {
				color += pulse.debug.visualDebugColors[0];
			}

			//Draw a dot on the anchor point
			ctx.save();
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(
				this.positionTopLeft.x + this.canvas.width / 2,
				this.positionTopLeft.y + this.canvas.height / 2,
				3, 0, Math.PI * 2, true
			);
			ctx.closePath();
			ctx.fill();
			ctx.restore();

			//Draw a bounding box
			ctx.strokeStyle = color;
			ctx.strokeRect(
				this.positionTopLeft.x / Math.abs(this.scale.x),
				this.positionTopLeft.y / Math.abs(this.scale.y),
				this.size.width,
				this.size.height
			);
		}
		
	}
);

//Add nodes to the inspector as they are added to the game
pulse.debug.plugin.subscribe(
	'pulse.Layer',
	'addNode',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.addNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Layer',
	'removeNode',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.removeNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Scene',
	'addLayer',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.addNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.Scene',
	'removeLayer',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.removeNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.SceneManager',
	'addScene',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.addNode(params);
	}
);

pulse.debug.plugin.subscribe(
	'pulse.SceneManager',
	'removeScene',
	pulse.plugin.PluginCallbackTypes.onExit,
	function(params) {
		pulse.debug.manager.removeNode(params);
	}
);

pulse.plugins.add(pulse.debug.plugin);

//Convenience function for logging messages to the console
pulse.log = function(message, type) {
	if(type === 'error') {
		pulse.debug.manager.logError(message);
	} else if(type === 'warning') {
		pulse.debug.manager.logWarning(message);
	} else {
		pulse.debug.manager.logDebug(message);
	}
};