pulse.physics = pulse.physics || {};
pulse.physics.factor = 0.01;

pulse.physics.Sprite = pulse.Sprite.extend({
	init: function(params) {
		this._super(params);
    this.isStatic = params.isStatic;
    this.shape = pulse.physics.Sprite.shapeBox;
    if(params.shape) {
      this.shape = params.shape;
    }
	},

  update: function(elapsed) {

    // TODO: adjust position based on anchor.
    if(this.size && this.size.width && this.size.height && !this.body) {

      var bodyDef = new b2BodyDef();

      bodyDef.position.Set(
        this.position.x * pulse.physics.factor, 
        this.position.y * pulse.physics.factor);

      this.body = this.world.CreateBody(bodyDef);

      var shapeDef = null;

      if(this.shape == pulse.physics.Sprite.shapeCircle) {
        shapeDef = new b2CircleDef();
        shapeDef.radius = this.size.width * pulse.physics.factor / 2;
      }
      else if(this.shape == pulse.physics.Sprite.shapeBox) {
        shapeDef = new b2PolygonDef();
        shapeDef.SetAsBox(
          this.size.width * pulse.physics.factor / 2, 
          this.size.height * pulse.physics.factor / 2);
      }

      shapeDef.restitution = 0.5;
      shapeDef.density = 1;
      shapeDef.friction = 0.9;
      this.body.CreateShape(shapeDef);

      if(!this.isStatic) {
        this.body.SetMassFromShapes();
      }
    }

    if(this.body) {
      // Update the position to Box2D's position.
      this.position = {
        x : this.body.GetPosition().x / pulse.physics.factor,
        y : this.body.GetPosition().y / pulse.physics.factor
      };      

      this.rotation = this.body.GetAngle() * (180 / Math.PI);
    }

    this._super(elapsed);
  }
});

pulse.physics.Sprite.shapeCircle = 'circle';
pulse.physics.Sprite.shapeBox = 'box';