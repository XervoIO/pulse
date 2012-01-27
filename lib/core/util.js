/**
 * @fileoverview Useful global utility functions.
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

/**
 * Namespace declaration if needed.
 * @namespace
 */
var pulse = pulse || {};

/**
 * Utility namespace declaration if needed. Holds basic utilities for
 * global use.
 * @namespace
 */
pulse.util = pulse.util || {};

/**
 * Finds an object or function by name by searching through items in collection.
 * @param  {array|object} collection The array or object to search through
 * @param  {string} name The name of the object or function to find
 * @return {array} A collection of matching objects or functions
 * @static
 */
pulse.util.find = function(collection, name)
{
  var found = [];

  if(collection instanceof Array)
  {
    for(var o = 0; o < collection.length; o++)
    {
      if(typeof collection[o] == 'function' &&
         typeof collection[o].name == 'function' &&
         collection[o].name == name)
      {
        found.push(collection[o]);
      }
    }
  }
  else if(typeof collection  == 'object')
  {
    for(var ob in collection)
    {
      if(ob == name)
      {
        found.push(collection[ob]);
      }
    }
  }

  return found;
};

/**
 * Checks if two rectangles overlap at all.
 * @param  {object} box1 The first rectangle to compare
 * @config {number} x The x position of the first rectangle
 * @config {number} y The y position of the first rectangle
 * @config {number} width The width of the first rectangle
 * @config {number} height The height of the first rectangle
 * @param  {object} box2 The second rectangle to compare
 * @config {number} x The x position of the second rectangle
 * @config {number} y The y position of the second rectangle
 * @config {number} width The width of the second rectangle
 * @config {number} height The height of the second rectangle
 * @return {boolean} Whether or not the two rectangles are overlapping at all
 * @static
 */
pulse.util.intersects = function(box1, box2)
{
  var points = [
    {x: box1.x, y: box1.y},
    {x: box1.x, y: box1.y + box1.height},
    {x: box1.x + box1.width, y: box1.y},
    {x: box1.x + box1.width, y: box1.y + box1.height}
  ];

  /** Loop through each point and determine if it
   * falls within the other box's footprint. */
  for(var p = 0; p < 4; p++)
  {
    var pnt = points[p];
    if(pnt.x < box2.width && pnt.x > box2.x)
    {
      if(pnt.y < box2.height && pnt.y > box2.y)
      {
        return true;
      }
    }
  }

  return false;
};

/**
 * This just checks a variable and sets it to
 * a default value if the variable is null.
 * @param {object} variable the variable to check
 * @param {object} vDefault the default value
 * @static
 */
pulse.util.checkValue = function(variable, vDefault)
{
  if(variable === null) {
    variable = vDefault;
  }
  return variable;
};

/** This checks a given object for the existence of
 * a property. If it does not exist, it creates it and
 * sets it to the default value.
 * @param {object} obj the object
 * @param {string} prop the property
 * @param {object} propDefault the default value
 * @static
 */
pulse.util.checkProperty = function(obj, prop, propDefault)
{
  if(typeof obj == 'undefined')
  {
    obj = {};
  }

  if(!obj.hasOwnProperty(prop) || obj[prop] === null)
  {
    obj[prop] = propDefault;
  }

  return obj;
};

/**
 * Checks if the properties of the params object are set based on the defaults
 * object passed in.
 * @param  {object} params The object to check the properties on
 * @param  {object} defaults The default values and properties to check against
 * @return {object} Updated params object with defaults set if needed
 * @static
 */
pulse.util.checkParams = function(params, defaults)
{
  if(typeof params == 'undefined' ||
     params === null ||
     typeof params != 'object')
  {
    params = {};
  }

  for(var p in defaults)
  {
    if(!params.hasOwnProperty(p) || params[p] === null)
    {
      params[p] = defaults[p];
    }
  }

  return params;
};

/**
 * Calculates the length of object based on number of properties it has
 * @param  {object} obj The object to calculate length of
 * @return {number} The number of properties the object has
 * @static
 */
pulse.util.getLength = function(obj)
{
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key))
    {
      size++;
    }
  }
  return size;
};

/**
 * Compares the zindex property of the objects passed in deciding which is
 * higher.
 * @param  {object} objA The first object to compare
 * @config {number} zindex The zindex of the first object
 * @param  {object} objB The second object to compare
 * @config {number} zindex The zindex of the second objects
 * @return {number} 0 if they are equal, 1 if objA is higher and -1 if objB is
 * @static
 */
pulse.util.compareZIndexes = function(objA, objB)
{
  var za = 0;
  if(objA.hasOwnProperty('zindex'))
  {
    za = objA.zindex;
  }

  var zb = 0;
  if(objB.hasOwnProperty('zindex'))
  {
    zb = objB.zindex;
  }

  if(za < zb)
  {
    return -1;
  }

  if(za > zb)
  {
    return 1;
  }

  return 0;
};

/**
 * Calculates the z order or a collection of object based on their zindex
 * property.
 * @param  {object} objects The collection (associative array) of objects
 * to compare
 * @return {array} An array of the keys of the objects collection in order
 * @static
 */
pulse.util.getOrderedKeys = function(objects)
{
  var ordered = [];

  for(var o in objects)
  {
    if(objects[o].hasOwnProperty('name'))
    {
      ordered.push(objects[o]);
    }
  }

  ordered.sort(pulse.util.compareZIndexes);

  var keys = [];

  for(var ov = 0; ov < ordered.length; ov++) {
    keys.push(ordered[ov].name);
  }

  return keys;
};

/**
 * Creates an HTML IFrame and attaches it to the DOM of the HTML document by
 * adding it as a child to the passed in parent element.
 * @param  {DOMElement} [parentElement] Parent element to add the IFrame to, if
 * none is passed in it's added to the document's body
 * @return {IFrame} The IFrame element created and added to the HTML document
 * @static
 */
pulse.util.getIFrame = function(parentElement)
{
  // Create the iframe which will be returned
  var iframe = document.createElement("iframe");

  // If no parent element is specified then use body as the parent element
  if(parentElement === null) {
    parentElement = document.body;
  }

  // This is necessary in order to initialize the document inside the iframe
  parentElement.appendChild(iframe);

  // Initiate the iframe's document to null
  iframe.doc = null;

  // Depending on browser platform get the iframe's document, this is only
  // available if the iframe has already been appended to an element which
  // has been added to the document
  if(iframe.contentDocument)
  {
    // Firefox, Opera
    iframe.doc = iframe.contentDocument;
  }
  else if(iframe.contentWindow)
  {
    // Internet Explorer
    iframe.doc = iframe.contentWindow.document;
  }
  else if(iframe.document)
  {
    // Others?
    iframe.doc = iframe.document;
  }

  // If we did not succeed in finding the document then throw an exception
  if(iframe.doc === null)
  {
    throw "Document not found, append the parent element to the DOM before creating the IFrame";
  }

  // Create the script inside the iframe's document which will call the
  iframe.doc.open();
  iframe.doc.close();

  // Return the iframe, now with an extra property iframe.doc containing the
  // iframe's document
  return iframe;
};