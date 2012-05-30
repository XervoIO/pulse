/**
 * Defines the debug namespaces.
 * @namespace debug
 */
pulse.debug = pulse.debug || {};

/**
 * Defines the debug namespaces.
 * @namespace debug.tabs
 */
pulse.debug.tabs = pulse.debug.tabs || {};

/**
* Gets the debug color scheme for a node's type
* @param {pulse.Node} node the node
*/
pulse.debug.getTypeColor = function(node) {
	if(node instanceof pulse.Scene) {
		return '248A8A';
	} else if(node instanceof pulse.Layer) {
		return 'F2572A';
	} else if(node instanceof pulse.Sprite) {
		return 'F9E555';
	} else if(node instanceof pulse.CanvasLabel) {
		return 'FAAC38';
	} else if(node instanceof pulse.BitmapLabel) {
		return 'C9FA58';
	} else {
		return 'CCCCCC';
	}
};