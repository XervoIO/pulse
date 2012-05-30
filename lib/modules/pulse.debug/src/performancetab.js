/**
 * Performance tab for debugging panel.
 * @class The debug performance tab class
 * @param {object} [params] parameters that can be set as initialized options
 * on the performance tab
 * @config {string} [name] the name of the tab will be used for name of link
 * @config {string} [icon] the icon url to use as image for the tab, should be 30x30
 * @config {string} [id] the machine readable id for the tab
 * @config {pulse.debug.FPS} [fpsTimer] fps tracker for this tab
 * @config {pulse.debug.Timer} [updateTimer] update timer for this tab
 * @config {pulse.debug.timer} [drawTimer] draw timer for this tab
 * @author PFP
 * @copyright 2012 Modulus
 */

pulse.debug.tabs.Performance = pulse.debug.PanelTab.extend(
/** @lends pulse.debug.tabs.Performance.prototype */
{
  /** @constructs */
  init : function (params) {
    this._super(params);

    params = pulse.util.checkParams(params, {
      fpsTimer : null,
      updateTimer : null,
      drawTimer : null
    });

    /**
     * The frames per second timer to use for this performance tab.
     * @type {pulse.debug.FPS}
     */
    this.fpsTimer = params.fpsTimer;

    /**
     * The update loop timer we want to use for this performance tab.
     * @type {pulse.debug.Timer}
     */
    this.updateTimer = params.updateTimer;

    /**
     * The draw loop timer we want to use for this performance tab.
     * @type {pulse.debug.Timer}
     */
    this.drawTimer = params.drawTimer;

    /**
     * @private
     * The current width of the current canvas
     * @type {number}
     */
    this._private.canvasWidth = window.innerWidth;
    var h = 118;

    /**
     * @private
     * The interval at which the graph will resize
     * @type {number}
     */
    this._private.heightIncrement = 59;

    /**
     * @private
     * The current height of the graph canvas
     * @type {number}
     */
    this._private.lastResize = h;

    /**
     * The canvas for the stats graph.
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas');
    this.canvas.width = this._private.canvasWidth;
    this.canvas.height = h;
    this.canvas.id = 'pulse-perf-graph';
    this.container.appendChild(this.canvas);

    var _self = this;
    var pCanvas = this.canvas;


    window.onresize = function() {
      //Resize the graph when the window is resized.
      _self._private.canvasWidth = window.innerWidth;
      _self.resize(_self.canvas.height + 20);
    };

    /**
     * @private
     * The graph canvas context.
     * @type {2DContext}
     */
    this._private.context = this.canvas.getContext('2d');
    this._private.context.fillStyle = "#333";
    this._private.context.fillRect(0, 0, this._private.canvasWidth, h);

    /**
     * @private
     * The max millisecond height we want to show on the graph.
     * @type {number}
     */
    this._private.msHeight = 100;

    /**
     * @private
     * The millisecond ratio from the canvas height to the max milliseconds, we
     * want to show.
     * @type {number}
     */
    this._private.msRatio = this._private.msHeight / h;

    //The graph colors
    this.updateColor = '61E561';
    this.drawColor = 'CC22EE';
    this.browserColor = 'F7Fd4A';

    // Setup labels
    this._private.stats = document.createElement('div');
    this._private.stats.style.cssText = 'height: 14px;line-height:14px;padding:3px 5px;margin-top:-3px;';
    this.container.appendChild(this._private.stats);

    var labelStyle = 'margin: 0 10px 0 5px';

    //Add the color block for update
    this._private.stats.appendChild(this.getLegendListing(this.updateColor));

    /**
     * @private
     * The update label for the legend for the graph.
     * @type {DOMElement}
     */
    this._private.updateText = document.createElement('span');
    this._private.updateText.style.cssText = labelStyle;
    this._private.updateText.innerHTML = 'Update';
    this._private.stats.appendChild(this._private.updateText);

    //Add the color block for draw
    this._private.stats.appendChild(this.getLegendListing(this.drawColor));

    /**
     * @private
     * The draw label for the legend for the graph.
     * @type {DOMElement}
     */

    this._private.drawText = document.createElement('span');
    this._private.drawText.style.cssText = labelStyle;
    this._private.drawText.innerHTML = 'Draw';
    this._private.stats.appendChild(this._private.drawText);

    //Add the color block for browser
    this._private.stats.appendChild(this.getLegendListing(this.browserColor));

    /**
     * @private
     * The browser label for the legend for the graph.
     * @type {DOMElement}
     */
    this._private.browserText = document.createElement('span');
    this._private.browserText.style.cssText = labelStyle;
    this._private.browserText.innerHTML = 'Browser';
    this._private.stats.appendChild(this._private.browserText);
  },

  /**
   * Returns a colored box to use in the graph legend.
   * @param {string} color the hex color of the box, without a #
   */
  getLegendListing : function(color) {
    var colorBlock = document.createElement('span');
    colorBlock.style.cssText = 'font-size: 14px; padding-left: 14px;' +
      'background-color: #' + color + ';';

    return colorBlock;
  },

  /**
   * Called when this tab is shown.
   */
  show : function () {
    this._super();
  },

  /**
   * Called when this tab is hidden.
   */
  hide : function() {
    this._super();
  },

  /**
   * Update function called on each loop in the engine
   * @param {number} elapsed the elapsed time since last call in
   * milliseconds
   */
  update : function(elapsed) {
    this.drawGraph();
  },

  /**
   * Resizes the console when the container is resized.
   * @param {number} newSize the new size of the container
   */
  resize : function(newSize) {
    newSize = Math.round(newSize - 20);

    //Create a temporary canvas obj to cache the pixel data
    var tmpCan = document.createElement('canvas');
    var tmpCtx = tmpCan.getContext('2d');

    //draw the current canvas data into the temp canvas
    tmpCan.width = this.canvas.width;
    tmpCan.height = newSize;
    tmpCtx.fillStyle = "#333";
    tmpCtx.fillRect(0, 0, this.canvas.width, newSize);

    //Only scale the chart if the canvas size has changed enough
    //to reach the next or previous increment.
    var h = newSize - (newSize % this._private.heightIncrement);
    if(h !== this._private.lastResize) {
      if(this.canvas.height < h) {
        var offset = h - this.canvas.height;

        tmpCtx.drawImage(
          this.canvas,
          0, h - this._private.lastResize - offset,
          this.canvas.width,
          this._private.lastResize,
          0, newSize - h, this.canvas.width, h
        );
      } else {
        tmpCtx.drawImage(
          this.canvas,
          0, newSize - h, this.canvas.width, h
        );
      }

      this._private.lastResize = h;
    } else {
      tmpCtx.drawImage(this.canvas, 0, newSize - this.canvas.height);
    }
    
    var widthOffset = this._private.canvasWidth - this.canvas.width;

    //Resize the canvas and draw the temp canvas
    this.canvas.height = newSize;
    this.canvas.width = this._private.canvasWidth;
    this._private.context.drawImage(tmpCan, widthOffset, 0);
  },

  /**
   * Updates the graph to show the frame elapsed time, update time, and
   * draw time. It will also update the labels to show the actual values.
   */
  drawGraph : function() {
    var nx = this.canvas.width - 1;
    var y = this._private.lastResize;
    var o = this.canvas.height - this._private.lastResize;

    //Recalculate the ms ratio with the current canvas height
    this._private.msRatio = this._private.msHeight / y;

    this._private.context.drawImage(this.canvas, -1, 0);
    this._private.context.fillStyle = "#333";
    this._private.context.fillRect(nx, 0, 1, this.canvas.height);
    var e, h = 0, b = 0;
    if(this.fpsTimer) {
      e = Math.round(this.fpsTimer.markCurrent);
      h = e / this._private.msRatio;
      this._private.context.fillStyle = '#' + this.browserColor;
      this._private.context.fillRect(nx, y - h + o, 1, h);
      b = e;
    }
    if(this.updateTimer) {
      e = Math.round(this.updateTimer.markCurrent);
      h = e / this._private.msRatio;
      this._private.context.fillStyle = '#' + this.updateColor;
      this._private.context.fillRect(nx, y - h + o, 1, h);
      b -= e;
      this._private.updateText.innerHTML = 'Update : ' + e + 'ms';
    }
    if(this.drawTimer) {
      e = Math.round(this.drawTimer.markCurrent);
      var hp = h;
      h = e / this._private.msRatio;
      this._private.context.fillStyle = '#' + this.drawColor;
      this._private.context.fillRect(nx, y - h - hp + o, 1, h);
      b -= e;
      this._private.drawText.innerHTML = 'Draw : ' + e + 'ms';
    }
    this._private.browserText.innerHTML = 'Browser : ' + b + 'ms';
  }
});