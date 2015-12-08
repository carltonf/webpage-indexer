var SectionDefs = {
  // todo only consider BODY for now
  Roots: ['BODY'],
  Elements: ['ARTICLE', 'ASIDE', 'NAV', 'SECTION'],
  // NOTE: HGROUP is NOT widely used and might not be standardized ever
  Headings: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HGROUP'],
};

// dumb algorithm:
// 1. Check whether the current node is a section start itself.
// 2. Search '.previousSibling' for possible sections starting nodes
// 3. Move up to '.parentNode' and repeat step 1 and 2.
// 4. Search till we reach the BODY which is by default a section root.
//
// TODO: the current algorithm disregards the user index/section, which should
// be considered by referring to the current outline instead of section
// definitions. We should manipulate the "Outline" data structure as returned by
// 'HTML5Outline' function.
function isSectionStart (node) {
  var nodeName = node.nodeName.toUpperCase();

  return (SectionDefs.Roots.indexOf(nodeName) > -1)
    || (SectionDefs.Elements.indexOf(nodeName) > -1)
    || (SectionDefs.Headings.indexOf(nodeName) > -1);
}

function isSectionStartInPreviousSiblings (node) {
  var tmpNode = node;
  while (tmpNode.previousElementSibling) {
    tmpNode = tmpNode.previousElementSibling;
    if (isSectionStart(tmpNode)) {
      return tmpNode;
    }
  }

  return false;
}

function getSectionForNode (node) {
  var secStartNode = null;
  var tmpNode = node;

  // NOTE: node will always reach 'body' first
  while (tmpNode) {
    if (isSectionStart(tmpNode)) {
      return tmpNode;
    }
    secStartNode = isSectionStartInPreviousSiblings(tmpNode);
    if (secStartNode) {
      return secStartNode;
    }

    tmpNode = tmpNode.parentNode;
  }
}

// Recreate CSS path with regards to the sectioning
// TODO get this path while searching for section?
//
// ref: http://stackoverflow.com/a/4588211/2526378
function getCSSPath (node) {
  var pathParts = [];
  var prevSiblingCount = 1;
  var tmpNode = node;
  var nodeName = node.nodeName.toLowerCase();

  while (tmpNode.parentNode) {
    nodeName = tmpNode.nodeName.toLowerCase();

    if (tmpNode.id) {
      pathParts.unshift('#' + tmpNode.id);
      break;
    } else {
      if (tmpNode === tmpNode.ownerDocument.documentElement) {
        pathParts.unshift(nodeName);
      } else {
        // note: "Node.previousSibling" might include text node.
        while (tmpNode.previousElementSibling) {
          prevSiblingCount++;
          tmpNode = tmpNode.previousElementSibling;
        }

        pathParts.unshift(nodeName + ":nth-child(" + prevSiblingCount + ")");
      }

      tmpNode = tmpNode.parentNode;
    }
  }

  return pathParts.join(" > ");
}

// Be explicit about global exports
window.getCSSPath = getCSSPath;
window.getSectionForNode = getSectionForNode;
window.isSectionStart = isSectionStart;
window.isSectionStartInPreviousSiblings = isSectionStartInPreviousSiblings;
