/**
 * Inspector tab for debugging panel.
 * @class The debug inspector tab class
 * @param {object} [params] parameters that can be set as initialized options
 * on the performance tab
 * @config {string} [name] the name of the tab will be used for name of link
 * @config {string} [icon] the icon url to use as image for the tab, should be
 * 45x90 with off state on top (45x45) and on state on bottom (45x45)
 * @config {string} [id] the machine readable id for the tab
 * @author PFP
 * @copyright 2012 Modulus
 */

pulse.debug.tabs.Inspector = pulse.debug.PanelTab.extend(
/** @lends pulse.debug.tabs.PerformanceTab.prototype */
{
  /** @constructs */
  init : function (params) {
    this._super(params);

    /**
     * The node that is currently being inspected.
     * @type {pulse.Node}
     */
    this.selectedNode = null;

    /**
     * @private
     * The list of nodes in the game being inspected.
     * @type {DOMElement}
     */
    this._private.nodeList = document.createElement('div');
    this._private.nodeList.style.cssText = 'overflow: auto; ' +
      'width: 70%; height: 120px; float: left; padding: 5px 0;';
    this.container.appendChild(this._private.nodeList);

    /**
     * @private
     * The list of properties for the selected node.
     * @type {DOMElement}
     */
    this._private.nodePropsDiv = document.createElement('div');
    this._private.nodePropsDiv.style.cssText = 'overflow: auto;' +
      'width: 30%; height: 130px; float: right; padding: 5px 0; background: #3C3C3C';
    this.container.appendChild(this._private.nodePropsDiv);

    var _self = this;

    /**
     * @private
     * The actions available for the selected node.
     * @type {DOMElement}
     */
    var actionsDiv = document.createElement('div');
    actionsDiv.id = 'inspector-node-actions';
    actionsDiv.style.cssText = 'float: right;';

    /**
     * Button to toggle visibilty of the selected node.
     * @type {DOMElement}
     */
    this.visibilityAction = document.createElement('a');
    this.visibilityAction.innerHTML = 'HIDE';
    this.visibilityAction.href = '#';
    this.visibilityAction.style.cssText = 'float: left; margin: 0 5px; font-size: 12px; height: 16px; line-height: 16px; padding: 2px 6px; text-decoration: none; color: #EEE; display:block; border-radius: 3px; border: 1px solid #888; background: #666;';
    this.visibilityAction.onclick = function() {
      if(_self.selectedNode) {
        _self.toggleNode(_self.selectedNode);
      }
      return false;
    };
    actionsDiv.appendChild(this.visibilityAction);

    /**
     * Button to toggle drawing the outline and anchor point
     * on the selected node.
     * @type {DOMElement}
     */
    this.outlineAction = document.createElement('a');
    this.outlineAction.innerHTML = 'OUTLINE';
    this.outlineAction.href = '#';
    this.outlineAction.style.cssText = 'float: left; margin: 0 5px; font-size: 12px; height: 16px; line-height: 16px; padding: 2px 6px; text-decoration: none; color: #EEE; display:block; border-radius: 3px; border: 1px solid #888; background: #666;';
    this.outlineAction.onclick = function() {
      if(_self.selectedNode) {
        _self.toggleDebug(_self.selectedNode);
      }
      return false;
    };
    actionsDiv.appendChild(this.outlineAction);

    this._private.nodePropsDiv.appendChild(actionsDiv);

    /**
     * @private
     * The properties to show for the selected node.
     * @type {array}
     */
    this._private.nodeProps = ['Name', 'Size', 'Position', 'Anchor', 'ZIndex'];

    //Build the containers for the properites.
    var propDiv, propName, valueSpan;
    for(var p in this._private.nodeProps) {
      propName = this._private.nodeProps[p];
      propDiv = document.createElement('div');
      propDiv.id = 'inspector-props-' + propName.toLowerCase();
      propDiv.style.cssText = 'padding: 2px 10px; color: #AAA;';
      propDiv.innerHTML = propName + ': ';

      valueSpan = document.createElement('span');
      valueSpan.id = 'inspector-prop-' + propName.toLowerCase() + '-value';
      valueSpan.style.cssText = 'color: #CCC;';

      propDiv.appendChild(valueSpan);
      this._private.nodePropsDiv.appendChild(propDiv);
    }

    /**
     * @private
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
    //If the selected node has been updated, update the properties by reselecting it
    if(this.selectedNode instanceof pulse.Visual && this.selectedNode.updated === true) {
      this.selectNode(this.selectedNode);
    }
  },

  /**
   * Set the engine to use for getting game information.
   * @param {pulse.Engine} engine the engine used in the current game.
   */
  setEngine : function(engine) {
    this._private.engine = engine;

    //Set the visiblity styling for all active scenes
    //as they are always added in an unactive state.
    var scenes = engine.scenes.getScenes(true);
    for(var s = 0; s < scenes.length; s++)
    {
      this.styleVisibility(scenes[s]);
    }
  },

  /**
   * Builds and returns all the necessary HTML for a node in
   * node list.
   * @param {pulse.Node} node the node being referenced
   * @param {boolean} addContainer whether or not to add a container
   * for the node's children.
   * @param {number} containerIndent the number of pixels to indent
   * the child container.
   */
  getNodeDiv : function(node, addContainer, containerIndent) {
    var nodeDiv = document.createElement('div');
    nodeDiv.id = 'inspector-node-' + node.name;
    nodeDiv.style.cssText = 'padding: 0 2px;';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.style.cssText = 'cursor: pointer; padding: 2px;';
    nameSpan.innerHTML = node.name;

    var _self = this;

    nameSpan.onclick = function() {
      _self.selectNode(node);
    };

    var container = null;
    if(addContainer === true) {
      container = document.createElement('div');
      container.id = 'inspector-' + node.name + '-children';
      container.style.marginLeft = containerIndent + 'px';
      container.style.display = 'none';

      var containerToggle = document.createElement('div');
      containerToggle.style.cssText =
        'display: inline-block; width: 20px; height: 20px; ' +
        'font-size: 14px; cursor: pointer;';

      containerToggle.onclick = function() {
        _self.toggleVisibility(container);
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
        _self.selectNode(node);
      };
    } else {
      nodeDiv.appendChild(nameSpan);
    }

    return { div: nodeDiv, container: container };
  },

  /**
   * Adds a node to the node listing.
   * @param {pulse.Node} node the node to reference
   */
  addNode : function(node) {
    node.debugging = false;

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
      divTmp = this.getNodeDiv(node, true, 30);
      parentElm.appendChild(divTmp.div);

      for(var o in node.objects) {
        this.addNode(node.objects[o]);
      }

    } else if(parentElm !== null) {
      divTmp = this.getNodeDiv(node, false);
      parentElm.appendChild(divTmp.div);
    }

    this.styleVisibility(node);
  },

  /**
   * Removes a node from the listing
   * @param {pulse.Node} node the node to remove
   */
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

  /**
   * Selects a node to inspect.
   * @param {pulse.Node} node the node to inspect
   */
  selectNode : function(node) {
    var nodeDiv;
    if(this.selectedNode !== null) {
      nodeDiv = document.getElementById('inspector-node-' + this.selectedNode.name);
      if(nodeDiv !== null) {
        var childu = nodeDiv.children[0];
        if(nodeDiv.children[0].className !== 'name') {
          childu = nodeDiv.children[1];
        }
        childu.style.color = nodeDiv.style.color;
        childu.style.background = 'transparent';
      }
    }

    this.selectedNode = node;

    nodeDiv = document.getElementById('inspector-node-' + node.name);
    if(nodeDiv !== null) {
      var childs = nodeDiv.children[0];
      if(nodeDiv.children[0].className !== 'name') {
        childs = nodeDiv.children[1];
      }
      childs.style.background = nodeDiv.style.color;
      childs.style.color = '#222';
    }

    //Check each property and display the value(s) if the
    //node has that property.
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

    // Update Visibility Button
    if(node.visible === true || node.active === true) {
      this.visibilityAction.innerHTML = 'HIDE';
    } else {
      this.visibilityAction.innerHTML = 'SHOW';
    }

    if(node instanceof pulse.Scene) {
      this.outlineAction.style.display = 'none';
    } else {
      this.outlineAction.style.display = 'block';
    }

    // Update Outline Button
    if(node.debugging) {
      this.outlineAction.style.cssText += "background: #444;";
    } else {
      this.outlineAction.style.cssText += "background: #666;";
    }
  },

  /**
   * Toggles the visibility (or activity for scenes) of a node.
   * @param {pulse.Node} node the node to show/hide
   */
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

    this.styleVisibility(node);

    //Forces a redraw of the selection styling
    this.selectNode(node);
  },

  /**
   * Styles the node's HTML in the node list based on its
   * visibility.
   * @param {pulse.Node} node the node being referenced
   */
  styleVisibility : function(node) {
    var nodeDiv = document.getElementById('inspector-node-' + node.name);

    if(nodeDiv !== null) {
      var color =  pulse.debug.getTypeColor(node);
      if(node.visible === false || node.active === false) {
        color = this.disableColor(color);
      }
      nodeDiv.highlightColor = '#' + color;
      nodeDiv.style.color = '#' + color;
    }
  },

  /**
   * Toggles whether or not to draw debugging information
   * on a visual node. This function will do nothing for scenes.
   * @param {pulse.Node} node the node to toggle
   */
  toggleDebug : function(node) {
    if(node.debugging === true) {
      node.debugging = false;
    } else {
      node.debugging = true;
    }

    //Forces a redraw of the selection styling
    this.selectNode(node);
  },

  /**
   * Shows/Hides a DOM element.
   * @param {DOMElement} elm the element to show/hide
   */
  toggleVisibility : function(elm) {
    if(elm.style.display !== 'none') {
      elm.style.display = 'none';
    } else {
      elm.style.display = 'block';
    }
  },

  /**
   * Gets a string concatenation of the values in an object
   * or a string representation of an object's value.
   * @param {object} object the object to get a value string for
   */
  getValueString : function(object) {
    var value = '';
    if(typeof object === 'object') {
      for(var a in object) {
        value += this.getValueString(object[a]) + ', ';
      }

      value = value.substring(0, value.length - 2);
    } else if(typeof object === 'number') {
      value += object.toFixed(2);
    } else {
      value += object;
    }

    return value;
  },

  /**
   * Shifts a color slightly darker
   * http://stackoverflow.com/questions/3403882/javascript-one-shade-darker
   * @param {string} color the color to shift
   */
  disableColor : function(color) {
    var colorInt = parseInt(color, 16);

    var R = (colorInt & 0xFF0000) >> 16;
    var G = (colorInt & 0x00FF00) >> 8;
    var B = (colorInt & 0x0000FF) >> 0;

    //Controls on much darker to make the color
    var shade = -100;

    R = R + Math.floor((shade / 255) * R);
    G = G + Math.floor((shade / 255) * G);
    B = B + Math.floor((shade / 255) * B);

    var newColorInt = (R << 16) + (G << 8) + (B);

    return newColorInt.toString(16);
  },

  /**
   * Resizes the node list and properties container when the panel is resized.
   * @param {number} newSize the new size of the container
   */
  resize : function(newSize) {
    this._private.nodeList.style.height = newSize + 'px';
    this._private.nodePropsDiv.style.height = newSize + 'px';
  }
});