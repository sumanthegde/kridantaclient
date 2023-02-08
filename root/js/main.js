// info on shadow: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
function showShadow(e){
  const shadowHostId= "snskrtbxuniq";
  if(document.getElementById(shadowHostId) != null)
    return;
  var selection = window.getSelection();
  selected = selection.toString().trim();
  if(!hasDevanagari(selected))
    return;
  var body = document.getElementsByTagName("BODY")[0];
  const shadowHost = document.createElement('div');
  shadowHost.id= shadowHostId;
  const shadowRoot = body.appendChild(shadowHost).attachShadow({mode: 'open'});
  const shadowStyle = document.createElement('style');
  shadowStyle.textContent = styleConfig;
  shadowRoot.appendChild(shadowStyle);
  const boxbox = document.createElement('span');
  boxbox.id = 'boxbox';
  setPosition(selection,boxbox);
  var respbox = document.createElement('span');
  respbox.id = 'respbox';
  var txtbox = document.createElement('input');
  txtbox.type = 'text';
  txtbox.id = 'txtbox';
  txtbox.value = selected;
  txtbox.autocomplete= 'off';
  txtbox.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
       fillShadow(e.target,respbox);
    }
  });
  boxbox.appendChild(txtbox);
  boxbox.appendChild(respbox);
  fillShadow(txtbox,respbox);
  shadowRoot.appendChild(boxbox);
  prepareToVanish(shadowHost);
}

function fillShadow(txtbox,respbox) {
  txt = txtbox.value;
  if(txt.length == 0 || !hasDevanagari(txt))
    return;
  encodedWord = encodeURI(txt);
  feedbackStr = '<a target="_blank" href="https://forms.gle/VUzn9PkFUVNP4DSb9">Feedback</a>';
  respbox.innerHTML='<i style="color:grey;">Checking…</i>';
  (async () => {
    t0 = Date.now();
    console.log(txt + ": "+ (new Date().toLocaleString()));
    const response = await chrome.runtime.sendMessage({word: encodedWord});
    t1 = Date.now();
    respbox.innerHTML='';
    if(Object.keys(response).length==0){
      feedback = document.createElement('span');
      feedback.id='feedback';
      feedback.innerHTML = feedbackStr;
      feedback.style.position = 'absolute';
      feedback.style.bottom = 0;
      feedback.style.right = 0;
      respbox.appendChild(feedback);
      tbl = document.createElement('table');
      cell = tbl.insertRow().insertCell();
      cell.style.color='grey';
      cell.style.fontStyle='italic';
      cell.appendChild(document.createTextNode('No data'));
      respbox.appendChild(tbl);
    }else{
      tbl = tablify(response);
      cap = tbl.createCaption();
      cap.innerHTML = feedbackStr;
      cap.style.captionSide='bottom';
      cap.style.textAlign='right';
      respbox.appendChild(tbl);
    }
    console.log(txt + ": "+ (t1-t0) + " ms");
  })();
}

function tablify(response){
  tbl = document.createElement('table');
  tbl.style.border = '1px solid #CCCCCC';
  tbl.style.borderCollapse = 'collapse';
  tbl.style.align = 'left';
  tbl.style.float = 'right';
  Object.keys(response).forEach(function(key) {
    const tr = tbl.insertRow();
    const td1 = tr.insertCell();
    anchor = document.createElement('a');
    anchor.appendChild(document.createTextNode(key));
    anchor.href = encodeURI('https://sanskritabhyas.in/Kridanta/View/'+encodeDha(key));
    anchor.target = '_blank';
    td1.appendChild(anchor);
    td1.style.border = '0.1px solid #CCCCCC';
    td1.style.fontWeight = 'bold';
    const td2 = tr.insertCell();
    td2.appendChild(document.createTextNode(response[key]));
    td2.style.border = '0.1px solid #CCCCCC';
  })
  return tbl;
}

function encodeDha(dha){
  var ret = dha.replaceAll('+','†');
  var posParen = ret.indexOf('(');
  if(posParen>-1){ // Assumed no णिच् in this case
    left = ret.substring(0,posParen).trim();
    right = ret.substring(posParen).slice(1,-1).replaceAll(' ','-');
    ret = left + '-' + right;
  }
  return ret;
}

function hasDevanagari(s){
  for(let i=0;i<s.length;i++){
    ch = s.charCodeAt(i);
    if(0x0900 <= ch && ch <= 0x0954)
      return true;
  }
  return false;
}

function setPosition(selection, box){
  var r = selection.getRangeAt(0).getBoundingClientRect();
  var R = document.body.parentNode.getBoundingClientRect();
  if(r.left==0 && r.right==0) 
    r = selection.anchorNode.getBoundingClientRect(); // maybe only keep this/
  box.style.top =(r.bottom -R.top)+'px';//this will place ele below the selection
  if(r.left>window.innerWidth*2/3)
    box.style.right=-(r.right-R.right)+'px';//this will align the right edges together
  else
    box.style.left=(r.left+R.left)+'px';//this will align the left edges together
}

styleConfig = `
    #txtbox{
       background: floralwhite;
       display: block;
       margin : 0 auto;
       border: 1px inset #EBE9ED;
    }
    #boxbox{
       position: absolute;
       background: Cornsilk;
       opacity: 1.0;
       border-radius: 3px;
       border: 1px solid LightGrey;
       padding: 5px;
       z-index: 99;
    }
     `;

function prepareToVanish(element) { //https://stackoverflow.com/a/3028037/10167011
  const isVisible = elem => 
    !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
  const outsideClickListener = event => {
    if (!element.contains(event.target) && isVisible(element)) {
      removeElement();
    }
  }
  const escapeKeyListener = (event) => {
    if(event.key === 'Escape'){
      removeElement();
    }
  }
  const removeElement = () => {
    element.remove();
    removeOutsideClickListener();
    removeEscapeKeyListener();
  }
  const removeOutsideClickListener = () => {
    document.removeEventListener('click', outsideClickListener);
  }
  const removeEscapeKeyListener = () => {
    document.removeEventListener('keydown', escapeKeyListener);
  }
  document.addEventListener('keydown', escapeKeyListener);
  document.addEventListener('click', outsideClickListener);
}

function showShadowOnDblClick(){
  const myDblClickListener = event => {
    showShadow(event);
  }
  document.addEventListener('dblclick', myDblClickListener);
}

showShadowOnDblClick();
