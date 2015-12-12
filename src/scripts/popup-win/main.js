'use strict';

function tweakH5OutlineHTML () {
  var allEntries = document.querySelectorAll('li > a');
  var i = 0;
  var entryContent = null;
  var lnk = null;
  var entry = null;
  var entryContentTpl = document.querySelector('#tpl-ol-entry-content');

  for (i = 0; i < allEntries.length; i++) {
    lnk = allEntries[i];
    entry = lnk.parentNode;

    entryContent = document.importNode(entryContentTpl.content, true);
    entry.replaceChild(entryContent, lnk);
    entry.querySelector('div').replaceChild(lnk, entry.querySelector('a'));
  }
}

function initOutline (outlineStr) {
  var outlineEl = document.querySelector('#outline');
  outlineEl.innerHTML = outlineStr;

  // TODO we should really reimplement the outlining algorithm to allow more
  // customization options and output formats.
  tweakH5OutlineHTML();
}

function setupOLEntryNav (tabId) {
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

function setupOLEntryEdit () {
  var outlineEl = document.querySelector('#outline');
  // var entryEditBtns = document.querySelectorAll('.entry-edit-btn');
  var entryTpl = document.querySelector('#tpl-outline-entry-edit-box');

  outlineEl.addEventListener('click', function entryEditBtnClickHandler (e) {
    var btn = e.target;
    var entryContainer = null;
    var entryEditBox = null;
    if (!btn.classList.contains('entry-edit-btn')) {
      return;
    }

    entryContainer = btn.parentNode;

    if (entryContainer.querySelector('.entry-edit-box') === null) {
      // avoids multiple insertions
      entryContainer.appendChild(document.importNode(entryTpl.content, true));
    }
    entryEditBox = entryContainer.querySelector('.entry-edit-box');

    setTimeout(function delayedShowEditBox () {
      entryEditBox.classList.add('entry-edit-box-show');
    }, 50);

    e.stopPropagation();
  });
}

document.addEventListener('click', function outBandClickHandler () {
  var allShownEntryEditBoxes = document.querySelectorAll('.entry-edit-box-show');
  var i = 0;
  for (; i < allShownEntryEditBoxes.length; i++) {
    allShownEntryEditBoxes[i].classList.remove('entry-edit-box-show');
  }
});

// communicate with content scripts
// all supported commands prefixed with 'popup.'
chrome.runtime.onMessage.addListener(function popupwinContentMsgHandler (req, sender) {
  switch (req.cmd) {
  case 'popup.populateOutline':
    initOutline(req.outline);
    setupOLEntryNav(sender.tab.id);
    setupOLEntryEdit();
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
