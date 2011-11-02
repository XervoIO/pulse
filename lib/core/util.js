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

PFPlay.util = 
{
  find: function(collection, name)
  {
    var found = Array();
    
    if(collection instanceof Array)
    {
      for(var o = 0; o < collection.length; o++)
      {
        if(typeof collection[o] == 'function' 
          && typeof collection[o].name == 'function'
          && collection[o].name == name)
        {
          found.push(collection[o]);
        }
           
      }
    }
    else if(typeof collection  == 'object')
    {
      for(var o in collection)
      {
        if(o == name)
          found.push(collection[o]);
      }
    }
    
    return found;
  },
    
  intersects: function(box1, box2)
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
          return true;
      }
    }
    
    return false;
  },
  
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
  
  checkValue: function(variable, vDefault)
  {
    if(variable == null)
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
    
    if(!obj.hasOwnProperty(prop) || obj[prop] == null)
      obj[prop] = propDefault;
      
    return obj;
  },
  
  checkParams: function(params, defaults)
  {
    if(typeof params == 'undefined' 
      || params == null 
      || typeof params != 'object')
    {
      params = {};
    }
    
    for(var p in defaults)
    {
      if(!params.hasOwnProperty(p) || params[p] == null)
        params[p] = defaults[p];
    }
    
    return params;
  },
  
  getLength: function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  },
  
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
  
  getOrderedKeys: function(objects)
  {
    var ordered = new Array();
    
    for(var o in objects)
    {
      if(objects[o].hasOwnProperty('name'))
      {
        ordered.push(objects[o]);
      }
    }
    
    ordered.sort(PFPlay.util.compareZIndexes);
    
    var keys = new Array();
    
    for(var o = 0; o < ordered.length; o++)
      keys.push(ordered[o].name);
    
    return keys;
  }
};


