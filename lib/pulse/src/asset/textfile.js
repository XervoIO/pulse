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
    var self = this;
    var txtFile = new pulse.AjaxLoader("GET", this.filename);
    txtFile.onload(function(data, status) {
      if (status === 200) {
        self.text = data;
        self.percentLoaded = 100;
        self.complete();
      } else if(status === 404) {
        // handle file not find
      }
    });
    txtFile.send();
  }
});