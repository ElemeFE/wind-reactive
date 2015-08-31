var util = require('../util');

var IFBinder = function(el, options, context) {
  this.element = el;
  this.valueFn = options.fn && options.fn.bind(context);
  this.options = options;
  this.context = context;
};

IFBinder.prototype.update = function() {
  var element = this.element;
  if (typeof element === 'string') {
    element = this.element = this.reactive.refs[element];
  }

  var options = this.options;
  var value = this.valueFn();

  var dom;

  var Reactive = require('../reactive');

  value = !!value;
  if (value) {
    if (this.dom) return;

    var view = Reactive(options.template, this.context);
    dom = view.element;
    this.dom = dom;

    var insertMode = options.insertMode;
    var refNode = this.refNode;

    if (typeof refNode === 'string') {
      refNode = null;
    }

    if (options.commentIndex !== undefined) {
      refNode = options.commentIndex;
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