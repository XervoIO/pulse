#What is Pulse?
Pulse is a graphics and game building engine. It uses HTML5 canvases to layer and render graphics in a web browser. It also provides the basic objects, utilities, and mechanics to build games quickly and easily. For more information, please visit [http://www.withpulse.com][1].

#Installing

The simple way is to reference either the minified version (pulse.min.js) or the full version (pulse.debug.js) in the head of an HTML demo file. These versions can be found in *build/bin*. For example:

    <html>
      <head>
        <script type=”text/javascript” src=”pulse/build/bin/pulse.debug.js”></script>
      </head>
    </html>

You can also include all the necessary Pulse files "on the fly" using [RequireJS][2] with the the [order plugin][3]. Once you have RequireJS included, you include Pulse.js from the *src* folder and call init, passing in the path to the *src* folder. The whole block will look something like so:

    <html>
      <head>
        <script src="lib/require.js"></script>
        <script type="text/javascript">
          requirejs.config({ paths: { order: "lib/order" }});
        </script>
        <script src="lib/pulse/src/pulse.js" type="text/javascript"></script>
        <script type="text/javascript">
          //Include game files here.
          pulse.init('lib/pulse/src');
        </script>
      </head>
    </html>
    
This allows you to run the code with any changes made without rebuilding Pulse.

#Using Pulse
##pulse Namespace
Every object within Pulse resides in the “pulse” namespace (pulse.Sprite, pulse.Layer, etc).

##Ready Callback
Pulse will raise a ready callback when the DOM and Pulse are both ready for use. The game’s javascript file should use this callback as the starting point for implementation.

    pulse.ready(function() {
      //TODO: start building a game
    });
    
##The Engine
The Pulse Engine object is the root class for a given game. Each Engine object is responsible for maintaining the visual state of a single game window. Websites can run multiple games simultaneously - each one will have a separate Engine object. The constructor for the Engine object requires a DOM object (or id) that will be used as the hosting element for the game.

These are typically DIV elements, but can be other types if needed.

    pulse.ready(function() {
      var engine = new pulse.Engine( { gameWindow: “myDivElementId” } );
    });

##Starting the Engine
After the game has been configured and is ready to begin, call go on the Engine class. The only required argument is the frames per second the game will run at. For example:

    pulse.ready(function() {
      //The game is all setup here.
      ...
      engine.go(33);
    });

The go function also accepts an optional callback that will be invoked on each update loop. This callback can be used to control game logic, animations, etc. For sufficiently advanced games, however, it is recommended to extend the base Pulse classes.

##Visual Hierarchy
Visual elements (nodes) in Pulse are organized into Layers, Scenes, and an Engine. Each game can have only one Engine. Each Engine can include multiple Scenes, however only one scene can be active at any given time. Each scene can contain multiple layers and each layer can include multiple nodes (sprites, text, etc).

The minimum amount of code required to display something to the screen is:

    pulse.ready(function() {
      var engine = new pulse.Engine( { gameWindow: "myDivElementId" } );
      var scene = new pulse.Scene();

      engine.scenes.addScene(scene);
      engine.scenes.activateScene(scene);

      var layer = new pulse.Layer( { x : 320, y : 240 } );
      scene.addLayer(layer);

      var diamond = new pulse.Sprite({ src: 'img/diamond.png' });
      diamond.position = { x: 320, y: 240 };
      layer.addNode(diamond);

      engine.go(33);
    });

##Extending Pulse Classes
All Pulse classes are implemented using a classical approach to inheritance, which makes extending them very easy. To extend the update logic of sprite, you would use the following code:

    var MyCustomSprite = pulse.Sprite.extend({
      //The update function is the most likely function to override.
      update: function(elapsed) {
        //Custom update logic - change the position, etc.

        //Remember to always call the base version.
        this._super(elapsed);
      }
    });

Refer to the game demos in the [pulse-demos project][4] for more complex and practical uses of object inheritance.

##The Render Loop
Each update cycle is split into two parts - update and render. The update loop is used to set the visual state of the object before it is rendered to the screen. This is where an object’s new position, color, texture, etc should be assigned. The render loop will then draw the object’s visual state to the screen.

Pulse includes optimizations to ensure objects are not redrawn if their visual states have not been altered.

##Events
Pulse supports many types of mouse and keyboard events. Each object has an instance of EventManager ([object].events) that can be used to bind events. For example, I can bind to a keydown event using the following code:

    scene.events.bind('keydown', function(e) {
      if(e.keyCode == 37) {
        arrowLeft = true;
      }
      if(e.keyCode == 39) {
        arrowRight = true;
      }
      if(e.keyCode == 38) {
        arrowUp = true;
      }
      if(e.keyCode == 40) {
        arrowDown = true;
      }
    });

#More Information
You can find full documentation at [http://www.withpulse.com/docs/][6].

If, in the course of using Pulse, you find bugs or would like to see a new feature, please send specific details to [support@withpulse.com][6].


  [1]: http://requirejs.org/docs/download.html#order
  [2]: http://requirejs.org/docs/download.html#requirejs
  [3]: http://requirejs.org/docs/download.html#order
  [4]: https://github.com/onmodulus/pulse-demos
  [5]: http://www.withpulse.com/docs/
  [6]: mailto:support@withpulse.com