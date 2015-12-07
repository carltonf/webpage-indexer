// Create new popup window
function createOLIndexerWin () {
  var createData = {
    url: "pages/popup-win.html",
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

  bgGlobal.injectScripts(bgGlobal.indexingTab.id);
});
