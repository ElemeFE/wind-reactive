var util = require('../util');
var dom = require('wind-dom');

var ModelBinder = function(el, valueFn, extra) {
  this.element = el;
  this.valueFn = null;
  this.valuePath = extra;

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
      var model = self.model;
      if (model.$set) {
        if (el.type === 'checkbox') {
          model.$set(path, el.checked);
        } else {
          model.$set(path, el.value);
        }
      } else {
        util.setPath(model, path, el.value);
      }
    };

    dom.on(el, 'change', callback);
    dom.on(el, 'keyup', callback);

    this.eventBinded = true;
  }

  var model = this.model;
  var value;
  if (model.$get)
    value = model.$get(path);
  else {
    value = util.getPath(model, path);
  }

  if (this.element.value !== value) {
    this.element.value = value;
  }
};

module.exports = ModelBinder;