bgGlobal.injectScripts = (function(){
  // programmatic injections
  var olIndexerScripts = [
    {
      "run_at": "document_end",
      "js": [ "scripts/content/vendor/outliner.min.js",
              "scripts/content/getOL.js" ],
    }
  ];

  function injectScriptsFunc (tabId) {
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

  return injectScriptsFunc;
})();

