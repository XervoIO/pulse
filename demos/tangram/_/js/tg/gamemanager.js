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
    }
  }
});