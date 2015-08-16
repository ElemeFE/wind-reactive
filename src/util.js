var set = function(object, prop, value) {
  if (prop === undefined || prop === null) return;

  if (typeof prop === 'object') {
    object = prop;
    for (prop in object) {
      if (object.hasOwnProperty(prop)) {
        set(prop, object[prop]);
      }
    }
  } else {
    prop = prop || '';
    var paths = prop.split('.');
    var current = object;
    for (var i = 0, j = paths.length; i < j; i++) {
      var path = paths[i];
      if (!current) break;
      if (i === j - 1) {
        current[path] = value;
        break;
      }
      current = current[path];
    }
  }
};

module.exports = {
  getPath: function(object, prop) {
    prop = prop || '';
    var paths = prop.split('.');
    var current = object;
    var result = null;
    for (var i = 0, j = paths.length; i < j; i++) {
      var path = paths[i];
      if (!current) {
        break;
      }
      if (i === j - 1) {
        result = current[path];
        break;
      }
      current = current[path];
    }
    return result;
  },
  setPath: set,
  insertNode: function(node, parentNode, insertMode, refNode) {
    if (!node || !parentNode) return;
    insertMode = insertMode || 'end';

    switch(insertMode) {
      case 'begin':
        parentNode.insertBefore(node, parentNode.firstChild);
        break;
      case 'end':
        parentNode.appendChild(node);
        break;
      case 'before':
        if (refNode) {
          parentNode.insertBefore(node, refNode);
        } else {
          throw new Error('refNode is required when insertMode is before!');
        }
        break;
      case 'after':
        if (refNode) {
          parentNode.insertBefore(node, refNode.nextSibling);
        } else {
          throw new Error('refNode is required when insertMode is after!');
        }
        break;
    }
  }
};