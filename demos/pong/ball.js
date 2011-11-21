var Ball = pulse.Sprite.extend({
  
  init: function(params) {
    this._super(params);
    
    this.velocity = { };
    this.velocity.x = .25;
    this.velocity.y = .25;
    
    this.maxX = 760;
    this.maxY = 480;
  },
  
  update: function(elapsed) {
    this._super(elapsed);
    
    this.position.x += elapsed * this.velocity.x;
    this.position.y += elapsed * this.velocity.y;
    
    var xMax = this.maxX - (this.size.width / 2);
    var yMax = this.maxY - (this.size.height / 2);
    var xMin = this.size.width / 2;
    var yMin = this.size.height / 2;
    
    if(this.position.x > xMax) {
      this.position.x = xMax;
      this.velocity.x *= -1;
      this.score.playerScore();
    }
    
    if(this.position.x < xMin) {
      this.position.x = xMin;
      this.velocity.x *= -1;
      this.score.aiScore();
    }
    
    if(this.position.y < yMin) {
      this.position.y = yMin;
      this.velocity.y *= -1;
    }
    
    if(this.position.y > yMax) {
      this.position.y = yMax;
      this.velocity.y *= -1;
    }
  },
});
