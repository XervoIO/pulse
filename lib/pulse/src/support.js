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

/**
 * Whether the web audio API is supported in the current browser.
 * @type {Boolean}
 * @default false
 */
pulse.support.audioAPI = false;

/**
 * Whether HTML5 audio is supported in the current browser.
 * @type {Boolean}
 * @default false
 */
pulse.support.html5Audio = false;

/**
 * Whether certain codecs are supported in the current browser.
 * @type {Object}
 * @default All false
 */
pulse.support.codecs = {
  mp3: false,
  ogg: false,
  wav: false,
  m4a: false
}

pulse.ready(function(){
  pulse.support.touch = pulse.util.eventSupported('touchstart');  

  if (typeof AudioContext !== "undefined" ||
    typeof webkitAudioContext !== "undefined") {
    pulse.support.audioAPI = true;
  }

  var audio = document.createElement('audio');
  if(audio.canPlayType !== 'undefined') {
    pulse.support.html5Audio = true;
    
    pulse.support.codecs.mp3 = !!audio.canPlayType('audio/mpeg;').replace(/^no$/,'');
    pulse.support.codecs.ogg = !!audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
    pulse.support.codecs.wav = !!audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/,'');
    pulse.support.codecs.m4a = !!(audio.canPlayType('audio/x-m4a;') || audio.canPlayType('audio/aac;')).replace(/^no$/,'');
  }
  audio = null;
});
