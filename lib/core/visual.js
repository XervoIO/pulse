/**
 * The base type for all visual elements added to the world.
 * @class
 */
PFPlay.Visual = PFPlay.Node.extend({
  init: function() {
    this._super();
  }
});

/**
 * The alpha transparency of the visual from 0-100.
 * @type {number}
 */
PFPlay.Visual.alpha = 100;
