// functions for editing outline entries
//
// all callbacks will be bound to '#outline', which is created at the very beginning
var outlineEl = document.querySelector('#outline');

functions entryEditActionBtnDispatcher(action){
  switch(action){
  case 'edit-promote-entry':
    break;
  case 'edit-demote-entry':
    break;
  case 'edit-promote-subtree':
    break;
  case 'edit-demote-subtree':
    break;
  case 'edit-up-subtree':
    break;
  case 'edit-down-subtree':
    break;
  case 'edit-rename':
    break;
  default:
  }
}

outlineEl.addEventListener('click', function entryEditActionBtnHandler (e) {
  var btn = e.target;
  var btnAction = null;

  if (!btn.classList.contains('entry-edit-action-btn')) {
    return;
  }

  // the 2nd class should represent the action
  btnAction = btn.classList[1];

  entryEditActionBtnDispatcher(btnAction);

  e.stopPropagation();
})
