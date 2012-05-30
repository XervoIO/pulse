/**
 * Base panel tab for the debugging panel. This should be extended when
 * creating a custom debugging tab.
 * @param {object} [params] parameters that can be set as initialized options
 * on a panel tab
 * @config {string} [name] the name of the tab will be used for name of link
 * @config {string} [icon] the icon url to use as image for the tab, should be 30x30
 * @config {string} [id] the machine readable id for the tab
 * @class The debug panel class
 * @author PFP
 * @copyright 2012 Modulus
 */

pulse.debug.PanelTab = PClass.extend(
/** @lends pulse.debug.PanelTab.prototype */
{
  /** @constructs */
  init : function (params) {
    params = pulse.util.checkParams(params, {
      name : 'Tab' + pulse.debug.Panel.tabIdx++,
      icon : '',
      id : 'Tab' + (pulse.debug.Panel.tabIdx - 1)
    });

    /**
     * The name of the timer.
     * @type {string}
     */
    this.name = params.name;

    /**
     * Icon to use for the tab.
     * @type {string}
     */
    this.icon = params.icon;

    /**
     * Id for this tab, must be machine readable (no spaces).
     * @type {string}
     */
    this.id = params.id;

    /**
     * Tab container div, holds the tab information.
     * @type {DOMElement}
     */
    this.container = document.createElement('div');
    this.container.className = 'debug-tab';
    this.container.id = 'debug-tab-' + this.id;

    /**
     * Whether the tab is currently visible or not.
     * @type {boolean}
     */
    this.visible = false;

    /**
     * @private
     * Private properties of the node. Should not need or use these.
     * @type {object}
     */
    this._private = { };
  },

  /**
   * Called when this tab is shown.
   */
  show : function () {
    this.visible = true;
  },

  /**
   * Called when this tab is hidden.
   */
  hide : function() {
    this.visible = false;
  },

  /**
   * Called when the tab's container has been resized.
   * @param {number} newSize the new size of the container
   */
  resize : function(newSize) {
    //Nothing is modified by default.
  },

  /**
   * Update function called on each loop in the engine
   * @param {number} elapsed the elapsed time since last call in
   * milliseconds
   */
  update : function(elapsed) {
    // Nothing is updated by default.
  }
});