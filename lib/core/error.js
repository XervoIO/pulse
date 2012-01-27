/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Static error throwing functions.
 * @static
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */
pulse.error = {

  /**
   * Throws a duplicate name error.
   */
  DuplicateName: function(name) {
    throw 'There is already an object with the name ' + name +
      ' on this layer.';
  }
};
