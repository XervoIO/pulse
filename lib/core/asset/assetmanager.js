/**
 * Asset manager is a common respository for all assets, and handles
 * all assets for an engine instance.
 * @author PFP
 * @class The master manager for all assets in a game.
 * @constructor
 * @copyright 2011 Paranoid Ferret Productions
 */
PFPlay.AssetManager = Class.extend({
  init: function() {
    
    this.bundles = {};
    
    this.addBundle(new PFPlay.AssetBundle(), 'global');
    this.bundles['global'].percentLoaded = 100;
    
    this._private = { };
    
    this._private.bundlesLoaded = 1;
    
    this.percentLoaded = 0.00;
    
    this.events = new PFPlay.EventManager();
  },
  
  addBundle: function(bundle, name) {
    if(bundle instanceof PFPlay.AssetBundle 
      && !this.bundles.hasOwnProperty(name))
    {
      var _self = this;
      
      bundle.events.bind('complete', function(evt) {
        _self._private.bundlesLoaded++;
        
        _self.updatePercent();
        
        if(_self.percentLoaded == 100)
          _self.events.raiseEvent('complete', {});
      });
      
      this.bundles[name] = bundle;
    }
  },
  
  addAsset: function(asset, bundle) {
    if(asset instanceof PFPlay.Asset)
    {
      if(typeof bundle == 'string')
      {
        if(!this.bundles.hasOwnProperty(bundle))
        {
          this.bundles[bundle] = new PFPlay.AssetBundle();
        }
        
        this.bundles[bundle].addAsset(asset);
        
        if(this.bundles[bundle].percentLoaded == 100)
          this.loadedBundles--;
      }
      else
      {
        this.bundles['global'].addAsset(asset);
        this.loadedBundles--;
      }
    }
  },
  
  load: function() {
    for(var b in this.bundles)
      this.bundles[b].load();
  },
  
  updatePercent: function() {
    var totalPercent = PFPlay.util.getLength(this.bundles) * 100;
    var percent = 0;
    
    for(var b in this.bundles)
      percent = percent + this.bundles[b].percentLoaded;
      
    this.percentLoaded = percent / totalPercent * 100;
    this.percentLoaded = parseFloat(this.percentLoaded.toFixed(2));
  }
});
