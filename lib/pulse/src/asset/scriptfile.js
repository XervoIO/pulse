/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Script file asset type, loads a javascript file.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string} filename the name of the script to download
 * @author PFP
 * @class Script File
 * @copyright 2013 Modulus
 */
pulse.ScriptFile = pulse.Asset.extend(
/** @lends pulse.ScriptFile.prototype */
{
  /** @constructs */
  init : function(params) {

    // Call the base constructor
    this._super(params);

    /**
     * The script tag for the javascript file.
     * @type {DOMElement}
     */
    this.scriptTag = document.createElement("script");
    this.scriptTag.type = "text/javascript";

    // Maybe a better way to add to page
    document.getElementsByTagName("head")[0].appendChild(this.scriptTag);

    // Auto load the content
    if(this.autoLoad) {
      this.load();
    }
  },

  /**
   * Begins loading the script file.
   */
  load : function() {
    var _self = this;

    var loadComplete = function() {
      _self.percentLoaded = 100;
      _self.complete();
    };

    if (this.scriptTag.readyState){
      this.scriptTag.onreadystatechange = function() {
        if (_self.scriptTag.readyState == "loaded" || _self.scriptTag.readyState == "complete"){
          _self.scriptTag.onreadystatechange = null;
          loadComplete();
        }
      };
    } else {
      _self.scriptTag.onload = function(){
        loadComplete();
      };
    }

    this.scriptTag.src = this.filename;
  }
});