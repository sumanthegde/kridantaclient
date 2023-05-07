// info on shadow: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
clientVersion=chrome.runtime.getManifest().version;
console.log(clientVersion);
function showShadow(e){
  const shadowHostId= "snskrtbxuniq";
  if(document.getElementById(shadowHostId) != null)
    return;
  var selection = window.getSelection();
  selected = selection.toString().trim();
  if(!hasDevanagariOnly(selected))
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
  txtbox.autocomplete= 'off';
  txtbox.value = selected; // || '';
  txtbox.placeholder = "type text & hit Enter!";
  txtbox.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
       fillShadow(e.target,respbox);
    }
  });

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.appendChild(txtbox);
//  container.appendChild(message);
  
  boxbox.appendChild(container);
  boxbox.appendChild(respbox);
  fillShadow(txtbox,respbox);
  shadowRoot.appendChild(boxbox);
//  txtbox.focus();
  prepareToVanish(shadowHost);
}

function fillShadow(txtbox,respbox) {
  txt = txtbox.value;
  if(txt.length == 0 || !hasDevanagariOnly(txt))
    return;
  encodedWord = encodeURI(txt);
  feedbackStr = '<a style="float: right;" target="_blank" href="https://forms.gle/VUzn9PkFUVNP4DSb9">Feedback</a>';
  respbox.innerHTML='<i style="color:grey;">Checking…</i>'+feedbackStr;
  (async () => {
    t0 = Date.now();
    console.log(txt + ": "+ (new Date().toLocaleString()));
    const response3 = await chrome.runtime.sendMessage({word: encodedWord, rawWord:txt, version:clientVersion, type:'parse'});
    t1 = Date.now();
    var response = response3['mainData'];
    var auxData = response3['auxData'];
    var combData = response3['combData'];
    var dmap = new Map();
    var dkmap = new Map();
    console.log(combData);
    if(combData.length>0){
      const responses = await Promise.all(combData[0].map(async ([word,kmap]) => {
        return await chrome.runtime.sendMessage({ word: word, type: 'dbLookup' });
      }));
      for (let i = 0; i < responses.length; i++) {
        dkmap.set(auxData[0][i], [responses[i],combData[0][i][1]]);
      }
    } 
    respbox.innerHTML='';
    if(dkmap.size==0){
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
      tbl = document.createElement('table');
      tbl.style.border = '1px solid #CCCCCC';
      tbl.style.borderCollapse = 'collapse';
      tbl.style.align = 'left';
      tbl.style.float = 'right';
      tbl.style.verticalAlign = "top";
      //table.style.textAlign = "left";
      if(dkmap.size>0)
        extendTable(dkmap,tbl);
      cap = tbl.createCaption();
      cap.innerHTML = feedbackStr;
      cap.style.captionSide='bottom';
      cap.style.textAlign='right';
      respbox.appendChild(tbl);
    }
    console.log(txt + ": "+ (t1-t0) + " ms");
  })();
//  return true;
}

// previously, input was a map {affixdha1: krits1, affixdha2: krits2}
// now, input is a map {word1: [d1, {affixdha1.1: krits1.1, affixdha1.2: krits1.2}], word2: [d2, {affixdha2.1: krits2.1}], ...}
function tablify(kmap) {
  var tbl = document.createElement('table');
  tbl.style.borderCollapse = 'collapse';
  tbl.style.align = 'left';
  tbl.style.float = 'left';
  tbl.style.color='black';
  tbl.style.fontStyle='italic';
  tbl.style.fontSize='0.8em';
  tbl.style.borderBottom = '1px solid #CCCCCC';
  tbl.style.backgroundColor = "#FFF5FE";

  Object.keys(kmap).forEach(function(key) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var anchor = document.createElement('a');
    anchor.appendChild(document.createTextNode(key));
    anchor.href = encodeURI('https://sanskritabhyas.in/Kridanta/View/'+encodeDha(key));
    anchor.target = '_blank';
    td1.appendChild(anchor);
    //td1.style.border = '0.1px solid #CCCCCC';
    td1.style.fontWeight = 'bold';
    tr.appendChild(td1);

    var td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(kmap[key]));
    td2.style.borderBottom = '0.1px solid #CCCCCC';
    tr.appendChild(td2);

    tbl.appendChild(tr);
  });

  return tbl;
}


function extendTable(dkmap,oldTable){
  dkmap.forEach(([value,kmap], key) => {
    const tr = oldTable.insertRow();
    tr.style.backgroundColor = "#E1F5FE";
    const td1 = tr.insertCell();
    anchor = document.createElement('a');
    anchor.appendChild(document.createTextNode(key));
    anchor.href = encodeURI('https://ashtadhyayi.com/kosha/?search=' + key);
    anchor.target = '_blank';
    td1.appendChild(anchor);
    td1.style.border = '0.1px solid #CCCCCC';
    td1.style.fontWeight = 'bold';
    td1.style.whiteSpace = "nowrap";
    td1.style.verticalAlign = 'top';
    const td2 = tr.insertCell();
    if(value==''){
      td2.style.color='grey';
      td2.style.fontStyle='italic';
      //td2.style.fontSize='0.8em';
      td2.appendChild(document.createTextNode('\u2190 Click the link to search.'));
    }
    td2.appendChild(untagDictEntry(value));
    td2.appendChild(tablify(kmap));
    td2.style.border = '0.1px solid #CCCCCC';
  });
}

function untagDictEntry(mytext){
  // create a temporary element to parse the XML-like tags
  const tempElement = document.createElement("div");
  tempElement.innerHTML = mytext;
  
  // iterate over all <lex> tags and apply italic styling to their text
  const lexTags = tempElement.getElementsByTagName("lex");
  for (let i = 0; i < lexTags.length; i++) {
    const lexTag = lexTags[i];
    const italicizedText = document.createElement("i");
    italicizedText.textContent = lexTag.textContent;
    lexTag.parentNode.replaceChild(italicizedText, lexTag);
  }
  
  // iterate over all <ab> tags and replace them with their text content in italic
  const abTags = tempElement.getElementsByTagName("ab");
  for (let i = 0; i < abTags.length; i++) {
    const abTag = abTags[i];
    const italicizedText = document.createElement("i");
    italicizedText.textContent = abTag.textContent;
    abTag.parentNode.replaceChild(italicizedText, abTag);
  }

  const delimitPattern = /{[%#]([^#%]+)[%#]}/g;
  const matchedDelimiters = mytext.match(delimitPattern);
  if (matchedDelimiters) {
    const delimitedTexts = mytext.split(delimitPattern);
    tempElement.innerHTML = delimitedTexts.map(text => {
      if (matchedDelimiters.includes(`{%${text}%}`) || matchedDelimiters.includes(`{#${text}#}`)) {
        return `<i>${text}</i>`;
      } else {
        return text;
      }
    }).join('');
  }

  return tempElement;
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

function hasDevanagariOnly(s){
  var d=0;
  for(let i=0;i<s.length;i++){
    ch = s.charCodeAt(i);
    if(0x0900 <= ch && ch <= 0x0954)
      d++;
    else
      return false;
  }
  return (d>0);
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
       background: white;
       display: block;
       margin : 0 auto;
       border: 1px inset #EBE9ED;
       box-sizing: border-box;
    }
    #txtbox:focus {
       outline: none;
       border-radius: 0;
       border: 2px solid blue;
       font-weight: bold;
    }
    #boxbox{
       position: absolute;
       background: Cornsilk;
       opacity: 1.0;
       border-radius: 3px;
       border: 1px solid LightGrey;
       padding: 5px;
       z-index: 4;
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
