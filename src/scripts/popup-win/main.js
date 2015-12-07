'use strict';

var targetTabId = null;

function initOutline (outlineStr) {
  var outlineEl = document.querySelector('#outline');
  outlineEl.innerHTML = outlineStr;
}

function setUpOutlineLink () {
  var outlineEl = document.querySelector('#outline');
  // FIX the logic below feels weired....
  var links = outlineEl.getElementsByTagName('a');
  for (var i=0; i < links.length; i++) {
	links[i].onclick=function(e) {
	  var lnk = e.target;
	  while (lnk.nodeName!='A' && lnk) lnk = lnk.parentNode;
	  
	  e.preventDefault();
	  var id = lnk.href.substring(lnk.href.indexOf('#')+1);
	  chrome.tabs.sendMessage(targetTabId, {cmd: "jumpTo", id: id});
	}
  }
}

// communicate with content scripts
chrome.runtime.onMessage.addListener(function(req, sender){
  switch (req.cmd) {
  case 'outlineResult':
    targetTabId = sender.tab.id;
    initOutline(req.result);
    setUpOutlineLink();
    break;
  default:
  }
});
