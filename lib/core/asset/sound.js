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
 * @copyright 2011 Paranoid Ferret Productions
 */
PFPlay.Sound = PFPlay.Asset.extend(
/** @lends PFPlay.Sound.prototype */
{
  /** @constructs */
  init : function(params) {
    this._super(params);

    params = PFPlay.util.checkParams(params, {
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

    // Auto load the content
    if(this.autoLoad) {
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
        break;
      case 'html5':
        audio = document.createElement('audio');
        if (audio.canPlayType) {
          // html5 audio available
          audio.setAttribute('preload', 'auto');
          if(!!audio.canPlayType && 
             "" != audio.canPlayType('audio/mpeg')) {
            audio.setAttribute('src', this.filename + '.mp3');
          } else if(!!audio.canPlayType && 
                    "" != audio.canPlayType('audio/ogg; codecs="vorbis"')) {
            audio.setAttribute('src', this.filename + '.ogg');
          }
          audio.addEventListener('progress', function(e) {
            _self.percentLoaded = audio.buffered.end(0) / audio.duration * 100;
            console.log(_self.percentLoaded);
            if(_self.percentLoaded >= 100) {
              _self.complete();
            }
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
        break;
      case 'html5':
        if(this.loop) {
          this._private.audio.setAttribute('loop', 'loop');
        }
        this._private.audio.play();
        break;
    }
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
        break;
      case 'html5':
        this._private.audio.pause();
        break;
    }
  },

  /**
   * Stops the sound file.
   */
  stop : function() {
     if(!this._private.audio) {
      return;
    }

    switch(this._private.type) {
      case 'flash':
        break;
      case 'html5':
        this._private.audio.pause();
        this._private.audio.currentTime = 0;
        break;
    }
  }
});