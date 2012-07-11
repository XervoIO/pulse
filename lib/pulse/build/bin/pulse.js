window.requestAnimFrame = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
    window.setTimeout(callback, 1E3 / 60)
  }
}();
(function() {
  var initializing = false, fnTest = /xyz/.test(function() {
    xyz
  }) ? /\b_super\b/ : /.*/;
  this.PClass = function() {
  };
  PClass.extend = function(prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this;
    initializing = false;
    for(var name in prop) {
      prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function(name, fn) {
        return function() {
          var tmp = this._super;
          this._super = _super[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret
        }
      }(name, prop[name]) : prop[name]
    }
    function PClass() {
      if(!initializing && this.init) {
        this.init.apply(this, arguments)
      }
    }
    PClass.prototype = prototype;
    PClass.prototype.constructor = PClass;
    PClass.extend = arguments.callee;
    return PClass
  }
})();
if(typeof pulse == "undefined") {
  pulse = {events:{"mousedown":"mouse", "mouseup":"mouse", "mouseover":"mouse", "mouseout":"mouse", "click":"mouse", "mousemove":"mouse", "mousewheel":"mouse", "keyup":"keyboard", "keydown":"keyboard", "keypress":"keyboard", "touchstart":"touch", "touchmove":"touch", "touchend":"touch", "touchcancel":"touch", "touchclick":"touch", "gesturestart":"touchgesture", "gesturechange":"touchgesture", "gestureend":"touchgesture"}, eventtranslations:{"touchstart":"mousedown", "touchmove":"mousemove", "touchend":"mouseup"}, 
  customevents:{"dragstart":"drag", "dragdrop":"drag", "dragenter":"drag", "dragover":"drag", "dragexit":"drag", "complete":"action", "finished":"audio"}}
}
var pulse = pulse || {};
pulse.readyCallbacks = [];
pulse.isReady = false;
pulse.ready = function(callback) {
  if(document.readyState === "complete") {
    pulse.isReady = true
  }
  if(pulse.isReady) {
    setTimeout(callback, 1)
  }
  pulse.readyCallbacks.push(callback)
};
pulse.DOMContentLoaded = function() {
  if(pulse.isReady) {
    return
  }
  pulse.isReady = true;
  for(var readyIdx in pulse.readyCallbacks) {
    pulse.readyCallbacks[readyIdx]()
  }
};
if(document.readyState !== "complete") {
  if(document.addEventListener) {
    document.addEventListener("DOMContentLoaded", pulse.DOMContentLoaded, false);
    window.addEventListener("load", pulse.DOMContentLoaded, false)
  }else {
    if(document.attachEvent) {
      document.attachEvent("onreadystatechange", pulse.DOMContentLoaded);
      window.attachEvent("onload", pulse.DOMContentLoaded)
    }
  }
}
pulse.DEBUG = false;
/*


 SoundManager 2: JavaScript Sound for the Web
 ----------------------------------------------
 http://schillmania.com/projects/soundmanager2/

 Copyright (c) 2007, Scott Schiller. All rights reserved.
 Code provided under the BSD License:
 http://schillmania.com/projects/soundmanager2/license.txt

 V2.97a.20111030
*/
(function($) {
  function N(N, Z) {
    function j(c) {
      return function(a) {
        return!this._t || !this._t._a ? null : c.call(this, a)
      }
    }
    this.flashVersion = 8;
    this.debugFlash = this.debugMode = false;
    this.useConsole = true;
    this.waitForWindowLoad = this.consoleOnly = false;
    this.bgColor = "#ffffff";
    this.useHighPerformance = false;
    this.flashPollingInterval = null;
    this.flashLoadTimeout = 1E3;
    this.wmode = null;
    this.allowScriptAccess = "always";
    this.useFlashBlock = false;
    this.useHTML5Audio = true;
    this.html5Test = /^(probably|maybe)$/i;
    this.preferFlash = true;
    this.noSWFCache = false;
    this.audioFormats = {mp3:{type:['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"], required:true}, mp4:{related:["aac", "m4a"], type:['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"], required:false}, ogg:{type:["audio/ogg; codecs=vorbis"], required:false}, wav:{type:['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"], required:false}};
    this.defaultOptions = {autoLoad:false, stream:true, autoPlay:false, loops:1, onid3:null, onload:null, whileloading:null, onplay:null, onpause:null, onresume:null, whileplaying:null, onstop:null, onfailure:null, onfinish:null, multiShot:true, multiShotEvents:false, position:null, pan:0, type:null, usePolicyFile:false, volume:100};
    this.flash9Options = {isMovieStar:null, usePeakData:false, useWaveformData:false, useEQData:false, onbufferchange:null, ondataerror:null};
    this.movieStarOptions = {bufferTime:3, serverURL:null, onconnect:null, duration:null};
    this.movieID = "sm2-container";
    this.id = Z || "sm2movie";
    this.swfCSS = {swfBox:"sm2-object-box", swfDefault:"movieContainer", swfError:"swf_error", swfTimedout:"swf_timedout", swfLoaded:"swf_loaded", swfUnblocked:"swf_unblocked", sm2Debug:"sm2_debug", highPerf:"high_performance", flashDebug:"flash_debug"};
    this.debugID = "soundmanager-debug";
    this.debugURLParam = /([#?&])debug=1/i;
    this.versionNumber = "V2.97a.20111030";
    this.movieURL = this.version = null;
    this.url = N || null;
    this.altURL = null;
    this.enabled = this.swfLoaded = false;
    this.oMC = this.o = null;
    this.sounds = {};
    this.soundIDs = [];
    this.didFlashBlock = this.specialWmodeCase = this.muted = false;
    this.filePattern = null;
    this.filePatterns = {flash8:/\.mp3(\?.*)?$/i, flash9:/\.mp3(\?.*)?$/i};
    this.features = {buffering:false, peakData:false, waveformData:false, eqData:false, movieStar:false};
    this.sandbox = {};
    var F;
    try {
      F = typeof Audio !== "undefined" && typeof(new Audio).canPlayType !== "undefined"
    }catch(Oa) {
      F = false
    }
    this.hasHTML5 = F;
    this.html5 = {usingFlash:null};
    this.flash = {};
    this.ignoreFlash = this.html5Only = false;
    var ra, c = this, O, o = navigator.userAgent, i = $, aa = i.location.href.toString(), h = document, ba, P, g, s = [], G = false, H = false, m = false, t = false, sa = false, I, n, ca, z, A, Q, ta, da, x, R, B, ea, fa, S, C, ua, ga, va, T, wa, J = null, ha = null, y, ia, D, U, V, ja, l, W = false, ka = false, xa, ya, q = null, za, X, K, u, la, ma, Aa, k, Ia = Array.prototype.slice, L = false, p, Y, Ba, r, Ca, na = o.match(/(ipad|iphone|ipod)/i), Ja = o.match(/firefox/i), Ka = o.match(/droid/i), 
    v = o.match(/msie/i), La = o.match(/webkit/i), M = o.match(/safari/i) && !o.match(/chrome/i), Ma = o.match(/opera/i);
    F = o.match(/(mobile|pre\/|xoom)/i) || na;
    var oa = !aa.match(/usehtml5audio/i) && !aa.match(/sm2\-ignorebadua/i) && M && o.match(/OS X 10_6_([3-7])/i), pa = typeof h.hasFocus !== "undefined" ? h.hasFocus() : null, E = M && typeof h.hasFocus === "undefined", Da = !E, Ea = /(mp3|mp4|mpa)/i, qa = h.location ? h.location.protocol.match(/http/i) : null, Fa = !qa ? "http://" : "", Ga = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|mp4v|3gp|3g2)\s*(?:$|;)/i, Ha = "mpeg4,aac,flv,mov,mp4,m4v,f4v,m4a,mp4v,3gp,3g2".split(","), Na = RegExp("\\.(" + 
    Ha.join("|") + ")(\\?.*)?$", "i");
    this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
    this.useAltURL = !qa;
    this._global_a = null;
    if(F && (c.useHTML5Audio = true, c.preferFlash = false, na)) {
      L = c.ignoreFlash = true
    }
    this.supported = this.ok = function() {
      return q ? m && !t : c.useHTML5Audio && c.hasHTML5
    };
    this.getMovie = function(c) {
      return O(c) || h[c] || i[c]
    };
    this.createSound = function(b) {
      function a() {
        e = U(e);
        c.sounds[d.id] = new ra(d);
        c.soundIDs.push(d.id);
        return c.sounds[d.id]
      }
      var e = null, f = null, d = null;
      if(!m || !c.ok()) {
        return ja("soundManager.createSound(): " + y(!m ? "notReady" : "notOK")), false
      }
      arguments.length === 2 && (b = {id:arguments[0], url:arguments[1]});
      d = e = n(b);
      if(l(d.id, true)) {
        return c.sounds[d.id]
      }
      if(X(d)) {
        f = a(), f._setup_html5(d)
      }else {
        if(g > 8) {
          if(d.isMovieStar === null) {
            d.isMovieStar = d.serverURL || (d.type ? d.type.match(Ga) : false) || d.url.match(Na)
          }
          if(d.isMovieStar && d.usePeakData) {
            d.usePeakData = false
          }
        }
        d = V(d, "soundManager.createSound(): ");
        f = a();
        if(g === 8) {
          c.o._createSound(d.id, d.loops || 1, d.usePolicyFile)
        }else {
          if(c.o._createSound(d.id, d.url, d.usePeakData, d.useWaveformData, d.useEQData, d.isMovieStar, d.isMovieStar ? d.bufferTime : false, d.loops || 1, d.serverURL, d.duration || null, d.autoPlay, true, d.autoLoad, d.usePolicyFile), !d.serverURL) {
            f.connected = true, d.onconnect && d.onconnect.apply(f)
          }
        }
        !d.serverURL && (d.autoLoad || d.autoPlay) && f.load(d)
      }
      !d.serverURL && d.autoPlay && f.play();
      return f
    };
    this.destroySound = function(b, a) {
      if(!l(b)) {
        return false
      }
      var e = c.sounds[b], f;
      e._iO = {};
      e.stop();
      e.unload();
      for(f = 0;f < c.soundIDs.length;f++) {
        if(c.soundIDs[f] === b) {
          c.soundIDs.splice(f, 1);
          break
        }
      }
      a || e.destruct(true);
      delete c.sounds[b];
      return true
    };
    this.load = function(b, a) {
      return!l(b) ? false : c.sounds[b].load(a)
    };
    this.unload = function(b) {
      return!l(b) ? false : c.sounds[b].unload()
    };
    this.onposition = function(b, a, e, f) {
      return!l(b) ? false : c.sounds[b].onposition(a, e, f)
    };
    this.start = this.play = function(b, a) {
      if(!m || !c.ok()) {
        return ja("soundManager.play(): " + y(!m ? "notReady" : "notOK")), false
      }
      return!l(b) ? (a instanceof Object || (a = {url:a}), a && a.url ? (a.id = b, c.createSound(a).play()) : false) : c.sounds[b].play(a)
    };
    this.setPosition = function(b, a) {
      return!l(b) ? false : c.sounds[b].setPosition(a)
    };
    this.stop = function(b) {
      return!l(b) ? false : c.sounds[b].stop()
    };
    this.stopAll = function() {
      for(var b in c.sounds) {
        c.sounds.hasOwnProperty(b) && c.sounds[b].stop()
      }
    };
    this.pause = function(b) {
      return!l(b) ? false : c.sounds[b].pause()
    };
    this.pauseAll = function() {
      var b;
      for(b = c.soundIDs.length;b--;) {
        c.sounds[c.soundIDs[b]].pause()
      }
    };
    this.resume = function(b) {
      return!l(b) ? false : c.sounds[b].resume()
    };
    this.resumeAll = function() {
      var b;
      for(b = c.soundIDs.length;b--;) {
        c.sounds[c.soundIDs[b]].resume()
      }
    };
    this.togglePause = function(b) {
      return!l(b) ? false : c.sounds[b].togglePause()
    };
    this.setPan = function(b, a) {
      return!l(b) ? false : c.sounds[b].setPan(a)
    };
    this.setVolume = function(b, a) {
      return!l(b) ? false : c.sounds[b].setVolume(a)
    };
    this.mute = function(b) {
      var a = 0;
      typeof b !== "string" && (b = null);
      if(b) {
        return!l(b) ? false : c.sounds[b].mute()
      }else {
        for(a = c.soundIDs.length;a--;) {
          c.sounds[c.soundIDs[a]].mute()
        }
        c.muted = true
      }
      return true
    };
    this.muteAll = function() {
      c.mute()
    };
    this.unmute = function(b) {
      typeof b !== "string" && (b = null);
      if(b) {
        return!l(b) ? false : c.sounds[b].unmute()
      }else {
        for(b = c.soundIDs.length;b--;) {
          c.sounds[c.soundIDs[b]].unmute()
        }
        c.muted = false
      }
      return true
    };
    this.unmuteAll = function() {
      c.unmute()
    };
    this.toggleMute = function(b) {
      return!l(b) ? false : c.sounds[b].toggleMute()
    };
    this.getMemoryUse = function() {
      var b = 0;
      c.o && g !== 8 && (b = parseInt(c.o._getMemoryUse(), 10));
      return b
    };
    this.disable = function(b) {
      var a;
      typeof b === "undefined" && (b = false);
      if(t) {
        return false
      }
      t = true;
      for(a = c.soundIDs.length;a--;) {
        va(c.sounds[c.soundIDs[a]])
      }
      I(b);
      k.remove(i, "load", A);
      return true
    };
    this.canPlayMIME = function(b) {
      var a;
      c.hasHTML5 && (a = K({type:b}));
      return!q || a ? a : b ? !!(g > 8 && b.match(Ga) || b.match(c.mimePattern)) : null
    };
    this.canPlayURL = function(b) {
      var a;
      c.hasHTML5 && (a = K({url:b}));
      return!q || a ? a : b ? !!b.match(c.filePattern) : null
    };
    this.canPlayLink = function(b) {
      return typeof b.type !== "undefined" && b.type && c.canPlayMIME(b.type) ? true : c.canPlayURL(b.href)
    };
    this.getSoundById = function(b) {
      if(!b) {
        throw Error("soundManager.getSoundById(): sID is null/undefined");
      }
      return c.sounds[b]
    };
    this.onready = function(c, a) {
      if(c && c instanceof Function) {
        return a || (a = i), ca("onready", c, a), z(), true
      }else {
        throw y("needFunction", "onready");
      }
    };
    this.ontimeout = function(c, a) {
      if(c && c instanceof Function) {
        return a || (a = i), ca("ontimeout", c, a), z({type:"ontimeout"}), true
      }else {
        throw y("needFunction", "ontimeout");
      }
    };
    this._wD = this._writeDebug = function() {
      return true
    };
    this._debug = function() {
    };
    this.reboot = function() {
      var b, a;
      for(b = c.soundIDs.length;b--;) {
        c.sounds[c.soundIDs[b]].destruct()
      }
      try {
        if(v) {
          ha = c.o.innerHTML
        }
        J = c.o.parentNode.removeChild(c.o)
      }catch(e) {
      }
      ha = J = q = null;
      c.enabled = ea = m = W = ka = G = H = t = c.swfLoaded = false;
      c.soundIDs = c.sounds = [];
      c.o = null;
      for(b in s) {
        if(s.hasOwnProperty(b)) {
          for(a = s[b].length;a--;) {
            s[b][a].fired = false
          }
        }
      }
      i.setTimeout(c.beginDelayedInit, 20)
    };
    this.getMoviePercent = function() {
      return c.o && typeof c.o.PercentLoaded !== "undefined" ? c.o.PercentLoaded() : null
    };
    this.beginDelayedInit = function() {
      sa = true;
      B();
      setTimeout(function() {
        if(ka) {
          return false
        }
        S();
        R();
        return ka = true
      }, 20);
      Q()
    };
    this.destruct = function() {
      c.disable(true)
    };
    ra = function(b) {
      var a = this, e, f, d;
      this.sID = b.id;
      this.url = b.url;
      this._iO = this.instanceOptions = this.options = n(b);
      this.pan = this.options.pan;
      this.volume = this.options.volume;
      this._lastURL = null;
      this.isHTML5 = false;
      this._a = null;
      this.id3 = {};
      this._debug = function() {
      };
      this.load = function(b) {
        var d = null;
        if(typeof b !== "undefined") {
          a._iO = n(b, a.options), a.instanceOptions = a._iO
        }else {
          if(b = a.options, a._iO = b, a.instanceOptions = a._iO, a._lastURL && a._lastURL !== a.url) {
            a._iO.url = a.url, a.url = null
          }
        }
        if(!a._iO.url) {
          a._iO.url = a.url
        }
        if(a._iO.url === a.url && a.readyState !== 0 && a.readyState !== 2) {
          return a
        }
        a._lastURL = a.url;
        a.loaded = false;
        a.readyState = 1;
        a.playState = 0;
        if(X(a._iO)) {
          if(d = a._setup_html5(a._iO), !d._called_load) {
            a._html5_canplay = false, d.load(), d._called_load = true, a._iO.autoPlay && a.play()
          }
        }else {
          try {
            a.isHTML5 = false, a._iO = V(U(a._iO)), g === 8 ? c.o._load(a.sID, a._iO.url, a._iO.stream, a._iO.autoPlay, a._iO.whileloading ? 1 : 0, a._iO.loops || 1, a._iO.usePolicyFile) : c.o._load(a.sID, a._iO.url, !!a._iO.stream, !!a._iO.autoPlay, a._iO.loops || 1, !!a._iO.autoLoad, a._iO.usePolicyFile)
          }catch(e) {
            C({type:"SMSOUND_LOAD_JS_EXCEPTION", fatal:true})
          }
        }
        return a
      };
      this.unload = function() {
        a.readyState !== 0 && (a.isHTML5 ? (f(), a._a && (a._a.pause(), la(a._a))) : g === 8 ? c.o._unload(a.sID, "about:blank") : c.o._unload(a.sID), e());
        return a
      };
      this.destruct = function(b) {
        if(a.isHTML5) {
          if(f(), a._a) {
            a._a.pause(), la(a._a), L || a._remove_html5_events(), a._a._t = null, a._a = null
          }
        }else {
          a._iO.onfailure = null, c.o._destroySound(a.sID)
        }
        b || c.destroySound(a.sID, true)
      };
      this.start = this.play = function(b, w) {
        var e, w = w === void 0 ? true : w;
        b || (b = {});
        a._iO = n(b, a._iO);
        a._iO = n(a._iO, a.options);
        a.instanceOptions = a._iO;
        if(a._iO.serverURL && !a.connected) {
          return a.getAutoPlay() || a.setAutoPlay(true), a
        }
        X(a._iO) && (a._setup_html5(a._iO), d());
        if(a.playState === 1 && !a.paused && (e = a._iO.multiShot, !e)) {
          return a
        }
        if(!a.loaded) {
          if(a.readyState === 0) {
            if(!a.isHTML5) {
              a._iO.autoPlay = true
            }
            a.load(a._iO)
          }else {
            if(a.readyState === 2) {
              return a
            }
          }
        }
        if(!a.isHTML5 && g === 9 && a.position > 0 && a.position === a.duration) {
          a._iO.position = 0
        }
        if(a.paused && a.position && a.position > 0) {
          a.resume()
        }else {
          a.playState = 1;
          a.paused = false;
          (!a.instanceCount || a._iO.multiShotEvents || !a.isHTML5 && g > 8 && !a.getAutoPlay()) && a.instanceCount++;
          a.position = typeof a._iO.position !== "undefined" && !isNaN(a._iO.position) ? a._iO.position : 0;
          if(!a.isHTML5) {
            a._iO = V(U(a._iO))
          }
          if(a._iO.onplay && w) {
            a._iO.onplay.apply(a), a._onplay_called = true
          }
          a.setVolume(a._iO.volume, true);
          a.setPan(a._iO.pan, true);
          a.isHTML5 ? (d(), e = a._setup_html5(), a.setPosition(a._iO.position), e.play()) : c.o._start(a.sID, a._iO.loops || 1, g === 9 ? a._iO.position : a._iO.position / 1E3)
        }
        return a
      };
      this.stop = function(b) {
        if(a.playState === 1) {
          a._onbufferchange(0);
          a.resetOnPosition(0);
          a.paused = false;
          if(!a.isHTML5) {
            a.playState = 0
          }
          a._iO.onstop && a._iO.onstop.apply(a);
          if(a.isHTML5) {
            if(a._a) {
              a.setPosition(0), a._a.pause(), a.playState = 0, a._onTimer(), f()
            }
          }else {
            c.o._stop(a.sID, b), a._iO.serverURL && a.unload()
          }
          a.instanceCount = 0;
          a._iO = {}
        }
        return a
      };
      this.setAutoPlay = function(b) {
        a._iO.autoPlay = b;
        a.isHTML5 || (c.o._setAutoPlay(a.sID, b), b && !a.instanceCount && a.readyState === 1 && a.instanceCount++)
      };
      this.getAutoPlay = function() {
        return a._iO.autoPlay
      };
      this.setPosition = function(b) {
        b === void 0 && (b = 0);
        var d = a.isHTML5 ? Math.max(b, 0) : Math.min(a.duration || a._iO.duration, Math.max(b, 0));
        a.position = d;
        b = a.position / 1E3;
        a.resetOnPosition(a.position);
        a._iO.position = d;
        if(a.isHTML5) {
          if(a._a && a._html5_canplay && a._a.currentTime !== b) {
            try {
              a._a.currentTime = b, (a.playState === 0 || a.paused) && a._a.pause()
            }catch(e) {
            }
          }
        }else {
          b = g === 9 ? a.position : b, a.readyState && a.readyState !== 2 && c.o._setPosition(a.sID, b, a.paused || !a.playState)
        }
        a.isHTML5 && a.paused && a._onTimer(true);
        return a
      };
      this.pause = function(b) {
        if(a.paused || a.playState === 0 && a.readyState !== 1) {
          return a
        }
        a.paused = true;
        a.isHTML5 ? (a._setup_html5().pause(), f()) : (b || b === void 0) && c.o._pause(a.sID);
        a._iO.onpause && a._iO.onpause.apply(a);
        return a
      };
      this.resume = function() {
        if(!a.paused) {
          return a
        }
        a.paused = false;
        a.playState = 1;
        a.isHTML5 ? (a._setup_html5().play(), d()) : (a._iO.isMovieStar && a.setPosition(a.position), c.o._pause(a.sID));
        !a._onplay_called && a._iO.onplay ? (a._iO.onplay.apply(a), a._onplay_called = true) : a._iO.onresume && a._iO.onresume.apply(a);
        return a
      };
      this.togglePause = function() {
        if(a.playState === 0) {
          return a.play({position:g === 9 && !a.isHTML5 ? a.position : a.position / 1E3}), a
        }
        a.paused ? a.resume() : a.pause();
        return a
      };
      this.setPan = function(b, d) {
        typeof b === "undefined" && (b = 0);
        typeof d === "undefined" && (d = false);
        a.isHTML5 || c.o._setPan(a.sID, b);
        a._iO.pan = b;
        if(!d) {
          a.pan = b, a.options.pan = b
        }
        return a
      };
      this.setVolume = function(b, d) {
        typeof b === "undefined" && (b = 100);
        typeof d === "undefined" && (d = false);
        if(a.isHTML5) {
          if(a._a) {
            a._a.volume = Math.max(0, Math.min(1, b / 100))
          }
        }else {
          c.o._setVolume(a.sID, c.muted && !a.muted || a.muted ? 0 : b)
        }
        a._iO.volume = b;
        if(!d) {
          a.volume = b, a.options.volume = b
        }
        return a
      };
      this.mute = function() {
        a.muted = true;
        if(a.isHTML5) {
          if(a._a) {
            a._a.muted = true
          }
        }else {
          c.o._setVolume(a.sID, 0)
        }
        return a
      };
      this.unmute = function() {
        a.muted = false;
        var b = typeof a._iO.volume !== "undefined";
        if(a.isHTML5) {
          if(a._a) {
            a._a.muted = false
          }
        }else {
          c.o._setVolume(a.sID, b ? a._iO.volume : a.options.volume)
        }
        return a
      };
      this.toggleMute = function() {
        return a.muted ? a.unmute() : a.mute()
      };
      this.onposition = function(b, c, d) {
        a._onPositionItems.push({position:b, method:c, scope:typeof d !== "undefined" ? d : a, fired:false});
        return a
      };
      this.processOnPosition = function() {
        var b, d;
        b = a._onPositionItems.length;
        if(!b || !a.playState || a._onPositionFired >= b) {
          return false
        }
        for(;b--;) {
          if(d = a._onPositionItems[b], !d.fired && a.position >= d.position) {
            d.fired = true, c._onPositionFired++, d.method.apply(d.scope, [d.position])
          }
        }
        return true
      };
      this.resetOnPosition = function(b) {
        var d, e;
        d = a._onPositionItems.length;
        if(!d) {
          return false
        }
        for(;d--;) {
          if(e = a._onPositionItems[d], e.fired && b <= e.position) {
            e.fired = false, c._onPositionFired--
          }
        }
        return true
      };
      d = function() {
        a.isHTML5 && xa(a)
      };
      f = function() {
        a.isHTML5 && ya(a)
      };
      e = function() {
        a._onPositionItems = [];
        a._onPositionFired = 0;
        a._hasTimer = null;
        a._onplay_called = false;
        a._a = null;
        a._html5_canplay = false;
        a.bytesLoaded = null;
        a.bytesTotal = null;
        a.position = null;
        a.duration = a._iO && a._iO.duration ? a._iO.duration : null;
        a.durationEstimate = null;
        a.failures = 0;
        a.loaded = false;
        a.playState = 0;
        a.paused = false;
        a.readyState = 0;
        a.muted = false;
        a.isBuffering = false;
        a.instanceOptions = {};
        a.instanceCount = 0;
        a.peakData = {left:0, right:0};
        a.waveformData = {left:[], right:[]};
        a.eqData = [];
        a.eqData.left = [];
        a.eqData.right = []
      };
      e();
      this._onTimer = function(b) {
        var c = {};
        if(a._hasTimer || b) {
          return a._a && (b || (a.playState > 0 || a.readyState === 1) && !a.paused) ? (a.duration = a._get_html5_duration(), a.durationEstimate = a.duration, b = a._a.currentTime ? a._a.currentTime * 1E3 : 0, a._whileplaying(b, c, c, c, c), true) : false
        }
      };
      this._get_html5_duration = function() {
        var b = a._a ? a._a.duration * 1E3 : a._iO ? a._iO.duration : void 0;
        return b && !isNaN(b) && b !== Infinity ? b : a._iO ? a._iO.duration : null
      };
      this._setup_html5 = function(b) {
        var b = n(a._iO, b), d = L ? c._global_a : a._a;
        decodeURI(b.url);
        var f = d && d._t ? d._t.instanceOptions : null;
        if(d) {
          if(d._t && f.url === b.url && (!a._lastURL || a._lastURL === f.url)) {
            return d
          }
          L && d._t && d._t.playState && b.url !== f.url && d._t.stop();
          e();
          d.src = b.url;
          a.url = b.url;
          a._lastURL = b.url;
          d._called_load = false
        }else {
          d = new Audio(b.url);
          d._called_load = false;
          if(Ka) {
            d._called_load = true
          }
          if(L) {
            c._global_a = d
          }
        }
        a.isHTML5 = true;
        a._a = d;
        d._t = a;
        a._add_html5_events();
        d.loop = b.loops > 1 ? "loop" : "";
        b.autoLoad || b.autoPlay ? (d.autobuffer = "auto", d.preload = "auto", a.load(), d._called_load = true) : (d.autobuffer = false, d.preload = "none");
        d.loop = b.loops > 1 ? "loop" : "";
        return d
      };
      this._add_html5_events = function() {
        if(a._a._added_events) {
          return false
        }
        var b;
        a._a._added_events = true;
        for(b in r) {
          r.hasOwnProperty(b) && a._a && a._a.addEventListener(b, r[b], false)
        }
        return true
      };
      this._remove_html5_events = function() {
        var b;
        a._a._added_events = false;
        for(b in r) {
          r.hasOwnProperty(b) && a._a && a._a.removeEventListener(b, r[b], false)
        }
      };
      this._onload = function(b) {
        b = !!b;
        a.loaded = b;
        a.readyState = b ? 3 : 2;
        a._onbufferchange(0);
        a._iO.onload && a._iO.onload.apply(a, [b]);
        return true
      };
      this._onbufferchange = function(b) {
        if(a.playState === 0) {
          return false
        }
        if(b && a.isBuffering || !b && !a.isBuffering) {
          return false
        }
        a.isBuffering = b === 1;
        a._iO.onbufferchange && a._iO.onbufferchange.apply(a);
        return true
      };
      this._onsuspend = function() {
        a._iO.onsuspend && a._iO.onsuspend.apply(a);
        return true
      };
      this._onfailure = function(b, c, d) {
        a.failures++;
        if(a._iO.onfailure && a.failures === 1) {
          a._iO.onfailure(a, b, c, d)
        }
      };
      this._onfinish = function() {
        var b = a._iO.onfinish;
        a._onbufferchange(0);
        a.resetOnPosition(0);
        if(a.instanceCount) {
          a.instanceCount--;
          if(!a.instanceCount) {
            a.playState = 0, a.paused = false, a.instanceCount = 0, a.instanceOptions = {}, a._iO = {}, f()
          }
          (!a.instanceCount || a._iO.multiShotEvents) && b && b.apply(a)
        }
      };
      this._whileloading = function(b, c, d, e) {
        a.bytesLoaded = b;
        a.bytesTotal = c;
        a.duration = Math.floor(d);
        a.bufferLength = e;
        if(a._iO.isMovieStar) {
          a.durationEstimate = a.duration
        }else {
          if(a.durationEstimate = a._iO.duration ? a.duration > a._iO.duration ? a.duration : a._iO.duration : parseInt(a.bytesTotal / a.bytesLoaded * a.duration, 10), a.durationEstimate === void 0) {
            a.durationEstimate = a.duration
          }
        }
        a.readyState !== 3 && a._iO.whileloading && a._iO.whileloading.apply(a)
      };
      this._whileplaying = function(b, c, d, e, f) {
        if(isNaN(b) || b === null) {
          return false
        }
        a.position = b;
        a.processOnPosition();
        if(!a.isHTML5 && g > 8) {
          if(a._iO.usePeakData && typeof c !== "undefined" && c) {
            a.peakData = {left:c.leftPeak, right:c.rightPeak}
          }
          if(a._iO.useWaveformData && typeof d !== "undefined" && d) {
            a.waveformData = {left:d.split(","), right:e.split(",")}
          }
          if(a._iO.useEQData && typeof f !== "undefined" && f && f.leftEQ && (b = f.leftEQ.split(","), a.eqData = b, a.eqData.left = b, typeof f.rightEQ !== "undefined" && f.rightEQ)) {
            a.eqData.right = f.rightEQ.split(",")
          }
        }
        a.playState === 1 && (!a.isHTML5 && g === 8 && !a.position && a.isBuffering && a._onbufferchange(0), a._iO.whileplaying && a._iO.whileplaying.apply(a));
        return true
      };
      this._onid3 = function(b, c) {
        var d = [], e, f;
        for(e = 0, f = b.length;e < f;e++) {
          d[b[e]] = c[e]
        }
        a.id3 = n(a.id3, d);
        a._iO.onid3 && a._iO.onid3.apply(a)
      };
      this._onconnect = function(b) {
        b = b === 1;
        if(a.connected = b) {
          a.failures = 0, l(a.sID) && (a.getAutoPlay() ? a.play(void 0, a.getAutoPlay()) : a._iO.autoLoad && a.load()), a._iO.onconnect && a._iO.onconnect.apply(a, [b])
        }
      };
      this._ondataerror = function() {
        a.playState > 0 && a._iO.ondataerror && a._iO.ondataerror.apply(a)
      }
    };
    fa = function() {
      return h.body || h._docElement || h.getElementsByTagName("div")[0]
    };
    O = function(b) {
      return h.getElementById(b)
    };
    n = function(b, a) {
      var e = {}, f, d;
      for(f in b) {
        b.hasOwnProperty(f) && (e[f] = b[f])
      }
      f = typeof a === "undefined" ? c.defaultOptions : a;
      for(d in f) {
        f.hasOwnProperty(d) && typeof e[d] === "undefined" && (e[d] = f[d])
      }
      return e
    };
    k = function() {
      function b(a) {
        var a = Ia.call(a), b = a.length;
        c ? (a[1] = "on" + a[1], b > 3 && a.pop()) : b === 3 && a.push(false);
        return a
      }
      function a(a, b) {
        var w = a.shift(), h = [f[b]];
        if(c) {
          w[h](a[0], a[1])
        }else {
          w[h].apply(w, a)
        }
      }
      var c = i.attachEvent, f = {add:c ? "attachEvent" : "addEventListener", remove:c ? "detachEvent" : "removeEventListener"};
      return{add:function() {
        a(b(arguments), "add")
      }, remove:function() {
        a(b(arguments), "remove")
      }}
    }();
    r = {abort:j(function() {
    }), canplay:j(function() {
      if(this._t._html5_canplay) {
        return true
      }
      this._t._html5_canplay = true;
      this._t._onbufferchange(0);
      var b = !isNaN(this._t.position) ? this._t.position / 1E3 : null;
      if(this._t.position && this.currentTime !== b) {
        try {
          this.currentTime = b
        }catch(a) {
        }
      }
    }), load:j(function() {
      this._t.loaded || (this._t._onbufferchange(0), this._t._whileloading(this._t.bytesTotal, this._t.bytesTotal, this._t._get_html5_duration()), this._t._onload(true))
    }), emptied:j(function() {
    }), ended:j(function() {
      this._t._onfinish()
    }), error:j(function() {
      this._t._onload(false)
    }), loadeddata:j(function() {
      var b = this._t, a = b.bytesTotal || 1;
      if(!b._loaded && !M) {
        b.duration = b._get_html5_duration(), b._whileloading(a, a, b._get_html5_duration()), b._onload(true)
      }
    }), loadedmetadata:j(function() {
    }), loadstart:j(function() {
      this._t._onbufferchange(1)
    }), play:j(function() {
      this._t._onbufferchange(0)
    }), playing:j(function() {
      this._t._onbufferchange(0)
    }), progress:j(function(b) {
      if(this._t.loaded) {
        return false
      }
      var a, c = 0, f = b.target.buffered;
      a = b.loaded || 0;
      var d = b.total || 1;
      if(f && f.length) {
        for(a = f.length;a--;) {
          c = f.end(a) - f.start(a)
        }
        a = c / b.target.duration
      }
      isNaN(a) || (this._t._onbufferchange(0), this._t._whileloading(a, d, this._t._get_html5_duration()), a && d && a === d && r.load.call(this, b))
    }), ratechange:j(function() {
    }), suspend:j(function(b) {
      r.progress.call(this, b);
      this._t._onsuspend()
    }), stalled:j(function() {
    }), timeupdate:j(function() {
      this._t._onTimer()
    }), waiting:j(function() {
      this._t._onbufferchange(1)
    })};
    X = function(b) {
      return!b.serverURL && (b.type ? K({type:b.type}) : K({url:b.url}) || c.html5Only)
    };
    la = function(b) {
      if(b) {
        b.src = Ja ? "" : "about:blank"
      }
    };
    K = function(b) {
      function a(a) {
        return c.preferFlash && p && !c.ignoreFlash && typeof c.flash[a] !== "undefined" && c.flash[a]
      }
      if(!c.useHTML5Audio || !c.hasHTML5) {
        return false
      }
      var e = b.url || null, b = b.type || null, f = c.audioFormats, d;
      if(b && c.html5[b] !== "undefined") {
        return c.html5[b] && !a(b)
      }
      if(!u) {
        u = [];
        for(d in f) {
          f.hasOwnProperty(d) && (u.push(d), f[d].related && (u = u.concat(f[d].related)))
        }
        u = RegExp("\\.(" + u.join("|") + ")(\\?.*)?$", "i")
      }
      d = e ? e.toLowerCase().match(u) : null;
      if(!d || !d.length) {
        if(b) {
          e = b.indexOf(";"), d = (e !== -1 ? b.substr(0, e) : b).substr(6)
        }else {
          return false
        }
      }else {
        d = d[1]
      }
      return d && typeof c.html5[d] !== "undefined" ? c.html5[d] && !a(d) : (b = "audio/" + d, e = c.html5.canPlayType({type:b}), (c.html5[d] = e) && c.html5[b] && !a(b))
    };
    Aa = function() {
      function b(b) {
        var d, e, f = false;
        if(!a || typeof a.canPlayType !== "function") {
          return false
        }
        if(b instanceof Array) {
          for(d = 0, e = b.length;d < e && !f;d++) {
            if(c.html5[b[d]] || a.canPlayType(b[d]).match(c.html5Test)) {
              f = true, c.html5[b[d]] = true, c.flash[b[d]] = !(!c.preferFlash || !p || !b[d].match(Ea))
            }
          }
          return f
        }else {
          return b = a && typeof a.canPlayType === "function" ? a.canPlayType(b) : false, !(!b || !b.match(c.html5Test))
        }
      }
      if(!c.useHTML5Audio || typeof Audio === "undefined") {
        return false
      }
      var a = typeof Audio !== "undefined" ? Ma ? new Audio(null) : new Audio : null, e, f = {}, d, h;
      d = c.audioFormats;
      for(e in d) {
        if(d.hasOwnProperty(e) && (f[e] = b(d[e].type), f["audio/" + e] = f[e], c.flash[e] = c.preferFlash && !c.ignoreFlash && e.match(Ea) ? true : false, d[e] && d[e].related)) {
          for(h = d[e].related.length;h--;) {
            f["audio/" + d[e].related[h]] = f[e], c.html5[d[e].related[h]] = f[e], c.flash[d[e].related[h]] = f[e]
          }
        }
      }
      f.canPlayType = a ? b : null;
      c.html5 = n(c.html5, f);
      return true
    };
    y = function() {
    };
    U = function(b) {
      if(g === 8 && b.loops > 1 && b.stream) {
        b.stream = false
      }
      return b
    };
    V = function(b) {
      if(b && !b.usePolicyFile && (b.onid3 || b.usePeakData || b.useWaveformData || b.useEQData)) {
        b.usePolicyFile = true
      }
      return b
    };
    ja = function() {
    };
    ba = function() {
      return false
    };
    va = function(b) {
      for(var a in b) {
        b.hasOwnProperty(a) && typeof b[a] === "function" && (b[a] = ba)
      }
    };
    T = function(b) {
      typeof b === "undefined" && (b = false);
      (t || b) && c.disable(b)
    };
    wa = function(b) {
      var a = null;
      if(b) {
        if(b.match(/\.swf(\?.*)?$/i)) {
          if(a = b.substr(b.toLowerCase().lastIndexOf(".swf?") + 4)) {
            return b
          }
        }else {
          b.lastIndexOf("/") !== b.length - 1 && (b += "/")
        }
      }
      b = (b && b.lastIndexOf("/") !== -1 ? b.substr(0, b.lastIndexOf("/") + 1) : "./") + c.movieURL;
      c.noSWFCache && (b += "?ts=" + (new Date).getTime());
      return b
    };
    da = function() {
      g = parseInt(c.flashVersion, 10);
      if(g !== 8 && g !== 9) {
        c.flashVersion = g = 8
      }
      var b = c.debugMode || c.debugFlash ? "_debug.swf" : ".swf";
      if(c.useHTML5Audio && !c.html5Only && c.audioFormats.mp4.required && g < 9) {
        c.flashVersion = g = 9
      }
      c.version = c.versionNumber + (c.html5Only ? " (HTML5-only mode)" : g === 9 ? " (AS3/Flash 9)" : " (AS2/Flash 8)");
      g > 8 ? (c.defaultOptions = n(c.defaultOptions, c.flash9Options), c.features.buffering = true, c.defaultOptions = n(c.defaultOptions, c.movieStarOptions), c.filePatterns.flash9 = RegExp("\\.(mp3|" + Ha.join("|") + ")(\\?.*)?$", "i"), c.features.movieStar = true) : c.features.movieStar = false;
      c.filePattern = c.filePatterns[g !== 8 ? "flash9" : "flash8"];
      c.movieURL = (g === 8 ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", b);
      c.features.peakData = c.features.waveformData = c.features.eqData = g > 8
    };
    ua = function(b, a) {
      if(!c.o) {
        return false
      }
      c.o._setPolling(b, a)
    };
    ga = function() {
      if(c.debugURLParam.test(aa)) {
        c.debugMode = true
      }
    };
    l = this.getSoundById;
    D = function() {
      var b = [];
      c.debugMode && b.push(c.swfCSS.sm2Debug);
      c.debugFlash && b.push(c.swfCSS.flashDebug);
      c.useHighPerformance && b.push(c.swfCSS.highPerf);
      return b.join(" ")
    };
    ia = function() {
      y("fbHandler");
      var b = c.getMoviePercent(), a = c.swfCSS, e = {type:"FLASHBLOCK"};
      if(c.html5Only) {
        return false
      }
      if(c.ok()) {
        if(c.oMC) {
          c.oMC.className = [D(), a.swfDefault, a.swfLoaded + (c.didFlashBlock ? " " + a.swfUnblocked : "")].join(" ")
        }
      }else {
        if(q) {
          c.oMC.className = D() + " " + a.swfDefault + " " + (b === null ? a.swfTimedout : a.swfError)
        }
        c.didFlashBlock = true;
        z({type:"ontimeout", ignoreInit:true, error:e});
        C(e)
      }
    };
    ca = function(b, a, c) {
      typeof s[b] === "undefined" && (s[b] = []);
      s[b].push({method:a, scope:c || null, fired:false})
    };
    z = function(b) {
      b || (b = {type:"onready"});
      if(!m && b && !b.ignoreInit) {
        return false
      }
      if(b.type === "ontimeout" && c.ok()) {
        return false
      }
      var a = {success:b && b.ignoreInit ? c.ok() : !t}, e = b && b.type ? s[b.type] || [] : [], f = [], d, a = [a], h = q && c.useFlashBlock && !c.ok();
      if(b.error) {
        a[0].error = b.error
      }
      for(b = 0, d = e.length;b < d;b++) {
        e[b].fired !== true && f.push(e[b])
      }
      if(f.length) {
        for(b = 0, d = f.length;b < d;b++) {
          if(f[b].scope ? f[b].method.apply(f[b].scope, a) : f[b].method.apply(this, a), !h) {
            f[b].fired = true
          }
        }
      }
      return true
    };
    A = function() {
      i.setTimeout(function() {
        c.useFlashBlock && ia();
        z();
        c.onload instanceof Function && c.onload.apply(i);
        c.waitForWindowLoad && k.add(i, "load", A)
      }, 1)
    };
    Y = function() {
      if(p !== void 0) {
        return p
      }
      var b = false, a = navigator, c = a.plugins, f, d = i.ActiveXObject;
      if(c && c.length) {
        (a = a.mimeTypes) && a["application/x-shockwave-flash"] && a["application/x-shockwave-flash"].enabledPlugin && a["application/x-shockwave-flash"].enabledPlugin.description && (b = true)
      }else {
        if(typeof d !== "undefined") {
          try {
            f = new d("ShockwaveFlash.ShockwaveFlash")
          }catch(h) {
          }
          b = !!f
        }
      }
      return p = b
    };
    za = function() {
      var b, a;
      if(na && o.match(/os (1|2|3_0|3_1)/i)) {
        c.hasHTML5 = false;
        c.html5Only = true;
        if(c.oMC) {
          c.oMC.style.display = "none"
        }
        return false
      }
      if(c.useHTML5Audio) {
        if(!c.html5 || !c.html5.canPlayType) {
          return c.hasHTML5 = false, true
        }else {
          c.hasHTML5 = true
        }
        if(oa && Y()) {
          return true
        }
      }else {
        return true
      }
      for(a in c.audioFormats) {
        if(c.audioFormats.hasOwnProperty(a) && (c.audioFormats[a].required && !c.html5.canPlayType(c.audioFormats[a].type) || c.flash[a] || c.flash[c.audioFormats[a].type])) {
          b = true
        }
      }
      c.ignoreFlash && (b = false);
      c.html5Only = c.hasHTML5 && c.useHTML5Audio && !b;
      return!c.html5Only
    };
    xa = function(b) {
      if(!b._hasTimer) {
        b._hasTimer = true
      }
    };
    ya = function(b) {
      if(b._hasTimer) {
        b._hasTimer = false
      }
    };
    C = function(b) {
      b = typeof b !== "undefined" ? b : {};
      c.onerror instanceof Function && c.onerror.apply(i, [{type:typeof b.type !== "undefined" ? b.type : null}]);
      typeof b.fatal !== "undefined" && b.fatal && c.disable()
    };
    Ba = function() {
      if(!oa || !Y()) {
        return false
      }
      var b = c.audioFormats, a, e;
      for(e in b) {
        if(b.hasOwnProperty(e) && (e === "mp3" || e === "mp4")) {
          if(c.html5[e] = false, b[e] && b[e].related) {
            for(a = b[e].related.length;a--;) {
              c.html5[b[e].related[a]] = false
            }
          }
        }
      }
    };
    this._setSandboxType = function() {
    };
    this._externalInterfaceOK = function() {
      if(c.swfLoaded) {
        return false
      }
      (new Date).getTime();
      c.swfLoaded = true;
      E = false;
      oa && Ba();
      v ? setTimeout(P, 100) : P()
    };
    S = function(b, a) {
      function e(a, b) {
        return'<param name="' + a + '" value="' + b + '" />'
      }
      if(G && H) {
        return false
      }
      if(c.html5Only) {
        return da(), c.oMC = O(c.movieID), P(), H = G = true, false
      }
      var f = a || c.url, d = c.altURL || f, g;
      g = fa();
      var i, l, j = D(), k, m = null, m = (m = h.getElementsByTagName("html")[0]) && m.dir && m.dir.match(/rtl/i), b = typeof b === "undefined" ? c.id : b;
      da();
      c.url = wa(qa ? f : d);
      a = c.url;
      c.wmode = !c.wmode && c.useHighPerformance ? "transparent" : c.wmode;
      if(c.wmode !== null && (o.match(/msie 8/i) || !v && !c.useHighPerformance) && navigator.platform.match(/win32|win64/i)) {
        c.specialWmodeCase = true, c.wmode = null
      }
      g = {name:b, id:b, src:a, width:"auto", height:"auto", quality:"high", allowScriptAccess:c.allowScriptAccess, bgcolor:c.bgColor, pluginspage:Fa + "www.macromedia.com/go/getflashplayer", title:"JS/Flash audio component (SoundManager 2)", type:"application/x-shockwave-flash", wmode:c.wmode, hasPriority:"true"};
      if(c.debugFlash) {
        g.FlashVars = "debug=1"
      }
      c.wmode || delete g.wmode;
      if(v) {
        f = h.createElement("div"), l = ['<object id="' + b + '" data="' + a + '" type="' + g.type + '" title="' + g.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + Fa + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="' + g.width + '" height="' + g.height + '">', e("movie", a), e("AllowScriptAccess", c.allowScriptAccess), e("quality", g.quality), c.wmode ? e("wmode", c.wmode) : "", e("bgcolor", c.bgColor), e("hasPriority", "true"), 
        c.debugFlash ? e("FlashVars", g.FlashVars) : "", "</object>"].join("")
      }else {
        for(i in f = h.createElement("embed"), g) {
          g.hasOwnProperty(i) && f.setAttribute(i, g[i])
        }
      }
      ga();
      j = D();
      if(g = fa()) {
        if(c.oMC = O(c.movieID) || h.createElement("div"), c.oMC.id) {
          k = c.oMC.className;
          c.oMC.className = (k ? k + " " : c.swfCSS.swfDefault) + (j ? " " + j : "");
          c.oMC.appendChild(f);
          if(v) {
            i = c.oMC.appendChild(h.createElement("div")), i.className = c.swfCSS.swfBox, i.innerHTML = l
          }
          H = true
        }else {
          c.oMC.id = c.movieID;
          c.oMC.className = c.swfCSS.swfDefault + " " + j;
          i = j = null;
          if(!c.useFlashBlock) {
            if(c.useHighPerformance) {
              j = {position:"fixed", width:"8px", height:"8px", bottom:"0px", left:"0px", overflow:"hidden"}
            }else {
              if(j = {position:"absolute", width:"6px", height:"6px", top:"-9999px", left:"-9999px"}, m) {
                j.left = Math.abs(parseInt(j.left, 10)) + "px"
              }
            }
          }
          if(La) {
            c.oMC.style.zIndex = 1E4
          }
          if(!c.debugFlash) {
            for(k in j) {
              j.hasOwnProperty(k) && (c.oMC.style[k] = j[k])
            }
          }
          try {
            v || c.oMC.appendChild(f);
            g.appendChild(c.oMC);
            if(v) {
              i = c.oMC.appendChild(h.createElement("div")), i.className = c.swfCSS.swfBox, i.innerHTML = l
            }
            H = true
          }catch(n) {
            throw Error(y("domError") + " \n" + n.toString());
          }
        }
      }
      return G = true
    };
    R = function() {
      if(c.html5Only) {
        return S(), false
      }
      if(c.o) {
        return false
      }
      c.o = c.getMovie(c.id);
      if(!c.o) {
        J ? (v ? c.oMC.innerHTML = ha : c.oMC.appendChild(J), J = null, G = true) : S(c.id, c.url), c.o = c.getMovie(c.id)
      }
      c.oninitmovie instanceof Function && setTimeout(c.oninitmovie, 1);
      return true
    };
    Q = function() {
      setTimeout(ta, 1E3)
    };
    ta = function() {
      if(W) {
        return false
      }
      W = true;
      k.remove(i, "load", Q);
      if(E && !pa) {
        return false
      }
      var b;
      m || (b = c.getMoviePercent());
      setTimeout(function() {
        b = c.getMoviePercent();
        !m && Da && (b === null ? c.useFlashBlock || c.flashLoadTimeout === 0 ? c.useFlashBlock && ia() : T(true) : c.flashLoadTimeout !== 0 && T(true))
      }, c.flashLoadTimeout)
    };
    x = function() {
      function b() {
        k.remove(i, "focus", x);
        k.remove(i, "load", x)
      }
      if(pa || !E) {
        return b(), true
      }
      pa = Da = true;
      M && E && k.remove(i, "mousemove", x);
      W = false;
      b();
      return true
    };
    Ca = function() {
      var b, a = [];
      if(c.useHTML5Audio && c.hasHTML5) {
        for(b in c.audioFormats) {
          c.audioFormats.hasOwnProperty(b) && a.push(b + ": " + c.html5[b] + (!c.html5[b] && p && c.flash[b] ? " (using flash)" : c.preferFlash && c.flash[b] && p ? " (preferring flash)" : !c.html5[b] ? " (" + (c.audioFormats[b].required ? "required, " : "") + "and no flash support)" : ""))
        }
      }
    };
    I = function(b) {
      if(m) {
        return false
      }
      if(c.html5Only) {
        return m = true, A(), true
      }
      var a;
      if(!c.useFlashBlock || !c.flashLoadTimeout || c.getMoviePercent()) {
        m = true, t && (a = {type:!p && q ? "NO_FLASH" : "INIT_TIMEOUT"})
      }
      if(t || b) {
        if(c.useFlashBlock && c.oMC) {
          c.oMC.className = D() + " " + (c.getMoviePercent() === null ? c.swfCSS.swfTimedout : c.swfCSS.swfError)
        }
        z({type:"ontimeout", error:a});
        C(a);
        return false
      }
      if(c.waitForWindowLoad && !sa) {
        return k.add(i, "load", A), false
      }else {
        A()
      }
      return true
    };
    P = function() {
      if(m) {
        return false
      }
      if(c.html5Only) {
        if(!m) {
          k.remove(i, "load", c.beginDelayedInit), c.enabled = true, I()
        }
        return true
      }
      R();
      try {
        c.o._externalInterfaceTest(false), ua(true, c.flashPollingInterval || (c.useHighPerformance ? 10 : 50)), c.debugMode || c.o._disableDebug(), c.enabled = true, c.html5Only || k.add(i, "unload", ba)
      }catch(b) {
        return C({type:"JS_TO_FLASH_EXCEPTION", fatal:true}), T(true), I(), false
      }
      I();
      k.remove(i, "load", c.beginDelayedInit);
      return true
    };
    B = function() {
      if(ea) {
        return false
      }
      ea = true;
      ga();
      if(!p && c.hasHTML5) {
        c.useHTML5Audio = true, c.preferFlash = false
      }
      Aa();
      c.html5.usingFlash = za();
      q = c.html5.usingFlash;
      Ca();
      if(!p && q) {
        c.flashLoadTimeout = 1
      }
      h.removeEventListener && h.removeEventListener("DOMContentLoaded", B, false);
      R();
      return true
    };
    ma = function() {
      h.readyState === "complete" && (B(), h.detachEvent("onreadystatechange", ma));
      return true
    };
    Y();
    k.add(i, "focus", x);
    k.add(i, "load", x);
    k.add(i, "load", Q);
    M && E && k.add(i, "mousemove", x);
    h.addEventListener ? h.addEventListener("DOMContentLoaded", B, false) : h.attachEvent ? h.attachEvent("onreadystatechange", ma) : C({type:"NO_DOM2_EVENTS", fatal:true});
    h.readyState === "complete" && setTimeout(B, 100)
  }
  var Z = null;
  $.SoundManager = N;
  $.soundManager = Z
})(window);
var pulse = pulse || {};
pulse.plugin = pulse.plugin || {};
pulse.plugin.Plugin = PClass.extend({init:function() {
  this._private = {};
  this._private.types = {}
}, subscribe:function(objectType, functionName, callbackType, callback) {
  var pluginCallback = new pulse.plugin.PluginCallback({objectType:objectType, functionName:functionName, callbackType:callbackType, callback:callback, pluginManager:this});
  if(this._private.types[objectType] == undefined) {
    this._private.types[objectType] = {}
  }
  if(this._private.types[objectType][functionName] == undefined) {
    this._private.types[objectType][functionName] = {}
  }
  if(this._private.types[objectType][functionName][callbackType] == undefined) {
    this._private.types[objectType][functionName][callbackType] = []
  }
  this._private.types[objectType][functionName][callbackType].push(pluginCallback);
  return pluginCallback
}, invoke:function(objectType, functionName, callbackType, sender, params) {
  if(typeof this._private.types[objectType] !== pulse.plugin._UNDEFINED && typeof this._private.types[objectType][functionName] !== pulse.plugin._UNDEFINED && typeof this._private.types[objectType][functionName][callbackType] !== pulse.plugin._UNDEFINED) {
    var len = this._private.types[objectType][functionName][callbackType].length;
    for(var i = 0;i < len;i++) {
      this._private.types[objectType][functionName][callbackType][i].callback.apply(sender, params)
    }
  }
}, unsubscribe:function(pluginCallback) {
  if(this._private.types[pluginCallback.objectType] != undefined && this._private.types[pluginCallback.objectType][pluginCallback.functionName] != undefined && this._private.types[pluginCallback.objectType][pluginCallback.functionName][pluginCallback.callbackType] != undefined) {
    var callbacks = this._private.types[pluginCallback.objectType][pluginCallback.functionName][pluginCallback.callbackType];
    for(var key in callbacks) {
      if(callbacks[key] == pluginCallback) {
        callbacks.splice(key, 1)
      }
    }
  }
}});
pulse.plugin.PluginCallback = PClass.extend({init:function(params) {
  this.objectType = params.objectType;
  this.functionName = params.functionName;
  this.callbackType = params.callbackType;
  this.callback = params.callback
}});
pulse.plugin.PluginCallbackTypes = {onEnter:"onEnter", onExit:"onExit"};
pulse.plugin._UNDEFINED = "undefined";
var pulse = pulse || {};
pulse.plugin = pulse.plugin || {};
pulse.plugin.PluginCollection = PClass.extend({init:function() {
  this._private = {};
  this._private.plugins = []
}, add:function(plugin) {
  this._private.plugins.push(plugin)
}, remove:function(plugin) {
  for(var key in this._private.plugins) {
    if(this._private.plugins[key] === plugin) {
      this._private.plugins.splice(key, 1)
    }
  }
}, invoke:function(objectType, functionName, callbackType, sender, params) {
  var len = this._private.plugins.length;
  for(var i = 0;i < len;i++) {
    this._private.plugins[i].invoke(objectType, functionName, callbackType, sender, params)
  }
}});
pulse.plugins = pulse.plugins || new pulse.plugin.PluginCollection;
var pulse = pulse || {};
pulse.error = {DuplicateName:function(name) {
  throw"There is already an object with the name " + name + " on this layer.";
}, InvalidSource:function() {
  throw"Invalid source for pulse image.";
}};
var pulse = pulse || {};
pulse.util = pulse.util || {};
pulse.util.find = function(collection, name) {
  var found = [];
  if(collection instanceof Array) {
    for(var o = 0;o < collection.length;o++) {
      if(typeof collection[o] == "function" && typeof collection[o].name == "function" && collection[o].name == name) {
        found.push(collection[o])
      }
    }
  }else {
    if(typeof collection == "object") {
      for(var ob in collection) {
        if(ob == name) {
          found.push(collection[ob])
        }
      }
    }
  }
  return found
};
pulse.util.intersects = function(box1, box2) {
  var points = [{x:box1.x, y:box1.y}, {x:box1.x, y:box1.y + box1.height}, {x:box1.x + box1.width, y:box1.y}, {x:box1.x + box1.width, y:box1.y + box1.height}];
  for(var p = 0;p < 4;p++) {
    var pnt = points[p];
    if(pnt.x < box2.width && pnt.x > box2.x) {
      if(pnt.y < box2.height && pnt.y > box2.y) {
        return true
      }
    }
  }
  return false
};
pulse.util.checkValue = function(variable, vDefault) {
  if(variable === null) {
    variable = vDefault
  }
  return variable
};
pulse.util.checkProperty = function(obj, prop, propDefault) {
  if(typeof obj == "undefined") {
    obj = {}
  }
  if(!obj.hasOwnProperty(prop) || obj[prop] === null) {
    obj[prop] = propDefault
  }
  return obj
};
pulse.util.checkParams = function(params, defaults) {
  if(typeof params == "undefined" || params === null || typeof params != "object") {
    params = {}
  }
  for(var p in defaults) {
    if(!params.hasOwnProperty(p) || params[p] === null) {
      params[p] = defaults[p]
    }
  }
  return params
};
pulse.util.getLength = function(obj) {
  var size = 0, key;
  for(key in obj) {
    if(obj.hasOwnProperty(key)) {
      size++
    }
  }
  return size
};
pulse.util.compareZIndexes = function(objA, objB) {
  var za = 0;
  if(objA.hasOwnProperty("zindex")) {
    za = objA.zindex
  }
  var zb = 0;
  if(objB.hasOwnProperty("zindex")) {
    zb = objB.zindex
  }
  if(za < zb) {
    return-1
  }
  if(za > zb) {
    return 1
  }
  return 0
};
pulse.util.getOrderedKeys = function(objects) {
  var ordered = [];
  for(var o in objects) {
    if(objects[o].hasOwnProperty("name")) {
      ordered.push(objects[o])
    }
  }
  ordered.sort(pulse.util.compareZIndexes);
  var keys = [];
  for(var ov = 0;ov < ordered.length;ov++) {
    keys.push(ordered[ov].name)
  }
  return keys
};
pulse.util.getIFrame = function(parentElement) {
  var iframe = document.createElement("iframe");
  if(parentElement === null) {
    parentElement = document.body
  }
  parentElement.appendChild(iframe);
  iframe.doc = null;
  if(iframe.contentDocument) {
    iframe.doc = iframe.contentDocument
  }else {
    if(iframe.contentWindow) {
      iframe.doc = iframe.contentWindow.document
    }else {
      if(iframe.document) {
        iframe.doc = iframe.document
      }
    }
  }
  if(iframe.doc === null) {
    throw"Document not found, append the parent element to the DOM before creating the IFrame";
  }
  iframe.doc.open();
  iframe.doc.close();
  return iframe
};
pulse.util.easeLinear = function(t, b, c, d) {
  return c * t / d + b
};
pulse.util.easeInQuad = function(t, b, c, d) {
  t /= d;
  return c * t * t + b
};
pulse.util.easeOutQuad = function(t, b, c, d) {
  t /= d;
  return-c * t * (t - 2) + b
};
pulse.util.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if(t < 1) {
    return c / 2 * t * t + b
  }
  t--;
  return-c / 2 * (t * (t - 2) - 1) + b
};
pulse.util.easeOutCubic = function(t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b
};
pulse.util.eventSupported = function(type) {
  var el = document.createElement("canvas");
  return"on" + type in el
};
var pulse = pulse || {};
pulse.Point = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {x:0, y:0});
  this.x = params.x;
  this.y = params.y
}});
var pulse = pulse || {};
pulse.support = pulse.support || {};
pulse.support.touch = false;
pulse.ready(function() {
  pulse.support.touch = pulse.util.eventSupported("touchstart")
});
var pulse = pulse || {};
pulse.Event = PClass.extend({init:function() {
  this.sender = null
}});
pulse.MouseEvent = pulse.Event.extend({init:function() {
  this._super();
  this.window = {x:0, y:0};
  this.world = {x:0, y:0};
  this.parent = {x:0, y:0};
  this.position = {x:0, y:0};
  this.scrollDelta = 0
}});
pulse.TouchEvent = pulse.MouseEvent.extend({init:function() {
  this._super();
  this.touches = [];
  this.changedTouches = [];
  this.targetTouches = [];
  this.gestureScale = 1;
  this.gestureRotation = 0
}});
var pulse = pulse || {};
pulse.EventManager = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {owner:null, masterCallback:null});
  this.owner = params.owner;
  this.masterCallback = params.masterCallback;
  this._private = {};
  this._private.events = {};
  this._private.touchDown = false
}, bind:function(type, callback) {
  var evtName = this.checkType(type);
  if(!this._private.events.hasOwnProperty(evtName)) {
    this._private.events[evtName] = [];
    this._private.events[evtName].push(callback)
  }else {
    this._private.events[evtName].push(callback)
  }
}, unbind:function(type) {
  var evtName = this.checkType(type);
  if(this._private.events.hasOwnProperty(evtName)) {
    delete this._private.events[evtName]
  }
}, unbindFunction:function(type, callback) {
  var evtName = this.checkType(type);
  if(this._private.events.hasOwnProperty(evtName)) {
    for(var i = this._private.events[evtName].length - 1;i >= 0;i--) {
      if(this._private.events[evtName][i] === callback) {
        this._private.events[evtName].splice(i, 1)
      }
    }
  }
}, hasEvent:function(type) {
  if(this._private.events.hasOwnProperty(type)) {
    return true
  }
  return false
}, raiseEvent:function(type, evt) {
  if(type === "touchstart" && this._private.touchDown === false) {
    this._private.touchDown = true
  }else {
    if(type === "touchend" && this._private.touchDown === true) {
      this.raiseEvent("touchclick", evt)
    }else {
      if(type === "touchclick" || type === "mouseout") {
        this._private.touchDown = false
      }
    }
  }
  if(this.hasEvent(type)) {
    for(var e = 0;e < this._private.events[type].length;e++) {
      this._private.events[type][e](evt)
    }
  }
  if(typeof this.masterCallback === "function") {
    if(this.owner) {
      this.masterCallback.call(this.owner, type, evt)
    }else {
      this.masterCallback(type, evt)
    }
  }
}, checkType:function(type) {
  if(type === "click" && pulse.util.eventSupported("touchend")) {
    return"touchclick"
  }
  for(var t in pulse.eventtranslations) {
    if(type === pulse.eventtranslations[t] && pulse.util.eventSupported(t)) {
      return t
    }
  }
  return type
}});
pulse.EventManager.DraggedItems = {};
var pulse = pulse || {};
pulse.Node = PClass.extend({init:function(params) {
  pulse.plugins.invoke("pulse.Node", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  params = pulse.util.checkParams(params, {name:"Node" + pulse.Node.nodeIdx++});
  this.name = params.name;
  this.parent = null;
  this._private = {};
  pulse.plugins.invoke("pulse.Node", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.Node.PLUGIN_TYPE, pulse.Node.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  pulse.plugins.invoke(pulse.Node.PLUGIN_TYPE, pulse.Node.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}});
pulse.Node.nodeIdx = 0;
pulse.Node.PLUGIN_TYPE = "pulse.Node";
pulse.Node.PLUGIN_UPDATE = "update";
var pulse = pulse || {};
pulse.Asset = pulse.Node.extend({init:function(params) {
  this._super(params);
  params = pulse.util.checkParams(params, {filename:"", autoLoad:true});
  this.filename = params.filename;
  this.autoLoad = params.autoLoad;
  this.percentLoaded = 0;
  this.events = new pulse.EventManager;
  this.error = false;
  this._private = {}
}, load:function() {
}, complete:function() {
  this.events.raiseEvent("complete", {asset:this})
}});
var pulse = pulse || {};
pulse.TextFile = pulse.Asset.extend({init:function(params) {
  this._super(params);
  this.text = "";
  if(this.autoLoad) {
    this.load()
  }
}, load:function() {
  var _self = this;
  var txtFile = new XMLHttpRequest;
  txtFile.open("GET", this.filename, true);
  txtFile.onreadystatechange = function() {
    if(txtFile.readyState === 4) {
      if(txtFile.status === 200) {
        _self.text = txtFile.responseText;
        _self.percentLoaded = 100;
        _self.complete()
      }else {
        if(txtFile.status === 404) {
        }
      }
    }
  };
  txtFile.send(null)
}});
var pulse = pulse || {};
pulse.Texture = pulse.Asset.extend({init:function(params) {
  this._super(params);
  if(params.filename === "") {
    pulse.error.InvalidSource()
  }
  this._private.image = new Image;
  this._private.imgCanvas = document.createElement("canvas");
  if(this.autoLoad === true) {
    this._private.image.src = this.filename
  }
  this.scaleX = 1;
  this.scaleY = 1;
  this.rotation = 0;
  this.alpha = 100;
  this._private.lastSlice = null;
  var _self = this;
  this._private.image.onload = function() {
    _self.percentLoaded = 100;
    var evt = {asset:_self.name};
    _self.complete();
    _self._private.lastSlice = {x:-1, y:-1, width:_self._private.image.width * _self.scaleX, height:_self._private.image.height * _self.scaleY, rotation:_self.rotation, alpha:_self.alpha}
  };
  this._private.image.onerror = function() {
    _self.error = true
  }
}, load:function() {
  if(this.autoLoad === true) {
    return
  }
  this._private.image.src = this.filename
}, width:function() {
  return this._private.image.width * this.scaleX
}, height:function() {
  return this._private.image.height * this.scaleY
}, slice:function(x, y, width, height) {
  if(this.percentLoaded !== 100) {
    return null
  }
  if(x === this._private.lastSlice.x && y === this._private.lastSlice.y && width === this._private.lastSlice.width && height === this._private.lastSlice.height && this.rotation === this._private.lastSlice.rotation && this.alpha === this._private.lastSlice.alpha) {
    return this._private.imgCanvas
  }
  this._private.lastSlice = {x:x, y:y, width:width * this.scaleX, height:height * this.scaleY, rotation:this.rotation, alpha:this.alpha};
  if(x === null || x < 0) {
    x = 0
  }
  if(x > this._private.image.width) {
    x = this._private.image.width
  }
  if(y === null || y < 0) {
    y = 0
  }
  if(y > this._private.image.height) {
    y = height
  }
  if(width === null || width > this._private.image.width) {
    width = this._private.image.width
  }
  if(x + width > this._private.image.width) {
    width = this._private.image.width - x
  }
  if(height === null || height > this._private.image.height) {
    height = this._private.image.height
  }
  if(y + height > this._private.image.height) {
    height = this._private.image.height - y
  }
  var sWidth = width;
  var sHeight = height;
  var iWidth = sWidth * this.scaleX;
  var iHeight = sHeight * this.scaleY;
  var cWidth = iWidth;
  var cHeight = iHeight;
  if(this.rotation % 360 !== 0) {
    cWidth = iWidth * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + iHeight * Math.abs(Math.sin(Math.PI * this.rotation / 180));
    cHeight = iHeight * Math.abs(Math.cos(Math.PI * this.rotation / 180)) + iWidth * Math.abs(Math.sin(Math.PI * this.rotation / 180))
  }
  this._private.imgCanvas.width = cWidth;
  this._private.imgCanvas.height = cHeight;
  var ctx = this._private.imgCanvas.getContext("2d");
  ctx.save();
  var drawX = 0;
  var drawY = 0;
  if(this.rotation % 360 !== 0) {
    drawX = (cWidth - iWidth) / 2;
    drawY = (cHeight - iHeight) / 2;
    var rotationX = cWidth / 2;
    var rotationY = cHeight / 2;
    ctx.translate(rotationX, rotationY);
    ctx.rotate(Math.PI * (this.rotation % 360) / 180);
    ctx.translate(-rotationX, -rotationY)
  }
  ctx.globalAlpha = this.alpha / 100;
  ctx.drawImage(this._private.image, x, y, sWidth, sHeight, drawX, drawY, iWidth, iHeight);
  if(pulse.DEBUG) {
    ctx.save();
    ctx.fillStyle = "#42CCDE";
    ctx.beginPath();
    ctx.arc(this._private.imgCanvas.width / 2, this._private.imgCanvas.height / 2, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore()
  }
  if(pulse.DEBUG) {
    ctx.strokeStyle = "#FF2200";
    ctx.strokeRect(drawX, drawY, iWidth, iHeight)
  }
  ctx.restore();
  return this._private.imgCanvas
}});
var pulse = pulse || {};
pulse.BitmapChar = PClass.extend({init:function() {
  this.position = {x:0, y:0};
  this.size = {width:0, height:0};
  this.offset = {x:0, y:0};
  this.xAdvance = 0;
  this.page = 0
}});
pulse.BitmapFont = pulse.Asset.extend({init:function(params) {
  this._super(params);
  this.imageFilename = "";
  this.fileDirectory = "";
  this.image = null;
  this.lineHeight = 0;
  this.base = 0;
  this.size = {width:0, height:0};
  this.characters = {};
  var pathParts = window.location.href;
  if(pathParts.indexOf("?") !== -1) {
    pathParts = pathParts.substr(0, pathParts.indexOf("?"))
  }
  pathParts = pathParts.split("/");
  var fileParts = this.filename.split("/");
  pathParts.pop();
  fileParts.pop();
  this.fileDirectory = pathParts.join("/");
  if(fileParts.length > 0) {
    this.fileDirectory += "/" + fileParts.join("/")
  }
  if(this.autoLoad) {
    this.load()
  }
}, load:function() {
  var _self = this;
  var fntFile = new XMLHttpRequest;
  fntFile.open("GET", this.filename, true);
  fntFile.onreadystatechange = function() {
    if(fntFile.readyState === 4) {
      if(fntFile.status === 200) {
        var allText = fntFile.responseText;
        var lines = fntFile.responseText.split("\n");
        _self.percentLoaded = 50;
        _self.parse(lines)
      }else {
        if(fntFile.status === 404) {
        }
      }
    }
  };
  fntFile.send(null)
}, parse:function(lines) {
  var line;
  for(var i = 0;i < lines.length;i++) {
    line = lines[i];
    if(line.indexOf("common") === 0) {
      var keyvals = line.split(" ");
      for(var j = 0;j < keyvals.length;j++) {
        var keyval = keyvals[j].split("=");
        if(keyval.length > 1) {
          switch(keyval[0]) {
            case "lineHeight":
              this.lineHeight = parseInt(keyval[1], 10);
              break;
            case "base":
              this.base = parseInt(keyval[1], 10);
              break;
            case "scaleW":
              this.size.width = parseInt(keyval[1], 10);
              break;
            case "scaleH":
              this.size.height = parseInt(keyval[1], 10);
              break
          }
        }
      }
    }else {
      if(line.indexOf("page") === 0) {
        var pvals = line.split(" ");
        for(var p = 0;p < pvals.length;p++) {
          var pval = pvals[p].split("=");
          if(pval.length > 1) {
            if(pval[0] === "file") {
              this.imageFilename = pval[1].replace(/"/gi, "")
            }
          }
        }
      }else {
        if(line.indexOf("char") === 0) {
          var character = new pulse.BitmapChar;
          var cvals = line.split(" ");
          for(var c = 0;c < cvals.length;c++) {
            var cval = cvals[c].split("=");
            if(cval.length > 1) {
              switch(cval[0]) {
                case "id":
                  this.characters[cval[1]] = character;
                  break;
                case "x":
                  character.position.x = parseInt(cval[1], 10);
                  break;
                case "y":
                  character.position.y = parseInt(cval[1], 10);
                  break;
                case "width":
                  character.size.width = parseInt(cval[1], 10);
                  break;
                case "height":
                  character.size.height = parseInt(cval[1], 10);
                  break;
                case "xoffset":
                  character.offset.x = parseInt(cval[1], 10);
                  break;
                case "yoffset":
                  character.offset.y = parseInt(cval[1], 10);
                  break;
                case "xadvance":
                  character.xAdvance = parseInt(cval[1], 10);
                  break;
                case "page":
                  character.page = parseInt(cval[1], 10);
                  break
              }
            }
          }
        }
      }
    }
  }
  var _self = this;
  this.image = new Image;
  this.image.src = this.fileDirectory + "/" + this.imageFilename;
  this.image.onload = function() {
    _self.percentLoaded = 100;
    _self.complete()
  }
}, getStringBitmapChars:function(text) {
  var verts = [];
  var charcode = 0;
  for(var i = 0;i < text.length;i++) {
    charcode = text.charCodeAt(i);
    verts.push(this.characters[charcode])
  }
  return verts
}, getStringWidth:function(text) {
  var width = 0;
  var charcode = 0;
  var character = null;
  for(var i = 0;i < text.length;i++) {
    charcode = text.charCodeAt(i);
    character = this.characters[charcode];
    width += character.xAdvance
  }
  return width
}});
var pulse = pulse || {};
pulse.Sound = pulse.Asset.extend({init:function(params) {
  this._super(params);
  params = pulse.util.checkParams(params, {type:"flash", loop:false});
  this._private.type = params.type;
  if(this._private.type == "flash") {
    this.initFlashPlayer()
  }
  this._private.audio = null;
  this.loop = params.loop;
  this.playing = false;
  this.paused = false;
  if(this.autoLoad && (this._private.type == "html5" || this._private.type == "flash" && pulse.Sound.FlashReady)) {
    this.load()
  }
}, load:function() {
  var _self = this;
  switch(this._private.type) {
    case "flash":
      this._private.audio = soundManager.createSound({id:"mySound", url:this.filename, autoLoad:true, autoPlay:false, whileloading:function() {
        _self.percentLoaded = this.bytesLoaded / this.bytesTotal * 100
      }, onload:function() {
        _self.percentLoaded = 100;
        _self.complete()
      }, onfinish:function() {
        _self.finished()
      }});
      break;
    case "html5":
      var audio = document.createElement("audio");
      if(audio.canPlayType) {
        audio.setAttribute("preload", "auto");
        if(!!audio.canPlayType && "" !== audio.canPlayType("audio/mpeg")) {
          audio.setAttribute("src", this.filename + ".mp3")
        }else {
          if(!!audio.canPlayType && "" !== audio.canPlayType('audio/ogg; codecs="vorbis"')) {
            audio.setAttribute("src", this.filename + ".ogg")
          }
        }
        audio.addEventListener("progress", function(e) {
          if(audio.buffered.end.length > 0) {
            _self.percentLoaded = audio.buffered.end(0) / audio.duration * 100
          }else {
            _self.percentLoaded = 0
          }
          if(_self.percentLoaded >= 100) {
            _self.complete()
          }
        });
        audio.addEventListener("ended", function() {
          _self.finished()
        })
      }else {
        audio = null
      }
      this._private.audio = audio;
      break
  }
}, play:function() {
  if(!this._private.audio) {
    return
  }
  switch(this._private.type) {
    case "flash":
      if(this.paused) {
        this._private.audio.resume()
      }else {
        this._private.audio.play()
      }
      break;
    case "html5":
      if(this.loop) {
        this._private.audio.setAttribute("loop", "loop")
      }
      this._private.audio.play();
      break
  }
  this.playing = true;
  this.paused = false
}, pause:function() {
  if(!this._private.audio) {
    return
  }
  switch(this._private.type) {
    case "flash":
    ;
    case "html5":
      this._private.audio.pause();
      break
  }
  this.playing = false;
  this.paused = true
}, stop:function() {
  if(!this._private.audio) {
    return
  }
  this.playing = false;
  this.paused = false;
  switch(this._private.type) {
    case "flash":
      this._private.audio.stop();
      break;
    case "html5":
      this._private.audio.pause();
      this._private.audio.currentTime = 0;
      break
  }
}, finished:function() {
  switch(this._private.type) {
    case "flash":
      if(this.loop) {
        this.start()
      }
      break;
    case "html5":
      break
  }
  this.events.raiseEvent("finished", {sound:this})
}, initFlashPlayer:function() {
  if(pulse.Sound.FlashInitialized === false) {
    pulse.Sound.FlashInitialized = true;
    window.soundManager = new SoundManager(pulse.libsrc + "/asset/");
    soundManager.beginDelayedInit();
    soundManager.flashVersion = 8;
    soundManager.useFlashBlock = false;
    soundManager.onready(function() {
      pulse.Sound.FlashReady = true;
      if(this.autoLoad) {
        this.load()
      }
    }, this);
    soundManager.ontimeout(function() {
    })
  }else {
    if(pulse.Sound.FlashReady === false) {
      soundManager.onready(function() {
        if(this.autoLoad) {
          this.load()
        }
      }, this)
    }
  }
}});
pulse.Sound.FlashInitialized = false;
pulse.Sound.FlashReady = false;
var pulse = pulse || {};
pulse.AssetBundle = PClass.extend({init:function(params) {
  this.assets = [];
  this.events = new pulse.EventManager;
  this._private = {};
  this._private.numberLoaded = 0;
  this.percentLoaded = 0
}, addAsset:function(asset) {
  if(asset instanceof pulse.Asset) {
    var _self = this;
    asset.events.bind("complete", function(evt) {
      _self._private.numberLoaded++;
      _self.updatePercent();
      _self.events.raiseEvent("assetLoaded", {asset:asset.name})
    });
    this.assets.push(asset)
  }
}, removeAsset:function(asset) {
  var assetName = asset;
  if(asset instanceof pulse.Asset) {
    assetName = asset.name
  }
  for(var a in this.assets) {
    if(this.assets[a].name === assetName) {
      this.assets.splice(a, 1)
    }
  }
  this.updatePercent()
}, getAsset:function(name) {
  for(var a = 0;a < this.assets.length;a++) {
    if(this.assets[a].name === name) {
      return this.assets[a]
    }
  }
  return null
}, load:function() {
  for(var a = 0;a < this.assets.length;a++) {
    this.assets[a].load()
  }
}, updatePercent:function() {
  if(this.assets.length === 0) {
    this.percentLoaded = 100
  }else {
    this.percentLoaded = this._private.numberLoaded / this.assets.length * 100;
    this.percentLoaded = parseFloat(this.percentLoaded.toFixed(2))
  }
  this.events.raiseEvent("progressChanged", {});
  if(this.percentLoaded === 100) {
    this.events.raiseEvent("complete", {})
  }
}});
var pulse = pulse || {};
pulse.AssetManager = PClass.extend({init:function() {
  this.bundles = {};
  this.addBundle(new pulse.AssetBundle, "global");
  this.bundles["global"].percentLoaded = 100;
  this._private = {};
  this._private.bundlesLoaded = 1;
  this.percentLoaded = 0;
  this.events = new pulse.EventManager
}, addBundle:function(bundle, name) {
  if(bundle instanceof pulse.AssetBundle && !this.bundles.hasOwnProperty(name)) {
    var _self = this;
    bundle.events.bind("progressChanged", function(evt) {
      _self.updatePercent()
    });
    bundle.events.bind("assetLoaded", function(evt) {
      _self.events.raiseEvent("assetLoaded", evt)
    });
    this.bundles[name] = bundle
  }
}, addAsset:function(asset, bundle) {
  if(asset instanceof pulse.Asset) {
    if(typeof bundle === "string") {
      if(!this.bundles.hasOwnProperty(bundle)) {
        this.addBundle(new pulse.AssetBundle, bundle)
      }
      this.bundles[bundle].addAsset(asset);
      if(this.bundles[bundle].percentLoaded === 100) {
        this.loadedBundles--
      }
    }else {
      this.bundles["global"].addAsset(asset);
      if(this.bundles["global"].percentLoaded === 100) {
        this.bundles["global"].updatePercent();
        this.loadedBundles--
      }
    }
  }
}, removeAsset:function(asset, bundle) {
  if(typeof bundle === "string") {
    if(this.bundles.hasOwnProperty(bundle)) {
      this.bundles[bundle].removeAsset(asset)
    }
  }else {
    this.bundles["global"].removeAsset(asset)
  }
}, getAsset:function(name, bundle) {
  if(bundle) {
    if(this.bundles.hasOwnProperty(bundle)) {
      return this.bundles[bundle].getAsset(name)
    }
  }else {
    return this.bundles["global"].getAsset(name)
  }
}, load:function() {
  for(var b in this.bundles) {
    this.bundles[b].load()
  }
}, updatePercent:function() {
  var totalPercent = pulse.util.getLength(this.bundles) * 100;
  var percent = 0;
  for(var b in this.bundles) {
    percent = percent + this.bundles[b].percentLoaded
  }
  this.percentLoaded = percent / totalPercent * 100;
  this.percentLoaded = parseFloat(this.percentLoaded.toFixed(2));
  this.events.raiseEvent("progressChanged", {});
  if(this.percentLoaded === 100) {
    this.events.raiseEvent("complete", {})
  }
}});
var pulse = pulse || {};
pulse.Visual = pulse.Node.extend({init:function(params) {
  pulse.plugins.invoke("pulse.Visual", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(params);
  this.canvas = document.createElement("canvas");
  this._private.context = this.canvas.getContext("2d");
  this._private.firstUpdate = true;
  this.position = {x:0, y:0};
  this.positionPrevious = {x:0, y:0};
  this.size = {width:0, height:0};
  this.sizePrevious = {width:0, height:0};
  this.bounds = {x:0, y:0, width:0, height:0};
  this.boundsPrevious = {x:0, y:0, width:0, height:0};
  this.anchor = {x:0.5, y:0.5};
  this.anchorPrevious = {x:0.5, y:0.5};
  this.anchorRadius = 0;
  this.anchorAngle = 0;
  this.scale = {x:1, y:1};
  this.scalePrevious = {x:1, y:1};
  this.rotation = 0;
  this.rotationPrevious = 0;
  this.positionTopLeft = {x:0, y:0};
  this.positionTopLeftPrevious = {x:0, y:0};
  this.invalidProperties = true;
  this.zindex = Number.NaN;
  this.zindexPrevious = 0;
  this.shuffled = false;
  this.alpha = 100;
  this.alphaPrevious = 100;
  this.shadowEnabled = false;
  this.shadowEnabledPrevious = false;
  this.shadowOffsetX = 2;
  this.shadowOffsetY = 2;
  this.shadowBlur = 2;
  this.shadowColor = "rgba(0, 0, 0, 0.5)";
  this.visible = true;
  this.visiblePrevious = true;
  this.actions = {};
  this.runningActions = {};
  this.updated = true;
  this.events = new pulse.EventManager({owner:this, masterCallback:this.eventsCallback});
  this.mousein = false;
  pulse.plugins.invoke("pulse.Visual", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, move:function(x, y) {
  this.position.x += x;
  this.position.y += y
}, getAction:function(name) {
  return this.actions[name]
}, runAction:function(name, oframe) {
  oframe = oframe || null;
  var action = this.getAction(name);
  action.target = this;
  action.start(oframe);
  return action
}, addAction:function(action) {
  action.target = this;
  this.actions[action.name] = action
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.Visual.PLUGIN_TYPE, pulse.Visual.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(elapsed);
  for(var n in this.runningActions) {
    this.runningActions[n].update(elapsed)
  }
  if(this._private.firstUpdate) {
    this._private.firstUpdate = false;
    this.invalidProperties = true
  }
  if(this.position.x !== this.positionPrevious.x || this.position.y !== this.positionPrevious.y) {
    this.positionPrevious.x = this.position.x;
    this.positionPrevious.y = this.position.y;
    this.invalidProperties = true
  }
  if(this.size.width !== this.sizePrevious.width || this.size.height !== this.sizePrevious.height) {
    this.sizePrevious.width = this.size.width;
    this.sizePrevious.height = this.size.height;
    this.invalidProperties = true
  }
  if(this.anchor.x !== this.anchorPrevious.x || this.anchor.y !== this.anchorPrevious.y) {
    this.anchorPrevious.x = this.anchor.x;
    this.anchorPrevious.y = this.anchor.y;
    this.invalidProperties = true
  }
  if(this.scale.x !== this.scalePrevious.x || this.scale.y !== this.scalePrevious.y) {
    this.scalePrevious.x = this.scale.x;
    this.scalePrevious.y = this.scale.y;
    this.invalidProperties = true
  }
  if(this.rotation !== this.rotationPrevious) {
    this.rotationPrevious = this.rotation;
    this.invalidProperties = true
  }
  if(this.zindex !== this.zindexPrevious) {
    this.zindexPrevious = this.zindex;
    this.shuffled = true;
    this.updated = true
  }
  if(this.alpha !== this.alphaPrevious) {
    this.alphaPrevious = this.alpha;
    this.updated = true
  }
  if(this.visible !== this.visiblePrevious) {
    this.visiblePrevious = this.visible;
    this.updated = true
  }
  if(this.shadowEnabled !== this.shadowEnabledPrevious) {
    this.shadowEnabledPrevious = this.shadowEnabled;
    this.updated = true
  }
  if(this.invalidProperties) {
    this.calculateProperties();
    this.updated = true
  }
  pulse.plugins.invoke(pulse.Visual.PLUGIN_TYPE, pulse.Visual.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, draw:function(ctx) {
  pulse.plugins.invoke(pulse.Visual.PLUGIN_TYPE, pulse.Visual.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(this.canvas.width === 0 || this.canvas.height === 0) {
    return
  }
  ctx.save();
  ctx.globalAlpha = this.alpha / 100;
  if(this.rotation !== 0) {
    var rotationX = this.positionTopLeft.x + this.size.width * Math.abs(this.scale.x) / 2;
    var rotationY = this.positionTopLeft.y + this.size.height * Math.abs(this.scale.y) / 2;
    ctx.translate(rotationX, rotationY);
    ctx.rotate(Math.PI * (this.rotation % 360) / 180);
    ctx.translate(-rotationX, -rotationY)
  }
  ctx.scale(this.scale.x, this.scale.y);
  var px = this.positionTopLeft.x / this.scale.x;
  if(this.scale.x < 1) {
    px -= this.size.width
  }
  var py = this.positionTopLeft.y / this.scale.y;
  if(this.scale.y < 1) {
    py -= this.size.height
  }
  if(this.shadowEnabled) {
    ctx.shadowOffsetX = this.shadowOffsetX;
    ctx.shadowOffsetY = this.shadowOffsetY;
    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowColor = this.shadowColor
  }
  ctx.drawImage(this.canvas, px, py);
  ctx.restore();
  this.updated = false;
  pulse.plugins.invoke(pulse.Visual.PLUGIN_TYPE, pulse.Visual.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, calculateProperties:function() {
  var sw = this.size.width;
  var sh = this.size.height;
  var sx = sw / 2, sy = sh / 2;
  var ix = this.anchor.x * sw, iy = this.anchor.y * sh;
  var dx = ix - sx, dy = iy - sy;
  this.anchorRadius = Math.sqrt(dx * dx + dy * dy);
  this.anchorAngle = Math.atan2(dy, dx) * 180 / Math.PI - 90;
  if(isNaN(this.anchorAngle)) {
    this.anchorAngle = 0
  }
  this.positionTopLeftPrevious = this.positionTopLeft;
  var ox = this.size.width * Math.abs(this.scale.x) / 2;
  var oy = this.size.height * Math.abs(this.scale.y) / 2;
  var xpos = this.position.x - Math.sin(Math.PI * -(this.rotation + this.anchorAngle) / 180) * this.anchorRadius - ox;
  var ypos = this.position.y - Math.cos(Math.PI * -(this.rotation + this.anchorAngle) / 180) * this.anchorRadius - oy;
  this.positionTopLeft = {x:xpos, y:ypos};
  if(this.canvas.width !== this.size.width) {
    this.canvas.width = this.size.width
  }
  if(this.canvas.height !== this.size.height) {
    this.canvas.height = this.size.height
  }
  this.boundsPrevious = this.bounds;
  this.bounds = {x:this.positionTopLeft.x, y:this.positionTopLeft.y, width:this.size.width * Math.abs(this.scale.x), height:this.size.height * Math.abs(this.scale.y)};
  this.invalidProperties = false
}, on:function(type, callback) {
  this.events.bind(type, callback)
}, eventsCallback:function(type, evt) {
}});
pulse.Visual.PLUGIN_TYPE = "pulse.Visual";
pulse.Visual.PLUGIN_DRAW = "draw";
pulse.Visual.PLUGIN_UPDATE = "update";
var pulse = pulse || {};
pulse.Action = pulse.Node.extend({init:function(params) {
  this._super(params);
  if(params.target === "") {
    throw"Target must be included for action.";
  }
  this.target = params.target;
  this.isRunning = false;
  this.isPaused = false;
  this.isComplete = false;
  this.events = new pulse.EventManager
}, start:function() {
  if(pulse.DEBUG) {
    console.log("action started")
  }
  if(this.target.runningActions) {
    this.target.runningActions[this.name] = this
  }
  this.isComplete = false;
  this.isRunning = true;
  this.isPaused = false
}, pause:function() {
  if(pulse.DEBUG) {
    console.log("action paused")
  }
  this.isRunning = false;
  this.isPaused = true
}, stop:function() {
  if(pulse.DEBUG) {
    console.log("action stopped")
  }
  if(this.target.runningActions) {
    delete this.target.runningActions[this.name]
  }
  this.isRunning = false;
  this.isPaused = false
}, complete:function() {
  if(pulse.DEBUG) {
    console.log("action complete")
  }
  if(this.target.runningActions) {
    delete this.target.runningActions[this.name]
  }
  this.isRunning = false;
  this.isComplete = true;
  this.events.raiseEvent("complete", {action:this})
}});
var pulse = pulse || {};
pulse.AnimateAction = pulse.Action.extend({init:function(params) {
  this._super(params);
  params = pulse.util.checkParams(params, {name:this.name, size:{width:0, height:0}, frames:0, frameRate:0, offset:{x:0, y:0}, bounds:{width:1, height:1}, plays:-1});
  this.size = params.size;
  this._private.frameOriginal = {x:0, y:0, width:0, height:0};
  this._private.bounds = params.bounds;
  this._private.frames = params.frames;
  this._private.frameRate = params.frameRate;
  this._private.offset = params.offset;
  this._private.plays = params.plays;
  this._private.currentPlay = 1;
  this._private.currentFrame = 0;
  this._private.start = 0;
  this._private.playTime = 0
}, bounds:function(newBounds) {
  if(typeof newBounds === "undefined" || newBounds === null) {
    return this._private.bounds
  }
  if(newBounds.width <= 0) {
    newBounds.width = 1
  }
  if(newBounds.height <= 0) {
    newBounds.height = 1
  }
  this._private.bounds = newBounds
}, getFrame:function(index) {
  var frame = pulse.util.checkValue(index, this._private.currentFrame);
  if(this._private.frames instanceof Array) {
    frame = this._private.frames[this._private.currentFrame]
  }
  var x = (frame + this._private.offset.x) * this.size.width;
  var y = this._private.offset.y;
  while(x >= this._private.bounds.width) {
    x = x - this._private.bounds.width;
    y++
  }
  y = y * this.size.height;
  if(y >= this._private.bounds.height) {
    y = this._private.bounds.height - this.size.height
  }
  return{x:x, y:y, width:this.size.width, height:this.size.height}
}, start:function(oframe) {
  this._super();
  this._private.currentPlay = 1;
  this._private.playTime = 1 / this._private.frameRate * 1E3;
  if(oframe) {
    this._private.frameOriginal = oframe
  }else {
    this._private.frameOriginal = null
  }
}, pause:function() {
  this._super()
}, stop:function() {
  this._super();
  this._private.currentFrame = 0;
  this._private.playTime = 0;
  if(this._private.frameOriginal) {
    this.target.textureFrame = this._private.frameOriginal;
    this.target.updated = true
  }
}, complete:function() {
  this._super();
  if(this._private.frameOriginal) {
    this.target.textureFrame = this._private.frameOriginal;
    this.target.updated = true
  }
}, update:function(elapsed) {
  this._super();
  if(this.running === false) {
    return
  }
  var updated = false;
  this._private.playTime += elapsed;
  if(this._private.playTime >= 1 / this._private.frameRate * 1E3) {
    this._private.currentFrame++;
    var length = this._private.frames.length || this._private.frames;
    if(this._private.currentFrame >= length) {
      this._private.currentFrame = 0;
      this._private.currentPlay++;
      if(this._private.plays > 0 && this._private.currentPlay > this._private.plays) {
        this.stop();
        this.complete();
        return
      }
    }
    this._private.playTime = 0;
    updated = true
  }
  if(updated) {
    var frame = this.getFrame();
    this.target.textureFrame = frame;
    this.target.updated = true
  }
}});
var pulse = pulse || {};
pulse.MoveAction = pulse.Action.extend({init:function(params) {
  this._super(params);
  params = pulse.util.checkParams(params, {name:this.name, position:null, duration:0, easing:pulse.util.easeInOutQuad});
  this.position = params.position;
  this.duration = params.duration;
  this.easingFunction = params.easing;
  this._private.playTime = 0;
  this._private.startPosition = null;
  this._private.positionDiff = null
}, start:function(oframe) {
  this._super();
  if(!this.target) {
    return
  }
  if(!this.isPaused) {
    this._private.playTime = 0;
    this._private.startPosition = {x:this.target.position.x, y:this.target.position.y};
    this._private.positionDiff = {x:this.position.x - this._private.startPosition.x, y:this.position.y - this._private.startPosition.y}
  }
}, pause:function() {
  this._super()
}, stop:function() {
  this._super()
}, complete:function() {
  this._super()
}, update:function(elapsed) {
  this._super();
  if(this.running === false) {
    return
  }
  this._private.playTime += elapsed;
  var newPosition = {};
  if(this._private.playTime > this.duration) {
    this._private.playTime = this.duration;
    this.stop();
    this.complete()
  }
  newPosition = {x:this.easingFunction(this._private.playTime, this._private.startPosition.x, this._private.positionDiff.x, this.duration), y:this.easingFunction(this._private.playTime, this._private.startPosition.y, this._private.positionDiff.y, this.duration)};
  this.target.position = newPosition
}});
var pulse = pulse || {};
pulse.Sprite = pulse.Visual.extend({init:function(params) {
  pulse.plugins.invoke("pulse.Sprite", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(params);
  this.texture = null;
  this.texturePrevious = null;
  this.textureFrame = {x:0, y:0, width:0, height:0};
  this.textureFramePrevious = {x:0, y:0, width:0, height:0};
  this.textureUpdated = true;
  params = pulse.util.checkParams(params, {src:"", size:{}});
  this.size = params.size;
  if(typeof params.src === "object") {
    this.texture = params.src
  }else {
    this.texture = new pulse.Texture({"filename":params.src})
  }
  this._private.isDragging = false;
  this._private.dragPos = false;
  this.hitTestType = pulse.Sprite.HIT_TEST_RECT;
  this.hitTestPoints = null;
  this.dragDropEnabled = false;
  this.dragMoveEnabled = false;
  this.dropAcceptEnabled = false;
  this.draggedOverItems = {};
  this.handleAllEvents = false;
  var self = this;
  this.itemDroppedCallback = function(e) {
    e.target = self;
    self.events.raiseEvent("itemdropped", e)
  };
  pulse.plugins.invoke("pulse.Sprite", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, loaded:function() {
  return this.texture.loaded()
}, addAction:function(params) {
  var newAction;
  if(params instanceof pulse.Action) {
    newAction = params;
    newAction.target = this
  }else {
    newAction = new pulse.AnimateAction({target:this, name:params.name, size:params.size, frames:params.frames, frameRate:params.frameRate, offset:params.offset})
  }
  newAction.bounds({x:this.texture.width(), y:this.texture.height()});
  this.actions[newAction.name] = newAction
}, inCurrentBounds:function(x, y) {
  x -= this.bounds.x;
  y -= this.bounds.y;
  if(this.rotation !== 0) {
    var ax = this.size.width / 2;
    var ay = this.size.height / 2;
    var dx = x - ax;
    var dy = y - ay;
    var r = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) + Math.PI / 2;
    x = r * Math.sin(angle - this.rotation * Math.PI / 180) + ax;
    y = ay - r * Math.cos(angle - this.rotation * Math.PI / 180)
  }
  if(this.hitTestType === pulse.Sprite.HIT_TEST_RECT) {
    if(this.hitTestPoints && this.hitTestPoints.length > 0) {
      if(x >= this.hitTestPoints[0].x && x <= this.hitTestPoints[1].x && y >= this.hitTestPoints[0].y && y <= this.hitTestPoints[1].y) {
        return true
      }
    }else {
      if(x >= 0 && x <= this.bounds.width && y >= 0 && y <= this.bounds.height) {
        return true
      }
    }
  }else {
    if(this.hitTestType === pulse.Sprite.HIT_TEST_CONVEX) {
      if(this.hitTestPoints && this.hitTestPoints.length >= 3) {
        var pcount = this.hitTestPoints.length;
        var retval = false;
        var vert1 = {};
        var vert2 = {};
        for(var i = 0, j = pcount - 1;i < pcount;j = i++) {
          vert1 = this.hitTestPoints[i];
          vert2 = this.hitTestPoints[j];
          if(vert1.y > y != vert2.y > y && x < (vert2.x - vert1.x) * (y - vert1.y) / (vert2.y - vert1.y) + vert1.x) {
            retval = !retval
          }
        }
        return retval
      }
    }
  }
  return false
}, getCurrentFrame:function() {
  if(this.texture.percentLoaded < 100) {
    return
  }
  var tw = this.texture.width();
  if(this.textureFrame.width !== 0) {
    tw = this.textureFrame.width
  }
  var th = this.texture.height();
  if(this.textureFrame.height !== 0) {
    th = this.textureFrame.height
  }
  return this.texture.slice(this.textureFrame.x, this.textureFrame.y, tw, th)
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.Sprite.PLUGIN_TYPE, pulse.Sprite.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(this.texture !== this.texturePrevious) {
    this.texturePrevious = this.texture;
    this.textureUpdated = true;
    this.updated = true
  }
  if(this.texture.percentLoaded === 100) {
    if(this.size === null) {
      this.size = {}
    }
    if(!this.size.width) {
      this.size.width = this.texture.width()
    }
    if(!this.size.height) {
      this.size.height = this.texture.height()
    }
  }
  if(this.textureFrame.x !== this.textureFramePrevious.x || this.textureFrame.y !== this.textureFramePrevious.y || this.textureFrame.width !== this.textureFramePrevious.width || this.textureFrame.height !== this.textureFramePrevious.height) {
    this.textureFramePrevious.x = this.textureFrame.x;
    this.textureFramePrevious.y = this.textureFrame.y;
    this.textureFramePrevious.width = this.textureFrame.width;
    this.textureFramePrevious.height = this.textureFrame.height;
    this.textureUpdated = true;
    this.updated = true
  }
  this._super(elapsed);
  pulse.plugins.invoke(pulse.Sprite.PLUGIN_TYPE, pulse.Sprite.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, draw:function(ctx) {
  pulse.plugins.invoke(pulse.Sprite.PLUGIN_TYPE, pulse.Sprite.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(this.texture.percentLoaded < 100 || this.size.width === 0 || this.size.height === 0) {
    return
  }
  if(this.textureUpdated) {
    this._private.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var slice = this.getCurrentFrame();
    this._private.context.drawImage(slice, 0, 0, this.size.width, this.size.height);
    this.textureUpdated = false
  }
  this._super(ctx);
  pulse.plugins.invoke(pulse.Sprite.PLUGIN_TYPE, pulse.Sprite.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, calculateProperties:function() {
  this._super()
}, killDrag:function(evt) {
  if(this._private.isDragging) {
    this._private.isDragging = false;
    this.handleAllEvents = false;
    evt.sender = this;
    this.events.raiseEvent("dragdrop", evt);
    delete pulse.EventManager.DraggedItems["sprite:" + this.name]
  }
}, eventsCallback:function(type, evt) {
  if(type === "mousedown" && this.dragDropEnabled) {
    this._private.isDragging = true;
    this._private.dragPos = {x:evt.world.x, y:evt.world.y};
    this.handleAllEvents = true;
    evt.sender = this;
    this.events.raiseEvent("dragstart", evt);
    pulse.EventManager.DraggedItems["sprite:" + this.name] = this
  }
  if((type === "mousemove" || type === "mouseup") && this._private.isDragging) {
    var posDiff = {x:evt.world.x - this._private.dragPos.x, y:evt.world.y - this._private.dragPos.y};
    if(this.dragMoveEnabled) {
      this.position = {x:this.position.x + posDiff.x, y:this.position.y + posDiff.y}
    }
    this._private.dragPos = {x:evt.world.x, y:evt.world.y}
  }
  if(type === "mouseup") {
    this.killDrag(evt)
  }
  if(type == "mousemove") {
    this._private.mousein = true
  }
}});
pulse.Sprite.HIT_TEST_RECT = "rect";
pulse.Sprite.HIT_TEST_CONVEX = "convex";
pulse.Sprite.PLUGIN_TYPE = "pulse.Sprite";
pulse.Sprite.PLUGIN_DRAW = "draw";
pulse.Sprite.PLUGIN_UPDATE = "update";
var pulse = pulse || {};
pulse.BitmapLabel = pulse.Visual.extend({init:function(params) {
  pulse.plugins.invoke("pulse.BitmapLabel", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(params);
  params = pulse.util.checkParams(params, {font:"", text:""});
  this.font = null;
  this.fontPrevious = null;
  this.text = params.text;
  this.textPrevious = "";
  this._private.verts = [];
  if(typeof params.font === "object") {
    this.font = params.font
  }else {
    this.font = new pulse.BitmapFont({"filename":params.font})
  }
  pulse.plugins.invoke("pulse.BitmapLabel", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, loaded:function() {
  return this.font.percentLoaded === 100
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.BitmapLabel.PLUGIN_TYPE, pulse.BitmapLabel.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(this.text !== this.textPrevious && this.loaded()) {
    this.textPrevious = this.text;
    this.size.height = this.font.lineHeight;
    this.size.width = this.font.getStringWidth(this.text);
    this._private.verts = this.font.getStringBitmapChars(this.text);
    this.updated = true
  }
  if(this.font !== this.fontPrevious && this.loaded()) {
    this.fontPrevious = this.font;
    this.updated = true
  }
  this._super(elapsed);
  pulse.plugins.invoke(pulse.BitmapLabel.PLUGIN_TYPE, pulse.BitmapLabel.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, draw:function(ctx) {
  pulse.plugins.invoke(pulse.BitmapLabel.PLUGIN_TYPE, pulse.BitmapLabel.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(!this.loaded() || this.size.width === 0 || this.size.height === 0) {
    return
  }
  this._private.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  var vert = null;
  var cursor = 0;
  for(var i = 0;i < this._private.verts.length;i++) {
    vert = this._private.verts[i];
    if(vert.size.width !== 0 && vert.size.height !== 0) {
      this._private.context.drawImage(this.font.image, vert.position.x, vert.position.y, vert.size.width, vert.size.height, cursor + vert.offset.x, vert.offset.y, vert.size.width, vert.size.height)
    }
    cursor += vert.xAdvance
  }
  this._super(ctx);
  pulse.plugins.invoke(pulse.BitmapLabel.PLUGIN_TYPE, pulse.BitmapLabel.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}});
pulse.BitmapLabel.PLUGIN_TYPE = "pulse.BitmalLabel";
pulse.BitmapLabel.PLUGIN_DRAW = "draw";
pulse.BitmapLabel.PLUGIN_UPDATE = "update";
var pulse = pulse || {};
pulse.CanvasLabel = pulse.Visual.extend({init:function(params) {
  pulse.plugins.invoke("pulse.CanvasLabel", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(params);
  params = pulse.util.checkParams(params, {font:"sans-serif", fontSize:20, text:""});
  this.font = params.font;
  this.fontPrevious = params.font;
  this.fontSize = params.fontSize;
  this.fontSizePrevious = params.fontSize;
  this.text = params.text;
  this.textPrevious = "";
  this.fillColor = "#000000";
  this.fillColorPrevious = "#000000";
  this.strokeColor = "#000000";
  this.strokeColorPrevious = "#000000";
  this.strokeWidth = 0;
  this.strokeWidthPrevious = 0;
  this.bold = false;
  this.boldPrevious = false;
  this.italic = false;
  this.italicPrevious = false;
  this.textBaseline = "middle";
  this.textBaselinePrevious = "middle";
  pulse.plugins.invoke("pulse.CanvasLabel", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, loaded:function() {
  return this.font.percentLoaded === 100
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.CanvasLabel.PLUGIN_TYPE, pulse.CanvasLabel.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  var textSizeUpdated = false;
  if(this.font != this.fontPrevious) {
    this.fontPrevious = this.font;
    textSizeUpdated = true
  }
  if(this.fontSize != this.fontSizePrevious) {
    this.fontSizePrevious = this.fontSize;
    textSizeUpdated = true
  }
  if(this.text != this.textPrevious) {
    this.textPrevious = this.text;
    textSizeUpdated = true
  }
  if(this.fillColor != this.fillColorPrevious) {
    this.fillColorPrevious = this.fillColor;
    textSizeUpdated = true
  }
  if(this.strokeColor != this.strokeColorPrevious) {
    this.strokeColorPrevious = this.strokeColor;
    textSizeUpdated = true
  }
  if(this.strokeWidth != this.strokeWidthPrevious) {
    this.strokeWidthPrevious = this.strokeWidth;
    textSizeUpdated = true
  }
  if(this.bold != this.boldPrevious) {
    this.boldPrevious = this.bold;
    textSizeUpdated = true
  }
  if(this.italic != this.italicPrevious) {
    this.italicPrevious = this.italic;
    textSizeUpdated = true
  }
  if(this.textBaseline != this.textBaselinePrevious) {
    this.textBaselinePrevious = this.textBaseline;
    textSizeUpdated = true
  }
  if(textSizeUpdated) {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    ctx.textBaseline = this.textBaseline;
    var fontstr = this.fontSize + "px " + this.font;
    if(this.bold) {
      fontstr = "bold " + fontstr
    }
    if(this.italic) {
      fontstr = "italic " + fontstr
    }
    ctx.font = fontstr;
    if(this.fillColor != "transparent") {
      ctx.fillStyle = this.fillColor;
      ctx.fillText(this.text, 0, 0)
    }
    if(this.strokeColor != "transparent" && this.strokeWidth !== 0) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.strokeText(this.text, 0, 0)
    }
    var dim = ctx.measureText(this.text);
    this.size.height = this.fontSize + 2;
    this.size.width = Math.ceil(dim.width) + 2;
    this.updated = true
  }
  this._super(elapsed);
  pulse.plugins.invoke(pulse.CanvasLabel.PLUGIN_TYPE, pulse.CanvasLabel.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, draw:function(ctx) {
  pulse.plugins.invoke(pulse.CanvasLabel.PLUGIN_TYPE, pulse.CanvasLabel.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(this.size.width === 0 || this.size.height === 0) {
    return
  }
  this._private.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this._private.context.textBaseline = this.textBaseline;
  var fontstr = this.fontSize + "px " + this.font;
  if(this.bold) {
    fontstr = "bold " + fontstr
  }
  if(this.italic) {
    fontstr = "italic " + fontstr
  }
  this._private.context.font = fontstr;
  if(this.fillColor != "transparent") {
    this._private.context.fillStyle = this.fillColor;
    this._private.context.fillText(this.text, 0, this.size.height / 2)
  }
  if(this.strokeColor != "transparent" && this.strokeWidth !== 0) {
    this._private.context.lineWidth = this.strokeWidth;
    this._private.context.strokeStyle = this.strokeColor;
    this._private.context.strokeText(this.text, 0, this.size.height / 2)
  }
  this._super(ctx);
  pulse.plugins.invoke(pulse.CanvasLabel.PLUGIN_TYPE, pulse.CanvasLabel.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}});
pulse.CanvasLabel.PLUGIN_TYPE = "pulse.BitmalLabel";
pulse.CanvasLabel.PLUGIN_DRAW = "draw";
pulse.CanvasLabel.PLUGIN_UPDATE = "update";
var pulse = pulse || {};
pulse.Layer = pulse.Visual.extend({init:function(params) {
  pulse.plugins.invoke("pulse.Layer", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(params);
  params = pulse.util.checkParams(params, {x:0, y:0, size:{width:0, height:0}});
  this.position.x = params.x;
  this.position.y = params.y;
  this.size = params.size;
  this.canvas.width = this.size.width;
  this.canvas.height = this.size.height;
  this.canvas.style.position = "absolute";
  this.objects = {};
  this._private.orderedKeys = [];
  pulse.plugins.invoke("pulse.Layer", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, addNode:function(obj) {
  pulse.plugins.invoke("pulse.Layer", "addNode", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(obj instanceof pulse.Visual) {
    if(isNaN(obj.zindex)) {
      obj.zindex = this._private.orderedKeys.length + 1
    }
    if(!this.objects.hasOwnProperty(obj.name)) {
      this.objects[obj.name] = obj;
      obj.parent = this;
      obj.updated = true;
      this._private.orderedKeys = pulse.util.getOrderedKeys(this.objects)
    }else {
      pulse.error.DuplicateName(obj.name)
    }
  }
  pulse.plugins.invoke("pulse.Layer", "addNode", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, removeNode:function(name) {
  pulse.plugins.invoke("pulse.Layer", "removeNode", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  var spriteName = name;
  if(name instanceof pulse.Visual) {
    spriteName = name.name
  }
  if(this.objects.hasOwnProperty(spriteName)) {
    if(this.objects[spriteName] instanceof pulse.Visual) {
      var clear = this.objects[spriteName].boundsPrevious;
      this._private.context.clearRect(clear.x, clear.y, clear.width, clear.height)
    }
    this.objects[spriteName].parent = null;
    delete this.objects[spriteName]
  }
  pulse.plugins.invoke("pulse.Layer", "removeNode", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, getNode:function(name) {
  return this.objects[name]
}, getNodesByType:function(type) {
  var ret = {};
  for(var o in this.objects) {
    if(this.objects[o] instanceof type) {
      ret[o] = this.objects[o]
    }
  }
  return ret
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.Layer.PLUGIN_TYPE, pulse.Layer.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  var reorder = false;
  for(var s in this.objects) {
    if(this.objects[s] instanceof pulse.Visual) {
      if(this.objects[s].shuffled === true) {
        this.objects[s].shuffled = false;
        reorder = true
      }
      this.objects[s].update(elapsed);
      if(this.objects[s].updated) {
        this.updated = true
      }
    }
  }
  if(reorder) {
    this._private.orderedKeys = pulse.util.getOrderedKeys(this.objects)
  }
  this._super(elapsed);
  pulse.plugins.invoke(pulse.Layer.PLUGIN_TYPE, pulse.Layer.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, draw:function(ctx) {
  pulse.plugins.invoke(pulse.Layer.PLUGIN_TYPE, pulse.Layer.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  var isDirty = false;
  for(var s in this.objects) {
    if(this.objects[s].updated) {
      isDirty = true;
      break
    }
  }
  if(isDirty) {
    var engine = this.parent;
    while(engine !== null && !(engine instanceof pulse.Engine)) {
      engine = engine.parent
    }
    if(engine === null) {
      return
    }
    this._private.context.clearRect(-this.positionTopLeft.x, -this.positionTopLeft.y, engine.size.width, engine.size.height);
    for(var ok = 0;ok < this._private.orderedKeys.length;ok++) {
      var obj = this.objects[this._private.orderedKeys[ok]];
      if(obj instanceof pulse.Visual) {
        if(obj.visible) {
          obj.draw(this._private.context)
        }else {
          obj.updated = false
        }
      }
    }
  }
  this._super(ctx);
  pulse.plugins.invoke(pulse.Layer.PLUGIN_TYPE, pulse.Layer.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, pointInBounds:function(point) {
  return point.x > this.bounds.x && point.x < this.bounds.x + this.bounds.width && point.y > this.bounds.y && point.y < this.bounds.y + this.bounds.height
}, eventsCallback:function(type, evt) {
  if(typeof evt === "undefined" || typeof evt.position === "undefined") {
    return
  }
  evt.parent.x = evt.position.x;
  evt.parent.y = evt.position.y;
  var sprites = this.getNodesByType(pulse.Sprite);
  var sprite;
  for(var s in sprites) {
    sprite = sprites[s];
    if(!sprite.visible) {
      continue
    }
    if(pulse.events[type] === "mouse" || pulse.events[type] === "touch") {
      var sBounds = sprite.bounds;
      evt.position.x = evt.parent.x - sBounds.x;
      evt.position.y = evt.parent.y - sBounds.y;
      evt.sender = sprite;
      if(sprite.handleAllEvents || sprite.inCurrentBounds(evt.parent.x, evt.parent.y)) {
        if(sprite.inCurrentBounds(evt.parent.x, evt.parent.y) && sprite.mousein === false) {
          sprite.mousein = true;
          sprite.events.raiseEvent("mouseover", evt)
        }
        sprite.events.raiseEvent(type, evt)
      }
      if(!sprite.inCurrentBounds(evt.parent.x, evt.parent.y) && sprite.mousein === true) {
        sprite.mousein = false;
        sprite.events.raiseEvent("mouseout", evt)
      }
      if(sprite.dropAcceptEnabled) {
        for(var id in pulse.EventManager.DraggedItems) {
          var obj = pulse.EventManager.DraggedItems[id];
          if(sprite.inCurrentBounds(evt.parent.x, evt.parent.y)) {
            evt.target = obj;
            if(!sprite.draggedOverItems[id]) {
              sprite.draggedOverItems[id] = obj;
              obj.events.bind("dragdrop", sprite.itemDroppedCallback);
              sprite.events.raiseEvent("dragenter", evt)
            }else {
              evt.sender = sprite;
              sprite.events.raiseEvent("dragover", evt)
            }
          }else {
            if(sprite.draggedOverItems[id]) {
              delete sprite.draggedOverItems[id];
              evt.target = obj;
              obj.events.unbindFunction("dragdrop", sprite.itemDroppedCallback);
              sprite.events.raiseEvent("dragexit", evt)
            }
          }
        }
      }
    }else {
      evt.sender = sprite;
      sprite.events.raiseEvent(type, evt)
    }
  }
}});
pulse.Layer.PLUGIN_TYPE = "pulse.Layer";
pulse.Layer.PLUGIN_DRAW = "draw";
pulse.Layer.PLUGIN_UPDATE = "update";
var pulse = pulse || {};
pulse.Scene = pulse.Node.extend({init:function(params) {
  pulse.plugins.invoke("pulse.Scene", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(params);
  this.container = null;
  this.layers = {};
  this._private.liveLayers = {};
  this._private.orderedKeys = [];
  this._private.defaultSize = {width:0, height:0};
  this.active = false;
  this.events = new pulse.EventManager({owner:this, masterCallback:this.eventsCallback});
  pulse.plugins.invoke("pulse.Scene", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, setDefaultSize:function(width, height) {
  for(var l in this.layers) {
    if(this.layers[l].size.width < 1) {
      this.layers[l].size.width = width
    }
    if(this.layers[l].size.height < 1) {
      this.layers[l].size.height = height
    }
  }
  this._private.defaultSize = {width:width, height:height}
}, addLayer:function(layer, zindex) {
  pulse.plugins.invoke("pulse.Scene", "addLayer", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(layer instanceof pulse.Layer && !this.layers.hasOwnProperty(layer.name)) {
    if(typeof zindex === "number") {
      layer.zindex = zindex
    }
    var appendToEnd = false;
    if(isNaN(layer.zindex)) {
      layer.zindex = this._private.orderedKeys.length + 1
    }
    if(layer.zindex === this._private.orderedKeys.length + 1) {
      appendToEnd = true
    }
    if(layer.size.width < 1) {
      layer.size.width = this._private.defaultSize.width
    }
    if(layer.size.height < 1) {
      layer.size.height = this._private.defaultSize.height
    }
    layer.parent = this;
    this.layers[layer.name] = layer;
    this._private.orderedKeys = pulse.util.getOrderedKeys(this.layers);
    if(this.active === true) {
      this._private.liveLayers[layer.name] = this.getLiveCanvas(layer);
      if(appendToEnd === true) {
        this.container.appendChild(this._private.liveLayers[layer.name].canvas)
      }else {
        this.updateLiveLayers()
      }
    }
  }
  pulse.plugins.invoke("pulse.Scene", "addLayer", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, removeLayer:function(name) {
  pulse.plugins.invoke("pulse.Scene", "removeLayer", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(typeof name === "string" && this.layers.hasOwnProperty(name)) {
    delete this.layers[name];
    delete this._private.liveLayers[name]
  }
  pulse.plugins.invoke("pulse.Scene", "removeLayer", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, getLayer:function(name) {
  if(this.layers.hasOwnProperty(name)) {
    return this.layers[name]
  }
  return null
}, getLiveLayer:function(name) {
  if(this.layers.hasOwnProperty(name)) {
    return this._private.liveLayers[name]
  }
  return null
}, getLiveCanvas:function(layer) {
  var liveCanvas = document.createElement("canvas");
  liveCanvas.width = this._private.defaultSize.width;
  liveCanvas.height = this._private.defaultSize.height;
  liveCanvas.style.position = "absolute";
  liveCanvas.id = "live:" + layer.name;
  var ctx = liveCanvas.getContext("2d");
  return{canvas:liveCanvas, context:ctx}
}, updateLiveLayers:function() {
  while(this.container.hasChildNodes()) {
    this.container.removeChild(this.container.lastChild)
  }
  for(var l = 0;l < this._private.orderedKeys.length;l++) {
    if(!this.layers[this._private.orderedKeys[l]]) {
      continue
    }
    var layer = this.layers[this._private.orderedKeys[l]];
    if(layer.size.width < 1) {
      layer.size.width = this._private.defaultSize.width
    }
    if(layer.size.height < 1) {
      layer.size.height = this._private.defaultSize.height
    }
    if(!this._private.liveLayers.hasOwnProperty(layer.name)) {
      this._private.liveLayers[layer.name] = this.getLiveCanvas(layer)
    }
    this.container.appendChild(this._private.liveLayers[layer.name].canvas)
  }
}, getSceneContainer:function() {
  if(!this.container) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.id = this.name;
    this.updateLiveLayers()
  }
  return this.container
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.Scene.PLUGIN_TYPE, pulse.Scene.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  this._super(elapsed);
  var reorder = false;
  for(var l in this.layers) {
    if(this.layers[l].shuffled === true) {
      this.layers[l].shuffled = false;
      reorder = true
    }
  }
  if(reorder === true) {
    this._private.orderedKeys = pulse.util.getOrderedKeys(this.layers)
  }
  for(var ul in this.layers) {
    this.layers[ul].update(elapsed)
  }
  pulse.plugins.invoke(pulse.Scene.PLUGIN_TYPE, pulse.Scene.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, draw:function() {
  pulse.plugins.invoke(pulse.Scene.PLUGIN_TYPE, pulse.Scene.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  for(var o = 0;o < this._private.orderedKeys.length;o++) {
    var layer = this.layers[this._private.orderedKeys[o]];
    if(layer.updated) {
      var name = layer.name;
      var canvas = this._private.liveLayers[layer.name].canvas;
      var ctx = this._private.liveLayers[layer.name].context;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(layer.visible === true) {
        layer.draw(ctx)
      }else {
        layer.updated = false
      }
    }
  }
  pulse.plugins.invoke(pulse.Scene.PLUGIN_TYPE, pulse.Scene.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, on:function(type, callback) {
  this.events.bind(type, callback)
}, eventsCallback:function(type, evt) {
  for(var l in this.layers) {
    if(pulse.events[type] === "mouse" || pulse.events[type] === "touch") {
      var lBounds = this.layers[l].bounds;
      evt.parent.x = evt.position.x;
      evt.parent.y = evt.position.y;
      evt.position.x = evt.world.x - lBounds.x;
      evt.position.y = evt.world.y - lBounds.y;
      evt.sender = this.layers[l];
      if(this.layers[l].pointInBounds(evt.world)) {
        if((type === "mousemove" || type === "touchmove") && this.layers[l].mousein === false) {
          this.layers[l].mousein = true;
          this.layers[l].events.raiseEvent("mouseover", evt)
        }
        this.layers[l].events.raiseEvent(type, evt)
      }else {
        if(this.layers[l].mousein === true) {
          this.layers[l].mousein = false;
          this.layers[l].events.raiseEvent("mouseout", evt)
        }
      }
    }else {
      evt.sender = this.layers[l];
      this.layers[l].events.raiseEvent(type, evt)
    }
  }
}});
pulse.Scene.PLUGIN_TYPE = "pulse.Scene";
pulse.Scene.PLUGIN_DRAW = "draw";
pulse.Scene.PLUGIN_UPDATE = "update";
var pulse = pulse || {};
pulse.SceneManager = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {gameWindow:document.getElementsByTagName("body")[0]});
  this.scenes = {};
  this.parent = null;
  this.gameWindow = params.gameWindow
}, addScene:function(scene) {
  pulse.plugins.invoke("pulse.SceneManager", "addScene", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(scene instanceof pulse.Scene && !this.scenes.hasOwnProperty(scene.name)) {
    scene.parent = this.parent;
    var width = this.gameWindow.clientWidth;
    var height = this.gameWindow.clientHeight;
    if(width === 0 && this.gameWindow.style.width) {
      width = parseInt(this.gameWindow.style.width)
    }
    if(height === 0 && this.gameWindow.style.height) {
      height = parseInt(this.gameWindow.style.height)
    }
    scene.setDefaultSize(width, height);
    this.scenes[scene.name] = scene
  }
  pulse.plugins.invoke("pulse.SceneManager", "addScene", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, removeScene:function(name) {
  pulse.plugins.invoke("pulse.SceneManager", "removeScene", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  if(name instanceof pulse.Scene) {
    name = name.name
  }
  if(this.scenes.hasOwnProperty(name)) {
    delete this.scenes[name]
  }
  pulse.plugins.invoke("pulse.SceneManager", "removeScene", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, activateScene:function(name) {
  if(name instanceof pulse.Scene) {
    name = name.name
  }
  if(this.scenes.hasOwnProperty(name)) {
    this.scenes[name].active = true;
    this.gameWindow.appendChild(this.scenes[name].getSceneContainer())
  }
}, deactivateScene:function(name) {
  if(name instanceof pulse.Scene) {
    name = name.name
  }
  if(this.scenes.hasOwnProperty(name) && this.scenes[name].active) {
    this.scenes[name].active = false;
    this.gameWindow.removeChild(this.scenes[name].getSceneContainer())
  }
}, getScene:function(name) {
  return this.scenes[name]
}, getScenes:function(active) {
  var scenes = [];
  for(var s in this.scenes) {
    if(active === true) {
      if(this.scenes[s].active === true) {
        scenes.push(this.scenes[s])
      }
    }else {
      scenes.push(this.scenes[s])
    }
  }
  return scenes
}});
var pulse = pulse || {};
pulse.Engine = PClass.extend({init:function(params) {
  pulse.plugins.invoke("pulse.Engine", "init", pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  params = pulse.util.checkParams(params, {gameWindow:"gameWindow", size:{width:0, height:0}});
  this.gameWindow = null;
  this.focused = false;
  this.hidden = false;
  if(typeof params.gameWindow === "object") {
    this.gameWindow = params.gameWindow
  }else {
    this.gameWindow = document.getElementById(params.gameWindow)
  }
  this.size = params.size;
  if(this.size.width === 0 || this.size.width === undefined || this.size.height === 0 || this.size.height === undefined) {
    if(this.gameWindow) {
      var parentWidth = parseInt(this.gameWindow.style.width, 10);
      var parentHeight = parseInt(this.gameWindow.style.height, 10);
      if(parentWidth) {
        this.size.width = parentWidth
      }
      if(parentHeight) {
        this.size.height = parentHeight
      }
    }
  }
  if(this.size.width === 0) {
    this.size.width = 640
  }
  if(this.size.height === 0) {
    this.size.height = 480
  }
  this._private = {};
  this._private.mainDiv = document.createElement("div");
  this._private.mainDiv.style.position = "absolute";
  this._private.mainDiv.style.width = this.size.width + "px";
  this._private.mainDiv.style.height = this.size.height + "px";
  this._private.mainDiv.style.overflow = "hidden";
  this._private.mainDiv.tabIndex = 1;
  this.gameWindow.appendChild(this._private.mainDiv);
  this.scenes = new pulse.SceneManager({gameWindow:this._private.mainDiv});
  this.scenes.parent = this;
  this.masterTime = 0;
  this.tick = 100;
  this.loopLogic = null;
  this._private.currentTime = (new Date).getTime();
  this._private.lastTime = this._private.currentTime;
  pulse.plugins.invoke("pulse.Engine", "init", pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, getWindowOffset:function() {
  var offX = this._private.mainDiv.offsetLeft;
  var offY = this._private.mainDiv.offsetTop;
  if(this._private.mainDiv.offsetParent) {
    var parent = this._private.mainDiv.offsetParent;
    do {
      offX += parent.offsetLeft;
      offY += parent.offsetTop
    }while(parent = parent.offsetParent)
  }
  return{x:offX, y:offY}
}, bindEvents:function() {
  var eng = this;
  for(var e in pulse.events) {
    window.addEventListener(e, function(evt) {
      eng.windowEvent.call(eng, evt)
    }, false);
    if(e === "mousewheel") {
      window.addEventListener("DOMMouseScroll", function(evt) {
        eng.windowEvent.call(eng, evt)
      }, false)
    }
  }
}, go:function(tick, loop) {
  this.tick = tick;
  var eng = this;
  this.bindEvents();
  if(loop) {
    this.loopLogic = loop
  }
  requestAnimFrame(function() {
    eng.loop.call(eng)
  }, this._private.mainDiv)
}, loop:function(autoContinue) {
  pulse.plugins.invoke(pulse.Engine.PLUGIN_TYPE, pulse.Engine.PLUGIN_LOOP, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  var eng = this;
  if(autoContinue || autoContinue === undefined) {
    requestAnimFrame(function() {
      eng.loop.call(eng)
    }, this._private.mainDiv)
  }
  this._private.currentTime = (new Date).getTime();
  var elapsed = this._private.currentTime - this._private.lastTime;
  if(elapsed < this.tick) {
    return
  }
  var increments = Math.floor(elapsed / 30);
  if(increments === 0) {
    increments = 1
  }
  if(increments < 20) {
    elapsed /= increments;
    for(var incrementIdx = 0;incrementIdx < increments;incrementIdx++) {
      if(this.loopLogic) {
        this.loopLogic(this.scenes, elapsed)
      }
      this.update(elapsed);
      this.draw();
      this.masterTime += elapsed
    }
  }
  this._private.lastTime = this._private.currentTime;
  pulse.plugins.invoke(pulse.Engine.PLUGIN_TYPE, pulse.Engine.PLUGIN_LOOP, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, update:function(elapsed) {
  pulse.plugins.invoke(pulse.Engine.PLUGIN_TYPE, pulse.Engine.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  var activeScenes = this.scenes.getScenes(true);
  for(var s = 0;s < activeScenes.length;s++) {
    activeScenes[s].update(elapsed)
  }
  pulse.plugins.invoke(pulse.Engine.PLUGIN_TYPE, pulse.Engine.PLUGIN_UPDATE, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, draw:function() {
  pulse.plugins.invoke(pulse.Engine.PLUGIN_TYPE, pulse.Engine.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onEnter, this, arguments);
  var activeScenes = this.scenes.getScenes(true);
  for(var s = 0;s < activeScenes.length;s++) {
    activeScenes[s].draw()
  }
  pulse.plugins.invoke(pulse.Engine.PLUGIN_TYPE, pulse.Engine.PLUGIN_DRAW, pulse.plugin.PluginCallbackTypes.onExit, this, arguments)
}, windowEvent:function(rawEvt) {
  if(this.hidden) {
    return
  }
  if(!rawEvt) {
    rawEvt = window.event
  }
  var etype = rawEvt.type;
  var activeScenes = this.scenes.getScenes(true);
  var offset = this.getWindowOffset();
  var scrollX = 0;
  var scrollY = 0;
  if(window.pageXOffset && window.pageYOffset) {
    scrollX = window.pageXOffset;
    scrollY = window.pageYOffset
  }else {
    scrollX = document.body.scrollLeft;
    scrollY = document.body.scrollTop
  }
  var evtProps = new pulse.MouseEvent;
  var x = rawEvt.clientX - offset.x + scrollX;
  var y = rawEvt.clientY - offset.y + scrollY;
  var isTouch = false;
  if(pulse.events[etype] === "touch" || pulse.events[etype] === "touchgesture") {
    isTouch = true;
    evtProps = new pulse.TouchEvent;
    if(rawEvt.touches && rawEvt.touches.length > 0) {
      x = rawEvt.touches[0].clientX - offset.x + scrollX;
      y = rawEvt.touches[0].clientY - offset.y + scrollY;
      evtProps.touches = rawEvt.touches
    }
    if(rawEvt.changedTouches && rawEvt.changedTouches.length > 0) {
      evtProps.changedTouches = rawEvt.changedTouches;
      if(etype === "touchend") {
        x = rawEvt.changedTouches[0].clientX - offset.x + scrollX;
        y = rawEvt.changedTouches[0].clientY - offset.y + scrollY
      }
    }
    if(rawEvt.targetTouches && rawEvt.targetTouches.length > 0) {
      evtProps.targetTouches = rawEvt.changedTouches
    }
    if(rawEvt.scale && rawEvt.rotation) {
      evtProps.gestureScale = rawEvt.scale;
      evtProps.gestureRotation = rawEvt.rotation
    }
    this.focused = true
  }
  evtProps.window.x = rawEvt.clientX;
  evtProps.window.y = rawEvt.clientY;
  evtProps.world.x = x;
  evtProps.world.y = y;
  var eventInsideGame = false;
  if(x > 0 && x < parseInt(this._private.mainDiv.style.width, 10) && y > 0 && y < parseInt(this._private.mainDiv.style.height, 10)) {
    eventInsideGame = true
  }
  var eventInsideScene = false;
  for(var s = 0;s < activeScenes.length;s++) {
    evtProps.parent.x = evtProps.window.x;
    evtProps.parent.y = evtProps.window.y;
    evtProps.position.x = x;
    evtProps.position.y = y;
    if(eventInsideGame) {
      if(rawEvt.preventDefault && isTouch === false) {
        rawEvt.preventDefault()
      }
      if(document.activeElement !== this._private.mainDiv && rawEvt.type.toLowerCase() === "click") {
        document.activeElement.blur();
        this._private.mainDiv.focus()
      }
      if(rawEvt.type.toLowerCase() === "mousedown") {
        this.focused = true
      }
    }else {
      if(rawEvt.type.toLowerCase() === "mousedown") {
        this.focused = false
      }
      activeScenes[s].events.raiseEvent("mouseout", evtProps)
    }
    if(rawEvt.type.toLowerCase() === "mousewheel" || rawEvt.type.toLowerCase() === "dommousescroll") {
      var delta = 0;
      if(rawEvt.wheelDelta) {
        delta = rawEvt.wheelDelta / 120
      }else {
        if(rawEvt.detail) {
          delta = -rawEvt.detail / 3
        }
      }
      evtProps.scrollDelta = delta;
      etype = "mousewheel"
    }
    if(pulse.events[rawEvt.type] === "keyboard") {
      var code;
      if(rawEvt.charCode) {
        code = rawEvt.charCode
      }else {
        if(rawEvt.keyCode) {
          code = rawEvt.keyCode
        }else {
          if(rawEvt.which) {
            code = rawEvt.which
          }
        }
      }
      evtProps["keyCode"] = code;
      evtProps["key"] = String.fromCharCode(code)
    }
    if(this.focused) {
      evtProps.sender = activeScenes[s];
      activeScenes[s].events.raiseEvent(etype, evtProps)
    }
  }
  if(rawEvt.type.toLowerCase() === "mouseup" && !eventInsideGame) {
    for(var di in pulse.EventManager.DraggedItems) {
      if(di.indexOf("sprite") === 0) {
        pulse.EventManager.DraggedItems[di].killDrag(evtProps)
      }
    }
  }
}, addScene:function(scene) {
  if(this.scenes && this.scenes.addScene) {
    this.scenes.addScene(scene)
  }
}, removeScene:function(scene) {
  if(this.scenes && this.scenes.addScene) {
    this.scenes.removeScene(scene)
  }
}, activateScene:function(scene) {
  if(this.scenes && this.scenes.addScene) {
    this.scenes.activateScene(scene)
  }
}, deactivateScene:function(scene) {
  if(this.scenes && this.scenes.addScene) {
    this.scenes.deactivateScene(scene)
  }
}});
pulse.Engine.PLUGIN_TYPE = "pulse.Engine";
pulse.Engine.PLUGIN_LOOP = "loop";
pulse.Engine.PLUGIN_UPDATE = "update";
pulse.Engine.PLUGIN_DRAW = "draw";

