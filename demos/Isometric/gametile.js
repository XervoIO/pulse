GameTile = function() {
  
  this.gridX = 0;
  this.gridY = 0;
  
  this.normalSprite = new pulse.Sprite({src: 'tile.png'});
  
  this.overSprite = new pulse.Sprite({src: 'selected.png'});
  this.overSprite.visible = false;
  
  this.setWorldCoords = function(x, y) {
    this.normalSprite.move(x, y);
    this.overSprite.move(x, y);
  }
  
  this.mouseenter = function() {
    this.overSprite.visible = true;
    this.normalSprite.visible = false;
  }
  
  this.mouseleave = function() {
    this.overSprite.visible = false;
    this.normalSprite.visible = true;
  }
}
