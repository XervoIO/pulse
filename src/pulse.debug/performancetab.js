/**
 * Performance tab for debugging panel.
 * @class The debug performance tab class
 * @param {object} [params] parameters that can be set as initialized options
 * on the performance tab
 * @config {string} [name] the name of the tab will be used for name of link
 * @config {string} [icon] the icon url to use as image for the tab, should be
 * 45x90 with off state on top (45x45) and on state on bottom (45x45)
 * @config {string} [id] the machine readable id for the tab
 * @config {pulse.debug.FPS} [fpsTimer] fps tracker for this tab
 * @config {pulse.debug.Timer} [updateTimer] update timer for this tab
 * @config {pulse.debug.timer} [drawTimer] draw timer for this tab
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.tabs.Performance = pulse.debug.PanelTab.extend(
/** @lends pulse.debug.PerformanceTab.prototype */
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

    // the canvas size
    var w = window.innerWidth;
    var h = 118;

    /**
     * The canvas for the stats graph.
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.id = 'pulse-perf-graph';
    this.container.appendChild(this.canvas);

    /**
     * @private
     * The graph canvas context.
     * @type {2DContext}
     */
    this._private.context = this.canvas.getContext('2d');
    this._private.context.fillStyle = "#333";
    this._private.context.fillRect(0, 0, w, h);

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

    // Setup labels
    /**
     * @private
     * The update label for graph legend.
     * @type {DOMElement}
     */
    this._private.updateLabel = document.createElement('div');
    this._private.updateLabel.className = 'debug-perf-label';
    //this.container.appendChild(this._private.updateLabel);

    /**
     * @private
     * The update legend marker for the graph.
     * @type {DOMElement}
     */
    this._private.updateMarker = document.createElement('div');
    this._private.updateMarker.className = 'debug-perf-marker';
    this._private.updateMarker.style.backgroundColor = '#61E561';
    this._private.updateLabel.appendChild(this._private.updateMarker);

    this._private.stats = document.createElement('div');
    this._private.stats.style.cssText = 'height: 20px;';
    this.container.appendChild(this._private.stats);

    /**
     * @private
     * The update text label for the legend for the graph.
     * @type {DOMElement}
     */
    this._private.updateText = document.createElement('span');
    this._private.updateText.className = 'debug-perf-labeltext';
    this._private.updateText.innerHTML = 'Update';
    this._private.stats.appendChild(this._private.updateText);

    /**
     * @private
     * The draw label for graph legend.
     * @type {DOMElement}
     */
    this._private.drawLabel = document.createElement('div');
    this._private.drawLabel.className = 'debug-perf-label';
    //this.container.appendChild(this._private.drawLabel);

    /**
     * @private
     * The draw legend marker for the graph.
     * @type {DOMElement}
     */
    this._private.drawMarker = document.createElement('div');
    this._private.drawMarker.className = 'debug-perf-marker';
    this._private.drawMarker.style.backgroundColor = '#CC22EE';
    //this._private.drawLabel.appendChild(this._private.drawMarker);

    /**
     * @private
     * The draw text label for the legend for the graph.
     * @type {DOMElement}
     */
    this._private.drawText = document.createElement('span');
    this._private.drawText.className = 'debug-perf-labeltext';
    this._private.drawText.innerHTML = 'Draw';
    this._private.stats.appendChild(this._private.drawText);

    /**
     * @private
     * The browser label for graph legend.
     * @type {DOMElement}
     */
    this._private.browserLabel = document.createElement('div');
    this._private.browserLabel.className = 'debug-perf-label';
    //this.container.appendChild(this._private.browserLabel);

    /**
     * @private
     * The browser legend marker for the graph.
     * @type {DOMElement}
     */
    this._private.browserMarker = document.createElement('div');
    this._private.browserMarker.className = 'debug-perf-marker';
    this._private.browserMarker.style.backgroundColor = '#F7Fd4A';
    //this._private.browserLabel.appendChild(this._private.browserMarker);

    /**
     * @private
     * The browser text label for the legend for the graph.
     * @type {DOMElement}
     */
    this._private.browserText = document.createElement('span');
    this._private.browserText.className = 'debug-perf-labeltext';
    this._private.browserText.innerHTML = 'Browser';
    this._private.stats.appendChild(this._private.browserText);
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
    // Nothing is updated by default
    this.drawGraph();
  },

  /**
   * Resizes the console when the container is resized.
   * @param {number} newSize the new size of the container
   */
  resize : function(newSize) {
    this.canvas.height = newSize - 20;
  },

  /**
   * Updates the graph to show the frame elapsed time, update time, and
   * draw time. It will also update the labels to show the actual values.
   */
  drawGraph : function() {
    var nx = this.canvas.width - 1;
    var y = this.canvas.height;
    this._private.context.drawImage(this.canvas, -1, 0);
    this._private.context.fillStyle = "#333";
    this._private.context.fillRect(nx, 0, 1, this.canvas.height);
    var e, h = 0, b = 0;
    if(this.fpsTimer) {
      e = Math.round(this.fpsTimer.markCurrent);
      h = e / this._private.msRatio;
      this._private.context.fillStyle = "#F7Fd4A";
      this._private.context.fillRect(nx, y-h, 1, h);
      b = e;
    }
    if(this.updateTimer) {
      e = Math.round(this.updateTimer.markCurrent);
      h = e / this._private.msRatio;
      this._private.context.fillStyle = "#61E561";
      this._private.context.fillRect(nx, y-h, 1, h);
      b -= e;
      this._private.updateText.innerHTML = 'Update : ' + e + 'ms';
    }
    if(this.drawTimer) {
      e = Math.round(this.drawTimer.markCurrent);
      var hp = h;
      h = e / this._private.msRatio;
      this._private.context.fillStyle = "#CC22EE";
      this._private.context.fillRect(nx, y-h-hp, 1, h);
      b -= e;
      this._private.drawText.innerHTML = 'Draw : ' + e + 'ms';
    }
    this._private.browserText.innerHTML = 'Browser : ' + b + 'ms';
  }
});