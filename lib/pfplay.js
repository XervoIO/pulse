/**
 * Copyright 2011 Paranoid Ferret Productions
 * 
 * This is the base PFPlay namespace.
 * @author Ricahrd Key
 */

//Define the namespace
if (typeof PFPlay == 'undefined') {
  PFPlay = {
    masterTime: 0,
    tick: 100,
    
    gameWindow: null,
    activeEngine: null,
    
    events: {
      'click': 'mouse'
    },
    
    coreFiles: [
      'core/error',
      'core/util',
      'core/image',
      'core/animation',
      'core/sprite',
      'core/layer',
      'core/scene',
      'core/scenemanager',
      'core/engine'
    ],
    gameFiles: [],
    
    addGameFile: function(src)
    {
      PFPlay.gameFiles.push(src);
    },
    
    generateScriptTag: function(src)
    {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      return script;
    },
    
    init: function(libSrc)
    {
      var head = document.getElementsByTagName('head')[0];
  
      for(var f = 0; f < PFPlay.coreFiles.length; f++)
      {
        var include = libSrc + '/' + PFPlay.coreFiles[f] + '.js';
        head.appendChild(PFPlay.generateScriptTag(include));
      }
      
      for(var f = 0; f < PFPlay.gameFiles.length; f++)
      {
        head.appendChild(PFPlay.generateScriptTag(PFPlay.gameFiles[f]));
      }
    }
  };
}