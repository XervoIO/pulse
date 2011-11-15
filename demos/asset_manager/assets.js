pulse.ready(function() {

  var myEngine = new pulse.Engine();
  var myManager = new pulse.AssetManager();
  var myBundle = new pulse.AssetBundle();
  var myBundleToo = new pulse.AssetBundle();
  
  var numAssets = 120;
  for(var t = 0; t < numAssets; t++)
  {
    myBundle.addAsset(new pulse.Texture({
      name: 'a1-' + t,
      filename: 'http://placehold.it/' + 
        Math.floor(t + 400 * Math.random()) + 'x' +
        Math.floor(t + 400 * Math.random()) ,
      autoLoad: false
    }));
    
    myBundleToo.addAsset(new pulse.Texture({
      name: 'a2-' + t,
      filename: 'http://placehold.it/' + 
        Math.floor(t + 400 * Math.random()) + 'x' +
        Math.floor(t + 400 * Math.random()) ,
      autoLoad: false
    }));
    
    myManager.addAsset(new pulse.Texture({ 
      name: 'global' + t,
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
    var rAsset = Math.floor(numAssets * Math.random());
    var bundle = 'Bundle' + Math.floor(3 * Math.random());
    var asset;
    
    switch(bundle)
    {
      case 'Bundle1':
        rAsset = 'a1-' + rAsset;
        asset = myManager.getAsset(rAsset, bundle);
        break;
      case 'Bundle2':
        rAsset = 'a2-' + rAsset;
        asset = myManager.getAsset(rAsset, bundle);
        break;
      default:
        rAsset = 'global' + rAsset;
        asset = myManager.getAsset(rAsset);
        break;
    }
    
    var debugTime = document.getElementById('loaded');
    debugTime.innerHTML = '';
    
    debugTime.innerHTML = '<h1>' + myManager.percentLoaded + '%</h1>'
      + '<h4>Random Asset:</h4>'
      + asset.name
      + '<br/>' + bundle
      + '<br/>' + asset.filename; 
  }

  myManager.load();
  myEngine.go(100, loop);
});