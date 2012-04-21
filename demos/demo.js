var queryString = getUrlVars();
if(queryString['demo'] !== undefined && queryString['demo'].length > 0) {
  pulse.addGameFile(queryString['demo'] + '.js');
  pulse.init('../src');
}

/* 
 * Read a page's GET URL variables and return them as an associative array. 
 * http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
 */
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(
      window.location.href.indexOf('?') + 1
    );
    hashes = hashes.split('&');
      
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    
    return vars;
}

function WriteLine(text) {
  var con = document.getElementById('console');
  con.value = con.value + text + '\n';
  con.scrollTop = 999999;
}
