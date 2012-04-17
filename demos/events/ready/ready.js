$(document).ready(function() {
  var console = document.getElementById('console');
  console.innerHTML += "Body Loaded! <br/>";
});

pulse.ready(function(){
  var console = document.getElementById('console');
  console.innerHTML += "Pulse Ready! <br/>";
});

function LoadPulse() {
  delete pulse;
  
  $.ajax({
    url: "../../../bin/pulse.js",
    dataType: "script",
    success: function() { 
      var console = document.getElementById('console');
      console.innerHTML += "Pulse Loaded! <br/>";
      pulse.ready(function(){
        console.innerHTML += "Pulse Ready! <br/>";
      });
    }
  });
}
