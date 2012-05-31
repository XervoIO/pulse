describe('Sprite', function() {
  describe('Constructors', function() {
    it('should not be able to be constructed without params', function() {
      var thrown = true;
      
      try {
        var sprite = new pulse.Sprite();
      }
      catch(e) {
        thrown = true;
      }
  
      expect(thrown).toBeTruthy();
    });
        
    it('should not be able to be constructed with a bad source', function() {
      var sprite = new pulse.Sprite({src: 'badimage.png'});
      
      waitsFor(function() {
        return sprite.texture.error;
      }, 'bad image to throw an error.', 2000);
      
      runs(function() {
        expect(sprite.texture.error).toBeTruthy();
      });
    });
    
    it('should be able to be constructed with a src as a url string', function() {
      var sprite = new pulse.Sprite({src:'img/test.png'});
      
      waitsFor(function() {
        if(sprite.texture.percentLoaded < 100) {
          return false;
        }
        
        return true;
      }, 'loading an image using a string path', 2000);
             
      runs(function() {
        expect(sprite.texture.error).toBeFalsy();
      });
    });

    it('should be able to be constructed with a src as a texture', function() {
      var texture = new pulse.Texture({filename: 'img/test.png'});
      var sprite = new pulse.Sprite({src: texture});
      
      waitsFor(function() {
        if(sprite.texture.percentLoaded < 100) {
          return false;
        }
        
        return true;
      }, 'loading an image using a texture ', 2000);
             
      runs(function() {
        expect(sprite.texture).toEqual(texture);
        expect(sprite.texture.error).toBeFalsy();
      });
    });
  });
  
  describe('Events', function() {
    var sprite = new pulse.Sprite({src:'img/test.png'});

    var lastEvent = '';
    var eventFunct = function(evt) {
      lastEvent = evt.type;
    };

    for(var e in pulse.events) {
      (function (evtName) {
        it('should be able to bind "' + evtName + '"', function() {
          sprite.on(evtName, eventFunct);
          expect(sprite.events._private.events[evtName]).toBeDefined();
        });
      }(e));

      (function (evtName) {
        it('should be able to raise "' + evtName + '"', function() {
          var error = false;
          try {
            sprite.events.raiseEvent(evtName, {'type': evtName});
          } catch(err) {
            error = true;
          }
          
          expect(error).toBeFalsy();
          expect(lastEvent).toEqual(evtName);
        });
      }(e));
    }
  });
  
  describe('Updating', function() {
    it('should be marked updated after first update', function() {
      var sprite = new pulse.Sprite({src:'img/test.png'});
      expect(sprite.updated).toBeTruthy();
      sprite.update(0);
      expect(sprite.updated).toBeTruthy();
    });
    
    it('should not be marked updated after first draw', function() {
      var sprite = new pulse.Sprite({src:'img/test.png'});
      var canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;

      waitsFor(function() {
        if(sprite.texture.percentLoaded < 100) {
          return false;
        }

        return true;
      }, 'loading a sprite texture', 2000);
             
      runs(function() {
        expect(sprite.updated).toBeTruthy();
        sprite.update(0);
        //mock sprite size
        sprite.size.width = sprite.size.height = 1;
        sprite.draw(canvas.getContext('2d'));
        expect(sprite.updated).toBeFalsy();
      });
    });
  });
});