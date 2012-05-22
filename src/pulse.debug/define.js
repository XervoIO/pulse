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
		return 'FF00FF';
	} else if(node instanceof pulse.Layer) {
		return '808080';
	} else if(node instanceof pulse.Sprite) {
		return '800080';
	} else if(node instanceof pulse.CanvasLabel) {
		return 'FF0000';
	} else if(node instanceof pulse.BitmapLabel) {
		return 'FFFF00';
	} else {
		return '000000';
	}
};