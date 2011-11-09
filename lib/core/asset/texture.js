/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * Raw 2d image.
 * @param {string} filename the path to the raw image.
 * @author Richard Key
 * @class Basic 2d image
 * @constructor
 */
PFPlay.Texture = PFPlay.Asset.extend(
/** @lends PFPlay.Texture.prototype */
{
  /** @constructs */
  init: function(params) {
    
    //Call the base constructor
    this._super(params);
    
    /**
     * The HTML Image object.
     * @type {HTML Image}
     */
    this._private.image = new Image();
    
    if(this.autoLoad == true)
      this._private.image.src = this.filename;
    
    var _self = this;
    
    /**
     * This sets the loaded bit and percentLoaded when the image has 
     * loaded.
     */
    this._private.image.onload = function()
    {
      _self.loaded = true;
      _self.percentLoaded = 100;
    };
    
    this._private.image.onerror = function()
    {
      _self.error = true;
    };
    
    this.load = function() {
      if(_self.autoLoad == true)
        return;
        
      _self._private.image.src = _self.filename;
    }
  },
  
  load: function() {
    
  }
});
