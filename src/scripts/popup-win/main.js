'use strict';

function initOutline (outlineStr) {
  var outlineEl = document.querySelector('#outline');
  outlineEl.innerHTML = outlineStr;
}

function setUpOutlineLink (tabId) {
  var outlineEl = document.querySelector('#outline');
  outlineEl.addEventListener('click', function outlineLinkClickHandler (e) {
    var lnk = e.target;
    var hash = null;
    if (lnk.nodeName !== 'A') {
      return;
    }

    hash = lnk.href.substring(lnk.href.indexOf('#'));
    chrome.tabs.sendMessage(tabId, {cmd: "jumpTo", hash: hash});

    e.preventDefault();
  });
}

// communicate with content scripts
chrome.runtime.onMessage.addListener(function popupwinContentMsgHandler (req, sender) {
  switch (req.cmd) {
  case 'outlineResult':
    initOutline(req.result);
    setUpOutlineLink(sender.tab.id);
    break;
  default:
  }
});
