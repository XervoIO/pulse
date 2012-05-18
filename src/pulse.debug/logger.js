/**
 * Class for adding log messages to a containing dom element.
 * @class The debug panel class
 * @param {object} [params] parameters that can be set as initialized options
 * on the logger
 * @config {DOMElement} [container] the element to add the log messages to
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.Logger = PClass.extend(
/** @lends pulse.debug.Logger.prototype */
{
  /** @constructs */
  init : function(params) {
    params = pulse.util.checkParams(params, {
      container : document.createElement('div')
    });

    /**
     * The containing element for the log messages.
     * @type {DOMElement}
     */
    this.container = params.container;
    this.container.className = 'pulse-debug-log';
    this.container.style.cssText = 'height: 120px; overflow: auto;';
  },

  /**
   * Adds a log message to this logger element.
   * @param {string} text the log message to add
   * @param {string} type the type of log message to add
   */
  addMessage : function(text, type) {
    var now = new Date();
    var logelement = document.createElement('div');
    logelement.className = 'debug-log-message ' + type;
    logelement.setAttribute('data-type', type);
    this.container.appendChild(logelement);
    var timeelement = document.createElement('span');
    timeelement.className = 'timestamp';
    var h = now.getHours() % 12;
    timeelement.innerHTML = (h === 0 ? 12 : h) +
                            ':' + now.getMinutes() +
                            ':' + now.getSeconds();
    logelement.appendChild(timeelement);
    var textelement = document.createElement('span');
    textelement.className = 'text';
    textelement.innerHTML = text;
    logelement.appendChild(textelement);

    this.scrollDiv();
  },

  scrollDiv : function() {
    var currentHeight = 0;

    if (this.container.scrollHeight > 0) {
      currentHeight = this.container.scrollHeight;
    } else {
      if (this.container.offsetHeight > 0) {
        currentHeight = scrollDiv.offsetHeight;
      }
       
      if (currentHeight - this.container.scrollTop - this.container.offsetHeight < 20) {
          this.container.scrollTop = currentHeight;
      }
        }
  },

  /**
   * Filters the log container by the type of log message.
   * @param {string} type the type of message to filter
   */
  filterType : function(type) {
    var nodes = this.container.childNodes;
    for(var i = 0; i < nodes.length; i++) {
      if(nodes[i].getAttribute('data-type') == type) {
        nodes[i].style.display = 'block';
      } else {
        nodes[i].style.display = 'none';
      }
    }
  },

  /**
   * Removes any filter from the log console, showing all the messages.
   */
  clearFilter : function() {
    var nodes = this.container.childNodes;
    for(var i = 0; i < nodes.length; i++) {
      nodes[i].style.display = 'block';
    }
  }
});