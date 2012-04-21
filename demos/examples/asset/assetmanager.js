pulse.ready(function() {

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
  
  var loaded = $('<div></div>');
  
  $('body').prepend(loaded);
  
  myManager.events.bind('assetLoaded', function(evt) {
    WriteLine(evt.asset + ' Loaded.');
  });
  
  myManager.events.bind('progressChanged', function() {
    loaded.html('<h1>' + myManager.percentLoaded + '% Loaded</h1>');
  });
  
  myManager.events.bind('complete', function(evt){
    loaded.html('<h1>All Done :D</h1>');
  });
  
  myManager.load();
});