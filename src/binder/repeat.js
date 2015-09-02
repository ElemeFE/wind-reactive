var RepeatBinder = function(el, options, context) {
  this.element = el;
  this.valueFn = options.fn && options.fn.bind(context);
  this.extra = options;
  this.context = context;


  if (options.trackBy === '$index') {
    this.trackByIndex = true;
    this.trackByFn = new Function('return this.$index;');
  } else {
    this.trackByFn = new Function('return this.' + options.item + '.' + options.trackBy + ';');
  }
  this.itemKey = options.item;
  this.value = options.value;

  this.itemTemplate = options.itemTemplate;
};

var insertAfter = function(node, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(node, refNode.nextSibling);
  }
};

RepeatBinder.prototype.diff = function (current) {
  var nameOfKey = this.itemKey;
  var trackByFn = this.trackByFn;

  var currentMap = {};
  var prevContext = null;

  for (var i = 0, j = current.length; i < j; i++) {
    var item = current[i];

    var subContext = {};
    subContext.$index = i;
    subContext.$prev = prevContext ? trackByFn.call(prevContext) : null;
    subContext[nameOfKey] = item;

    currentMap[trackByFn.call(subContext)] = subContext;

    prevContext = subContext;
  }

  var removed = [];
  var added = [];
  var moved = [];

  var lastMap = this.lastMap || {};

  var trackByIndex = this.trackByIndex;

  for (var lastKey in lastMap) {
    if (lastMap.hasOwnProperty(lastKey)) {
      var lastContext = lastMap[lastKey];
      var currentContext = currentMap[lastKey];
      if (!currentContext) {
        removed.push(lastContext);
      } else if (currentContext && lastContext && trackByIndex &&
        currentContext[nameOfKey] !== lastContext[nameOfKey]) { // when track by $index
        removed.push(lastContext);
        added.push(currentContext);
      }
    }
  }

  for (var currentKey in currentMap) {
    if (currentMap.hasOwnProperty(currentKey)) {
      var context = currentMap[currentKey];
      var prev = context.$prev;
      if (!lastMap[currentKey]) {
        added.push(context);
      } else if (lastMap[currentKey].$prev !== prev) {
        moved.push(context);
      }
    }
  }

  this.lastMap = currentMap;

  return {
    added: added,
    moved: moved,
    removed: removed
  };
};

RepeatBinder.prototype.patch = function (patch) {
  var itemElementMap = this.itemElementMap;
  if (!itemElementMap) {
    itemElementMap = this.itemElementMap = {};
  }

  var itemTemplate = this.itemTemplate;
  var trackByFn = this.trackByFn;
  var commentNode = this.refNode;

  var added = patch.added;
  var removed = patch.removed;
  var moved = patch.moved;

  var Reactive = require('../reactive');

  var element = this.element;

  removed.forEach(function (removeContext) {
    var key = trackByFn.apply(removeContext);
    var el = itemElementMap[key];
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
    if (removeContext.$destroy) {
      removeContext.$destroy();
    }
    delete itemElementMap[key];
  });

  var itemKey = this.itemKey;

  var context = this.context;

  added.forEach(function (newContext) {
    if (context.$extend) {
      var index = newContext.$index;
      delete newContext.$index;
      newContext = context.$extend(newContext);
      newContext.$index = index;
    }

    var prevKey = newContext.$prev;
    var refNode;

    if (prevKey !== null && prevKey !== undefined) {
      refNode = itemElementMap[prevKey];
    } else {
      refNode = commentNode;
    }

    var view = new Reactive(itemTemplate, newContext);

    if (refNode) {
      insertAfter(view.element, refNode);
    } else {
      element.insertBefore(view.element, element.firstChild);
    }

    itemElementMap[trackByFn.call(newContext)] = view.element;
  });

  moved.forEach(function(moveContext) {
    var key = trackByFn.apply(moveContext);
    var el = itemElementMap[key];
    if (!el) {
      throw new Error('some error happen when diff');
    }

    var prevKey = moveContext.$prev;
    var refNode;

    if (prevKey) {
      refNode = itemElementMap[prevKey];
    } else {
      refNode = commentNode;
    }

    insertAfter(el, refNode);
  });
};

RepeatBinder.prototype.update = function() {
  var context = this.context;

  var array = this.valueFn.call(context) || [];

  var patches = this.diff(array);
  this.patch(patches);
};

module.exports = RepeatBinder;