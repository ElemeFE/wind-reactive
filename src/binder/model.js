var util = require('../util');
var dom = require('wind-dom');

var ModelBinder = function(el, options, context) {
  this.element = el;
  this.valueFn = null;
  this.valuePath = options.key;
  this.context = context;
  this.eventBinded = false;
};

ModelBinder.prototype.update = function() {
  var path = this.valuePath;
  if (!this.eventBinded) {
    var el = this.element;
    if (typeof el === 'string') {
      el = this.element = this.reactive.refs[el];
    }

    var self = this;

    var callback = function() {
      var context = self.context;
      if (context.$set) {
        if (el.type === 'checkbox') {
          context.$set(path, el.checked);
        } else {
          context.$set(path, el.value);
        }
      } else {
        util.setPath(context, path, el.value);
      }
    };

    dom.on(el, 'change', callback);
    dom.on(el, 'keyup', callback);

    this.eventBinded = true;
  }

  var context = this.context;
  var value;
  if (context.$get)
    value = context.$get(path);
  else {
    value = util.getPath(context, path);
  }

  if (this.element.value !== value) {
    this.element.value = value;
  }
};

module.exports = ModelBinder;