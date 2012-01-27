/*global PClass:true */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Simple class for holding properties for an event
 * @class Event properties
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.Event = PClass.extend(
/** @lends pulse.Event.prototype */
{
  /** @constructs */
  init : function() {
    /**
     * The raiser of the event.
     * @type {object}
     */
    this.sender = null;
  }
});

/**
 * Simple class for holding properties for a mouse event
 * @class Mouse event properties
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.MouseEvent = pulse.Event.extend(
/** @lends pulse.MouseEvent.prototype */
{
  /** @constructs */
  init : function() {

    // call the base constructor
    this._super();

    /**
     * Event position relative to the entire html window.
     * @type {point}
     */
    this.window = {
      x : 0,
      y : 0
    };

    /**
     * Event position relative to the game window.
     * @type {point}
     */
    this.world = {
      x : 0,
      y : 0
    };

    /**
     * Event position relative to the parent of object which the event was
     * raised from.
     * @type {point}
     */
    this.parent = {
      x : 0,
      y : 0
    };

    /**
     * Event position relative to the object in which the event was raised from.
     * @type {point}
     */
    this.position = {
      x : 0,
      y : 0
    };

    /**
     * The scroll delta for mouse wheel. This is only filled in for mousewheel
     * events.
     * @type {number}
     */
    this.scrollDelta = 0;
  }
});