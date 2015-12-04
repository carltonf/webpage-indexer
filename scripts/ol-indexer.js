var outline = HTML5Outline(document.body);
outline = outline ? outline.asHTML(true) : "No outline - is there a FRAMESET?";

chrome.runtime.sendMessage({cmd: 'outlineResult', result: outline});

chrome.runtime.onMessage.addListener(function(req, sender){
  switch (req.cmd) {
  case 'jumpTo':
    location.href = '#' + req.id;
    break;
  }
})
