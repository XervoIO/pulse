/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * The base type for all visual elements added to the world. This debug version
 * includes debugging code for counting draws.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the visual node
 * @author PFP
 * @class visual debug node
 * @augments pulse.Visual
 * @copyright 2012 Paranoid Ferret Productions
 */
pulse.debug.Visual = pulse.Visual.extend(
/** @lends pulse.debug.Visual.prototype */
{
  /**
   * Draws this visual node to passed in context. This is draw the canvas
   * for this visual node on the context applying rotation, scale, and
   * alpha.
   * @param {CanvasRenderingContext2D} ctx the context in which to draw
   * visual on
   */
  draw : function(ctx) {
    if(pulse.DebugManager) {
      pulse.DebugManager.incrementDraws();
    }

    this._super(ctx);
  }
});