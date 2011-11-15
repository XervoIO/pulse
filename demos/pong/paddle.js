var Paddle = pulse.Sprite.extend({
  init: function(params) {
    this._super(params);
    
    this.arrowUp = false;
    this.arrowDown = false;
    
    this.size.width = 50;
    this.size.height = 200;

    this.events.bind('keydown', 
      function(e) {
        if(e.keyCode == 38) {
          e.sender.arrowUp = true;
        }  
        else if(e.keyCode == 40) {
          e.sender.arrowDown = true;
        }
      });
      
    this.events.bind('keyup',
      function(e) {
        if(e.keyCode == 38) {
          e.sender.arrowUp = false;
        }  
        else if(e.keyCode == 40) {
          e.sender.arrowDown = false;
        }
      });
  },
  
  update: function(elapsed) {
    this._super(elapsed);
    
    if(this.auto) {
      if(this.ball.position.y < this.position.y) {
        this.position.y -= .15 * elapsed;
      }
      else if(this.ball.position.y > this.position.y) {
        this.position.y += .15 * elapsed;
      }
    }
    else {
      if(this.arrowUp) {
        this.position.y -= .15 * elapsed;
      }
      else if(this.arrowDown) {
        this.position.y += .15 * elapsed;
      } 
    }
  }  
});
