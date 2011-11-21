var mm = mm || {};

mm.TestMan = pulse.Sprite.extend({
  init : function(world) {
    this.world = world;
    this._super( { src: 'brick_ground.png' });
    this.size.width = 20.0;
    this.size.height = 20.0;
    
    this.position.x = 10.0;
    this.position.y = 500.0;
    
    var bodyDef = new b2BodyDef();
    bodyDef.position.Set(10.0 * mm.Box2DFactor, 500.0 * mm.Box2DFactor);
    bodyDef.massData.mass = 2.0;             // the body's mass in kg
    bodyDef.massData.center.SetZero();       // the center of mass in local coordinates
    bodyDef.massData.I = Number.POSITIVE_INFINITY; 
    var body = world.CreateBody(bodyDef);
    body.w = 20 * mm.Box2DFactor;
    body.h = 20 * mm.Box2DFactor;
    var shapeDef = new b2PolygonDef();
    shapeDef.SetAsBox(body.w / 2, body.h / 2);
    shapeDef.restitution = 0.0;
    shapeDef.friction = 0.0;
    shapeDef.density = 2.0;
    body.CreateShape(shapeDef);
    //body.SetMassFromShapes();
    //body.SynchronizeShapes();
    body.SetLinearVelocity(new b2Vec2(1, 0));
    this.body = body;
    
    this.events.bind('keydown', function(e) {
      if(e.keyCode == 32) {
          e.sender.body.ApplyImpulse(new b2Vec2(0, -10), e.sender.body.GetPosition());
      }
    });
  },
  update : function(elapsed) {
    this.position.x = this.body.m_xf.position.x / mm.Box2DFactor;
    this.position.y = this.body.m_xf.position.y / mm.Box2DFactor;
    this.rotation = (180 * this.body.GetAngle()) / Math.PI;
    this._super(elapsed);
  },
});
