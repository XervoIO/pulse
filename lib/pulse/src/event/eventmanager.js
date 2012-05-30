/*global PClass:true */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Event manager which handles binding and calling event callbacks to event
 * types.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {object} [owner] the owner of this event manager
 * @config {function} [masterCallback] callback for all events raised
 * @class scene manager class
 * @author PFP
 * @copyright 2012 Modulus
 */
pulse.EventManager = PClass.extend(
/** @lends pulse.EventManager.prototype */
{
  /** @constructs */
  init : function(params) {

    params = pulse.util.checkParams(params, {
      owner : null,
      masterCallback: null
    });

    /**
     * The owner of this event manager and handler of any master callback.
     * @type {object}
     */
    this.owner = params.owner;

    /**
     * The master callback for this event manager. This function will be
     * called for any events raised.
     * @type {function}
     */
    this.masterCallback = params.masterCallback;

    /**
     * @private
     * Private properties of the event manager. Should not need or use these.
     * @type {object}
     */
    this._private = { };

    /**
     * @private
     * The event bindings for this event manager. The bindings are held in an
     * associative array (object).
     * @type {object}
     */
    this._private.events = { };
    
    this._private.touchDown = false;
  },

  /**
   * Binds a callback to an event type.
   * @param {string} type the event type to bind
   * @param {function} callback the function callback to bind to the event
   */
  bind : function(type, callback) {
    var evtName = this.checkType(type);
    
    if(!this._private.events.hasOwnProperty(evtName)) {
      this._private.events[evtName] = [];
      this._private.events[evtName].push(callback);
    } else {
      this._private.events[evtName].push(callback);
    }
  },

  /**
   * Unbinds any callbacks from and event type.
   * @param {string} type the event type to unbind from
   */
  unbind : function(type) {
    var evtName = this.checkType(type);
    
    if(this._private.events.hasOwnProperty(evtName)) {
      delete this._private.events[evtName];
    }
  },

  /**
   * Unbinds a specific callback from event type.
   * @param  {string} type the event type to unbind from
   * @param  {function} callback the function callback to unbind
   */
  unbindFunction : function(type, callback) {
    var evtName = this.checkType(type);
    
    if(this._private.events.hasOwnProperty(evtName)) {
      for(var i = this._private.events[evtName].length - 1; i >= 0; i--) {
        if(this._private.events[evtName][i] === callback) {
          this._private.events[evtName].splice(i, 1);
        }
      }
    }
  },

  /**
   * Checks to see if an event type has a callback currently.
   * @param {string} type the event type to check
   * @return {boolean} true if there is a callback attached to the event type
   */
  hasEvent : function(type) {
    if(this._private.events.hasOwnProperty(type)) {
      return true;
    }

    return false;
  },

  /**
   * Raises an event from this event manager. This will call the callback
   * (if one exists) for the event type. It will also call the master callback
   * if it is set.
   * @param {string} type the event type to raise
   * @param {object} the event object to raise
   */
  raiseEvent : function(type, evt) {
    if(type === 'touchstart' && this._private.touchDown === false) {
      this._private.touchDown = true;
    } else if(type === 'touchend' && this._private.touchDown === true) {
      this.raiseEvent('touchclick', evt);
    } else if (type === 'touchclick' || type === 'mouseout') {
      this._private.touchDown = false;
    }

    if(this.hasEvent(type)) {
      for(var e = 0; e < this._private.events[type].length; e++) {
        this._private.events[type][e](evt);
      }
    }

    if(typeof this.masterCallback === 'function') {
      if(this.owner) {
        this.masterCallback.call(this.owner, type, evt);
      } else {
        this.masterCallback(type, evt);
      }
    }
  },
  
  /**
   * Checks the browser support of the event, and translates the event name to
   * an event that is supported in necessary and available.
   * @param {string} type the event type to check
   */
  checkType : function(type) {
    //Translate
    if(type === 'click' && pulse.util.eventSupported('touchend')) {
      return 'touchclick';
    }
    
    for(var t in pulse.eventtranslations) {
      if(type === pulse.eventtranslations[t] &&
        pulse.util.eventSupported(t)) {
        return t;
      }
    }
    
    return type;
  }
});

/**
 * Static property to hold the currently dragged objects
 */
pulse.EventManager.DraggedItems = {};