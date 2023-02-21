console.log('kridantadarshika service worker start');
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var hosts=['https://kridantaapp.fly.dev','http://localhost:8000'];
    //var i = Math.random() > 0.5 ? 1 : 0;
    var i=0;
    var url=hosts[i].concat('/?word=').concat(request.word).concat('&version=').concat(request.version);
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(response => sendResponse(response));
    return true;
  }
);
console.log('kridantadarshika service worker end');
