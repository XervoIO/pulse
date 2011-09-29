/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * This is the base PFPlay namespace.
 * @author Ricahrd Key
 */

//Define the namespace
if (typeof PFPlay == 'undefined') {
  PFPlay = {};
}

//In order of include
PFPlay.files = [
  'core/util',
  'core/image',
  'core/sprite'
];

PFPlay.userFiles = [];

/**
 * Allows users to add files to the file list so they will
 * be guarenteed to load after the library is included.
 */
PFPlay.addGameFile = function(src)
{
  PFPlay.userFiles.push(src);
}

PFPlay.writeInclude = function(src)
{
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  return script;
}

/**
 * Initialized the PFPlay Library.
 */
PFPlay.init = function(libSrc)
{
  var head = document.getElementsByTagName('head')[0];
  
  for(var f = 0; f < PFPlay.files.length; f++)
  {
    var include = libSrc + '/' + PFPlay.files[f] + '.js';
    head.appendChild(PFPlay.writeInclude(include));
  }
  
  for(var f = 0; f < PFPlay.userFiles.length; f++)
  {
    head.appendChild(PFPlay.writeInclude(PFPlay.userFiles[f]));
  }
};