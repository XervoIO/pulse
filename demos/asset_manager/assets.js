var myEngine = new PFPlay.Engine();
var myManager = new PFPlay.AssetManager();

var textures = new Array();
for(var t = 0; t < 120; t++)
{
  textures.push(new PFPlay.Texture({ 
    filename: 'http://placehold.it/' + 
      Math.floor(t + 400 * Math.random()) + 'x' +
      Math.floor(t + 400 * Math.random()) ,
    autoLoad: false
  }));
}

function loop(sceneManager)
{
  var debugTime = document.getElementById('loaded');
  debugTime.innerHTML = '';
  
  for(var t = 0; t < textures.length; t++)
  {
    textures[t].load();
    if(textures[t].error == true)
      ebugTime.innerHTML = debugTime.innerHTML + 'error!<br/>';
    else
      debugTime.innerHTML = debugTime.innerHTML + textures[t].loaded + '<br/>';
  }
}

function gameGo()
{  
  myEngine.go(10, loop);
}
