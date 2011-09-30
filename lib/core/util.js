/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * @author Richard Key
 * Some basic utilities, for global use.
 */

/** This just checks a variable and sets it to
 * a default value if the variable is null.
 * @param {object} variable the variable to check
 * @param {object} vDefault the default value
 */
function CheckValue(variable, vDefault)
{
  if(variable == null)
    variable = vDefault;
    
  return variable;
}

/** This checks a given object for the existence of
 * a property. If it does not exist, it creates it and
 * sets it to the default value.
 * @param {object} obj the object
 * @param {string} prop the property
 * @param {object} propDefault the default value
 */
function CheckProperty(obj, prop, propDefault)
{
  if(typeof obj == 'undefined')
    obj = {};
  
  if(!obj.hasOwnProperty(prop))
    obj[prop] = propDefault;
    
  return obj;
}

/** A simple two value object. Used for positioning and size.
 * @param {number} pX the horizontal value
 * @param {number} pY the vertical value
 */
function Point(pX, pY)
{
  this.x = pX;
  this.y = pY;
}
