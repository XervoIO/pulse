/**
 * Request animation frame shim to use the correct animation frame animation.
 */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.PClass = function(){};

  // Create a new Class that inherits from this class
  PClass.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function PClass() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    PClass.prototype = prototype;

    // Enforce the constructor to be what we expect
    PClass.prototype.constructor = PClass;

    // And make this class extendable
    PClass.extend = arguments.callee;

    return PClass;
  };
})();



//Define the namespace
if (typeof pulse == 'undefined') {
  /**
   * This is the base pulse namespace.
   * @author PFP
   * @namespace Holds all the pulse engine classes
   * @copyright 2012 Paranoid Ferret Productions
   */
  pulse = {
    events: {
      'mousedown': 'mouse',
      'mouseup': 'mouse',
      'mouseover': 'mouse',
      'mouseout': 'mouse',
      'click': 'mouse',
      'mousemove': 'mouse',
      'mousewheel' : 'mouse',
      'keyup': 'keyboard',
      'keydown': 'keyboard',
      'keypress': 'keyboard'
    },

    customevents: {
      'dragstart' : 'drag',
      'dragdrop' : 'drag',
      'dragenter' : 'drag',
      'dragover' : 'drag',
      'dragexit' : 'drag',
      'complete' : 'action',
      'finished' : 'audio'
    },

    coreFiles: [
      'other/soundmanager2',
      'core/error',
      'core/util',
      'core/point',
      'core/event/eventproperties',
      'core/event/eventmanager',
      'core/node',
      'core/asset/asset',
      'core/asset/textfile',
      'core/asset/texture',
      'core/asset/bitmapfont',
      'core/asset/sound',
      'core/asset/assetbundle',
      'core/asset/assetmanager',
      'core/visual',
      //'core/image',
      'core/action/action',
      'core/action/animateaction',
      'core/action/moveaction',
      'core/sprite',
      'core/bitmaplabel',
      'core/canvaslabel',
      'core/layer',
      'core/scene',
      'core/scenemanager',
      'core/engine',
      'pulse.physics/box2d',
      'pulse.physics/sprite',
      'pulse.physics/layer'
    ],
    gameFiles: [],

    addGameFile: function(src)
    {
      pulse.gameFiles.push(src);
    },

    generateScriptTag: function(src)
    {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      return script;
    },

    init: function(libSrc) {
      pulse.libsrc = libSrc;
      var head = document.getElementsByTagName('head')[0];

      var files = [ ];
      for(var f in pulse.coreFiles) {
        files.push('order!' + libSrc + "/" + pulse.coreFiles[f]);
      }
      for(var f in pulse.gameFiles) {
        files.push('order!' + pulse.gameFiles[f]);
      }

      require(files, function() {
        pulse.isReady = true;
        setTimeout(pulse.notifyReady, 10);
      });
    }
  };
}

pulse.libsrc = "";
pulse.isReady = false;
pulse.readyCallbacks = [ ];

pulse.ready = function(callback) {

  // Pulse is already ready, just notify it now.
  if(pulse.isReady) {
    callback();
  }

  pulse.readyCallbacks.push(callback);
};

pulse.notifyReady = function() {
  // Notify anyone listening that the engine is now ready.
  for(var idx in pulse.readyCallbacks) {
    pulse.readyCallbacks[idx]();
  }
};

pulse.DEBUG = false;
