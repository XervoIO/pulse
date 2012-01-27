/*global PClass:true */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * An asset bundle holds a collection of assets and provides management
 * functions to load and use assets.
 * @author PFP
 * @class An asset bundle that holds a collection of assets.
 * @constructor
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.AssetBundle = PClass.extend(
/** @lends pulse.AssetBundle.prototype */
{
  /** @constructs */
  init: function(params) {

    /**
     * The collection of assets
     * @type {array}
     */
    this.assets = [];

    /**
     * Event handler for the asset bundle.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager();

    /**
     * @private
     * Private properties of the asset bundle.
     * @type {object}
     */
    this._private = { };

    /**
     * @private
     * The number of assets that have been loaded.
     * @type {integer}
     */
    this._private.numberLoaded = 0;

    /**
     * The precentage of loaded assets in the bundle.
     * @type {float}
     */
    this.percentLoaded = 0.00;
  },

  /**
   * Adds an asset to the bundle.
   * @param {pulse.Asset} asset The Asset to add.
   */
  addAsset: function(asset) {
    if(asset instanceof pulse.Asset)
    {
      var _self = this;

      //Bind a load event to update the bundle's loaded percent.
      asset.events.bind('load', function(evt) {
        _self._private.numberLoaded++;
        _self.updatePercent();

        if(_self.percentLoaded === 100) {
          _self.events.raiseEvent('complete', {});
        }
      });

      this.assets.push(asset);
    }
  },

  /**
   * Retrieves an asset with the name provided from the bundle.
   * @param {string} name The name of the Asset to retrieve.
   */
  getAsset: function(name) {
    for(var a = 0; a < this.assets.length; a++)
    {
      if(this.assets[a].name === name) {
        return this.assets[a];
      }
    }

    return null;
  },

  /**
   * Forces all assets in the bundle to load.
   */
  load: function() {
    for(var a = 0; a < this.assets.length; a++) {
      this.assets[a].load();
    }
  },

  /**
   * Updates the percent loaded of the bundle, based on the number of
   * assets that have been loaded.
   */
  updatePercent: function() {
    this.percentLoaded =
      this._private.numberLoaded / this.assets.length * 100;

    this.percentLoaded = parseFloat(this.percentLoaded.toFixed(2));
  }
});