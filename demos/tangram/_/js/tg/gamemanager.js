var tg = tg || { };

tg.GameManager = PClass.extend(
{
  init: function() {
    this.selectedPiece = null;
  },

  rotateSelectedPiece: function(val) {
    if(this.selectedPiece) {
      this.selectedPiece.rotation += val;
    }
  }
});