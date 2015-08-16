var create = require('../create');
var util = require('../util');

var IFBinder = function(el, valueFn, extra) {
  this.element = el;
  this.valueFn = valueFn;
  this.extra = extra;
};

IFBinder.prototype.update = function() {
  var element = this.element;
  if (typeof element === 'string') {
    element = this.element = this.reactive.refs[element];
  }
  var extra = this.extra;
  var value = this.valueFn();
  var dom;

  value = !!value;
  if (value) {
    dom = create(extra.template);
    this.dom = dom;

    var insertMode = extra.insertMode;
    var refNode = extra.refNode;

    if (typeof refNode === 'string') {
      refNode = null;
    }

    util.insertNode(dom, element, insertMode, refNode);
  } else {
    dom = this.dom;
    if (dom) {
      if (dom.parentNode === element) {
        element.removeChild(dom);
      }
      this.dom = null;
    }
  }
};

module.exports = IFBinder;