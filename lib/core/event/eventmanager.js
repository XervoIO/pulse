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
 * @copyright 2011 Paranoid Ferret Productions
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
  },

  /**
   * Binds a callback to an event type.
   * @param {string} type the event type to bind
   * @param {function} callback the function callback to bind to the event
   */
  bind : function(type, callback) {
    if(!this._private.events.hasOwnProperty(type)) {
      this._private.events[type] = [];
      this._private.events[type].push(callback);
    } else {
      this._private.events[type].push(callback);
    }
  },

  /**
   * Unbinds any callbacks from and event type.
   * @param {string} type the event type to unbind from
   */
  unbind : function(type) {
    if(this._private.events.hasOwnProperty(type)) {
      delete this._private.events[type];
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
  }
});

/**
 * Static property to hold the currently dragged objects
 */
pulse.EventManager.DraggedItems = {};