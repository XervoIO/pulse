/**
 * Copyright 2011 Paranoid Ferret Productions
 *
 * @static
 * Static error throwing functions.
 * @author PFP
 */
PFPlay.error = {
  
  /**
   * Throws a duplicate name error.
   */
  DuplicateName: function(name) {
    throw 'There is already an object with the name ' + name +
      ' on this layer.';
  }
};
