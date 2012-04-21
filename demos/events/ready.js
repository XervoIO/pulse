$(document).ready(function() {
  $('<button>Reload Pulse</button>').click(LoadPulse).prependTo('#debug');
  WriteLine('Body Loaded!');
});

pulse.ready(function(){
  WriteLine('Pulse Ready!');
});

function LoadPulse() {
  delete pulse;
  
  $.ajax({
    url: '../build/bin/pulse.js',
    dataType: 'script',
    success: function() { 
      WriteLine('Pulse Loaded!');
      pulse.ready(function(){
        WriteLine('Pulse Ready!');
      });
    }
  });
}
