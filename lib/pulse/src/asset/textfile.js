/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Text file asset type, downloads a file as text and stores it.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string} filename the name of the file to download
 * @author PFP
 * @class Text File
 * @copyright 2012 Modulus
 */
pulse.TextFile = pulse.Asset.extend(
/** @lends pulse.TextFile.prototype */
{
  /** @constructs */
  init : function(params) {

    // Call the base constructor
    this._super(params);

    /**
     * The text that is in the text file downloaded.
     * @type {string}
     */
    this.text = "";

    // Auto load the content
    if(this.autoLoad) {
      this.load();
    }
  },

  /**
   * Begins loading the text file
   */
  load : function() {
    var _self = this;
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", this.filename, true);
    txtFile.onreadystatechange = function() {
      if (txtFile.readyState === 4) {
        if (txtFile.status === 200) {
          _self.text = txtFile.responseText;
          _self.percentLoaded = 100;
          _self.complete();
        } else if(txtFile.status === 404) {
          // handle file not find
        }
      }
    };
    txtFile.send(null);
  }
});