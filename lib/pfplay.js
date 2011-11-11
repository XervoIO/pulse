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
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
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
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();



//Define the namespace
if (typeof PFPlay == 'undefined') {
  /**
   * This is the base PFPlay namespace.
   * @author PFP
   * @namespace Holds all the PFPlay engine classes
   * @copyright 2011 Paranoid Ferret Productions
   */
  PFPlay = {
    events: {
      'mousedown': 'mouse',
      'mouseup': 'mouse',
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
      'complete' : 'action'
    },
    
    coreFiles: [
      'core/error',
      'core/util',
      'core/event/eventproperties',
      'core/event/eventmanager',
      'core/node',
      'core/asset/asset',
      'core/asset/texture',
      'core/asset/bitmapfont',
      'core/asset/sound',
      'core/asset/assetbundle',
      'core/asset/assetmanager',
      'core/visual',
      'core/image',
      'core/action/action',
      'core/action/animateaction',
      'core/sprite',
      'core/bitmaplabel',
      'core/canvaslabel',
      'core/layer',
      'core/scene',
      'core/scenemanager',
      'core/engine'
    ],
    gameFiles: [],
    
    addGameFile: function(src)
    {
      PFPlay.gameFiles.push(src);
    },
    
    generateScriptTag: function(src)
    {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      return script;
    },
    
    init: function(libSrc)
    {
      var head = document.getElementsByTagName('head')[0];
  
      for(var f = 0; f < PFPlay.coreFiles.length; f++)
      {
        var include = libSrc + '/' + PFPlay.coreFiles[f] + '.js';
        head.appendChild(PFPlay.generateScriptTag(include));
      }
      
      for(var f = 0; f < PFPlay.gameFiles.length; f++)
      {
        head.appendChild(PFPlay.generateScriptTag(PFPlay.gameFiles[f]));
      }
    }
  };
}

PFPlay.DEBUG = false;
