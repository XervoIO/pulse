/**
 * Performance tab for debugging panel.
 * @class The debug performance tab class
 * @param {object} [params] parameters that can be set as initialized options
 * on the performance tab
 * @config {string} [name] the name of the tab will be used for name of link
 * @config {string} [icon] the icon url to use as image for the tab, should be
 * 45x90 with off state on top (45x45) and on state on bottom (45x45)
 * @config {string} [id] the machine readable id for the tab
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.debug.tabs.Inspector = pulse.debug.PanelTab.extend(
/** @lends pulse.debug.PerformanceTab.prototype */
{
  /** @constructs */
  init : function (params) {
    this._super(params);

    this.selectedNode = null;

    this._private = {};

    this._private.nodeList = document.createElement('div');
    this._private.nodeList.style.cssText = 'overflow: auto;';
    this._private.nodeList.style.width = '70%';
    this._private.nodeList.style.height = '130px';
    this._private.nodeList.style.cssFloat = 'left';
    this._private.nodeList.style.styleFloat = 'left';
    //this._private.nodeList.style.clear = 'both';
    this.container.appendChild(this._private.nodeList);

    this._private.nodePropsDiv = document.createElement('div');
    this._private.nodePropsDiv.style.width = '30%';
    this._private.nodePropsDiv.style.height = '100%';
    this._private.nodePropsDiv.style.cssFloat = 'right';
    this._private.nodePropsDiv.style.styleFloat = 'right';
    //this._private.nodePropsDiv.style.clear = 'both';

    var iTab = this;

    var actionsDiv = document.createElement('div');
    actionsDiv.id = 'inspector-node-actions';

    var visibilityAction = document.createElement('a');
    visibilityAction.innerHTML = 'Show/Hide';
    visibilityAction.onclick = function() {
        iTab.toggleNode(iTab.selectedNode);
    };
    actionsDiv.appendChild(visibilityAction);

    var outlineAction = document.createElement('a');
    outlineAction.innerHTML = 'Outline';
    outlineAction.onclick = function() {
        iTab.toggleDebug(iTab.selectedNode);
    };
    actionsDiv.appendChild(outlineAction);

    this._private.nodePropsDiv.appendChild(actionsDiv);

    this._private.nodeProps = ['Name', 'Size', 'Position', 'Anchor', 'ZIndex'];

    var propDiv, propName, valueSpan;
    for(var p in this._private.nodeProps) {
      propName = this._private.nodeProps[p];
      propDiv = document.createElement('div');
      propDiv.id = 'inspector-props-' + propName.toLowerCase();
      propDiv.innerHTML = propName + ': ';

      valueSpan = document.createElement('span');
      valueSpan.id = 'inspector-prop-' + propName.toLowerCase() + '-value';

      propDiv.appendChild(valueSpan);
      this._private.nodePropsDiv.appendChild(propDiv);
    }

    this.container.appendChild(this._private.nodePropsDiv);

    /**
     * The engine for the current game
     * @type {pulse.Engine}
     */
    this._private.engine = null;
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
    
  },

  /**
   * Updates the graph to show the frame elapsed time, update time, and
   * draw time. It will also update the labels to show the actual values.
   */
  setEngine : function(engine) {
    this._private.engine = engine;
    //this.setupNodes();
  },

  setupNodes : function() {
    if(this._private.engine === null) {
      return;
    }

    var scenes = this._private.engine.scenes.getScenes(false);
    var sceneTmp, layerTmp, nodeTmp;
    var tab =  this;
    for(var s in scenes) {
      this.addNode(scenes[s]);
    }

    if(scenes.length > 0) {
      this.selectNode(scenes[0]);
    }
  },

  getNodeDiv : function(node, addContainer, containerIndent) {
    var nodeDiv = document.createElement('div');
    nodeDiv.id = 'inspector-node-' + node.name;

    var nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.innerHTML = node.name;

    nameSpan.onclick = function() {
      iTab.selectNode(node);
    };
    
    var iTab = this;
    var container = null;
    if(addContainer === true) {
      container = document.createElement('div');
      container.id = 'inspector-' + node.name + '-children';
      container.style.marginLeft = containerIndent + 'px';
      container.style.display = 'none';

      var containerToggle = document.createElement('div');
      containerToggle.style.cssText = 'display: inline-block; width: 20px; height: 20px; font-size: 14px; cursor: pointer;';

      containerToggle.onclick = function() {
        iTab.toggleVisibility(container);
        if(container.style.display === 'block') {
          containerToggle.innerHTML = '&#9660;';
        } else {
          containerToggle.innerHTML = '&#9658;';
        }
      };

      containerToggle.innerHTML = '&#9658;';

      nodeDiv.appendChild(containerToggle);
      nodeDiv.appendChild(nameSpan);
      nodeDiv.appendChild(container);

      nameSpan.onclick = function() {
        iTab.selectNode(node);
      }; 
    } else {
      nodeDiv.appendChild(nameSpan);
    }

    return { div: nodeDiv, container: container };
  },

  addNode : function(node) {
    var parentElm = null;
    if(node.parent !== null) {
      parentElm = document.getElementById('inspector-' + node.parent.name + '-children');
    }

    var divTmp = null;
    if(node instanceof pulse.Scene) {
      divTmp = this.getNodeDiv(node, true, 10);
      this._private.nodeList.appendChild(divTmp.div);

      for(var l in node.layers) {
        this.addNode(node.layers[l]);
      }
    } else if(node instanceof pulse.Layer && parentElm !== null) {
      divTmp = this.getNodeDiv(node, true, 20);
      parentElm.appendChild(divTmp.div);

      for(var o in node.objects) {
        this.addNode(node.objects[o]);
      }

    } else if(parentElm !== null) {
      divTmp = this.getNodeDiv(node, false);
      parentElm.appendChild(divTmp.div);
    }
  },

  removeNode : function(node) {
    var nodeName = node;
    if(node instanceof pulse.Node) {
      nodeName = node.name;
    }

    var nodeDiv = document.getElementById('inspector-node-' + nodeName);
    if(nodeDiv !== null) {
      nodeDiv.parentNode.removeChild(nodeDiv);
    }
  },

  selectNode : function(node) {
    this.selectedNode = node;

    var propName, propValueSpan;
    for(var p in this._private.nodeProps) {
      propName = this._private.nodeProps[p];
      propValueSpan = document.getElementById('inspector-prop-' + propName.toLowerCase() + '-value');
      if(propValueSpan !== null) {
        if(node.hasOwnProperty(propName.toLowerCase())) {
          propValueSpan.innerHTML = this.getValueString(node[propName.toLowerCase()]);
        } else {
          propValueSpan.innerHTML = 'N/A';
        }
      }
    }
  },

  toggleNode : function(node) {
    if(node instanceof pulse.Scene && this._private.engine instanceof pulse.Engine) {
      if(node.active === true) {
        this._private.engine.scenes.deactivateScene(node.name);
      } else {
        this._private.engine.scenes.activateScene(node.name);
      }
    }

    if(node instanceof pulse.Visual) {
      if(node.visible === true) {
        node.visible = false;
      } else {
        node.visible = true;
      }
    }
  },

  toggleDebug : function(node) {
    if(node.debugging === true) {
        node.debugging = false;
      } else {
        node.debugging = true;
      }
  },

  toggleVisibility : function(elm) {
    if(elm.style.display !== 'none') {
      elm.style.display = 'none';
    } else {
      elm.style.display = 'block';
    }
  },

  getValueString : function(object) {
    var value = '';
    if(typeof object === 'object') {
      for(var a in object) {
        value += this.getValueString(object[a]) + ',';
      }

      value = value.substring(0, value.length - 1);
    } else if(typeof object === 'number') {
      value += object.toFixed(2);
    } else {
      value += object;
    }

    return value;
  }
});