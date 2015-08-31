var util = require('../util');
var dom = require('wind-dom');

var ModelBinder = function(el, options, context) {
  this.element = el;
  this.valueFn = null;
  this.valuePath = options.extra;
  this.context = context;
  this.eventBinded = false;
};

ModelBinder.prototype.update = function() {
  var path = this.valuePath;
  var el = this.element;
  if (!this.eventBinded) {
    if (typeof el === 'string') {
      el = this.element = this.reactive.refs[el];
    }

    var self = this;

    var callback = function() {
      var context = self.context;
      if (context.$set) {
        if (el.type === 'checkbox') {
          context.$set(path, !!el.checked);
        } else if (el.type === 'radio') {
          if (el.checked) {
            context.$set(path, el.value);
          }
        } else {
          context.$set(path, el.value);
        }
      } else {
        util.setPath(context, path, el.value);
      }
    };

    dom.on(el, 'change', callback);
    if (el.type === 'text') {
      dom.on(el, 'keyup', callback);
    }

    this.eventBinded = true;
  }

  var context = this.context;
  var value;
  if (context.$get) {
    value = context.$get(path);
  } else {
    value = util.getPath(context, path);
  }

  var checked;
  if (el.type === 'checkbox') {
    checked = !!value;
    if (el.checked !== checked) {
      el.checked = checked;
    }
  } else if (el.type === 'radio') {
    var inputValue = el.value;
    checked = inputValue == value;
    if (el.checked !== checked) {
      el.checked = checked;
    }
  } else {
    if (el.value !== value) {
      el.value = value;
    }
  }
};

module.exports = ModelBinder;