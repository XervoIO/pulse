/*!
 * Pulse Native Audio 
 * Based on howler.js v1.0.3
 * howlerjs.com
 *
 *  (c) 2013, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

 /**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

 /**
 * Audio Namespace declaration if needed.
 * @namespace
 */
pulse.Audio = pulse.Audio || {};

pulse.Audio.Native = PClass.extend(
/**
 * A Class to utilize native audio, either through the Web Audio API or
 * HTML5 audio.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [name] name of the node
 * @class The base node object.
 * @author PFP
 * @copyright 2012 Modulus
 */
{
  init : function(params) {
    params = pulse.util.checkParams(params, {
      src: ''
    });

    /**
     * @private
     * Private properties of the class. Should not need or use these.
     * @type {object}
     */
    this._private = { };

    /**
     * @private
     * An in-memory cache for the audio data
     * @type {object}
     */
    this._private.cache = { };

    /**
     * @private
     * The HTML5 audio node
     * @type {HTML Audio}
     */
    this._private.node = null;
    
    //Create a new audio API context, if available
    if (typeof AudioContext !== 'undefined' && !pulse.Audio.ctx) {
      pulse.Audio.ctx = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined' && !pulse.Audio.ctx) {
      pulse.Audio.ctx = new webkitAudioContext();
    } else {
      this._private.node = new Audio();
    }

    /**
     * @private
     * The audio API Context
     * @type {HTML AudioContext}
     */
    this._private.ctx = pulse.Audio.ctx;

    /**
     * @private
     * The audio API Gain Node
     * @type {HTML GainNode}
     */
    this._private.gainNode = null;

    //create a master gain node
    if(this._private.ctx !== null) {
      this._private.gainNode = this._private.ctx.createGainNode();
      this._private.gainNode.gain.value = 1;
      this._private.gainNode.connect(this._private.ctx.destination);
    }

    /**
     * @private
     * The buffer source for the web audio context
     * @type {HTML BufferSource}
     */
    this._private.bufferSource = null;

    /**
     * @private
     * Whether the audio has loaded
     * @type {Boolean}
     */
    this._private.loaded = false;

    /**
     * @private
     * The source file for the audio
     * @type {String}
     */
    this._private.src = params.src;

    /**
     * @private
     * The duration of the current play, in seconds
     * @type {Number}
     */
    this._private.duration = 0;

    /**
     * @private
     * A reference to the function to run when playback has finished
     * @type {Number}
     */
    this._private.playTimer = null;


    /**
     * @private
     * The last start position of the context playback
     * @type {Number}
     */
    this._private.playStart = 0;

    /**
     * @private
     * The current postion the audio is playing at
     * @type {HTML Audio Context}
     */
    this.pos = 0;

    /**
     * Event handler for this asset.
     * @type {pulse.EventManager}
     */
    this.events = new pulse.EventManager();
  },

  /**
   * Load in the audio file.
   */
  load : function() {
    if (this._private.ctx !== null) {
      this.buffer();
    } else {
      var _self = this;
      
      //Catch any load errors
      this._private.node.addEventListener('error', function(evt) {
        _self.events.raiseEvent('error', evt);
      });

      // setup the new audio node
      this._private.node.preload = 'auto';
      this._private.node.src = this._private.src;

      //If the progress and canplaythrough events are not supported, try a simple check over time.
      if('oncanplaythrough' in this._private.node === false) {
        var duration = 0;
        var wait = 0;
        var check = function() {          
          if(isNaN(_self._private.node.duration)) {
            wait++
            if(wait >= 15) {
              _self.loaded();
              return;
            }
          } else {
            if(_self._private.node.duration !== duration) {
              duration = _self._private.node.duration;
              wait = 0;
            } else if(wait >= 2) {
              _self.loaded();
              return;
            }

            wait++;
          }

          setTimeout(check, 1000);
        };

        check();
      } else {
        var progressListener = function(e) {
          var percent = 0;
          if(_self._private.node.buffered.end.length > 0) {
            percent = _self._private.node.buffered.end(0) / _self._private.node.duration * 100;
          }

          if(percent >= 100) {
            _self.loaded();
          } else {
            _self.events.raiseEvent('progress', {percent:percent});
          }
        };

        this._private.node.addEventListener('progress', progressListener);

        this._private.node.addEventListener('canplaythrough', function(e) {
          if(!_self._private.loaded) {
            _self._private.node.removeEventListener('progress', progressListener);
            _self.loaded();
          }
        });
      }
    }

    return true;
  },

  /**
   * Buffer a sound from URL (or from cache) and decode to audio source (Web Audio API only).
   */
  buffer : function() {
    if(this._private.ctx === null || this._private.src === '') {
      return;
    }

    // load the buffer from the URL
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this._private.src, true);
    xhr.responseType = 'arraybuffer';

    var _self = this;
    xhr.onerror = function(evt) {
      _self.events.raiseEvent('error', evt);
    };

    xhr.onload = function() {
      if(xhr.status === 200) {
        // decode the buffer into an audio source
        _self._private.ctx.decodeAudioData(xhr.response, function(buffer) {
          if (buffer) {
            _self._private.cache[_self._private.src] = buffer;
            _self.loaded(buffer);
          }
        });
      } else {
        _self.events.raiseEvent('error', {status:xhr.status});
      }
    };

    xhr.send();
  },

  /**
   * Finishes loading the Web Audio API sound and fires the loaded event
   * @param  {Objecct} buffer The decoded buffer sound source.
   */
  loaded : function(buffer) {
    if(buffer) {
      this._private.duration = buffer.duration;
    } else if(this._private.node !== null) {
      this._private.duration = this._private.node.duration;
    }

    this._private.loaded = true;
    this.events.raiseEvent('load');
  },

  /**
   * Load the sound back into the buffer source.
   * @param  {Object} obj The sound to load.
   */
  refresh : function() {
    if(this._private.ctx === null) {
      return;
    }

    this._private.bufferSource = this._private.ctx.createBufferSource();
    this._private.bufferSource.buffer = this._private.cache[this._private.src];
    this._private.bufferSource.connect(this._private.gainNode);
  },

  /**
   * Play a sound from the current time (0 by default).
   */
  play : function() {
    // if the sound hasn't been loaded, add it to the event queue
    if (!this._private.loaded) {
      var _self = this;
      this.events.bind('load', function() {
        _self.play();
      });

      return;
    }

    var duration = this._private.duration - this.pos;

    // set timer to fire the 'onend' event
    var _self = this;
    this._private.playTimer = setTimeout(function() {
      _self.stop();
      _self.events.raiseEvent('end');
    }, duration * 1000);

    if (this._private.ctx !== null) {
      // load the sound into context
      this.refresh();
      this._private.playStart = this._private.ctx.currentTime;
      this._private.bufferSource.noteGrainOn(0, this.pos, duration);
    } else {
      this._private.node.play();
    }
  },

  /**
   * Pause playback and save the current position.
   */
  pause : function() {
    if (this._private.playTimer !== null) {
      clearTimeout(this._private.playTimer);
    }

    if (this._private.ctx !== null) {
      // make sure the sound has been created
      if (this._private.bufferSource === null) {
        return;
      }

      this.pos += this._private.ctx.currentTime - this._private.playStart;
      this._private.bufferSource.noteOff(0);
    } else {
      this.pos = this._private.node.currentTime;
      this._private.node.pause();
    }
  },

  /**
   * Stop playback and reset to start.
   */
  stop : function() {
    this.pos = 0;

    if (this._private.playTimer !== null) {
      clearTimeout(this._private.playTimer);
    }

    if (this._private.ctx !== null) {
      // make sure the sound has been created
      if (this._private.bufferSource === null) {
        return;
      }

      this._private.bufferSource.noteOff(0);
    } else {
      this._private.node.pause();
      this._private.node.currentTime = 0;
    }
  }
});

/**
 * The global audio API context. There can only be one.
 * @type {AudioContext}
 * @static
 */
pulse.Audio.ctx = null;