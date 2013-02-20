/**
 * @fileoverview Holds various browser technology support information. 
 * @author PFP
 * @copyright 2012 Modulus
 *
 * Flash Support Checking
 * Copyright (c) 2007, Carl S. Yestrau All rights reserved.
 * Code licensed under the BSD License: http://www.featureblend.com/license.txt
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
};

/**
 * The names of the various Shockwave Active X versions.
 * @type {Array}
 */
pulse.support.activeXDetectRules = [
  "ShockwaveFlash.ShockwaveFlash.7",
  "ShockwaveFlash.ShockwaveFlash.6",
  "ShockwaveFlash.ShockwaveFlash"
];

/**
 * Gets an Active X object for the shockwave version given.
 * @return boolean
 */
pulse.support._getActiveXObject = function(name) {
  var obj = -1;
  try {
    obj = new ActiveXObject(name);
  } catch(err) {
    obj = {activeXError:true};
  }

  return obj;
};

/**
 * Whether flash is supported in the current browser
 * @return boolean
 */
pulse.support.checkFlash = function() {
  var hasFlash = false;

  try {
    if(navigator.plugins && navigator.plugins.length > 0) {
      var type = 'application/x-shockwave-flash';
      var mimeTypes = navigator.mimeTypes;
      if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description) {
        hasFlash = true;
      }
    } else if(navigator.appVersion.indexOf("Mac") === -1 && window.execScript) {
      for(var i = 0; i < pulse.support.activeXDetectRules.length && hasFlash === false; i++) {
        var obj = pulse.support._getActiveXObject(pulse.support.activeXDetectRules[i]);
        if(!obj.activeXError){
          hasFlash = true;
        }

        obj = null;
      }
    }
  } catch(e) {
    //Surpress Errors, flash is not supported
  }

  return hasFlash;
};

pulse.ready(function() {
  pulse.support.touch = pulse.util.eventSupported('touchstart');  

  if (typeof AudioContext !== "undefined" ||
    typeof webkitAudioContext !== "undefined") {
    pulse.support.audioAPI = true;
  }

  try {
    var audio = document.createElement('audio');
    if(typeof audio.canPlayType !== 'undefined') {
      pulse.support.codecs.mp3 = !!audio.canPlayType('audio/mpeg;').replace(/^no$/,'');
      pulse.support.codecs.ogg = !!audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
      pulse.support.codecs.wav = !!audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/,'');
      pulse.support.codecs.m4a = !!(audio.canPlayType('audio/x-m4a;') || audio.canPlayType('audio/aac;')).replace(/^no$/,'');
      pulse.support.html5Audio = true;
    }
    audio = null;
  } catch(e) {
    //Surpress Errors, HTML5 not supported 
  }

  pulse.support.flash = pulse.support.checkFlash();
});
