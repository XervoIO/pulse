pulse.physics = pulse.physics || { };

pulse.physics.Layer = pulse.Layer.extend({
	init: function(params) {
		this._super(params);

    // Container object for Box2D objects.
    this.box2d = {};

    // Setup the world.
    this.box2d.worldAABB = new b2AABB();
    this.box2d.worldAABB.lowerBound.Set(-10000.0, -10000.0);
    this.box2d.worldAABB.upperBound.Set(10000.0, 10000.0);
    this.box2d.gravity = new b2Vec2(0.0, 7);
    this.box2d.world = new b2World(this.box2d.worldAABB, this.box2d.gravity, true);
	},

	update: function(elapsed) {
      if(elapsed > 32) { // ~30hz
        var iterations = Math.floor(elapsed / 32);
      }
      
      // Atttempt to make sure the world is stepped at 60hz.
      for(var i = 0; i < iterations; i++) {
        this.box2d.world.Step((elapsed / iterations) / 1000, 5);
      }

      this._super(elapsed);
	},

  addNode: function(node) {
    if(node instanceof pulse.physics.Sprite) {
      node.world = this.box2d.world;
    }
    this._super(node);
  },

});