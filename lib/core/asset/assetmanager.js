/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * Asset manager is a common respository for all assets, and handles
 * all assets for an engine instance.
 * @author Richard Key
 * @class The master manager for all assets in a game.
 * @constructor
 */
PFPlay.AssetManager = Class.extend({
  init: function() {
    
    this.bundles = {
      default: new Array()
    };
  }
});
