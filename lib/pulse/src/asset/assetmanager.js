/*global PClass:true */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Asset manager is a common respository for all assets, and handles
 * all assets for an engine instance.
 * @author PFP
 * @class The master manager for all assets in a game.
 * @constructor
 * @copyright 2012 Modulus
 */
pulse.AssetManager = PClass.extend(
/** @lends pulse.AssetManager.prototype */
{
  /**
   * Event rose when an asset, in any bundle, has been successfully loaded.
   * @name pulse.AssetManager#assetLoaded
   * @event
   * @param {string} asset The name of the asset that has been loaded.
   */

  /**
   * Event rose when the percent loaded has changed.
   * @name pulse.AssetManager#progressChanged
   * @event
   */

  /**
   * Event rose when all asset bundles have completely loaded.
   * @name pulse.AssetManager#complete
   * @event
   */

  /** @constructs */
  init: function() {

    /**
     * The bundles managed by this asset manager.
     * @type {array}
     */
    this.bundles = {};

    //Add a default 'global' bundle to this manager.
    this.addBundle(new pulse.AssetBundle(), 'global');
    this.bundles['global'].percentLoaded = 100;

    /**
     * @private
     * Private properties of the asset manager.
     * @type {object}
     */
    this._private = { };

    /**
     * @private
     * The number of bundles that have been loaded. Defaults to 1 because
     * the default bundle starts out loaded (no assets) and it is not
     * required to use it.
     * @type {integer}
     */
    this._private.bundlesLoaded = 1;

    /**
     * The precentage of loaded bundles in the manager.
     * @type {float}
     */
    this.percentLoaded = 0.00;

    /**
     * Event handler for the asset manager.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager();
  },

  /**
   * Adds an bundle to manage, if a bundle with the same name is not in the
   * bundle collection already.
   * @param {pulse.AssetBundle} bundle The bundle to add.
   * @param {string} name The name to assign to the bundle.
   */
  addBundle: function(bundle, name) {
    if(bundle instanceof pulse.AssetBundle &&
      !this.bundles.hasOwnProperty(name))
    {
      var _self = this;

      //Bind an update event to update the percent when
      bundle.events.bind('progressChanged', function(evt){
        _self.updatePercent();
      });

      bundle.events.bind('assetLoaded', function(evt){
        _self.events.raiseEvent('assetLoaded', evt);
      });

      this.bundles[name] = bundle;
    }
  },

  /**
   * Adds an asset to the bundle provided. If no bundle name is provided,
   * the asset with be added to the default ("global") bundle.
   * @param {pulse.Asset} asset The Asset to add.
   * @param {string} [bundle] The name of the bundle to add the asset to. If a
   * bundle name is not provided, the asset is added to the default bundle.
   */
  addAsset: function(asset, bundle) {
    if(asset instanceof pulse.Asset)
    {
      if(typeof bundle === 'string')
      {
        if(!this.bundles.hasOwnProperty(bundle)) {
          this.addBundle(new pulse.AssetBundle(), bundle);
        }

        this.bundles[bundle].addAsset(asset);

        if(this.bundles[bundle].percentLoaded === 100) {
          this.loadedBundles--;
        }
      }
      else
      {
        this.bundles['global'].addAsset(asset);

        if(this.bundles['global'].percentLoaded === 100)
        {
          this.bundles['global'].updatePercent();
          this.loadedBundles--;
        }
      }
    }
  },

  /**
   * Removes an asset from the bundle provided. If no bundle name is provided,
   * the asset with be removed from the default ("global") bundle.
   * @param {string|pulse.Asset} asset The asset or name of the asset to remove.
   * @param {string} [bundle] The name of the bundle to remove the asset from. If a
   * bundle name is not provided, the asset is removed from the default bundle.
   */
  removeAsset: function(asset, bundle) {
    if(typeof bundle === 'string')
    {
      if(this.bundles.hasOwnProperty(bundle)) {
        this.bundles[bundle].removeAsset(asset);
      }
    }
    else
    {
      this.bundles['global'].removeAsset(asset);
    }
  },

  /**
   * Gets an asset from the bundle with the bundle name provided, or from
   * the default bundle if no bundle name is provided.
   * @param {string} name The name of the Asset to get.
   * @param {string} [bundle] The name of the bundle to search. If a
   * bundle name is not provided, the default bundle is used.
   */
  getAsset: function(name, bundle) {
    if(bundle)
    {
      if(this.bundles.hasOwnProperty(bundle)) {
        return this.bundles[bundle].getAsset(name);
      }
    }
    else
    {
      return this.bundles['global'].getAsset(name);
    }
  },

  /**
   * Loads all the attached bundles via their load function.
   */
  load: function() {
    for(var b in this.bundles) {
      this.bundles[b].load();
    }
  },

  /**
   * Updates the percent loaded. This does not cause the complete event to
   * fire if the percent is calculated to be 100.
   */
  updatePercent: function() {
    var totalPercent = pulse.util.getLength(this.bundles) * 100;
    var percent = 0;

    for(var b in this.bundles) {
      percent = percent + this.bundles[b].percentLoaded;
    }

    this.percentLoaded = percent / totalPercent * 100;
    this.percentLoaded = parseFloat(this.percentLoaded.toFixed(2));

    this.events.raiseEvent('progressChanged', {});

    if(this.percentLoaded === 100) {
      this.events.raiseEvent('complete', {});
    }
  }
});