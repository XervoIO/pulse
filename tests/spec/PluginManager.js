describe("Plugin Manager", function() {

  it("should be able to be constructed without parameters", function() {

    var thrown = false;

    try {
      var pluginManager = new pulse.PluginManager();
    }
    catch(e) {
      thrown = true;
    }

    expect(thrown).toEqual(false);
  });

  it("should be able subscribe init callback", function() {

    var exceptionThrown = false;

    try {
      var pluginManager = new pulse.PluginManager();
      pluginManager.subscribe(pulse.Sprite, 'init', pulse.plugin.callbackTypes.onEnter, function() { });

    }
    catch(e) {
      console.log(e);
      exceptionThrown = true;
    }

    expect(exceptionThrown).toEqual(false);
  });

  it("should invoke subscribed init callback", function() {

    var callbackInvoked = false;

    var pluginManager = new pulse.PluginManager();
    pulse.plugin = pluginManager;
    pluginManager.subscribe(pulse.Sprite, 'init', 
      pulse.plugin.callbackTypes.onEnter, function() { callbackInvoked = true; });

    var sprite = new pulse.Sprite({ src: 'dummy/path.png'});

    expect(callbackInvoked).toEqual(true);
  });

  it("should invoke subscribed init callback with correct arguments", function() {

    var callbackInvoked = false;

    var pluginManager = new pulse.PluginManager();
    pulse.plugin = pluginManager;
    pluginManager.subscribe(pulse.Sprite, 'init', 
      pulse.plugin.callbackTypes.onEnter, 
      function(params) {
        expect(params.src).toEqual('dummy/path.png');
        callbackInvoked = true;
      });

    var sprite = new pulse.Sprite({ src: 'dummy/path.png'});

    expect(callbackInvoked).toEqual(true);
  });

  it("should invoke subscribed init callback with correct this variable", function() {

    var callbackInvoked = false;

    var sprite = null;

    var pluginManager = new pulse.PluginManager();
    pulse.plugin = pluginManager;
    pluginManager.subscribe(pulse.Sprite, 'init', 
      pulse.plugin.callbackTypes.onEnter, 
      function(params) {
        // Can only do a != null here since the sprite
        // variable won't be assigned until the init completes.
        expect(this).toNotEqual(null);
        callbackInvoked = true;
      });

    sprite = new pulse.Sprite({ src: 'dummy/path.png'});

    expect(callbackInvoked).toEqual(true);
  });
});