/**
 * @author Neo
 */

function CheckProperty(obj, prop, propDefault)
{
  if(!obj.hasOwnProperty(prop))
    obj[prop] = propDefault;
}
