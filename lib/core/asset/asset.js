/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * The base class for all assets.
 * @param {string} filename the path to the raw file.
 * @author Richard Key
 * @class The base for assets.
 * @constructor
 */
PFPlay.Asset = PFPlay.Node.extend(
/** @lends PFPlay.Asset.prototype */
{
  /** @constructs */
  init: function(params) {
    
    //Call the base constructor
    this._super(params);
    
    params = PFPlay.util.checkParams(params, {
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
     * Event handler for this sprite.
     * @type {PFPlay.EventManager}
     */
    this.events = new PFPlay.EventManager();
    
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
