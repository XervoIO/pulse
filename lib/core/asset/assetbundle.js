/**
 * @author Neo
 */
pulse.AssetBundle = PClass.extend({
  init: function(params) {
    
    this.assets = new Array();
    
    this.events = new pulse.EventManager();
    
    this._private = { };
    
    
    this._private.numberLoaded = 0;
     
    this.percentLoaded = 0.00;
  },
  
  addAsset: function(asset) {
    if(asset instanceof pulse.Asset)
    {
      var _self = this;
      
      asset.events.bind('load', function(evt) {
        _self._private.numberLoaded++;
        _self.percentLoaded = 
          _self._private.numberLoaded / _self.assets.length * 100;
        
        _self.percentLoaded = parseFloat(_self.percentLoaded.toFixed(2));
        
        if(_self.percentLoaded == 100)
          _self.events.raiseEvent('complete', {});
      });
      
      this.assets.push(asset);
    }
  },
  
  load: function() {
    for(var a = 0; a < this.assets.length; a++)
      this.assets[a].load();
  }
});