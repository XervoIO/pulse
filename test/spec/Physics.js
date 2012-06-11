describe('Physics', function() {
  describe('Constructor', function() {

    it('Should create default Body Definition if none is specified', function() {
      var sprite = new pulse.Sprite({ src: 'dummy.png' });
      expect(sprite._physics.bodyDef).not.toBe(null);
    });

    it('Should create default Fixture Definition is none is specified', function() {
      var sprite = new pulse.Sprite({ src: 'dummy.png' });
      expect(sprite._physics.fixtureDef).not.toBe(null);
    });

    it('Should use default world when none is specified', function() {
      var sprite = new pulse.Sprite({ src: 'dummy.src' });
      expect(sprite._physics.world).toBe(pulse.physics.WORLD);
    });

    it('Should create body when added to layer', function() {
      var layer = new pulse.Layer();
      var sprite = new pulse.Sprite({ src: 'dummy.png' });
      layer.addNode(sprite);

      expect(sprite._physics.body).not.toBe(null);
    });

    it('Should remove body when removed from layer', function() {
      var layer = new pulse.Layer();
      var sprite = new pulse.Sprite({ src: 'dummy.png' });
      layer.addNode(sprite);

      expect(sprite._physics.body).not.toBe(null);

      layer.removeNode(sprite);

      expect(sprite._physics.body).toBe(null);
    });

    it('Should not override custom body definitions', function() {
      var bodyDef = new Box2D.Dynamics.b2BodyDef();
      var sprite = new pulse.Sprite({ 
        src: 'dummy.png',
        physics: {
          bodyDef : bodyDef
        }
      });

      expect(sprite._physics.bodyDef).toBe(bodyDef);

    });

    it('Should not override custom fixture definitions', function() {
      var fixDef = new Box2D.Dynamics.b2FixtureDef();
      var sprite = new pulse.Sprite({ 
        src: 'dummy.png',
        physics: {
          fixDef : fixDef
        }
      });

      expect(sprite._physics.fixDef).toBe(fixDef);

    });

    it('Should not override custom world definitions', function() {
      var world = new Box2D.Dynamics.b2World(pulse.physics.GRAVITY, true);

      var sprite = new pulse.Sprite({ 
        src: 'dummy.png',
        physics: {
          world : world
        }
      });

      expect(sprite._physics.world).toBe(world);

    });

  });
});