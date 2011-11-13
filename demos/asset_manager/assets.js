var myEngine = new pulse.Engine();
var myManager = new pulse.AssetManager();
var myBundle = new pulse.AssetBundle();
var myBundleToo = new pulse.AssetBundle();

var textures = new Array();
for(var t = 0; t < 320; t++)
{
  myBundle.addAsset(new pulse.Texture({ 
    filename: 'http://placehold.it/' + 
      Math.floor(t + 400 * Math.random()) + 'x' +
      Math.floor(t + 400 * Math.random()) ,
    autoLoad: false
  }));
  
  myBundleToo.addAsset(new pulse.Texture({ 
    filename: 'http://placehold.it/' + 
      Math.floor(t + 400 * Math.random()) + 'x' +
      Math.floor(t + 400 * Math.random()) ,
    autoLoad: false
  }));
}

myManager.addBundle(myBundle, 'Bundle1');
myManager.addBundle(myBundleToo, 'Bundle2');


function loop(sceneManager)
{
  var debugTime = document.getElementById('loaded');
  debugTime.innerHTML = '';
  
  debugTime.innerHTML = myManager.percentLoaded + "%";
}

function gameGo()
{
  myManager.load();
  myEngine.go(10, loop);
}
