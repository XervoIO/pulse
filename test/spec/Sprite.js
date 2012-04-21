describe("Sprite", function() {

  var createDummySprite = function() {
    return new pulse.Sprite( { src: "dummy/path.png" });
  };

  it("should not be able to be constructed without a source", function() {
    var thrown = false;

    try {
      var sprite = new pulse.Sprite();
    }
    catch(e) {
      thrown = true;
    }

    expect(thrown).toEqual(true);
  });

  it("should be able to be constructed with name param", function() {
    var sprite = new pulse.Sprite( { src: "dummy/path.png", name: "custom name" });

    expect(sprite.name).toEqual("custom name");
  });

  var suiteWideSprite = createDummySprite();

  it("should be marked updated after first update", function() {
    var sprite = createDummySprite();
    expect(sprite.updated).toBeTruthy();
    sprite.update(0);
    expect(sprite.updated).toBeTruthy();
  });

  // it("should not be marked updated after first draw", function() {
  //   var sprite = createDummySprite();
  //   expect(sprite.updated).toBeTruthy();
  //   sprite.update(0);
  //   // mock loading texture
  //   sprite.texture.percentLoaded = 100;
  //   // mock sprite size
  //   sprite.size.width = sprite.size.height = 1;
  //   sprite.draw();
  //   expect(sprite.updated).toBeFalsy();
  // });
});