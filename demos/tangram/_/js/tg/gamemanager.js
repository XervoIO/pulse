var tg = tg || { };

tg.GameManager = PClass.extend(
{
  init: function() {
    this.selectedPiece = null;
    this.pieces = [];
  },

  rotateSelectedPiece: function(val) {
    if(this.selectedPiece) {
      this.selectedPiece.rotation += val;
      if(this.selectedPiece.rotation < 0) {
        this.selectedPiece.rotation = 360 + this.selectedPiece.rotation;
      }
    }
  }
});