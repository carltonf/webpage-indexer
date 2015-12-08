bgGlobal.contentScripts = [
  {
    "run_at": "document_end",
    "js": [ "scripts/content/vendor/outliner.min.js",
            "scripts/content/ol-locator.js",
            "scripts/content/getOL.js" ],
  }
];

bgGlobal.injectScripts = function bgGlobalInjectScripts (tabId) {
  this.contentScripts.forEach(
    scriptBlock =>
      scriptBlock.js.forEach(
        scriptFile => chrome.tabs.executeScript(tabId, {
          runAt: scriptBlock.run_at,
          file: scriptFile,
        })
      )
  );
};
