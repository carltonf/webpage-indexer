'use strict';

function tweakH5OutlineHTML () {
  var allEntries = document.querySelectorAll('li > a');
  var i = 0;
  var divContainer = null;
  var editButton = null;
  var entry = null;

  for (i = 0; i < allEntries.length; i++) {
    entry = allEntries[i];
    divContainer = document.createElement('div');
    divContainer.classList.add('ol-entry-container');

    entry.parentNode.replaceChild(divContainer, entry);

    divContainer.appendChild(entry);
    editButton = document.createElement('span');
    editButton.classList.add('entry-edit-btn');
    editButton.textContent = '✎';
    divContainer.appendChild(editButton);
  }
}

function initOutline (outlineStr) {
  var outlineEl = document.querySelector('#outline');
  outlineEl.innerHTML = outlineStr;

  // TODO we should really reimplement the outlining algorithm to allow more
  // customization options and output formats.
  tweakH5OutlineHTML();
}

function setUpOutlineLink (tabId) {
  var outlineEl = document.querySelector('#outline');
  outlineEl.addEventListener('click', function outlineLinkClickHandler (e) {
    var lnk = e.target;
    var hash = null;
    var path = null;
    if (lnk.nodeName !== 'A') {
      return;
    }

    path = lnk.getAttribute('data-csspath');
    if (path) {
      chrome.tabs.sendMessage(tabId, {cmd: "doc.jumpTo", path: path});
    } else {
      hash = lnk.href.substring(lnk.href.indexOf('#'));
      chrome.tabs.sendMessage(tabId, {cmd: "doc.jumpTo", hash: hash});
    }

    e.preventDefault();
  });
}

// communicate with content scripts
// all supported commands prefixed with 'popup.'
chrome.runtime.onMessage.addListener(function popupwinContentMsgHandler (req, sender) {
  switch (req.cmd) {
  case 'popup.populateOutline':
    initOutline(req.outline);
    setUpOutlineLink(sender.tab.id);
    break;
  case 'popup.addUserIndex':
    const newIndexInfo = req.indexInfo;
    const newEntry = document.createElement('li');
    const newLnk = document.createElement('a');
    // the section will always has an id (the h5o implementation ensures that)
    // we need to manipulate the list where this section heading remains
    const section = document.querySelector('a[href="' + newIndexInfo.sectionPath + '"]').parentNode;
    const indexPath = newIndexInfo.indexPath;
    const indexName = newIndexInfo.indexName;
    let sectionSubSection = section.querySelector('ol');

    newEntry.appendChild(newLnk);
    newLnk.setAttribute('data-csspath', indexPath);
    newLnk.href = '#';          // not used
    newLnk.textContent = indexName;

    if (!sectionSubSection) {
      sectionSubSection = document.createElement('ol');
      section.appendChild(sectionSubSection);
    }

    sectionSubSection.appendChild(newEntry);
    break;
  default:
  }
});
