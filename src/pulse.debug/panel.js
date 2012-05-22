/**
 * Panel for containing and dislpaying debug information from the engine.
 * @class The debug panel class
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.Panel = PClass.extend(
/** @lends pulse.debug.Panel.prototype */
{
  /** @constructs */
  init : function (params) {
    params = pulse.util.checkParams(params, {
      container : document.getElementsByTagName('body')[0],
      useDefault : true,
      fpsTimer : null,
      updateTimer : null,
      drawTimer : null,
      drawCounter : null,
      nodeCounter : null
    });

    var _self = this;

    /**
     * Panel container element.
     * @type {DOMElement}
     */
    this.panel = document.createElement('div');
    this.panel.id = 'pulse-debug-panel';

    this.panel.style.cssText =
      'width: 100%; background-color: #333; color: #00FF00;' +
      'position: absolute; left: 0px; bottom: 0px; color: #ccc;';
    
    params.container.appendChild(this.panel);

    /**
     * Panel top bar, holds title and minimize button.
     * @type {DOMElement}
     */
    this.topbar = document.createElement('div');
    this.topbar.className = 'debug-topbar';
    this.topbar.style.cssText = 'height: 14px; line-height: 14px; font-size: 14px; padding: 5px;' +
      'background-color: #222;';

    this.panel.appendChild(this.topbar);

    //Resize the panel when the header is dragged.
    this.topbar.onmousedown = function(e) {
      var ec = {x : e.pageX, y : e.pageY};
      var body = document.getElementsByTagName('body')[0];
      var bodyStyle = body.style.cssText;
      body.style.cssText = bodyStyle + '-webkit-touch-callout: none; -webkit-user-select: none;' +
        '-khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;';

      var mm = function(e){
        var d = {x : e.pageX - ec.x, y : e.pageY - ec.y};
        
        var contentHeight = _self.tabholder.style.height;
        contentHeight = contentHeight.substr(0, contentHeight.length - 2);
        contentHeight = parseInt(contentHeight, 10);
        _self.resize(contentHeight - d.y);
        ec = {x : e.pageX, y : e.pageY};
      };
      window.addEventListener('mousemove', mm, false);
      window.addEventListener('mouseup', function(){
        this.removeEventListener('mousemove', mm, false);
        this.removeEventListener('mouseup', arguments.callee, false);
        body.style.cssText = bodyStyle;
      }, false);
    };

    var span = document.createElement('span');
    span.innerHTML = 'Pulse Debug';
    this.topbar.appendChild(span);

    /**
     * Panel tab bar, control holder for switching debugging tabs.
     * @type {DOMElement}
     */
    this.tabbar = document.createElement('div');
    this.tabbar.className = 'debug-tabbar';
    this.tabbar.style.cssText = 'height: 40px; background-color: #222; font-size: 16px;';
    this.panel.appendChild(this.tabbar);

    /**
     * Global actions available for the current game.
     * @type {DOMElement}
     */
    this.globalActions = document.createElement('div');
    this.globalActions.style.cssText = 'float: right;';
    this.tabbar.appendChild(this.globalActions);

    /**
     * Toggles global visual debugging for the game.
     * @type {DOMElement}
     */
    var toggleVisualDebug = document.createElement('a');
    toggleVisualDebug.style.cssText = 'padding: 5px; text-decoration: none; color: #ccc;';
    toggleVisualDebug.innerHTML = 'Visual Debug';
    toggleVisualDebug.href = '#';
    toggleVisualDebug.onclick = function() {
      if(pulse.debug && pulse.debug.visualDebug !== undefined) {
        if(pulse.debug.visualDebug === false) {
          pulse.debug.visualDebug = true;
        } else {
          pulse.debug.visualDebug = false;
        }
      }
    };
    this.globalActions.appendChild(toggleVisualDebug);

    /**
     * Panel tab holder, will contain all custom panels.
     * @type {DOMElement}
     */
    this.tabholder = document.createElement('div');
    this.tabholder.className = 'debug-tabholder';
    this.tabholder.style.cssText = 'height: 138px; overflow: hidden;';

    this.panel.appendChild(this.tabholder);

    /**
     * Panel status bar, holds a few stats for the debug panel.
     * @type {DOMElement}
     */
    this.statusbar = document.createElement('div');
    this.statusbar.className = 'debug-statusbar';
    this.statusbar.style.cssText = 'height: 24px; font-size: 16px; padding: 2px 0px; overflow: hidden;';
    this.panel.appendChild(this.statusbar);

    var statStyle = 'margin-right: 5px; padding-right: 5px; border-right: 1px solid #ccc;';

    /**
     * Number of nodes in the current scene.
     * @type {DOMElement}
     */
    this.statusNodes = document.createElement('span');
    this.statusNodes.style.cssText = statStyle;
    this.statusbar.appendChild(this.statusNodes);

    /**
     * Number of draws per frame status text.
     * @type {DOMElement}
     */
    this.statusDraws = document.createElement('span');
    this.statusDraws.style.cssText = statStyle;
    this.statusbar.appendChild(this.statusDraws);

    /**
     * Frame per second status text.
     * @type {DOMElement}
     */
    this.statusFPS = document.createElement('span');
    this.statusFPS.style.cssText = statStyle;
    this.statusbar.appendChild(this.statusFPS);

    /**
     * Frame time status text.
     * @type {DOMElement}
     */
    this.statusMS = document.createElement('span');
    this.statusMS.style.cssText = statStyle;
    this.statusbar.appendChild(this.statusMS);

    /**
     * Associative array (object) of the tabs in this panel.
     * @type {object}
     */
    this.tabs = {};

    /**
     * Associative array (object) of tab bar links.
     * @type {object}
     */
    this.tabbarLinks = {};

    /**
     * FPS timer for this debug panel.
     * @type {pulse.debug.FPS}
     */
    this.fpsTimer = params.fpsTimer;

    /**
     * Draw counter for this debug panel.
     * @type {pulse.debug.Counter}
     */
    this.drawCounter = params.drawCounter;

    /**
     * Node counter for this debug panel.
     * @type {pulse.debug.Counter}
     */
    this.nodeCounter = params.nodeCounter;

    if(params.useDefault) {
      var consoleTab = new pulse.debug.tabs.Console({
        name : 'Console',
        id : 'console'
      });
      this.addTab(consoleTab);
      var perfTab = new pulse.debug.tabs.Performance({
        name : 'Performance',
        id : 'perf',
        fpsTimer : params.fpsTimer,
        updateTimer : params.updateTimer,
        drawTimer : params.drawTimer
      });
      this.addTab(perfTab);
      var specTab = new pulse.debug.tabs.Inspector({
        name : 'Inspector',
        id : 'inspector'
      });
      this.addTab(specTab);

      this.showTab(perfTab.id);
    }
  },

  /**
   * Adds a tab to the panel.
   * @param {pulse.debug.DebugPanelTab} tab the tab to insert
   */
  addTab : function(tab) {
    this.tabs[tab.id] = tab;
    var _self = this;
    var link = document.createElement('a');
    link.href = '#';
    link.innerHTML = tab.name;
    link.onclick = function() {
      _self.showTab(tab.id);
      return false;
    };
    if(tab.icon !== '') {
      link.style.backgroundImage = 'url(' + tab.icon + ')';
    }
    link.id = 'pulse-tab-link-' + tab.id;
    link.name = tab.name;
    link.style.cssText = 'padding: 10px; display: inline-block; text-decoration: none; color: #ccc;';

    tab.container.style.display = 'none';
    this.tabbarLinks[tab.id] = link;
    this.tabbar.appendChild(link);
    this.tabholder.appendChild(tab.container);
  },

  /**
   * Removes a tab from the panel.
   * @param {string} id the id of the tab to remove
   */
  removeTab : function(id) {
    if(this.tabs[id]) {
      this.tabholder.removeChild(this.tabs[id]);
      this.tabbar.removeChild(this.tabbarLinks[id]);
      delete this.tabs[id];
      delete this.tabbarLinks[id];
    }
  },

  /**
   * Shows a tab which makes it visible and brings it to the front.
   * @param {string} id the id of the tab to display
   */
  showTab : function(id) {
    for(var tid in this.tabbarLinks) {
      if(this.tabbarLinks[tid].className !== '') {
        this.tabbarLinks[tid].className = '';
        this.tabbarLinks[tid].style.backgroundColor = '';
        this.tabbarLinks[tid].style.color ='#ccc';
        this.tabs[tid].container.className = 'debug-tab';
        this.tabs[tid].hide();
      }
    }
    if(!this.tabs[id]) {
      return;
    }
    var tab = this.tabs[id];
    var link = this.tabbarLinks[id];
    link.className = 'selected';
    link.style.backgroundColor = '#333';
    link.style.color = '#00FF00';
    tab.container.className = 'debug-tab selected';
    tab.show();
  },


  /**
   * Resizes each tab when the panel is resized.
   * @param {number} newSize the new size of the panel's content.
   */
  resize : function(newSize) {
    this.tabholder.style.height = newSize + 'px';

    for(var tid in this.tabs) {
      this.tabs[tid].resize(newSize);
    }
  },

  /**
   * Adds log entry to the console.
   * @param {string} text the message text for the log entry
   * @param {string} type the type of the message
   */
  logMessage : function(text, type) {
    if(this.tabs['console']) {
      this.tabs['console'].logMessage(text, type);
    }
  },

  /**
   * Sets the engine for the inspector tab, if applicatable.
   * @param {pulse.Engine} engine the engine to reference
   */
  setEngine : function(engine) {
    if(this.tabs['inspector']) {
      this.tabs['inspector'].setEngine(engine);
    }
  },

  /**
   * Adds a node to the inspector panel.
   * @param {pulse.Node} engine the engine to reference
   */
  addNode : function(node) {
    if(this.tabs['inspector']) {
      this.tabs['inspector'].addNode(node);
    }
  },

  /**
   * Removes a node to the inspector panel.
   * @param {pulse.Node} node the node to add
   */
  removeNode : function(node) {
    if(this.tabs['inspector']) {
      this.tabs['inspector'].removeNode(node);
    }
  },

  /**
   * Update function called on each loop in the engine
   * @param {number} elapsed the elapsed time since last call in
   * milliseconds
   */
  update : function(elapsed) {
    for(var n in this.tabs) {
      if(this.tabs[n].visible === true) {
        this.tabs[n].container.style.display = 'block';
      } else if(this.tabs[n].container.style.display !== 'none') {
        this.tabs[n].container.style.display = 'none';
      }

      this.tabs[n].update(elapsed);
    }

    // update status bar
    if(this.fpsTimer) {
      var e = Math.round(this.fpsTimer.markCurrent * 100) / 100;
      this.statusMS.innerHTML = e + "ms";
      this.statusFPS.innerHTML = "FPS: " + this.fpsTimer.fps;
    }
    if(this.drawCounter) {
      this.statusDraws.innerHTML = "Draws: " + this.drawCounter.count;
    }
    if(this.nodeCounter) {
      this.statusNodes.innerHTML = "Nodes: " + this.nodeCounter.count;
    }
  }
});

// Static index that's incremented whenever a tab is created.
// Used for uniquely naming panel tabs if a name is not specified.
pulse.debug.Panel.tabIdx = 0;