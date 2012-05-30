/**
 * @fileoverview Holds various browser technology support information. 
 * @author PFP
 * @copyright 2012 Modulus
 */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Support namespace that holds boolean objects that tell you if
 * certain technologies are supported.
 * @namespace
 */
pulse.support = pulse.support || {};

/**
 * Whether touch events are supported in the current browser.
 * @type {Boolean}
 * @default false
 */
pulse.support.touch = false;

pulse.ready(function(){
  pulse.support.touch = pulse.util.eventSupported('touchstart');  
});
