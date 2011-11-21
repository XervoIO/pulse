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
   * @copyright 2011 Paranoid Ferret Productions
   */
  pulse = {
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
      'complete' : 'action',
      'finished' : 'audio'
    }
  };
}


pulse.DEBUG = false;
