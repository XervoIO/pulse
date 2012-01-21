/**
 * Some basic utilities, for global use.
 * @author PFP
 * @copyright 2011 Paranoid Ferret Productions
 */

pulse.util =
{
  /**
   * Searches an array for object or function by name.
   * @param  {Array} collection The array to search in
   * @param  {string} name The name of the object to search for.
   * @return {Array} Collection of found objects.
   */
  find: function(collection, name)
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
      for(var obj in collection)
      {
        if(obj == name)
          found.push(collection[obj]);
      }
    }
    
    return found;
  },
  
  /**
   * Check's if two rectangles intersect each other.
   * @param  {object} box1 The first rectangle to compare.
   * @param  {object} box2 The second rectangle to check.
   * @return {boolean} Whether the two rectangles intersect each other.
   */
  intersects: function(box1, box2)
  {
    var points = [
      {x: box1.x, y: box1.y},
      {x: box1.x, y: box1.y + box1.height},
      {x: box1.x + box1.width, y: box1.y},
      {x: box1.x + box1.width, y: box1.y + box1.height}
    ];
    
    // Loop through each point and determine if it falls within the
    // other box's footprint.
    for(var p = 0; p < 4; p++)
    {
      var pnt = points[p];
      if(pnt.x < box2.width && pnt.x > box2.x)
      {
        if(pnt.y < box2.height && pnt.y > box2.y)
          return true;
      }
    }
    
    return false;
  },
  
  /**
   * Compares two points to see if they are the same.
   * @param  {Point} obj1 The first point to compare.
   * @param  {Point} obj2 The second point to compare.
   * @return {boolean} Returns true if the points are equal.
   */
  compare: function(obj1, obj2)
  {
    if(obj1 instanceof Point && obj2 instanceof Point)
    {
      if(obj1.x == obj2.x && obj1.y == obj2.y)
        return true;
      else
        return false;
    }
  },
  
  /**
   * This just checks a variable and sets it to
   * a default value if the variable is null.
   * @param {object} variable the variable to check
   * @param {object} vDefault the default value
   */
  checkValue: function(variable, vDefault)
  {
    if(variable === null)
      variable = vDefault;
      
    return variable;
  },
  
  /** This checks a given object for the existence of
   * a property. If it does not exist, it creates it and
   * sets it to the default value.
   * @param {object} obj the object
   * @param {string} prop the property
   * @param {object} propDefault the default value
   */
  checkProperty: function(obj, prop, propDefault)
  {
    if(typeof obj == 'undefined')
      obj = {};
    
    if(!obj.hasOwnProperty(prop) || obj[prop] === null)
      obj[prop] = propDefault;
      
    return obj;
  },
  
  /**
   * Checks a object for defaulted properties and if they don't exist will set
   * them to the passed in defaults.
   * @param  {object} params The parameters object to check.
   * @param  {object} defaults The parameter defaults to compare against.
   * @return {object} The defaulted parameters object.
   */
  checkParams: function(params, defaults)
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
        params[p] = defaults[p];
    }
    
    return params;
  },
  
  /**
   * Gets the length of the an object by counting the number of properties.
   * @param  {object} obj The object to get the length for.
   * @return {number} The number of properties on object.
   */
  getLength: function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  },
  
  /**
   * Compares two objects with a zindex property to find out which is higher.
   * @param  {object} objA The first object to compare
   * @param  {object} objB The second object to compare
   * @return {number} Return 1 if objA has a higher zindex, -1 if objB does and
   * 0 if they are equal.
   */
  compareZIndexes: function(objA, objB)
  {
    za = 0;
    if(objA.hasOwnProperty('zindex'))
        za = objA.zindex;
        
    zb = 0;
    if(objB.hasOwnProperty('zindex'))
        zb = objB.zindex;
    
    if(za < zb)
        return -1;
    
    if(za > zb)
        return 1;
    
    return 0;
  },
  
  /**
   * Orders an array of objects by sorting them based on their zindex property.
   * @param  {Array} objects The collection of objects to sort.
   * @return {Array} A collection of the sorted keys for the passed in objects.
   */
  getOrderedKeys: function(objects)
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
    
    for(var obj = 0; obj < ordered.length; obj++)
      keys.push(ordered[obj].name);
    
    return keys;
  },
  
  /**
   * Creates and returns an iframe that is added to the passed in element, if
   * no element is passed in it's added to the document's body element.
   * @param  {HTMLElement} parentElement The HTML element to add the iframe to.
   * @return {IFrame} The iframe that was created and added to the page.
   */
  getIFrame: function(parentElement) {
    // Create the iframe which will be returned
    var iframe = document.createElement("iframe");

    // If no parent element is specified then use body as the parent element
    if(parentElement === null)
      parentElement = document.body;

    // This is necessary in order to initialize the document inside the iframe
    parentElement.appendChild(iframe);

    // Initiate the iframe's document to null
    iframe.doc = null;

    // Depending on browser platform get the iframe's document, this is only
    // available if the iframe has already been appended to an element which
    // has been added to the document
    if(iframe.contentDocument)
      // Firefox, Opera
      iframe.doc = iframe.contentDocument;
    else if(iframe.contentWindow)
      // Internet Explorer
      iframe.doc = iframe.contentWindow.document;
    else if(iframe.document)
      // Others?
      iframe.doc = iframe.document;

    // If we did not succeed in finding the document then throw an exception
    if(iframe.doc === null)
      throw "Document not found, append the parent element to the DOM before creating the IFrame";

    // Create the script inside the iframe's document which will call the
    iframe.doc.open();
    iframe.doc.close();

    // Return the iframe, now with an extra property iframe.doc containing the
    // iframe's document
    return iframe;
  }
};