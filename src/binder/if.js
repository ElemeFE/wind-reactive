var util = require('../util');

var IFBinder = function(el, valueFn, extra, model) {
  this.element = el;
  this.valueFn = valueFn;
  this.extra = extra;
  this.model = model;
};

IFBinder.prototype.update = function() {
  var element = this.element;
  if (typeof element === 'string') {
    element = this.element = this.reactive.refs[element];
  }

  var extra = this.extra;
  var value = this.valueFn();

  var dom;

  var Reactive = require('../reactive');

  value = !!value;
  if (value) {
    if (this.dom) return;

    var view = Reactive(extra.template, this.model);
    dom = view.element;
    this.dom = dom;

    var insertMode = extra.insertMode;
    var refNode = this.refNode;

    if (typeof refNode === 'string') {
      refNode = null;
    }

    if (extra.commentIndex !== undefined) {
      refNode = extra.commentIndex;
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