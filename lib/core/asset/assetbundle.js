/**
 * A collection of assets to load.
 * @author PFP
 * @class A collection of assets to load
 * @constructor
 * @copyright 2011 Paranoid Ferret Productions
 */
PFPlay.AssetBundle = Class.extend(
/** @lends PFPlay.AssetBundle.prototype */
{
  /** @constructs */
  init: function(params) {
    
    /**
     * The collection of assets to load.
     * @type {Array}
     */
    this.assets = new Array();
    
    /**
     * Event handler for this bundle.
     * @type {HTML Image}
     */
    this.events = new PFPlay.EventManager();
    
    /** 
     * @private
     * Private properties of the bundle.
     * @type {object}
     */
    this._private = { };
    
    /** 
     * @private
     * The number of assets in this bundle that have been loaded.
     * @type {integer}
     */
    this._private.numberLoaded = 0;
    
    /**
     * The process percentage of how much of the raw file has been loaded.
     * @type {float}
     */
    this.percentLoaded = 0.00;
  },
  
  /**
   * Adds an asset to the collection and binds a load event that is
   * fired when the asset has loaded and is ready to use.
   */
  addAsset: function(asset) {
    if(asset instanceof PFPlay.Asset)
    {
      var _self = this;
      
      asset.events.bind('load', function(evt) {
        //Update the number of assets loaded and the percent loaded
        _self._private.numberLoaded++;
        _self.percentLoaded = 
          _self._private.numberLoaded / _self.assets.length * 100;
        
        //Convert the percent to a 0.00 format (truncate extra digits)
        _self.percentLoaded = parseFloat(_self.percentLoaded.toFixed(2));
        
        //When 100% loaded, fire off a complete event.
        if(_self.percentLoaded == 100)
          _self.events.raiseEvent('complete', {});
      });
      
      this.assets.push(asset);
    }
  },
  
  /**
   * Forces any unloaded assets to begin loading.In most cases these will
   * be non-autoloaded assets.
   */
  load: function() {
    for(var a = 0; a < this.assets.length; a++)
      this.assets[a].load();
  }
});