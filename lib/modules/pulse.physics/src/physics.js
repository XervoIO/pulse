/**
 * @namespace Pulse core.
 */
var pulse = pulse || {};

/**
 * @namespace Holds functionality related to the Pulse Physics module.
 */
pulse.physics = pulse.physics || {};

/**
 * Enables or disables physics globally for the entire application.
 * @type {boolean}
 * @property
 */  
pulse.physics.isEnabled = true;

/**
 * Factor between Pulse coordinates and Box2D coordinates.  Pulse uses larger
 * numbers (pixels) whereas Box2D works best with much smaller numbers.  Any 
 * positioning information supplied/retrieved from Box2D must be adjusted by
 * this factor.  Numbers supplied to Box2D must be multiplied and numbers 
 * retrieved from Box2D must be divided.
 * @type {number}
 * @constant
 */
pulse.physics.FACTOR = 0.01;

/**
 * The default gravity.  The gravity can be changed at any time by calling
 * pulse.physics.world.SetGravity(new Box2D.Common.Math.b2Vec2(x, y)).
 * @type {Box2D.Common.Math.b2Vec2}
 * @constant
 */
pulse.physics.GRAVITY = new Box2D.Common.Math.b2Vec2(0, 9.8);

/**
 * Friction applied to every new object.  Friction can be changed on a 
 * per-object bases by passing a Fixture definition through the constructor params.
 * Changing this property after an object has been created will have no affect.
 * @type {number}
 */
pulse.physics.friction = 0.5;

/**
 * Density applied to every new object.  Density can be changed on a 
 * per-object bases by passing a Fixture definition through the constructor params.
 * Changing this property after an object has been created will have no affect.
 * @type {number}
 */
pulse.physics.density = 1.0;

/**
 * Restitution applied to every new object.  Restitution can be changed on a
 * per-object bases by passing a Fixture definition through the constructor params.
 * Changing this property after an object has been created will have no affect.
 * @type {number}
 */
pulse.physics.restitution = 0.3;

/**
 * The minimum amount of milliseconds that the physics world should be stepped.
 * If the update elapsed time exceeds this value, the physics world will be
 * stepped multiple times per update loop.
 * @type {number}
 */
pulse.physics.minStepTime = 16;

/**
 * The global physics world.  All visuals will be added to this world by
 * default.  Visuals can be added to a custom world by passing it through
 * the constructor in the physics params e.g. 
 * new Sprite({ physics: { world: customWorld }})
 * @type {Box2D.Dynamics.b2World}
 * @constant
 */
pulse.physics.WORLD = new Box2D.Dynamics.b2World(pulse.physics.GRAVITY, true);

/**
 * Converts radians to degrees.
 * @constant
 */
pulse.physics.ANGLE_COEF = 180 / Math.PI;

// The physics plugin.  Provides hooks into pulse core.
pulse.physics.plugin = new pulse.plugin.Plugin();

/**
 * Extends the default pulse.Visual constructor for physics configuration.
 * @name pulse.Visual
 * @constructor
 * @param {object} [params.physics] Physics configuration options.
 * @param {boolean} [params.physics.isEnabled] Whether or not physics are enabled for this node.
 * Defaults to true.
 * @param {boolean} [params.physics.isStatic] Whether or not this is a static object.  Static
 * objects are not affected by gravity.  Things do collide with static objects.  This is good
 * for things like the ground and walls.  Defaults to false.
 * @param {string} [params.physics.basicShape] 'circle' or 'box'.  Setting this property 
 * provides a quick mechanism to set up a physics object.  Custom shapes can be created by
 * defining a FixtureDef and assigning it to the fixDef.shape param.  Defaults to 'box'.
 * @param {Box2D.Dynamics.b2FixtureDef} [params.physics.fixDef] Provides full control over the 
 * node's fixture.  The fixture controls properties like friction, restitution, and density.
 * The fixDef.shape property provides full control over the collision object.  Any value
 * assigned to the fixDef.shape property will override the basicShape property.
 * @param {Box2D.Dynamics.b2FixtureDef} [params.physics.bodyDef] Custom body definition.
 * @param {Box2D.Dynamics.b2World} [params.physics.world] Custom physics world.
 * @param {object} [params.physics.positionOffset] An adjustment between the physics position
 * and the resulting visual position.  The x and y properties will be added to the physics
 * position when being applied to the visual.
 * By default every visual is added to the global pulse.physics.WORLD.  
 * This property allows the application to have multiple separate physics worlds.
 */

/**
 * Hooks the engine update loop and steps the physics world.
 */
pulse.physics.plugin.subscribe(
   'pulse.Engine',
   'update',
   'onEnter',
   function(elapsed) {
      if(pulse.physics.isEnabled) {
         // Make sure the minimum step time is not exceeded.
         var steps = Math.ceil(elapsed / pulse.physics.minStepTime);

         elapsed /= steps;

         for(var i = 0; i < steps; i++) {
            pulse.physics.WORLD.Step(
               elapsed / 1000, 
               3, // velocity iterations
               3  // position iterations
            );
            pulse.physics.WORLD.ClearForces();
         }
      }
   }
);

/**
 * Hooks the visual's constructor.  Sets up the physics object
 * whenever a new visual is created.
 */
pulse.physics.plugin.subscribe(
   'pulse.Visual',
   'init',
   'onExit',
   function(params) {

      // If this node is a layer, skip physics initialization.
      if(this instanceof pulse.Layer) {
         return;
      }

      this._physics = {};
      params = params || {};
      params.physics = params.physics || {};

      // Set the world.  If a world is not supplied, use the default world.
      this._physics.world = params.physics.world || pulse.physics.WORLD;

      // Two basic shapes are supported - 'circle' and 'box'.
      // Default to 'box'.
      this._physics.basicShape = params.physics.basicShape || 'box';

      // Default the isStatic property to false if it's not defined.
      if(typeof params.physics.isStatic === 'undefined') {
         this._physics.isStatic = false;
      }
      else {
         this._physics.isStatic = params.physics.isStatic;
      }

      // Default the isEnabled property to true if it's not defined.
      if(typeof params.physics.isEnabled === 'undefined') {
         this._physics.isEnabled = true;
      }
      else {
         this._physics.isEnabled = params.physics.isEnabled;
      }

      // Create a default fixture if one is not defined.
      if(typeof params.physics.fixDef === 'undefined') {
         this._physics.fixDef = new Box2D.Dynamics.b2FixtureDef();
         this._physics.fixDef.density = pulse.physics.density;
         this._physics.fixDef.friction = pulse.physics.friction;
         this._physics.fixDef.restitution = pulse.physics.restitution;
      }
      else {
         this._physics.fixDef = params.physics.fixDef;
      }

      // If the user did not specify a body, create one.
      if(typeof params.physics.bodyDef === 'undefined') {
         this._physics.bodyDef = new Box2D.Dynamics.b2BodyDef();
         this._physics.bodyDef.allowSleep = true;

         if(this._physics.isStatic) {
            this._physics.bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
            this._physics.bodyDef.awake = false;
            this._physics.bodyDef.fixedRotation = true;
         }
         else {
            this._physics.bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
         }
      }
      else {
         this._physics.bodyDef = params.physics.bodyDef;
      }

      this._physics.positionOffset = params.physics.positionOffset || { x: 0, y: 0 };
   }
);

/**
 * Hooks a layer's removeNode function.  Removes the object from the physics world.
 */
pulse.physics.plugin.subscribe(
   'pulse.Layer',
   'removeNode',
   'onExit',
   function(node) {
      if(node._physics.world && node._physics.body) {
         node._physics.world.DestroyBody(node._physics.body);

         // Clear out the body so it's reconstructed if this visual is 
         // re-added to another layer.
         node._physics.body = null;
      }
   }
);

/**
 * Hooks a layer's addNode function.  Adds the node's physics object to the world.
 */
pulse.physics.plugin.subscribe(
   'pulse.Layer',
   'addNode',
   'onExit',
   function(node) {
      // Physics are enabled and a body has not already been created.
      if(node._physics.isEnabled && !node._physics.body) {
         // Set the default position.
         node._physics.bodyDef.position.x = node.position.x * pulse.physics.FACTOR;
         node._physics.bodyDef.position.y = node.position.y * pulse.physics.FACTOR;

         // If the user did not define a shape, create a basic one for them.
         if(!node._physics.fixDef.shape) {
            if(node._physics.basicShape === 'circle') {
               node._physics.fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(
                  (node.size.width / 2) * pulse.physics.FACTOR);
            }
            else if(node._physics.basicShape === 'box') {
               node._physics.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
               node._physics.fixDef.shape.SetAsBox(
                  node.size.width / 2 * pulse.physics.FACTOR,
                  node.size.height / 2 * pulse.physics.FACTOR);
            }
         }

         node._physics.body = node._physics.world.CreateBody(node._physics.bodyDef);
         node._physics.fixture = node._physics.body.CreateFixture(node._physics.fixDef);
      }
   }
);

/**
 * Hooks the visual's update.  Updates the display properties of the visual
 * from the physics engine.
 */
pulse.physics.plugin.subscribe(
   'pulse.Visual',
   'update',
   'onExit',
   function(elapsed) {
      if(this._physics && this._physics.isEnabled && this._physics.body) {

         if(!this._physics.isStatic) {
            // Update the position from the physics engine.
            var newPosition = this._physics.body.GetPosition();
            this.position.x = newPosition.x / pulse.physics.FACTOR + this._physics.positionOffset.x;
            this.position.y = newPosition.y / pulse.physics.FACTOR + this._physics.positionOffset.y;
         }

         // Convert radians to degrees.
         this.rotation = this._physics.body.GetAngle() * pulse.physics.ANGLE_COEF;
      }
   }
);

// Add the plugin to pulse core.
pulse.plugins.add(pulse.physics.plugin);