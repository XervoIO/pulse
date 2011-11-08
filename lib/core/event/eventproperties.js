/**
 * Simple class for holding properties for a mouse event
 * @class Mouse event properties
 * @author PFP
 * @constructor
 * @copyright 2011 Paranoid Ferret Productions
 */
PFPlay.MouseEvent = function() {};

/**
 * Event position relative to the entire html window.
 * @type {point}
 * @field
 */
PFPlay.MouseEvent.prototype.window = function() {};
PFPlay.MouseEvent.prototype.window.prototype.x = 0;
PFPlay.MouseEvent.prototype.window.prototype.y = 0;

/**
 * Event position relative to the game window.
 * @type {point}
 * @field
 */
PFPlay.MouseEvent.prototype.world = function() {};
PFPlay.MouseEvent.prototype.world.prototype.x = 0;
PFPlay.MouseEvent.prototype.world.prototype.y = 0;

/**
 * Event position relative to the parent of object which the event was
 * raised from.
 * @type {point}
 * @field
 */
PFPlay.MouseEvent.prototype.parent = function() {};
PFPlay.MouseEvent.prototype.parent.prototype.x = 0;
PFPlay.MouseEvent.prototype.parent.prototype.y = 0;

/**
 * Event position relative to the object in which the event was raised from.
 * @type {point}
 * @field
 */
PFPlay.MouseEvent.prototype.position = function() {};
PFPlay.MouseEvent.prototype.position.prototype.x = 0;
PFPlay.MouseEvent.prototype.position.prototype.y = 0;