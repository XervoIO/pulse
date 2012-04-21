describe("Sprite", function() {

  var createDummySprite = function() {
    return new pulse.Sprite( { src: "../demos/img/star_1.png" });
  };
  
  describe("Constructors", function(){
    
      it("should not be able to be constructed without params", function() {
        var thrown = true;
        
        try {
          var sprite = new pulse.Sprite();
        }
        catch(e) {
          thrown = true;
        }
    
        expect(thrown).toEqual(true);
      });
      
      it("should not be able to be constructed with a bad source", function() {
        var sprite = new pulse.Sprite({src: 'badimage.png'});
        
        waitsFor(function() {
          return sprite.texture.error;
        }, 'bad image to throw an error.', 1); 
        
        runs(function() {
          expect(sprite.texture.error).toEqual(true);
        });
      });
      
      it("should be able to be constructed with a src as a url string", function() {
        var sprite = new pulse.Sprite({src:"../demos/img/star_1.png"});
        
        waitsFor(function() {
          return sprite.texture._private.image.complete;
        }, 'image not loaded.', 2000); 
        
        runs(function() {
          expect(sprite.texture.error).toEqual(false);
        });
      });
  });
  
  /*
  var suiteWideSprite = createDummySprite();

  it("should be marked updated after first update", function() {
    var sprite = createDummySprite();
    expect(sprite.updated).toBeTruthy();
    sprite.update(0);
    expect(sprite.updated).toBeTruthy();
  });
  */
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