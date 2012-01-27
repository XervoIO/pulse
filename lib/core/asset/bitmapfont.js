/*global PClass:true */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Bitmap font character definition
 * @class Bitmap font character
 * @constructor
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.BitmapChar = PClass.extend(
/** @lends pulse.BitmapChar.prototype */
{
  /** @constructs */
  init : function() {
    /**
     * The position of the character inside the bitmap sheet.
     * @type {point}
     */
    this.position = {
      x : 0,
      y : 0
    };

    /**
     * The size of the character inside the bitmap sheet.
     * @type {size}
     */
    this.size = {
      width : 0,
      height : 0
    };

    /**
     * The offset of the character inside the bitmap sheet.
     * @type {point}
     * @field
     */
    this.offset = {
      x : 0,
      y : 0
    };

    /**
     * The x advance of the character. This is how much space should be between
     * this character and the next character.
     * @type {number}
     */
    this.xAdvance = 0;

    /**
     * The page that the character is on.
     * @type {number}
     */
    this.page = 0;
  }
});

/**
 * Bitmap font definition. Can be used for creating text using font.
 * @param {object} params parameters that can be set as initialized options
 * on the node
 * @config {string} filename the name of the bitmap font definition file
 * @author PFP
 * @class Bitmap font
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.BitmapFont = pulse.Asset.extend(
/** @lends pulse.BitmapFont.prototype */
{
  /** @constructs */
  init : function(params) {

    // Call the base constructor
    this._super(params);

    /**
     * Font image filename.
     * @type {string}
     */
    this.imageFilename = "";

    /**
     * Font image and descriptor file directory.
     * @type {string}
     */
    this.fileDirectory = "";

    /**
     * Font bitmap image.
     * @type {HTMLImage}
     */
    this.image = null;

    /**
     * Line height for the font.
     * @type {number}
     */
    this.lineHeight = 0;

    /**
     * Base height for the character set.
     * @type {number}
     */
    this.base = 0;

    /**
     * Size of the bitmap font. This is the actual size of the incoming image.
     * @type {number}
     */
    this.size = {
      width : 0,
      height : 0
    };

    /**
     * Associative array (object) of characters for this font. Key is char code
     * and value is pulse.BitmapChar.
     * @type {array}
     */
    this.characters = {};

    // Parse the directory from the font file
    var pathParts = window.location.href.split('/');
    var fileParts = this.filename.split('/');
    pathParts.pop();
    fileParts.pop();
    this.fileDirectory = pathParts.join('/');
    if(fileParts.length > 0) {
      this.fileDirectory += "/" + fileParts.join('/');
    }

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
    var fntFile = new XMLHttpRequest();
    fntFile.open("GET", this.filename, true);
    fntFile.onreadystatechange = function() {
      if (fntFile.readyState === 4) {
        if (fntFile.status === 200) {
          var allText = fntFile.responseText;
          var lines = fntFile.responseText.split("\n");
          _self.percentLoaded = 50;
          _self.parse(lines);
        }
      }
    };
    fntFile.send(null);
  },

  /**
   * Parses the bitmap font definition file.
   * @param {array} lines the lines in the definition file
   */
  parse : function(lines) {
    var line;
    for (var i = 0; i < lines.length; i++) {
      line = lines[i];
      if(line.indexOf("common") === 0) {
        var keyvals = line.split(" ");
        for (var j = 0; j < keyvals.length; j++) {
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
                break;
            }
          }
        }
      }
      else if(line.indexOf("page") === 0) {
        var pvals = line.split(" ");
        for (var p = 0; p < pvals.length; p++) {
          var pval = pvals[p].split("=");
          if(pval.length > 1) {
            if(pval[0] === "file") {
              this.imageFilename = pval[1].replace(/"/gi, '');
            }
          }
        }
      } else if(line.indexOf("char") === 0) {
        var character = new pulse.BitmapChar();
        var cvals = line.split(" ");
        for (var c = 0; c < cvals.length; c++) {
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
                break;
            }
          }
        }
      }
    }

    var _self = this;

    // load the bitmap image
    this.image = new Image();
    this.image.src = this.fileDirectory + "/" + this.imageFilename;
    this.image.onload = function(){
      _self.percentLoaded = 100;
      _self.complete();
    };
  },

  /**
   * Gets the bitmap chars for a passed in string.
   * @param {string} text the string to get the chars for
   */
  getStringBitmapChars : function(text) {
    var verts = [];
    var charcode = 0;
    for(var i = 0; i < text.length; i++) {
      charcode = text.charCodeAt(i);
      verts.push(this.characters[charcode]);
    }
    return verts;
  },

  /**
   * Gets the width for a string
   * @param {string} text the string to get the width of
   */
  getStringWidth : function(text) {
    var width = 0;
    var charcode = 0;
    var character = null;
    for(var i = 0; i < text.length; i++) {
      charcode = text.charCodeAt(i);
      character = this.characters[charcode];
      width += character.xAdvance;
    }
    return width;
  }
});