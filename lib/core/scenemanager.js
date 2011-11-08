/**
 * @author Neo
 */

PFPlay.SceneManager = function(params)
{
  params = PFPlay.util.checkParams(params,
  {
    gameWindow: document.getElementsByTagName('body')[0]
  });
  
  var _scenes = {};
  var _gameWindow = params.gameWindow;
  
  this.add = function(scene)
  {
    if(scene instanceof PFPlay.Scene 
      && !_scenes.hasOwnProperty(scene.name))
    {
      scene.setDefaultSize(
        _gameWindow.clientWidth, 
        _gameWindow.clientHeight);
      
      _scenes[scene.name] = scene;
    }
  };
  
  this.remove = function(name)
  {
    if(_scenes.hasOwnProperty(name))
      delete _scenes[name];
  };
  
  this.activate = function(name)
  {
    if(name instanceof PFPlay.Scene)
      name = name.name;
    
    if(_scenes.hasOwnProperty(name))
    {
      _scenes[name].active = true;
      _gameWindow.appendChild(_scenes[name].getSceneContainer());
    }
  };
  
  this.deactivate = function(name)
  {
    if(name instanceof PFPlay.Scene)
      name = name.name;
    
    if(_scenes.hasOwnProperty(name) && _scenes[name].active)
    {
      _scenes[name].active = false;
      _gameWindow.removeChild(_scenes[name].getSceneContainer());
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

