var util = require('../util');

var expression = require('wind-expression');
var compileExpr = expression.compileExpr;

var RepeatBinder = function(el, valueFn, extra) {
  this.element = el;
  this.valueFn = valueFn;
  this.extra = extra;

  this.refNode = this.extra.refNode;

  this.itemTemplate = extra.itemTemplate;

  this.parseExpression(extra.expression);
};

var newContext = function() {
  return {};
};

var insertAfter = function(node, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(node, refNode.nextSibling);
  }
};

RepeatBinder.prototype.parseExpression = function (expression) {
  var nameOfKey;
  var valueExpression;
  var trackByExpression;

  var matches = expression.match(/\s*([\d\w]+)\s+in\s+(.+)\s+track\s+by\s+(.+)/);

  if (matches) {
    nameOfKey = matches[1];
    valueExpression = matches[2];
    trackByExpression = matches[3];
  } else {
    matches = expression.match(/\s*([\d\w]+)\s+in\s+(.+)/);
    if (!matches) {
      throw 'Wrong expression of repeat: ' + expression;
    }

    nameOfKey = matches[1];
    valueExpression = matches[2];
  }

  if (trackByExpression === undefined) {
    trackByExpression = '$index';
    this.trackByIndex = true;
  }

  this.itemKey = nameOfKey;
  this.trackBy = trackByExpression;
  this.value = valueExpression;

  this.trackByFn = compileExpr(trackByExpression);

  return {
    itemKey: nameOfKey,
    trackBy: trackByExpression,
    value: valueExpression
  };
};

RepeatBinder.prototype.diff = function (current) {
  var nameOfKey = this.itemKey;
  var trackByFn = this.trackByFn;

  var currentMap = {};
  var prevContext = null;

  for (var i = 0, j = current.length; i < j; i++) {
    var item = current[i];

    var subContext = newContext(this.context);
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

  added.forEach(function (newContext) {
    var prevKey = newContext.$prev;
    var refNode;

    if (prevKey !== null && prevKey !== undefined) {
      refNode = itemElementMap[prevKey];
    } else {
      refNode = commentNode;
    }

    var view = Reactive(itemTemplate, newContext);

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
  var extra = this.extra;
  var model = this.model;

  var expression = extra.expression;
  var result = this.parseExpression(expression);

  var array = util.getPath(model, result.value) || [];

  var patches = this.diff(array);
  this.patch(patches);
};

module.exports = RepeatBinder;