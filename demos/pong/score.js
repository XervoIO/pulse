var Score = pulse.CanvasLabel.extend({
  init: function(params) {
    this._super(params);
    
    this.scoreA = 0;
    this.scoreB = 0;
  },
  
  playerScore : function() {
    this.scoreA++;
    this.text = this.scoreA + " | " + this.scoreB;
  },
  
  aiScore : function() {
    this.scoreB++;
    this.text = this.scoreA + " | " + this.scoreB;
  }
});
