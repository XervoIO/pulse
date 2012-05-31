/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * The base class for all assets.
 * @param {string} filename the path to the raw file.
 * @author Richard Key
 * @class The base for assets.
 * @constructor
 * @copyright 2012 Modulus
 */
pulse.Asset = pulse.Node.extend(
/** @lends pulse.Asset.prototype */
{
  /**
   * Event rose when asset has completely loaded.
   * @name pulse.Asset#complete
   * @event
   * @param {object} data Object with asset that rose the event.
   * @config {pulse.Asset} asset The asset that rose the event.
   */

  /** @constructs */
  init: function(params) {

    //Call the base constructor
    this._super(params);

    params = pulse.util.checkParams(params, {
      filename : '',
      autoLoad : true
    });

    /**
     * The path to the raw file.
     * @type {string}
     */
    this.filename = params.filename;

    /**
     * This determines whether to begin loading the asset automatically,
     * or to wait for the developer to start the loading process.
     */
    this.autoLoad = params.autoLoad;

    /**
     * The process percentage of how much of the raw file has been loaded.
     * @type {float}
     */
    this.percentLoaded = 0.00;

    /**
     * Event handler for this asset.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager();

    /**
     * A flag to determine if there was an error loading the asset.
     * @type {boolean}
     */
    this.error = false;

    /**
     * @private
     * Private properties of the node. Should not need or use these.
     * @type {object}
     */
    this._private = { };
  },

  /**
   * Begins the loading process for the asset. In this base class it
   * does nothing.
   */
  load: function() {

  },

  /**
   * This should be called when asset has completed loading. Raises complete
   * event.
   */
  complete: function() {
    this.events.raiseEvent('complete', {asset: this});
  }
});
