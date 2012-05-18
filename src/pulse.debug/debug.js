pulse.debug.visualDebug = false;
pulse.debug.visualDebugColors = [
	'000000', //Default/Undefined
	'808080', //Layer
	'800080', //Sprite
	'FF0000', //CanvasLabel
	'FFFF00'  //BitmapLabel
];

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

		if(this.debugging === true || pulse.debug.visualDebug === true){
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