describe("Sprite", function() {
  
  var createDummySprite = function() {
    return new PFPlay.Sprite( { src: "dummy/path.png" });
  }
  
  it("should not be able to be constructed without a source", function() {
    var thrown = false;
    
    try {
      var sprite = new PFPlay.Sprite();
    }
    catch(e) {
      thrown = true;
    }
    
    expect(thrown).toEqual(true);
  });

  it("should be able to be constructed with name param", function() {
    var sprite = new PFPlay.Sprite( { src: "dummy/path.png", name: "custom name" });
    
    expect(sprite.name).toEqual("custom name");
  });
  
  it("should not be marked updated after first update", function() {
    var sprite = createDummySprite();
    expect(sprite.updated).toEqual(true);
    sprite.update(0);
    expect(sprite.updated).toEqual(false);
  });
});