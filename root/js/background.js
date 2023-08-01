import { sdict } from './cae_yat.js'; 

var isProduction = false;

console.log('kridantadarshika version: ' + chrome.runtime.getManifest().version); 
console.log('extension id: ' + chrome.runtime.id);
console.log('is_prod: ' + isProduction);


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type == 'parse')
      parse(request, sender, sendResponse);
    else if(request.type == 'dbLookup')
      lookup(request, sender, sendResponse);
    return true;
  }
);

function parse(request,sender,sendResponse){
    var hosts=['http://localhost:8001','https://kridantaapp.fly.dev'];
    //var i = Math.random() > 0.5 ? 1 : 0;
    var i= isProduction ? 1:0;
    var url=hosts[i].concat('/?word=').concat(request.word).concat('&version=').concat(request.version).concat('&trigtype=').concat(request.trigtype);
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(response => sendResponse(response))
    .catch(error => {
            console.error("server ERROR in parsing: "+request.rawWord);
            sendResponse({mainData:{},auxData:[],version:"B"});
            //console.error(error);
            // Handle the error here
        });
    //return true;
}

function lookup(request,sender,sendResponse){
  var ans = '';
  if(request.word in sdict)
    ans = sdict[request.word];
  sendResponse(ans);
  return true;
}
