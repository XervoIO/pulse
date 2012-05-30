/*global PClass:true */

/**
 * @fileoverview An Object to hold two values, typically x and y coordinates.
 * @author PFP
 * @copyright 2012 Modulus
 */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Points are a simple objects that hold two values, x and y. Typically they
 * are used to indicate positions in a 2-Dimensional plane.
 * @param {object} params parameters that can be set as initialized options
 * on the point
 * @config {string|number} x The x coordinate of the point.
 * @config {string|number} y The y coordinate of the point.
 * @author PFP
 * @class The point object.
 * @copyright 2012 Modulus
 */
pulse.Point = PClass.extend(
/** @lends pulse.Point.prototype */
{
  /** @constructs */
  init: function(params) {

    params = pulse.util.checkParams(params, {
      x : 0,
      y : 0
    });

    /**
     * The x coordinate of the point.
     * @type {number}
     */
    this.x = params.x;

    /**
     * The y coordinate of the point.
     * @type {number}
     */
    this.y = params.y;
  }
});