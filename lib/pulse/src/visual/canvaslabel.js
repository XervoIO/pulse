/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * A label that shows a piece of text using a canvases own drawing options.
 * @param {object} [params] parameters that can be set as initialized options
 * on the node
 * @config {string} [font] the font name used to draw the text
 * @config {string} [fontSize] the font size used for drawing the text
 * @config {string} [name] name of the node
 * @config {string} [text] the text of the label
 * @author PFP
 * @class The canvas text label
 * @augments pulse.Visual
 * @copyright 2012 Modulus
 */
pulse.CanvasLabel = pulse.Visual.extend(
/** @lends pulse.CanvasLabel.prototype */
{
  /** @constructs */
  init: function(params) {

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.CanvasLabel',
      'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    // Call the base constructor.
    this._super(params);

    params = pulse.util.checkParams(params, {
      font : 'sans-serif',
      fontSize : 20,
      text : ''
    });

    /**
     * The font used for this label. Must be installed on client machine.
     * @type {string}
     */
    this.font = params.font;

    /**
     * The previous font used for this label.
     * @type {string}
     */
    this.fontPrevious = params.font;

    /**
     * The font size used for drawing the text, in pixels.
     * @type {number}
     */
    this.fontSize = params.fontSize;

    /**
     * The previous font size used for drawing the text, in pixels.
     * @type {number}
     */
    this.fontSizePrevious = params.fontSize;

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
     * The fill color used for the text, if set to "transparent" the text
     * will not be filled.
     * @type {string}
     */
    this.fillColor = "#000000";

    /**
     * The previous fill color used for the text.
     * @type {string}
     */
    this.fillColorPrevious = "#000000";

    /**
     * The stroke color used for the text, if set to "transparent" the text
     * will not be stroked.
     * @type {string}
     */
    this.strokeColor = "#000000";

    /**
     * The previous stroke color used for the text.
     * @type {string}
     */
    this.strokeColorPrevious = "#000000";

    /**
     * The stroke width used for the text, if set to 0 the text
     * will not be stroked.
     * @type {number}
     */
    this.strokeWidth = 0;

    /**
     * The previous stroke width used for the text.
     * @type {number}
     */
    this.strokeWidthPrevious = 0;

    /**
     * Whether the text should be bold or not.
     * @type {boolean}
     */
    this.bold = false;

    /**
     * Previous value of bold.
     * @type {boolean}
     */
    this.boldPrevious = false;

    /**
     * Whether the text should be italic or not.
     * @type {boolean}
     */
    this.italic = false;

    /**
     * Previous value of italic.
     * @type {boolean}
     */
    this.italicPrevious = false;

    /**
     * The baseline that should be used when drawing the text. Possible values
     * are "top", "hanging", "middle", "alphabetic",
     * "ideographic" and "bottom".
     * @type {string}
     */
    this.textBaseline = "middle";

    /**
     * The previous text baseline used.
     * @type {string}
     */
    this.textBaselinePrevious = "middle";

    // Plugin support.
    pulse.plugins.invoke(
      'pulse.CanvasLabel',
      'init',
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Returns true if the font for this label has been loaded
   * @return {boolean} Whether the font has been loaded
   */
  loaded : function() {
    return (this.font.percentLoaded === 100);
  },

  /**
   * Label's update will update the size of itself based on it's text. It will
   * also make sure none of the properties have changed on the label.
   * @param {number} time elapsed since last update call in milliseconds
   */
  update : function(elapsed) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.CanvasLabel.PLUGIN_TYPE,
      pulse.CanvasLabel.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    var textSizeUpdated = false;

    if(this.font != this.fontPrevious) {
      this.fontPrevious = this.font;
      textSizeUpdated = true;
    }

    if(this.fontSize != this.fontSizePrevious) {
      this.fontSizePrevious = this.fontSize;
      textSizeUpdated = true;
    }

    if(this.text != this.textPrevious) {
      this.textPrevious = this.text;
      textSizeUpdated = true;
    }

    if(this.fillColor != this.fillColorPrevious) {
      this.fillColorPrevious = this.fillColor;
      textSizeUpdated = true;
    }

    if(this.strokeColor != this.strokeColorPrevious) {
      this.strokeColorPrevious = this.strokeColor;
      textSizeUpdated = true;
    }

    if(this.strokeWidth != this.strokeWidthPrevious) {
      this.strokeWidthPrevious = this.strokeWidth;
      textSizeUpdated = true;
    }

    if(this.bold != this.boldPrevious) {
      this.boldPrevious = this.bold;
      textSizeUpdated = true;
    }

    if(this.italic != this.italicPrevious) {
      this.italicPrevious = this.italic;
      textSizeUpdated = true;
    }

    if(this.textBaseline != this.textBaselinePrevious) {
      this.textBaselinePrevious = this.textBaseline;
      textSizeUpdated = true;
    }

    if(textSizeUpdated) {
      var c = document.createElement('canvas');
      var ctx = c.getContext('2d');

      ctx.textBaseline = this.textBaseline;
      var fontstr = this.fontSize + "px " + this.font;
      if(this.bold) {
        fontstr = "bold " + fontstr;
      }
      if(this.italic) {
        fontstr = "italic " + fontstr;
      }
      ctx.font = fontstr;

      if(this.fillColor != "transparent") {
        ctx.fillStyle = this.fillColor;
        ctx.fillText(this.text, 0, 0);
      }

      if(this.strokeColor != "transparent" && this.strokeWidth !== 0) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.strokeText(this.text, 0, 0);
      }

      var dim = ctx.measureText(this.text);

      this.size.height = this.fontSize + 2;
      this.size.width = Math.ceil(dim.width) + 2;

      this.updated = true;
    }

    this._super(elapsed);

    // Plugin support.
    pulse.plugins.invoke(
      pulse.CanvasLabel.PLUGIN_TYPE,
      pulse.CanvasLabel.PLUGIN_UPDATE,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  },

  /**
   * Draws this label to passed in context
   * @param {CanvasRenderingContext2D} ctx the context in which to draw this
   * visual on
   */
  draw : function(ctx) {

    // Plugin support.
    pulse.plugins.invoke(
      pulse.CanvasLabel.PLUGIN_TYPE,
      pulse.CanvasLabel.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onEnter,
      this,
      arguments);

    // skip if no size
    if(this.size.width === 0 || this.size.height === 0) {
      return;
    }

    // Clear my canvas
    this._private.context.clearRect(
      0, 0,
      this.canvas.width, this.canvas.height
    );

    // Draws the texture to this visual's canvas

    this._private.context.textBaseline = this.textBaseline;

    var fontstr = this.fontSize + "px " + this.font;
    if(this.bold) {
      fontstr = "bold " + fontstr;
    }
    if(this.italic) {
      fontstr = "italic " + fontstr;
    }
    this._private.context.font = fontstr;

    if(this.fillColor != "transparent") {
      this._private.context.fillStyle = this.fillColor;
      this._private.context.fillText(this.text, 0, this.size.height / 2);
    }

    if(this.strokeColor != "transparent" && this.strokeWidth !== 0) {
      this._private.context.lineWidth = this.strokeWidth;
      this._private.context.strokeStyle = this.strokeColor;
      this._private.context.strokeText(this.text, 0, this.size.height / 2);
    }

    this._super(ctx);

    // Plugin support.
    pulse.plugins.invoke(
      pulse.CanvasLabel.PLUGIN_TYPE,
      pulse.CanvasLabel.PLUGIN_DRAW,
      pulse.plugin.PluginCallbackTypes.onExit,
      this,
      arguments);
  }
});

pulse.CanvasLabel.PLUGIN_TYPE = "pulse.BitmalLabel";
pulse.CanvasLabel.PLUGIN_DRAW = "draw";
pulse.CanvasLabel.PLUGIN_UPDATE = "update";