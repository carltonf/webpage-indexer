'use strict';

// functions for editing outline entries
//
// all callbacks will be bound to '#outline', which is created at the very beginning
//
// TODO refactor codes here into a separate library for manipulating outline
// tree, there are many reference projects in README

var outlineEl = document.querySelector('#outline');

function editActionPromoteSubtree (entry) {
  var entryList = entry.closest('ol');
  var parentEntry = entryList.closest('li');
  var parentEntryList = parentEntry.closest('ol');

  entryList.removeChild(entry);
  // insert after to make demote and promote reversible in some cases.
  // no insertAfter!!!
  parentEntryList.insertBefore(entry, parentEntry.nextElementSibling);
}

function editActionDemoteSubtree (entry) {
  // demote to become a child of its previous sibling
  var entryList = entry.closest('ol');
  var prevEntry = entry.previousElementSibling;
  var prevEntryContent = null;
  var prevEntrySublist = null;
  if (!prevEntry) {
    prevEntry = document.createElement('li');
    entryList.insertBefore(prevEntry, entry);

    prevEntryContent = document.importNode(document.querySelector('#tpl-ol-entry-content').content,
                                           true);
    prevEntry.appendChild(prevEntryContent);
  }

  prevEntrySublist = prevEntry.querySelector('ol');
  if (!prevEntrySublist) {
    prevEntrySublist = document.createElement('ol');
    prevEntry.appendChild(prevEntrySublist);
  }

  entryList.removeChild(entry);
  prevEntrySublist.appendChild(entry);
}

function editActionUpSubtree (entry) {
  var entryList = entry.closest('ol');
  var prevEntry = entry.previousElementSibling;
  if (!prevEntry) {
    // TODO add validation code to disable buttons
    console.log('No previous entry to move up');
    return;
  }

  entryList.insertBefore(entry, prevEntry);
}

function editActionDownSubtree (entry) {
  var entryList = entry.closest('ol');
  var nextEntry = entry.nextElementSibling;
  if (!nextEntry) {
    // TODO add validation code to disable buttons
    console.log('No next entry to move down');
    return;
  }

  entryList.insertBefore(entry, nextEntry.nextElementSibling);
}

function entryEditActionBtnDispatcher (action, entry) {
  switch (action) {
  case 'edit-promote-entry':
    break;
  case 'edit-demote-entry':
    break;
  case 'edit-promote-subtree':
    editActionPromoteSubtree(entry);
    break;
  case 'edit-demote-subtree':
    editActionDemoteSubtree(entry);
    break;
  case 'edit-up-subtree':
    editActionUpSubtree(entry);
    break;
  case 'edit-down-subtree':
    editActionDownSubtree(entry);
    break;
  case 'edit-rename':
    break;
  default:
  }
}

outlineEl.addEventListener('click', function entryEditActionBtnHandler (e) {
  var btn = e.target;
  var btnAction = null;
  var entry = null;

  if (!btn.classList.contains('entry-edit-action-btn')) {
    return;
  }

  // the 2ND class should represent the action
  btnAction = btn.classList[1];
  // find the nearest <li> element, use "element.closest" API, there is also a
  // loop version
  // ref: http://stackoverflow.com/q/22119673
  entry = btn.closest('li');

  entryEditActionBtnDispatcher(btnAction, entry);

  e.stopPropagation();
});
