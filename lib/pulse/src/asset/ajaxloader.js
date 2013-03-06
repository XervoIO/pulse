/*global PClass:true */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Ajax loader that handle XMLHttpRequest and also IE cross-domain requests
 * using XDomainRequest.
 * @class Ajax loader.
 * @author PFP
 * @constructor
 * @copyright 2012 Modulus
 */
pulse.AjaxLoader = PClass.extend(
/** @lends pulse.AjaxLoader.prototype */
{
  /** @constructs */
  init : function(method, url) {
    var self = this;

    this.request = new XMLHttpRequest();

    if ("withCredentials" in this.request ||
        typeof XDomainRequest === 'undefined') {
      this.request.open(method, url, true);
      this.request.onreadystatechange = function() {
        if (self.request.readyState === 4) {
          if(self.onloadCallback) {
            self.onloadCallback(self.request.responseText, self.request.status);
          }
        }
      };
    } else if (typeof XDomainRequest != "undefined"){
      this.request = new XDomainRequest();
      this.request.open(method, url);
      this.request.onload = function() {
        if(self.onloadCallback) {
          self.onloadCallback(self.request.responseText, 200);
        }
      };
      this.request.onerror = function() {
        if(self.onerrorCallback) {
          self.onerrorCallback('Error loading request.');
        }
      };
      this.request.onprogress = function(){};
    }

  },
  /**
   * Adds a callback for when request has finished loading.
   * @param  {Function} callback The load handler. The handler should take data,
   * and status.
   */
  onload : function(callback) {
    this.onloadCallback = callback;
  },
  /**
   * Adds a callback for if error occured during request.
   * @param  {Function} callback The error handler. The handler should take data,
   * and status.
   */
  onerror : function(callback) {
    this.onerrorCallback = callback;
  },
  /**
   * Sends request.
   * @return {boolean} If the request was successfully sent.
   */
  send : function() {
    if(this.request) {
      this.request.send(null);
      return true;
    }
    return false;
  }
});