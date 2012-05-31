pulse.debug = pulse.debug || {};
pulse.debug.tabs = pulse.debug.tabs || {};
pulse.debug.getTypeColor = function(node) {
  if(node instanceof pulse.Scene) {
    return"248A8A"
  }else {
    if(node instanceof pulse.Layer) {
      return"F2572A"
    }else {
      if(node instanceof pulse.Sprite) {
        return"F9E555"
      }else {
        if(node instanceof pulse.CanvasLabel) {
          return"FAAC38"
        }else {
          if(node instanceof pulse.BitmapLabel) {
            return"C9FA58"
          }else {
            return"CCCCCC"
          }
        }
      }
    }
  }
};
pulse.debug.Logger = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {container:document.createElement("div")});
  this.container = params.container;
  this.container.className = "pulse-debug-log";
  this.container.style.cssText = "height: 118px; overflow: auto;";
  this.colors = {"error":"ff5c5c", "warning":"ffcc66", "debug":"ccc"};
  this.even = false
}, addMessage:function(text, type) {
  var now = new Date;
  var logelement = document.createElement("div");
  logelement.style.cssText = "padding: 2px 0; border-bottom: 1px solid #555; padding:2px 5px;";
  logelement.style.color = "#" + this.colors[type];
  if(this.even) {
    logelement.style.background = "#2C2C2C"
  }
  logelement.className = "debug-log-message " + type;
  logelement.setAttribute("data-type", type);
  this.container.appendChild(logelement);
  var timeelement = document.createElement("div");
  timeelement.className = "timestamp";
  timeelement.style.cssText = "float:left; width: 50px; margin-right: 5px;";
  var h = now.getHours() % 12;
  timeelement.innerHTML = (h === 0 ? 12 : h) + ":" + now.getMinutes() + ":" + now.getSeconds();
  logelement.appendChild(timeelement);
  var textelement = document.createElement("span");
  textelement.className = "text";
  textelement.innerHTML = text;
  logelement.appendChild(textelement);
  this.even = !this.even
}, filterType:function(type) {
  var nodes = this.container.childNodes;
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute("data-type") == type) {
      nodes[i].style.display = "block"
    }else {
      nodes[i].style.display = "none"
    }
  }
}, clearFilter:function() {
  var nodes = this.container.childNodes;
  for(var i = 0;i < nodes.length;i++) {
    nodes[i].style.display = "block"
  }
}});
pulse.debug.Timer = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {name:"Timer" + pulse.debug.Timer.timerIdx++});
  this.name = params.name;
  this.timeCurrent = null;
  this.marks = [];
  this.marksMax = 300;
  this.markCurrent = -1
}, start:function() {
  this.timeCurrent = (new Date).getTime()
}, mark:function() {
  var now = (new Date).getTime();
  if(this.marks.length >= this.marksMax) {
    this.marks.shift()
  }
  this.markCurrent = now - this.timeCurrent;
  this.marks.push(this.markCurrent);
  this.timeCurrent = now
}});
pulse.debug.Timer.timerIdx = 0;
pulse.debug.FPS = pulse.debug.Timer.extend({init:function(params) {
  this._super(params);
  this.timeStart = 0;
  this.frames = 0;
  this.fpsUpdateInterval = 10;
  this.fps = 0;
  this.fpsMarks = [];
  this._private = {};
  this._private.timeLastSecond = -1
}, start:function() {
  this._super();
  this._private.timeLastSecond = this.timeCurrent;
  this.timeStart = this.timeCurrent;
  this.frames = 0;
  this.fps = 0
}, mark:function() {
  this._super();
  this.frames++;
  if(this.timeCurrent > this._private.timeLastSecond + this.fpsUpdateInterval) {
    var cfps = Math.round(this.frames * 1E3 / (this.timeCurrent - this._private.timeLastSecond));
    var total = 0;
    var terms = 9;
    for(var i = 0;i < terms;i++) {
      if(i === 0) {
        total += cfps / terms
      }else {
        var term = this.fpsMarks[this.fpsMarks.length - 1] || 0;
        total += term / terms
      }
    }
    this.fps = Math.round(total);
    if(this.fpsMarks.length >= this.marksMax) {
      this.fpsMarks.shift()
    }
    this.fpsMarks.push(this.fps);
    this._private.timeLastSecond = this.timeCurrent;
    this.frames = 0
  }
}});
pulse.debug.Counter = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {name:"Counter" + pulse.debug.Counter.counterIdx++});
  this.name = params.name;
  this.count = 0
}, reset:function() {
  this.count = 0
}, increment:function() {
  this.count++
}, decrement:function() {
  this.count--
}});
pulse.debug.Counter.counterIdx = 0;
pulse.debug.PanelTab = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {name:"Tab" + pulse.debug.Panel.tabIdx++, icon:"", id:"Tab" + (pulse.debug.Panel.tabIdx - 1)});
  this.name = params.name;
  this.icon = params.icon;
  this.id = params.id;
  this.container = document.createElement("div");
  this.container.className = "debug-tab";
  this.container.id = "debug-tab-" + this.id;
  this.visible = false;
  this._private = {}
}, show:function() {
  this.visible = true
}, hide:function() {
  this.visible = false
}, resize:function(newSize) {
}, update:function(elapsed) {
}});
pulse.debug.tabs.Performance = pulse.debug.PanelTab.extend({init:function(params) {
  this._super(params);
  params = pulse.util.checkParams(params, {fpsTimer:null, updateTimer:null, drawTimer:null});
  this.fpsTimer = params.fpsTimer;
  this.updateTimer = params.updateTimer;
  this.drawTimer = params.drawTimer;
  this._private.canvasWidth = window.innerWidth;
  var h = 118;
  this._private.heightIncrement = 59;
  this._private.lastResize = h;
  this.canvas = document.createElement("canvas");
  this.canvas.width = this._private.canvasWidth;
  this.canvas.height = h;
  this.canvas.id = "pulse-perf-graph";
  this.container.appendChild(this.canvas);
  var _self = this;
  var pCanvas = this.canvas;
  window.onresize = function() {
    _self._private.canvasWidth = window.innerWidth;
    _self.resize(_self.canvas.height + 20)
  };
  this._private.context = this.canvas.getContext("2d");
  this._private.context.fillStyle = "#333";
  this._private.context.fillRect(0, 0, this._private.canvasWidth, h);
  this._private.msHeight = 100;
  this._private.msRatio = this._private.msHeight / h;
  this.updateColor = "61E561";
  this.drawColor = "CC22EE";
  this.browserColor = "F7Fd4A";
  this._private.stats = document.createElement("div");
  this._private.stats.style.cssText = "height: 14px;line-height:14px;padding:3px 5px;margin-top:-3px;";
  this.container.appendChild(this._private.stats);
  var labelStyle = "margin: 0 10px 0 5px";
  this._private.stats.appendChild(this.getLegendListing(this.updateColor));
  this._private.updateText = document.createElement("span");
  this._private.updateText.style.cssText = labelStyle;
  this._private.updateText.innerHTML = "Update";
  this._private.stats.appendChild(this._private.updateText);
  this._private.stats.appendChild(this.getLegendListing(this.drawColor));
  this._private.drawText = document.createElement("span");
  this._private.drawText.style.cssText = labelStyle;
  this._private.drawText.innerHTML = "Draw";
  this._private.stats.appendChild(this._private.drawText);
  this._private.stats.appendChild(this.getLegendListing(this.browserColor));
  this._private.browserText = document.createElement("span");
  this._private.browserText.style.cssText = labelStyle;
  this._private.browserText.innerHTML = "Browser";
  this._private.stats.appendChild(this._private.browserText)
}, getLegendListing:function(color) {
  var colorBlock = document.createElement("span");
  colorBlock.style.cssText = "font-size: 14px; padding-left: 14px;" + "background-color: #" + color + ";";
  return colorBlock
}, show:function() {
  this._super()
}, hide:function() {
  this._super()
}, update:function(elapsed) {
  this.drawGraph()
}, resize:function(newSize) {
  newSize = Math.round(newSize - 20);
  var tmpCan = document.createElement("canvas");
  var tmpCtx = tmpCan.getContext("2d");
  tmpCan.width = this.canvas.width;
  tmpCan.height = newSize;
  tmpCtx.fillStyle = "#333";
  tmpCtx.fillRect(0, 0, this.canvas.width, newSize);
  var h = newSize - newSize % this._private.heightIncrement;
  if(h !== this._private.lastResize) {
    if(this.canvas.height < h) {
      var offset = h - this.canvas.height;
      tmpCtx.drawImage(this.canvas, 0, h - this._private.lastResize - offset, this.canvas.width, this._private.lastResize, 0, newSize - h, this.canvas.width, h)
    }else {
      tmpCtx.drawImage(this.canvas, 0, newSize - h, this.canvas.width, h)
    }
    this._private.lastResize = h
  }else {
    tmpCtx.drawImage(this.canvas, 0, newSize - this.canvas.height)
  }
  var widthOffset = this._private.canvasWidth - this.canvas.width;
  this.canvas.height = newSize;
  this.canvas.width = this._private.canvasWidth;
  this._private.context.drawImage(tmpCan, widthOffset, 0)
}, drawGraph:function() {
  var nx = this.canvas.width - 1;
  var y = this._private.lastResize;
  var o = this.canvas.height - this._private.lastResize;
  this._private.msRatio = this._private.msHeight / y;
  this._private.context.drawImage(this.canvas, -1, 0);
  this._private.context.fillStyle = "#333";
  this._private.context.fillRect(nx, 0, 1, this.canvas.height);
  var e, h = 0, b = 0;
  if(this.fpsTimer) {
    e = Math.round(this.fpsTimer.markCurrent);
    h = e / this._private.msRatio;
    this._private.context.fillStyle = "#" + this.browserColor;
    this._private.context.fillRect(nx, y - h + o, 1, h);
    b = e
  }
  if(this.updateTimer) {
    e = Math.round(this.updateTimer.markCurrent);
    h = e / this._private.msRatio;
    this._private.context.fillStyle = "#" + this.updateColor;
    this._private.context.fillRect(nx, y - h + o, 1, h);
    b -= e;
    this._private.updateText.innerHTML = "Update : " + e + "ms"
  }
  if(this.drawTimer) {
    e = Math.round(this.drawTimer.markCurrent);
    var hp = h;
    h = e / this._private.msRatio;
    this._private.context.fillStyle = "#" + this.drawColor;
    this._private.context.fillRect(nx, y - h - hp + o, 1, h);
    b -= e;
    this._private.drawText.innerHTML = "Draw : " + e + "ms"
  }
  this._private.browserText.innerHTML = "Browser : " + b + "ms"
}});
pulse.debug.Panel = PClass.extend({init:function(params) {
  params = pulse.util.checkParams(params, {container:document.getElementsByTagName("body")[0], useDefault:true, fpsTimer:null, updateTimer:null, drawTimer:null, drawCounter:null, nodeCounter:null});
  var _self = this;
  this.panel = document.createElement("div");
  this.panel.id = "pulse-debug-panel";
  this.panel.style.cssText = "width: 100%; background-color: #333; color: #00FF00;" + "left: 0px; bottom: 0px; color: #ccc; " + "font: 12px Helvetica,arial,freesans,clean,sans-serif; position: fixed;";
  params.container.appendChild(this.panel);
  this.topbar = document.createElement("div");
  this.topbar.className = "debug-topbar";
  this.topbar.style.cssText = "height: 13px; line-height: 13px; font-size: 13px; padding: 5px;" + "background-color: #222;cursor:ns-resize;";
  this.panel.appendChild(this.topbar);
  this.topbar.onmousedown = function(e) {
    var ec = {x:e.pageX, y:e.pageY};
    var panelStyle = _self.panel.style.cssText;
    _self.panel.style.cssText = "-webkit-touch-callout: none; -webkit-user-select: none;" + "-khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;" + panelStyle;
    var mm = function(e) {
      var d = {x:e.pageX - ec.x, y:e.pageY - ec.y};
      var contentHeight = _self.tabholder.style.height;
      contentHeight = contentHeight.substr(0, contentHeight.length - 2);
      contentHeight = parseInt(contentHeight, 10);
      _self.resize(contentHeight - d.y);
      ec = {x:e.pageX, y:e.pageY}
    };
    window.addEventListener("mousemove", mm, false);
    window.addEventListener("mouseup", function() {
      _self.panel.style.cssText = panelStyle;
      this.removeEventListener("mousemove", mm, false);
      this.removeEventListener("mouseup", arguments.callee, false)
    }, false)
  };
  var span = document.createElement("span");
  span.innerHTML = "Pulse Debug";
  this.topbar.appendChild(span);
  this.tabbar = document.createElement("div");
  this.tabbar.className = "debug-tabbar";
  this.tabbar.style.cssText = "height: 30px; background-color: #222; font-size: 14px;";
  this.panel.appendChild(this.tabbar);
  this.globalActions = document.createElement("div");
  this.globalActions.style.cssText = "line-height: 30px; float: right;";
  this.tabbar.appendChild(this.globalActions);
  var toggleVisualDebug = document.createElement("a");
  toggleVisualDebug.style.cssText = "margin: 2px 5px; font-size: 12px; height: 16px; line-height: 16px; padding: 2px 6px; text-decoration: none; color: #EEE; display:block; border-radius: 3px; border: 1px solid #888; background: #666;";
  toggleVisualDebug.innerHTML = "VISUAL DEBUG";
  toggleVisualDebug.href = "#";
  toggleVisualDebug.onclick = function() {
    if(pulse.debug && pulse.debug.visualDebug !== undefined) {
      if(pulse.debug.visualDebug === false) {
        pulse.debug.visualDebug = true;
        this.style.cssText += "background: #444;"
      }else {
        pulse.debug.visualDebug = false;
        this.style.cssText += "background: #666;"
      }
    }
  };
  this.globalActions.appendChild(toggleVisualDebug);
  this.tabholder = document.createElement("div");
  this.tabholder.className = "debug-tabholder";
  this.tabholder.style.cssText = "height: 138px; overflow: hidden;";
  this.panel.appendChild(this.tabholder);
  this.statusbar = document.createElement("div");
  this.statusbar.className = "debug-statusbar";
  this.statusbar.style.cssText = "height: 16px; line-height: 16px; padding: 2px 5px; overflow: hidden; background: #555;";
  this.panel.appendChild(this.statusbar);
  var statStyle = "float: left; margin-right: 5px; padding-right: 5px; border-right: 1px solid #ccc;";
  this.statusNodes = document.createElement("div");
  this.statusNodes.style.cssText = statStyle;
  this.statusbar.appendChild(this.statusNodes);
  this.statusDraws = document.createElement("div");
  this.statusDraws.style.cssText = statStyle;
  this.statusbar.appendChild(this.statusDraws);
  this.statusFPS = document.createElement("div");
  this.statusFPS.style.cssText = statStyle;
  this.statusbar.appendChild(this.statusFPS);
  this.statusMS = document.createElement("div");
  this.statusMS.style.cssText = statStyle + "border:0;";
  this.statusbar.appendChild(this.statusMS);
  this.tabs = {};
  this.tabbarLinks = {};
  this.fpsTimer = params.fpsTimer;
  this.drawCounter = params.drawCounter;
  this.nodeCounter = params.nodeCounter;
  if(params.useDefault) {
    var perfTab = new pulse.debug.tabs.Performance({name:"Performance", id:"perf", fpsTimer:params.fpsTimer, updateTimer:params.updateTimer, drawTimer:params.drawTimer});
    this.addTab(perfTab);
    var specTab = new pulse.debug.tabs.Inspector({name:"Inspector", id:"inspector"});
    this.addTab(specTab);
    var consoleTab = new pulse.debug.tabs.Console({name:"Console", id:"console"});
    this.addTab(consoleTab);
    this.showTab(perfTab.id)
  }
  this.offsetBody()
}, addTab:function(tab) {
  this.tabs[tab.id] = tab;
  var _self = this;
  var link = document.createElement("a");
  link.href = "#";
  link.innerHTML = tab.name;
  link.onclick = function() {
    _self.showTab(tab.id);
    return false
  };
  link.id = "pulse-tab-link-" + tab.id;
  link.name = tab.name;
  link.style.cssText = "height: 30px; padding: 0px 10px; line-height: 30px; display: inline-block; text-decoration: none; color: #ccc;";
  if(tab.icon !== "") {
    link.style.cssText += "background: transparent url('" + tab.icon + "') no-repeat 10px center;" + "padding-left: 35px"
  }
  tab.container.style.display = "none";
  this.tabbarLinks[tab.id] = link;
  this.tabbar.appendChild(link);
  this.tabholder.appendChild(tab.container)
}, removeTab:function(id) {
  if(this.tabs[id]) {
    this.tabholder.removeChild(this.tabs[id]);
    this.tabbar.removeChild(this.tabbarLinks[id]);
    delete this.tabs[id];
    delete this.tabbarLinks[id]
  }
}, showTab:function(id) {
  for(var tid in this.tabbarLinks) {
    if(this.tabbarLinks[tid].className !== "") {
      this.tabbarLinks[tid].className = "";
      this.tabbarLinks[tid].style.backgroundColor = "";
      this.tabbarLinks[tid].style.color = "#ccc";
      this.tabs[tid].container.className = "debug-tab";
      this.tabs[tid].hide()
    }
  }
  if(!this.tabs[id]) {
    return
  }
  var tab = this.tabs[id];
  var link = this.tabbarLinks[id];
  link.className = "selected";
  link.style.backgroundColor = "#333";
  link.style.color = "#CCFF00";
  tab.container.className = "debug-tab selected";
  tab.show()
}, resize:function(newSize) {
  var body = document.getElementsByTagName("body")[0];
  body.style.minHeight = body.offsetHeight - this.panel.offsetHeight + "px";
  this.tabholder.style.height = newSize + "px";
  for(var tid in this.tabs) {
    this.tabs[tid].resize(newSize)
  }
  this.offsetBody()
}, offsetBody:function() {
  var body = document.getElementsByTagName("body")[0];
  body.style.minHeight = body.offsetHeight + this.panel.offsetHeight + "px"
}, logMessage:function(text, type) {
  if(this.tabs["console"]) {
    this.tabs["console"].logMessage(text, type)
  }
}, setEngine:function(engine) {
  if(this.tabs["inspector"]) {
    this.tabs["inspector"].setEngine(engine)
  }
}, addNode:function(node) {
  if(this.tabs["inspector"]) {
    this.tabs["inspector"].addNode(node)
  }
}, removeNode:function(node) {
  if(this.tabs["inspector"]) {
    this.tabs["inspector"].removeNode(node)
  }
}, gameUpdated:function() {
  if(this.tabs["inspector"]) {
    this.tabs["inspector"].update()
  }
}, update:function(elapsed) {
  for(var n in this.tabs) {
    if(this.tabs[n].visible === true) {
      this.tabs[n].container.style.display = "block"
    }else {
      if(this.tabs[n].container.style.display !== "none") {
        this.tabs[n].container.style.display = "none"
      }
    }
    this.tabs[n].update(elapsed)
  }
  if(this.fpsTimer) {
    var e = Math.round(this.fpsTimer.markCurrent * 100) / 100;
    this.statusMS.innerHTML = e + "ms";
    this.statusFPS.innerHTML = "FPS: " + this.fpsTimer.fps
  }
  if(this.drawCounter) {
    this.statusDraws.innerHTML = "Draws: " + this.drawCounter.count
  }
  if(this.nodeCounter) {
    this.statusNodes.innerHTML = "Nodes: " + this.nodeCounter.count
  }
}});
pulse.debug.Panel.tabIdx = 0;
pulse.debug.tabs.Console = pulse.debug.PanelTab.extend({init:function(params) {
  this._super(params);
  var self = this;
  this.selectedBGColor = "555";
  this.toolbar = document.createElement("div");
  this.toolbar.className = "debug-console-toolbar";
  this.toolbar.style.cssText = "padding: 0 5px;line-height:20px;border-bottom: 1px solid #555;";
  this.container.appendChild(this.toolbar);
  this.allButton = this.addFilterButton("All", "none");
  this.allButton.className = "selected";
  this.allButton.style.backgroundColor = "#" + this.selectedBGColor;
  this.errorsButton = this.addFilterButton("Errors", "error");
  this.warningsButton = this.addFilterButton("Warnings", "warning");
  this.infoButton = this.addFilterButton("Info", "debug");
  this.logger = new pulse.debug.Logger;
  this.container.appendChild(this.logger.container);
  this._private.currentFilterLink = this.allButton
}, addFilterButton:function(name, type) {
  var _self = this;
  var button = document.createElement("a");
  button.onclick = function() {
    if(_self._private.currentFilterLink) {
      _self._private.currentFilterLink.style.backgroundColor = ""
    }
    _self._private.currentFilterLink = this;
    this.className = "selected";
    this.style.backgroundColor = "#" + _self.selectedBGColor;
    if(type == "none") {
      _self.clearFilter()
    }else {
      _self.filterLogs(type)
    }
    return false
  };
  button.id = "filter-" + type;
  button.href = "#";
  button.innerHTML = name;
  button.style.cssText = "text-decoration: none; color: #ccc; padding:2px 5px;";
  this.toolbar.appendChild(button);
  return button
}, logMessage:function(text, type) {
  this.logger.addMessage(text, type)
}, filterLogs:function(type) {
  this.logger.filterType(type)
}, clearFilter:function() {
  this.logger.clearFilter()
}, resize:function(newSize) {
  this.logger.container.style.height = newSize - 20 + "px"
}});
pulse.debug.tabs.Inspector = pulse.debug.PanelTab.extend({init:function(params) {
  this._super(params);
  this.selectedNode = null;
  this._private.nodeList = document.createElement("div");
  this._private.nodeList.style.cssText = "overflow: auto; " + "width: 70%; height: 120px; float: left; padding: 5px 0;";
  this.container.appendChild(this._private.nodeList);
  this._private.nodePropsDiv = document.createElement("div");
  this._private.nodePropsDiv.style.cssText = "overflow: auto;" + "width: 30%; height: 130px; float: right; padding: 5px 0; background: #3C3C3C";
  this.container.appendChild(this._private.nodePropsDiv);
  var _self = this;
  var actionsDiv = document.createElement("div");
  actionsDiv.id = "inspector-node-actions";
  actionsDiv.style.cssText = "float: right;";
  this.visibilityAction = document.createElement("a");
  this.visibilityAction.innerHTML = "HIDE";
  this.visibilityAction.href = "#";
  this.visibilityAction.style.cssText = "float: left; margin: 0 5px; font-size: 12px; height: 16px; line-height: 16px; padding: 2px 6px; text-decoration: none; color: #EEE; display:block; border-radius: 3px; border: 1px solid #888; background: #666;";
  this.visibilityAction.onclick = function() {
    if(_self.selectedNode) {
      _self.toggleNode(_self.selectedNode)
    }
    return false
  };
  actionsDiv.appendChild(this.visibilityAction);
  this.outlineAction = document.createElement("a");
  this.outlineAction.innerHTML = "OUTLINE";
  this.outlineAction.href = "#";
  this.outlineAction.style.cssText = "float: left; margin: 0 5px; font-size: 12px; height: 16px; line-height: 16px; padding: 2px 6px; text-decoration: none; color: #EEE; display:block; border-radius: 3px; border: 1px solid #888; background: #666;";
  this.outlineAction.onclick = function() {
    if(_self.selectedNode) {
      _self.toggleDebug(_self.selectedNode)
    }
    return false
  };
  actionsDiv.appendChild(this.outlineAction);
  this._private.nodePropsDiv.appendChild(actionsDiv);
  this._private.nodeProps = ["Name", "Size", "Position", "Anchor", "ZIndex"];
  var propDiv, propName, valueSpan;
  for(var p in this._private.nodeProps) {
    propName = this._private.nodeProps[p];
    propDiv = document.createElement("div");
    propDiv.id = "inspector-props-" + propName.toLowerCase();
    propDiv.style.cssText = "padding: 2px 10px; color: #AAA;";
    propDiv.innerHTML = propName + ": ";
    valueSpan = document.createElement("span");
    valueSpan.id = "inspector-prop-" + propName.toLowerCase() + "-value";
    valueSpan.style.cssText = "color: #CCC;";
    propDiv.appendChild(valueSpan);
    this._private.nodePropsDiv.appendChild(propDiv)
  }
  this._private.engine = null
}, show:function() {
  this._super()
}, hide:function() {
  this._super()
}, update:function(elapsed) {
  if(this.selectedNode instanceof pulse.Visual && this.selectedNode.updated === true) {
    this.selectNode(this.selectedNode)
  }
}, setEngine:function(engine) {
  this._private.engine = engine;
  var scenes = engine.scenes.getScenes(true);
  for(var s = 0;s < scenes.length;s++) {
    this.styleVisibility(scenes[s])
  }
}, getNodeDiv:function(node, addContainer, containerIndent) {
  var nodeDiv = document.createElement("div");
  nodeDiv.id = "inspector-node-" + node.name;
  nodeDiv.style.cssText = "padding: 0 2px;";
  var nameSpan = document.createElement("span");
  nameSpan.className = "name";
  nameSpan.style.cssText = "cursor: pointer; padding: 2px;";
  nameSpan.innerHTML = node.name;
  var _self = this;
  nameSpan.onclick = function() {
    _self.selectNode(node)
  };
  var container = null;
  if(addContainer === true) {
    container = document.createElement("div");
    container.id = "inspector-" + node.name + "-children";
    container.style.marginLeft = containerIndent + "px";
    container.style.display = "none";
    var containerToggle = document.createElement("div");
    containerToggle.style.cssText = "display: inline-block; width: 20px; height: 20px; " + "font-size: 14px; cursor: pointer;";
    containerToggle.onclick = function() {
      _self.toggleVisibility(container);
      if(container.style.display === "block") {
        containerToggle.innerHTML = "&#9660;"
      }else {
        containerToggle.innerHTML = "&#9658;"
      }
    };
    containerToggle.innerHTML = "&#9658;";
    nodeDiv.appendChild(containerToggle);
    nodeDiv.appendChild(nameSpan);
    nodeDiv.appendChild(container);
    nameSpan.onclick = function() {
      _self.selectNode(node)
    }
  }else {
    nodeDiv.appendChild(nameSpan)
  }
  return{div:nodeDiv, container:container}
}, addNode:function(node) {
  node.debugging = false;
  var parentElm = null;
  if(node.parent !== null) {
    parentElm = document.getElementById("inspector-" + node.parent.name + "-children")
  }
  var divTmp = null;
  if(node instanceof pulse.Scene) {
    divTmp = this.getNodeDiv(node, true, 10);
    this._private.nodeList.appendChild(divTmp.div);
    for(var l in node.layers) {
      this.addNode(node.layers[l])
    }
  }else {
    if(node instanceof pulse.Layer && parentElm !== null) {
      divTmp = this.getNodeDiv(node, true, 30);
      parentElm.appendChild(divTmp.div);
      for(var o in node.objects) {
        this.addNode(node.objects[o])
      }
    }else {
      if(parentElm !== null) {
        divTmp = this.getNodeDiv(node, false);
        parentElm.appendChild(divTmp.div)
      }
    }
  }
  this.styleVisibility(node)
}, removeNode:function(node) {
  var nodeName = node;
  if(node instanceof pulse.Node) {
    nodeName = node.name
  }
  var nodeDiv = document.getElementById("inspector-node-" + nodeName);
  if(nodeDiv !== null) {
    nodeDiv.parentNode.removeChild(nodeDiv)
  }
}, selectNode:function(node) {
  var nodeDiv;
  if(this.selectedNode !== null) {
    nodeDiv = document.getElementById("inspector-node-" + this.selectedNode.name);
    if(nodeDiv !== null) {
      var childu = nodeDiv.children[0];
      if(nodeDiv.children[0].className !== "name") {
        childu = nodeDiv.children[1]
      }
      childu.style.color = nodeDiv.style.color;
      childu.style.background = "transparent"
    }
  }
  this.selectedNode = node;
  nodeDiv = document.getElementById("inspector-node-" + node.name);
  if(nodeDiv !== null) {
    var childs = nodeDiv.children[0];
    if(nodeDiv.children[0].className !== "name") {
      childs = nodeDiv.children[1]
    }
    childs.style.background = nodeDiv.style.color;
    childs.style.color = "#222"
  }
  var propName, propValueSpan;
  for(var p in this._private.nodeProps) {
    propName = this._private.nodeProps[p];
    propValueSpan = document.getElementById("inspector-prop-" + propName.toLowerCase() + "-value");
    if(propValueSpan !== null) {
      if(node.hasOwnProperty(propName.toLowerCase())) {
        propValueSpan.innerHTML = this.getValueString(node[propName.toLowerCase()])
      }else {
        propValueSpan.innerHTML = "N/A"
      }
    }
  }
  if(node.visible === true || node.active === true) {
    this.visibilityAction.innerHTML = "HIDE"
  }else {
    this.visibilityAction.innerHTML = "SHOW"
  }
  if(node instanceof pulse.Scene) {
    this.outlineAction.style.display = "none"
  }else {
    this.outlineAction.style.display = "block"
  }
  if(node.debugging) {
    this.outlineAction.style.cssText += "background: #444;"
  }else {
    this.outlineAction.style.cssText += "background: #666;"
  }
}, toggleNode:function(node) {
  if(node instanceof pulse.Scene && this._private.engine instanceof pulse.Engine) {
    if(node.active === true) {
      this._private.engine.scenes.deactivateScene(node.name)
    }else {
      this._private.engine.scenes.activateScene(node.name)
    }
  }
  if(node instanceof pulse.Visual) {
    if(node.visible === true) {
      node.visible = false
    }else {
      node.visible = true
    }
  }
  this.styleVisibility(node);
  this.selectNode(node)
}, styleVisibility:function(node) {
  var nodeDiv = document.getElementById("inspector-node-" + node.name);
  if(nodeDiv !== null) {
    var color = pulse.debug.getTypeColor(node);
    if(node.visible === false || node.active === false) {
      color = this.disableColor(color)
    }
    nodeDiv.highlightColor = "#" + color;
    nodeDiv.style.color = "#" + color
  }
}, toggleDebug:function(node) {
  if(node.debugging === true) {
    node.debugging = false
  }else {
    node.debugging = true
  }
  this.selectNode(node)
}, toggleVisibility:function(elm) {
  if(elm.style.display !== "none") {
    elm.style.display = "none"
  }else {
    elm.style.display = "block"
  }
}, getValueString:function(object) {
  var value = "";
  if(typeof object === "object") {
    for(var a in object) {
      value += this.getValueString(object[a]) + ", "
    }
    value = value.substring(0, value.length - 2)
  }else {
    if(typeof object === "number") {
      value += object.toFixed(2)
    }else {
      value += object
    }
  }
  return value
}, disableColor:function(color) {
  var colorInt = parseInt(color, 16);
  var R = (colorInt & 16711680) >> 16;
  var G = (colorInt & 65280) >> 8;
  var B = (colorInt & 255) >> 0;
  var shade = -100;
  R = R + Math.floor(shade / 255 * R);
  G = G + Math.floor(shade / 255 * G);
  B = B + Math.floor(shade / 255 * B);
  var newColorInt = (R << 16) + (G << 8) + B;
  return newColorInt.toString(16)
}, resize:function(newSize) {
  this._private.nodeList.style.height = newSize + "px";
  this._private.nodePropsDiv.style.height = newSize + "px"
}});
pulse.debug.DebugManager = PClass.extend({init:function() {
  this.timers = {};
  this.counters = {};
  this.fps = 0;
  this.running = false;
  this._private = {};
  this._private.fpsTimer = new pulse.debug.FPS;
  this._private.fpsTimer.start();
  this._private.updateTimer = new pulse.debug.Timer;
  this._private.drawTimer = new pulse.debug.Timer;
  this._private.drawCounter = new pulse.debug.Counter;
  this._private.nodeCounter = new pulse.debug.Counter;
  this.panel = null;
  this.setupPanel()
}, logWarning:function(text) {
  this.panel.logMessage(text, "warning")
}, logDebug:function(text) {
  this.panel.logMessage(text, "debug")
}, logError:function(text) {
  this.panel.logMessage(text, "error")
}, markTime:function(timer) {
  if(!this.timers[timer]) {
    this.timers[timer] = new pulse.debug.DebugTimer({name:timer});
    this.timers[timer].start()
  }else {
    this.timers[timer].mark()
  }
}, markFPS:function() {
  this._private.fpsTimer.mark();
  this.fps = this._private.fpsTimer.fps
}, startUpdate:function() {
  this._private.updateTimer.start()
}, stopUpdate:function() {
  this._private.updateTimer.mark();
  this.panel.gameUpdated()
}, startDraw:function() {
  this._private.drawTimer.start()
}, stopDraw:function() {
  this._private.drawTimer.mark()
}, resetDraws:function() {
  this._private.drawCounter.reset()
}, incrementDraws:function() {
  this._private.drawCounter.increment()
}, resetNodes:function() {
  this._private.nodeCounter.reset()
}, addNode:function(node) {
  this._private.nodeCounter.increment();
  this.panel.addNode(node)
}, removeNode:function(node) {
  this._private.nodeCounter.decrement();
  this.panel.removeNode(node)
}, setEngine:function(engine) {
  this.panel.setEngine(engine)
}, setupPanel:function() {
  this.panel = new pulse.debug.Panel({fpsTimer:this._private.fpsTimer, updateTimer:this._private.updateTimer, drawTimer:this._private.drawTimer, drawCounter:this._private.drawCounter, nodeCounter:this._private.nodeCounter})
}, update:function(elapsed) {
  this.panel.update(elapsed)
}});
pulse.debug.visualDebug = false;
pulse.ready(function() {
  pulse.debug.manager = new pulse.debug.DebugManager
});
pulse.debug.plugin = new pulse.plugin.Plugin;
var loopCallback = pulse.debug.plugin.subscribe("pulse.Engine", "loop", pulse.plugin.PluginCallbackTypes.onEnter, function(params) {
  pulse.debug.manager.setEngine(this);
  pulse.debug.plugin.unsubscribe(loopCallback)
});
pulse.debug.plugin.subscribe("pulse.Engine", "update", pulse.plugin.PluginCallbackTypes.onEnter, function(params) {
  pulse.debug.manager.startUpdate()
});
pulse.debug.plugin.subscribe("pulse.Engine", "update", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.stopUpdate()
});
pulse.debug.plugin.subscribe("pulse.Engine", "draw", pulse.plugin.PluginCallbackTypes.onEnter, function(params) {
  pulse.debug.manager.markFPS();
  pulse.debug.manager.resetDraws();
  pulse.debug.manager.startDraw()
});
pulse.debug.plugin.subscribe("pulse.Engine", "draw", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.stopDraw();
  pulse.debug.manager.update(this.masterTime)
});
pulse.debug.plugin.subscribe("pulse.Visual", "update", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.stopUpdate();
  if(this.debugDrawn === undefined) {
    this.debugDrawn = false
  }
  if((this.debugging === true || pulse.debug.visualDebug === true) && this.debugDrawn === false || this.debugging === false && pulse.debug.visualDebug === false && this.debugDrawn === true) {
    this.updated = true
  }
});
pulse.debug.plugin.subscribe("pulse.Visual", "draw", pulse.plugin.PluginCallbackTypes.onEnter, function(ctx) {
  if(this.updated === true) {
    if(this.debugging === true || pulse.debug.visualDebug === true) {
      this.debugDrawn = false
    }
    pulse.debug.manager.incrementDraws()
  }
});
pulse.debug.plugin.subscribe("pulse.Visual", "draw", pulse.plugin.PluginCallbackTypes.onExit, function(ctx) {
  if((this.debugging === true || pulse.debug.visualDebug === true) && this.debugDrawn === false) {
    var color = "#" + pulse.debug.getTypeColor(this);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.positionTopLeft.x + this.canvas.width / 2, this.positionTopLeft.y + this.canvas.height / 2, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.strokeRect(this.positionTopLeft.x / Math.abs(this.scale.x), this.positionTopLeft.y / Math.abs(this.scale.y), this.size.width, this.size.height);
    this.debugDrawn = true
  }else {
    if(this.debugDrawn === true) {
      this.debugDrawn = false
    }
  }
});
pulse.debug.plugin.subscribe("pulse.Layer", "addNode", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.addNode(params)
});
pulse.debug.plugin.subscribe("pulse.Layer", "removeNode", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.removeNode(params)
});
pulse.debug.plugin.subscribe("pulse.Scene", "addLayer", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.addNode(params)
});
pulse.debug.plugin.subscribe("pulse.Scene", "removeLayer", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.removeNode(params)
});
pulse.debug.plugin.subscribe("pulse.SceneManager", "addScene", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.addNode(params)
});
pulse.debug.plugin.subscribe("pulse.SceneManager", "removeScene", pulse.plugin.PluginCallbackTypes.onExit, function(params) {
  pulse.debug.manager.removeNode(params)
});
pulse.plugins.add(pulse.debug.plugin);
pulse.log = function(message, type) {
  if(type === "error") {
    pulse.debug.manager.logError(message)
  }else {
    if(type === "warning") {
      pulse.debug.manager.logWarning(message)
    }else {
      pulse.debug.manager.logDebug(message)
    }
  }
};
pulse.info = function(message) {
  pulse.debug.manager.logDebug(message)
};
pulse.warn = function(message) {
  pulse.debug.manager.logWarning(message)
};
pulse.error = function(message) {
  pulse.debug.manager.logError(message)
};

