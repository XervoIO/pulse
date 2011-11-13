var mm = mm || {};

mm.Brick = PFPlay.Sprite.extend({
  init: function(texture, layer) {
    this.layer = layer;
    this._super( { src: texture });
    this.size = { width: mm.Brick.Size.width, height: mm.Brick.Size.height };
  },
  createBody: function() {
    var bodyDef = new b2BodyDef();
    bodyDef.position.Set(this.position.x * mm.Box2DFactor, this.position.y * mm.Box2DFactor);
    var body = this.layer.world.CreateBody(bodyDef);
    var shapeDef = new b2PolygonDef();
    shapeDef.restitution = 0.0;
    shapeDef.friction = 0.0;
    shapeDef.density = 2.0;
    body.w = mm.Brick.Size.width * mm.Box2DFactor;
    body.h = mm.Brick.Size.height * mm.Box2DFactor;
    shapeDef.SetAsBox(body.w / 2, body.h / 2);
    body.CreateShape(shapeDef);
    body.SynchronizeShapes();
    this.body = body;
  }
});

mm.Brick.PlatformTexture = new PFPlay.Image( { src: 'brick_platform.png'} );
mm.Brick.PlatformTextureLeft = new PFPlay.Image( { src: 'brick_platform_left.png'} );
mm.Brick.PlatformTextureRight = new PFPlay.Image( { src: 'brick_platform_right.png'} );
mm.Brick.GroundTexture = new PFPlay.Image( { src: 'brick_ground.png'} );
mm.Brick.GroundTopTexture = new PFPlay.Image( { src: 'ground_top.png'} );
mm.Brick.Size = { width: 25, height: 25 };

mm.Level = PFPlay.Layer.extend({
  init: function(params) {
    
    this.world = params.world;
    
    this._super(params);
    
    for(var idx in mm.Level.Layout) {
      // Platform
      if(mm.Level.Layout[idx].p) {
        var platform = new mm.Platform(mm.Level.Layout[idx].p, this);
      }
      // Chunk
      else if(mm.Level.Layout[idx].c) {
        var chunk = new mm.Chunk(mm.Level.Layout[idx].c, this);
      }
    }
  }
});

mm.Platform = function(params, layer) {
  for(var i = 0; i < params.width; i++) {
    var texture = mm.Brick.PlatformTexture;
    if(i == 0) {
      texture = mm.Brick.PlatformTextureLeft;
    }
    else if (i == params.width - 1) {
      texture = mm.Brick.PlatformTextureRight;
    }
    
    var brick = new mm.Brick(texture, layer);
    brick.position.x = mm.Brick.Size.width * params.x + i * (mm.Brick.Size.width - 1);
    brick.position.y = layer.size.height - (mm.Brick.Size.height * params.y) - mm.Brick.Size.height;
    brick.createBody();
    layer.addNode(brick);
  }
};

mm.Chunk = function(params, layer) {
  for(var rowIdx = 0; rowIdx < params.width; rowIdx++) {
    for(var colIdx = 0; colIdx < params.height; colIdx++) {
      var top = colIdx == params.height - 1;
      var brick = new mm.Brick(top ? mm.Brick.GroundTopTexture : mm.Brick.GroundTexture, layer);
      brick.position.y = 
        layer.size.height -
        colIdx * (mm.Brick.Size.height - 1) - 
        mm.Brick.Size.height;
      brick.position.x = (mm.Brick.Size.width - 1) * (params.x + rowIdx);
      layer.addNode(brick);
      brick.createBody();
    }
  }
}

mm.Level.Layout = [
 // Chunks - the ground
 { c: { width: 12, height: 2, x: 0}}, // A
 { c: { width: 4, height: 2, x: 16}}, // B
 { c: { width: 4, height: 3, x: 20}}, // C
 { c: { width: 4, height: 9, x: 24}}, // D
 { c: { width: 4, height: 4, x: 30}}, // E
 { c: { width: 4, height: 3, x: 34}}, // F
 { c: { width: 4, height: 2, x: 38}}, // G
 { c: { width: 4, height: 15, x: 54}}, // H
 
 // Platforms
 { p: { width: 4, x: 6, y: 5}},    // a
 { p: { width: 2, x: 13, y: 7}},   // b
 { p: { width: 2, x: 19, y: 6}},   // c
 { p: { width: 4, x: 42, y: 4}},   // d
 { p: { width: 4, x: 49, y: 6}},   // e
 { p: { width: 4, x: 42, y: 9}},   // f
 { p: { width: 2, x: 46, y: 13}},  // g
 { p: { width: 2, x: 50, y: 16}},  // h
];
