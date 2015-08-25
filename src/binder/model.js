var util = require('../util');

var ModelBinder = function(el, valueFn, extra, model) {
  this.element = el;
  this.valueFn = valueFn;
  this.extra = extra;
  this.model = model;
};

ModelBinder.prototype.update = function() {
};

module.exports = ModelBinder;