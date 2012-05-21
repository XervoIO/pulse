/**
 * Console tab for debugging panel.
 * @class The debug console tab class
 * @param {object} [params] parameters that can be set as initialized options
 * on the performance tab
 * @config {string} [name] the name of the tab will be used for name of link
 * @config {string} [icon] the icon url to use as image for the tab, should be
 * 45x90 with off state on top (45x45) and on state on bottom (45x45)
 * @config {string} [id] the machine readable id for the tab
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.tabs.Console = pulse.debug.PanelTab.extend(
/** @lends pulse.debug.tabs.Console.prototype */
{
  /** @constructs */
  init : function(params) {
    this._super(params);

    var self = this;

    /**
     * The background color of the selected filter.
     * @type {string}
     */
    this.selectedBGColor = '555';

    /**
     * The filter toolbar for this console tab.
     * @type {DOMElement}
     */
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'debug-console-toolbar';
    this.toolbar.style.height = '20px;';
    this.container.appendChild(this.toolbar);

    /**
     * Button to display all console messages.
     * @type {DOMElement}
     */
    this.allButton = this.addFilterButton('All', 'none');
    this.allButton.className = 'selected';
    this.allButton.style.backgroundColor = '#' + this.selectedBGColor;

    /**
     * Button to display all console messages of type error.
     * @type {DOMElement}
     */
    this.errorsButton = this.addFilterButton('Errors', 'error');

    /**
     * Button to display all console messages of type warning.
     * @type {DOMElement}
     */
    this.warningsButton = this.addFilterButton('Warnings', 'warning');

    /**
     * Button to to display all console messages of type debug.
     * @type {DOMElement}
     */
    this.infoButton = this.addFilterButton('Info', 'debug');

    /**
     * The logger for this console tab.
     * @type {pulse.debug.Logger}
     */
    this.logger = new pulse.debug.Logger();
    this.container.appendChild(this.logger.container);

    /**
     * @private
     * The current filter link that is selected.
     * @type {DOMElement}
     */
    this._private.currentFilterLink = this.allButton;
  },

  /**
   * Adds a filter button to the toolbar
   * @param {string} name the name to display for link
   * @param {string} type the type of message to filter when pressed
   * @return {DOMElement} the link dom element created
   */
  addFilterButton : function(name, type) {
    var _self = this;
    var button = document.createElement('a');
    button.onclick = function() {
      if(_self._private.currentFilterLink) {
        _self._private.currentFilterLink.style.backgroundColor = '';
      }
      _self._private.currentFilterLink = this;
      this.className = 'selected';
      this.style.backgroundColor = '#' + _self.selectedBGColor;
      if(type == 'none') {
        _self.clearFilter();
      } else {
        _self.filterLogs(type);
      }
      return false;
    };
    button.id = 'filter-' + type;
    button.href = '#';
    button.innerHTML = name;
    button.style.cssText = 'text-decoration: none; color: #ccc; padding: 3px;';

    this.toolbar.appendChild(button);
    return button;
  },

  /**
   * Adds log entry to the console.
   * @param {string} text the message text for the log entry
   * @param {string} type the type of the message
   */
  logMessage : function(text, type) {
    this.logger.addMessage(text, type);
  },

  /**
   * Filters the logger based on the passed in type.
   * @param {string} type the type to filter the logger on
   */
  filterLogs : function(type) {
    this.logger.filterType(type);
  },

  /**
   * Clears the filters from the logger.
   */
  clearFilter : function() {
    this.logger.clearFilter();
  },

  /**
   * Resizes the console when the container is resized.
   * @param {number} newSize the new size of the container
   */
  resize : function(newSize) {
    this.logger.container.style.height = (newSize - 20) + 'px';
  }
});