console.log('kridantadarshika service worker start');
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var url='https://kridantaapp.fly.dev/?word='.concat(request.word);//https://kridantaapp.fly.dev/
    fetch(url)
    .then(response => response.json())
    .then(response => sendResponse(response));
    return true;
  }
);
console.log('kridantadarshika service worker end');
