var mm = mm || {};

mm.Brick = PFPlay.Sprite.extend({
  init: function(texture, layer) {
    this.layer = layer;
    this._super( { src: texture });
    this.anchor = { x: 0, y: 0 };
    this.size = { width: mm.Brick.Size.width, height: mm.Brick.Size.height };
  },
  createBody: function() {
    this.body = mm.createBody(
      { x: this.position.x, 
        y: this.position.y,
        width: mm.Brick.Size.width,
        height: mm.Brick.Size.height },
        this.layer.world)
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
    brick.position.x = (mm.Brick.Size.width - 1) * params.x + i * (mm.Brick.Size.width - 1);
    brick.position.y = layer.size.height - (mm.Brick.Size.height * params.y) - mm.Brick.Size.height;
    layer.addNode(brick);
  }
  
  var width = (mm.Brick.Size.width - 1) * params.width;
  var height = (mm.Brick.Size.height - 1);
  var xPos = (mm.Brick.Size.width - 1) * params.x + width / 2;
  var yPos = layer.size.height - (mm.Brick.Size.height * params.y) - mm.Brick.Size.height + height / 2;

  // Create a single body to represent the chunk.
  mm.createBody({ x: xPos, y: yPos, width: width, height: height }, layer.world);
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
      //brick.createBody();
    }
  }
  
  var width = (mm.Brick.Size.width - 1) * params.width;
  var height = (mm.Brick.Size.height - 1) * params.height;
  var xPos = (mm.Brick.Size.width - 1) * params.x + width / 2;
  var yPos = layer.size.height - ((params.height) * (mm.Brick.Size.height - 1)) + height / 2;
  
  // Create a single body to represent the chunk.
  mm.createBody({ x: xPos, y: yPos, width: width, height: height }, layer.world);
};

mm.createBody = function(params, world) {
  console.log(params.x + "," + params.y + "," + params.width + "," + params.height);
  var bodyDef = new b2BodyDef();
  bodyDef.position.Set(params.x * mm.Box2DFactor, params.y * mm.Box2DFactor);
  var body = world.CreateBody(bodyDef);
  var shapeDef = new b2PolygonDef();
  shapeDef.restitution = 0.0;
  shapeDef.friction = 0.0;
  shapeDef.density = 2.0;
  shapeDef.SetAsBox(
    (params.width * mm.Box2DFactor) / 2, 
    (params.height * mm.Box2DFactor) / 2);
  body.CreateShape(shapeDef);
  //body.SynchronizeShapes();
  
  return body;
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
