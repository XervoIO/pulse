/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * A label that shows a piece of text using a bitmap font.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string|pulse.BitmapFont} font the font filename to use or a
 * pulse.BitmapFont to use
 * @config {string} [name] name of the node
 * @config {string} [text] the text of the label
 * @author PFP
 * @class The bitmap font label
 * @augments pulse.Visual
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.BitmapLabel = pulse.Visual.extend(
/** @lends pulse.BitmapLabel.prototype */
{
  /** @constructs */
  init: function(params) {

    // Call the base constructor.
    this._super(params);

    params = pulse.util.checkParams(params, {
      font : '',
      text : ''
    });

    /**
     * The font used for this label.
     * @type {pulse.BitmapFont}
     */
    this.font = null;

    /**
     * The previous font used for this label.
     * @type {pulse.BitmapFont}
     */
    this.fontPrevious = null;

    /**
     * The text for this label.
     * @type {string}
     */
    this.text = params.text;

    /**
     * The previous text for this label.
     * @type {string}
     */
    this.textPrevious = '';

    /**
     * @private
     * The vert slices for the text for this label.
     * @type {array}
     */
    this._private.verts = [];

    //Create a font for this label if one isn't passed in
    if(typeof params.font === 'object') {
      this.font = params.font;
    } else {
      this.font = new pulse.BitmapFont({
        'filename' : params.font
      });
    }
  },

  /**
   * Returns true if the font for this label has been loaded
   * @return {boolean} Whether the font has been loaded
   */
  loaded : function() {
    return (this.font.percentLoaded === 100);
  },

  /**
   * Label's update will update the size of itself based on it's text.
   * @param {number} time elapsed since last update call in milliseconds
   */
  update : function(elapsed) {
    if(this.text !== this.textPrevious && this.loaded()) {
      this.textPrevious = this.text;
      // update size
      this.size.height = this.font.lineHeight;
      this.size.width = this.font.getStringWidth(this.text);
      this._private.verts = this.font.getStringBitmapChars(this.text);
      this.updated = true;
    }

    if(this.font !== this.fontPrevious && this.loaded())
    {
      this.updated = true;
    }

    this._super(elapsed);
  },

  /**
   * Draws this label to passed in context
   * @param {CanvasRenderingContext2D} ctx the context in which to draw this
   * visual on
   */
  draw : function(ctx) {
    // skip if we're not loaded or no size
    if(!this.loaded() ||
       this.size.width === 0 ||
       this.size.height === 0) {
      return;
    }

    // Clear my canvas
    this._private.context.clearRect(
      0, 0,
      this.canvas.width, this.canvas.height
    );

    /// Draws the texture to this visual's canvas
    var vert = null;
    var cursor = 0;
    for (var i = 0; i < this._private.verts.length; i++) {
      vert = this._private.verts[i];
      if(vert.size.width !== 0 && vert.size.height !== 0) {
        this._private.context.drawImage(
          this.font.image,
          vert.position.x, vert.position.y,
          vert.size.width, vert.size.height,
          cursor, 0,
          vert.size.width, vert.size.height
        );
      }
      cursor += vert.xAdvance;
    }

    this._super(ctx);
  }
});