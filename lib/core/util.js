/**
 * @author Neo
 */

/** This checks a given object for the existence of
 * a property. If it does not exist, it creates it and
 * sets it to the default value.
 * @param {object} obj the object
 * @param {string} prop the property
 * @param {object} propDefault the default value
 */
function CheckProperty(obj, prop, propDefault)
{
  if(!obj.hasOwnProperty(prop))
    obj[prop] = propDefault;
}
