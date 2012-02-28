describe("Plugin", function () {

  it("should be able to be constructed without parameters", function () {

    var thrown = false;

    try {
      var plugin = new pulse.plugin.Plugin();
    }
    catch (e) {
      thrown = true;
    }

    expect(thrown).toEqual(false);
  });

  it("should be able to subscribe init callback", function () {

    var exceptionThrown = false;

    try {
      var plugin = new pulse.plugin.Plugin();
      plugin.subscribe(pulse.Sprite, 'init', pulse.plugin.PluginCallbackTypes.onEnter, function () { });

    }
    catch (e) {
      console.log(e);
      exceptionThrown = true;
    }

    expect(exceptionThrown).toEqual(false);
  });

  it("should invoke subscribed init callback", function () {

    var callbackInvoked = false;

    var plugin = new pulse.plugin.Plugin();
    pulse.plugins.add(plugin);

    plugin.subscribe(pulse.Sprite, 'init',
      pulse.plugin.PluginCallbackTypes.onEnter, function () { callbackInvoked = true; });

    var sprite = new pulse.Sprite({ src: 'dummy/path.png' });

    expect(callbackInvoked).toEqual(true);
  });

  it("should invoke subscribed init callback with correct arguments", function () {

    var callbackInvoked = false;

    var plugin = new pulse.plugin.Plugin();
    pulse.plugins.add(plugin);
    plugin.subscribe(pulse.Sprite, 'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      function (params) {
        expect(params.src).toEqual('dummy/path.png');
        callbackInvoked = true;
      });

    var sprite = new pulse.Sprite({ src: 'dummy/path.png' });

    expect(callbackInvoked).toEqual(true);
  });

  it("should invoke subscribed init callback with correct this variable", function () {

    var callbackInvoked = false;

    var sprite = null;

    var plugin = new pulse.plugin.Plugin();
    pulse.plugins.add(plugin);
    plugin.subscribe(pulse.Sprite, 'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      function (params) {
        // Can only do a != null here since the sprite
        // variable won't be assigned until the init completes.
        expect(this).toNotEqual(null);
        callbackInvoked = true;
      });

    sprite = new pulse.Sprite({ src: 'dummy/path.png' });

    expect(callbackInvoked).toEqual(true);
  });

  it("should be able to unsubscribe callback", function () {
    var callbackInvokeCount = 0;

    var plugin = new pulse.plugin.Plugin();
    pulse.plugins.add(plugin);
    var callback = plugin.subscribe(pulse.Sprite, 'init',
      pulse.plugin.PluginCallbackTypes.onEnter,
      function (params) {
        callbackInvokeCount++;
      });


    var sprite = new pulse.Sprite({ src: 'dummy/path.png' });

    plugin.unsubscribe(callback);

    sprite = new pulse.Sprite({ src: 'dummy/path.png' });

    expect(callbackInvokeCount).toEqual(1);
  });
});