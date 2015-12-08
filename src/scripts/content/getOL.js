'use strict';

var getCSSPath = window.getCSSPath;
var getSectionForNode = window.getSectionForNode;

var html5Outline = window.HTML5Outline;
var outline = html5Outline(document.body);
var possibleUserIndex = null;
outline = outline ? outline.asHTML(true) : "No outline - is there a FRAMESET?";

chrome.runtime.sendMessage({cmd: 'popup.populateOutline', 'outline': outline});

// All supported commands prefixed with 'doc.'
chrome.runtime.onMessage.addListener(function contentOLMsgListener (req) {
  switch (req.cmd) {
  case 'doc.jumpTo':
    if (req.hash) {
      location.href = req.hash;
    } else {
      document.querySelector(req.path).scrollIntoView(true);
    }
    break;
  case 'doc.addUserIndex':
    if (!possibleUserIndex) {
      console.error('addUserIndex command failed: no user selected node.');
      return;
    }
    const info = {
      indexName: req.name,
      sectionPath: getCSSPath(getSectionForNode(possibleUserIndex)),
      indexPath: getCSSPath(possibleUserIndex),
    };
    chrome.runtime.sendMessage({
      cmd: 'popup.addUserIndex',
      indexInfo: info,
    });
    break;
  default:
  }
});

document.addEventListener('contextmenu', function contextMenuTargetCB (e) {
  // register context menu target for possible user index
  possibleUserIndex = e.target;
});
