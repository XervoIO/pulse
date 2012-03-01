// Namespace declaration
var mm = mm || {};

/**
 * Platform brick class that handles placement, size and texture
 */
mm.Brick = pulse.Sprite.extend({
  /**
   * Initializes the brick
   * @param  {pulse.Texture} texture The texture to use for the brick
   * @param  {pulse.Layer} layer The layer the brick should be added to
   */
  init: function(texture, layer) {
    this.layer = layer;
    this._super( { src: texture });
    this.anchor = { x: 0, y: 0 };
    this.size = { width: mm.Brick.Size.width, height: mm.Brick.Size.height };
  },
  /**
   * Creates the Box2D body for this brick
   * @return {[type]}
   */
  createBody: function() {
    this.body = mm.createBody(
      { x: this.position.x,
        y: this.position.y,
        size: {
          width: mm.Brick.Size.width,
          height: mm.Brick.Size.height }
        },
        this.layer.world);
  }
});

// Creating brick textures and setting them to static members
mm.Brick.GroundTextureLeft = new pulse.Texture( { filename: 'brick_ground_left.png'} );
mm.Brick.GroundTextureRight = new pulse.Texture( { filename: 'brick_ground_right.png'} );
mm.Brick.PlatformTexture = new pulse.Texture( { filename: 'brick_platform.png'} );
mm.Brick.PlatformTextureLeft = new pulse.Texture( { filename: 'brick_platform_left.png'} );
mm.Brick.PlatformTextureRight = new pulse.Texture( { filename: 'brick_platform_right.png'} );
mm.Brick.GroundTexture = new pulse.Texture( { filename: 'brick_ground.png'} );
mm.Brick.GroundTopTexture = new pulse.Texture( { filename: 'ground_top.png'} );

// Setting the size for bricks as a static member
mm.Brick.Size = { width: 25, height: 25 };

/**
 * Level class that handles creating the platforms and ground chunks
 * @class Level
 */
mm.Level = pulse.Layer.extend({
  /**
   * Initializes the level based off of mm.Level.Layout
   * @param  {object} params parameter object
   * @config {b2World} world Box2D world
   */
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

/**
 * Static function for creating a platforms
 * @param  {object} params parameter object
 * @config {number} size The size, width and height, of the platform to create
 * @config {number} x The x position to start the platform
 * @config {number} y the y position to start the platform
 * @param {pulse.Layer} layer The layer to add the platform to
 */
mm.Platform = function(params, layer) {
  // loop through the width of the platform
  for(var i = 0; i < params.size.width; i++) {

    // determine the texture based on the position in the platform
    var texture = mm.Brick.PlatformTexture;
    if(i === 0) {
      texture = mm.Brick.PlatformTextureLeft;
    }
    else if (i == params.size.width - 1) {
      texture = mm.Brick.PlatformTextureRight;
    }
    
    // create a brick and set its position
    var brick = new mm.Brick(texture, layer);
    brick.position.x = (mm.Brick.Size.width - 1) * params.x + i * (mm.Brick.Size.width - 1);
    brick.position.y = layer.size.height - (mm.Brick.Size.height * params.y) - mm.Brick.Size.height;

    // add the brick to the layer
    layer.addNode(brick);
  }
  
  /**
   * Calculate the width, height, x, and y position of the Box2D body that
   * needs to be created
   */
  var width = (mm.Brick.Size.width - 1) * params.size.width;
  var height = (mm.Brick.Size.height - 1);
  var xPos = (mm.Brick.Size.width - 1) * params.x + width / 2;
  var yPos = layer.size.height - (mm.Brick.Size.height * params.y) - mm.Brick.Size.height + height / 2;

  // Create a single body to represent the platform
  mm.createBody({ x: xPos, y: yPos, size: {width: width, height: height}}, layer.world);
};

/**
 * Static function for creating a chunk of land
 * @param  {object} params parameter object
 * @config {number} width The width of the chunk to create
 * @config {number} height The height of the chunk to create
 * @config {number} x The x position to start the chunk
 * @config {number} y the y position to start the chunk
 * @param {pulse.Layer} layer The layer to add the chunk to
 */
mm.Chunk = function(params, layer) {
  // Loop through the width and height of the chunk to create all the bricks
  for(var rowIdx = 0; rowIdx < params.size.width; rowIdx++) {
    for(var colIdx = 0; colIdx < params.size.height; colIdx++) {

      // Determine if the brick is on the top layer of the chunk
      var top = colIdx == params.size.height - 1;

      // Determine the texture based on location of the brick
      var texture = mm.Brick.GroundTexture;
      if(top) {
        texture = mm.Brick.GroundTopTexture;
      }
      else if(rowIdx === 0) {
        texture = mm.Brick.GroundTextureLeft;
      }
      else if(rowIdx == params.size.width - 1) {
        texture = mm.Brick.GroundTextureRight;
      }

      // Create new brick and set its position
      var brick = new mm.Brick(texture, layer);
      brick.position.y =
        layer.size.height -
        colIdx * (mm.Brick.Size.height - 1) -
        mm.Brick.Size.height;
      brick.position.x = (mm.Brick.Size.width - 1) * (params.x + rowIdx);

      // Add the brick to the layer
      layer.addNode(brick);
    }
  }
  
  /**
   * Calculate the width, height, x, and y position of the Box2D body that
   * needs to be created
   */
  var width = (mm.Brick.Size.width - 1) * params.size.width;
  var height = (mm.Brick.Size.height - 1) * params.size.height;
  var xPos = (mm.Brick.Size.width - 1) * params.x + width / 2;
  var yPos = layer.size.height - ((params.size.height) * (mm.Brick.Size.height - 1)) + height / 2;
  
  // Create a single body to represent the chunk
  mm.createBody({ x: xPos, y: yPos, size: {width: width, height: height}}, layer.world);
};

/**
 * Helper static function for creating Box2D body
 * @config {number} width The width of the body to create
 * @config {number} height The height of the body to create
 * @config {number} x The x position of the body
 * @config {number} y the y position of the body
 * @param  {b2World} world The Box2D world to add the body to
 * @return {b2Body}
 */
mm.createBody = function(params, world) {
  // Box2D body definition and shape definition creation
  var bodyDef = new b2BodyDef();
  bodyDef.position.Set(params.x * mm.Box2DFactor, params.y * mm.Box2DFactor);
  var body = world.CreateBody(bodyDef);
  var shapeDef = new b2PolygonDef();
  shapeDef.restitution = 0.0;
  shapeDef.friction = 0.0;
  shapeDef.density = 2.0;
  shapeDef.SetAsBox(
    (params.size.width * mm.Box2DFactor) / 2,
    (params.size.height * mm.Box2DFactor) / 2);
  body.CreateShape(shapeDef);

  return body;
};

/**
 * Static list of the layout for the level for the demo
 * @type {Array}
 */
mm.Level.Layout = [
 // Chunks - the ground
 { c: { size: {width: 12, height: 2}, x: 0}}, // A
 { c: { size: {width: 4, height: 2}, x: 16}}, // B
 { c: { size: {width: 4, height: 3}, x: 20}}, // C
 { c: { size: {width: 4, height: 9}, x: 24}}, // D
 { c: { size: {width: 4, height: 4}, x: 30}}, // E
 { c: { size: {width: 4, height: 3}, x: 34}}, // F
 { c: { size: {width: 4, height: 2}, x: 38}}, // G
 { c: { size: {width: 4, height: 15}, x: 60}}, // H
 { c: { size: {width: 6, height: 17}, x: 64}}, // I
 { c: { size: {width: 4, height: 13}, x: 70}}, // J
 { c: { size: {width: 30, height: 2}, x: 96}}, // K
 { c: { size: {width: 8, height: 23}, x: 138}}, // L
 
 
 // Platforms
 { p: { size: {width: 4}, x: 6, y: 5}},    // a
 { p: { size: {width: 2}, x: 13, y: 7}},   // b
 { p: { size: {width: 2}, x: 19, y: 6}},   // c
 { p: { size: {width: 4}, x: 46, y: 4}},   // d
 { p: { size: {width: 4}, x: 53, y: 6}},   // e
 { p: { size: {width: 4}, x: 46, y: 9}},   // f
 { p: { size: {width: 2}, x: 50, y: 13}},  // g
 { p: { size: {width: 2}, x: 56, y: 16}},  // h
 { p: { size: {width: 2}, x: 34, y: 7}},   // i
 { p: { size: {width: 2}, x: 82, y: 11}},  // j
 { p: { size: {width: 2}, x: 90, y: 5}},   // k
 { p: { size: {width: 2}, x: 86, y: 8}},   // l
 { p: { size: {width: 4}, x: 128, y: 5}},   // m
 { p: { size: {width: 4}, x: 120, y: 9}},   // n
 { p: { size: {width: 4}, x: 112, y: 13}},   // o
 { p: { size: {width: 4}, x: 120, y: 17}},   // p
 { p: { size: {width: 4}, x: 128, y: 21}}   // q
];