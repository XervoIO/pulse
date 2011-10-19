/**
 * @author Neo
 */

PFPlay.SceneManager = function(gameWindow)
{
  var _scenes = {};
  var _gameWindow = gameWindow;
  
  this.add = function(scene)
  {
    if(scene instanceof PFPlay.Scene 
      && !_scenes.hasOwnProperty(scene.name()))
    {
      _scenes[scene.name()] = scene;
    }
  };
  
  this.remove = function(name)
  {
    if(_scenes.hasOwnProperty(name))
      delete _scenes[name];
  };
  
  this.activate = function(name)
  {
    if(_scenes.hasOwnProperty(name))
    {
      _scenes[name].active = true;
      _gameWindow.appendChild(_scenes[name].getScene());
    }
  };
  
  this.deactivate = function(name)
  {
    if(_scenes.hasOwnProperty(name) && _scenes[name].active)
    {
      _scenes[name].active = false;
      _gameWindow.removeChild(_scenes[name].getScene());
    }
  };
  
  this.getScene = function(name) { return _scenes[name]; };
  
  this.getScenes = function(active)
  {
    var scenes = Array();
    
    for(var s in _scenes)
    {
      if(active == true)
      {
        if(_scenes[s].active == true)
          scenes.push(_scenes[s]);
      }
      else
        scenes.push(_scenes[s]);
    }
    
    return scenes;
  };
}

