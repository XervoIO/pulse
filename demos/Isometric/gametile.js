GameTile = function() {
  
  this.gridX = 0;
  this.gridY = 0;
  
  this.normalSprite = new PFPlay.Sprite({src: 'tile.png'});
  
  this.overSprite = new PFPlay.Sprite({src: 'selected.png'});
  this.overSprite.visible = false;
  
  this.setWorldCoords = function(x, y) {
    this.normalSprite.move(x, y);
    this.overSprite.move(x, y);
  }
  
  this.mouseenter = function() {
    console.log('mouseenter ' + this.gridX + ", " + this.gridY);
    this.overSprite.visible = true;
    this.normalSprite.visible = false;
  }
  
  this.mouseleave = function() {
    console.log('mouseleave ' + this.gridX + ", " + this.gridY);
    this.overSprite.visible = false;
    this.normalSprite.visible = true;
  }
}
