/*global soundManager:true, SoundManager:false */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Sound asset definition. Can be loaded and can be played.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string} filename the name of the sound file, if type is 'html5'
 * the file extension is not needed because files must be available in .mp3 and
 * .ogg
 * @config {string} [type] the type of audio player to use for this file,
 * possible types are 'flash' and 'html5', defaults to 'flash'
 * @config {boolean} [loop] whether to loop the sound
 * @class Sound
 * @author PFP
 * @copyright 2012 Modulus
 */
pulse.Sound = pulse.Asset.extend(
/** @lends pulse.Sound.prototype */
{

  /**
   * Event rose when sound is finished playing.
   * @name pulse.Sound#raise
   * @event
   * @param {object} data Object with sound that rose the event.
   * @config {pulse.Sound} sound The sound that rose the event.
   */

  /** @constructs */
  init : function(params) {
    this._super(params);

    params = pulse.util.checkParams(params, {
      type : 'flash',
      loop : false
    });

    /**
     * @private
     * The type of audio player to use for this sound. The valid types are
     * 'flash' or 'html5'.
     * @type {string}
     */
    this._private.type = params.type;

    // Init the flash player
    if(this._private.type == 'flash') {
      this.initFlashPlayer();
    }

    /**
     * @private
     * The audio object which playes the sound.
     * @type {object}
     */
    this._private.audio = null;


    /**
     * Whether to loop the sound file when played.
     * @type {boolean}
     */
    this.loop = params.loop;

    /**
     * Whether the sound is currently playing.
     * @type {boolean}
     */
    this.playing = false;

    /**
     * Whether the sound is currently paused.
     * @type {boolean}
     */
    this.paused = false;

    // Auto load the content
    if(this.autoLoad && (this._private.type == 'html5' ||
      (this._private.type == 'flash' && pulse.Sound.FlashReady))) {
      this.load();
    }
  },

  /**
   * Begins loading the font file for this bitmap font.
   */
  load : function() {
    var _self = this;

    switch(this._private.type) {
      case 'flash':
        this._private.audio = soundManager.createSound({
          id : 'mySound',
          url : this.filename,
          autoLoad : true,
          autoPlay : false,
          whileloading : function() {
            _self.percentLoaded = this.bytesLoaded / this.bytesTotal * 100;
          },
          onload : function() {
            _self.percentLoaded = 100;
            _self.complete();
          },
          onfinish : function() {
            _self.finished();
          }
        });
        break;
      case 'html5':
        var audio = document.createElement('audio');
        if (audio.canPlayType) {
          // html5 audio available
          audio.setAttribute('preload', 'auto');
          if(!!audio.canPlayType &&
             "" !== audio.canPlayType('audio/mpeg')) {
            audio.setAttribute('src', this.filename + '.mp3');
          } else if(!!audio.canPlayType &&
                    "" !== audio.canPlayType('audio/ogg; codecs="vorbis"')) {
            audio.setAttribute('src', this.filename + '.ogg');
          }
          audio.addEventListener('progress', function(e) {
            if(audio.buffered.end.length > 0) {
              _self.percentLoaded = audio.buffered.end(0) / audio.duration * 100;
            } else {
              _self.percentLoaded = 0;
            }
            if(_self.percentLoaded >= 100) {
              _self.complete();
            }
          });
          audio.addEventListener('ended', function() {
            _self.finished();
          });
        } else {
          audio = null;
        }
        this._private.audio = audio;
       break;
    }
  },

  /**
   * Plays the sound file.
   */
  play : function() {
    if(!this._private.audio) {
      return;
    }

    switch(this._private.type) {
      case 'flash':
        if(this.paused) {
          this._private.audio.resume();
        } else {
          this._private.audio.play();
        }
        break;
      case 'html5':
        if(this.loop) {
          this._private.audio.setAttribute('loop', 'loop');
        }
        this._private.audio.play();
        break;
    }

    this.playing = true;
    this.paused = false;
  },

  /**
   * Pauses the sound file.
   */
  pause : function() {
     if(!this._private.audio) {
      return;
    }

    switch(this._private.type) {
      case 'flash':
      case 'html5':
        this._private.audio.pause();
        break;
    }

    this.playing = false;
    this.paused = true;
  },

  /**
   * Stops the sound file.
   */
  stop : function() {
     if(!this._private.audio) {
      return;
    }

    this.playing = false;
    this.paused = false;

    switch(this._private.type) {
      case 'flash':
        this._private.audio.stop();
        break;
      case 'html5':
        this._private.audio.pause();
        this._private.audio.currentTime = 0;
        break;
    }
  },

  /**
   * Sound finished playing. This will raise event for finished playing.
   */
  finished : function() {
    switch(this._private.type) {
      case 'flash':
        if(this.loop) {
          this.start();
        }
        break;
      case 'html5':
        break;
    }

    this.events.raiseEvent('finished', {sound : this});
  },

  /**
   * Initalizes flash sound manager.
   */
  initFlashPlayer : function() {
    if(pulse.Sound.FlashInitialized === false) {
      pulse.Sound.FlashInitialized = true;
      window.soundManager = new SoundManager(pulse.libsrc + '/asset/');
      soundManager.beginDelayedInit();
      soundManager.flashVersion = 8;
      soundManager.useFlashBlock = false;
      soundManager.onready(function() {
        pulse.Sound.FlashReady = true;
        if(this.autoLoad) {
          this.load();
        }
      }, this);
      soundManager.ontimeout(function() {
        // Have some kind of logging for errors
        //console.log(e);
      });
    } else if(pulse.Sound.FlashReady === false){
      soundManager.onready(function() {
        if(this.autoLoad) {
          this.load();
        }
      }, this);
    }
  }
});

/**
 * Global property used for determining if the Flash sound manager has been
 * initialized.
 * @type {Boolean}
 * @static
 */
pulse.Sound.FlashInitialized = false;

pulse.Sound.FlashReady = false;