/**
 * This is the main game object. It controls any vital
 * processes that are of global scope. The game logic 
 * loop for example.
 * @author Richard Key
 * @constructor
 */

var img = new Image();
img.src = 'Forest_blue.jpg';   

function gameGo() {
  
  var gw = document.getElementById('gameWindow');
  var gwContext = gw.getContext('2d');
  gwContext.drawImage(img, 0, 0);
};

function Scene(pName, pWidth, pHeight)
{
  var name = pName;
  var layers = new Array();
  var buffer = document.createElement("canvas");
  buffer.width = pWidth
  buffer.height = pHeight;
  
  this.draw = function()
  {
    
  };
  
  this.play = function()
  {
    
  };
}
