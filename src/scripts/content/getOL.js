var html5Outline = window.HTML5Outline;
var outline = html5Outline(document.body);
outline = outline ? outline.asHTML(true) : "No outline - is there a FRAMESET?";

chrome.runtime.sendMessage({cmd: 'outlineResult', result: outline});

chrome.runtime.onMessage.addListener(function contentOLMessageListener (req) {
  switch (req.cmd) {
  case 'jumpTo':
    location.href = req.hash;
    break;
  default:
  }
});
