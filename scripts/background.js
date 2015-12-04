// global
var bgGlobal = {
  popup: {},
  indexingTab: {} 
};

// programmatic injections
var olIndexerScripts = [
  {
    "run_at": "document_end",
    "js": [ "scripts/outliner.min.js",
            "scripts/ol-indexer.js" ],
  }
];

function injectScripts (tabId) {
  olIndexerScripts.forEach(
    scriptBlock =>
      scriptBlock.js.forEach(
        scriptFile => chrome.tabs.executeScript(tabId, {
          runAt: scriptBlock.run_at,
          file: scriptFile,
        })
      )
  );
}

// Create new popup window
function createOLIndexerWin () {
  var createData = {
    url: "pages/ol-indexer.html",
    width: 350,
    height: 600,
    type: 'popup',
  };

  var createPopupProimse = new Promise(function createPopupPromiseExecutor (resolve) {
    chrome.windows.create(createData, function createPopupWinAsyncCB (win) {
      bgGlobal.popup.winId = win.id;
      bgGlobal.popup.tabId = win.tabs[0].id;

      resolve(null);
    });
  });

  return createPopupProimse;
}


chrome.browserAction.onClicked.addListener(function browserActionOnClickCB (tab) {
  createOLIndexerWin().then(true);

  bgGlobal.indexingTab.id = tab.id;

  injectScripts(bgGlobal.indexingTab.id);
});
