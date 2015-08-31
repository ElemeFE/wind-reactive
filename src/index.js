var config = require('./config');
var filter = require('./filter');
var binder = require('./binder');

module.exports = {
  Reactive: require('./reactive'),
  View: require('./view/view'),
  ViewFactory: require('./view/factory'),
  registerDirective: binder.register,
  Adapter: require('./adapter'),
  getDefaultAdapter: config.getDefaultAdapter,
  setDefaultAdapter: config.setDefaultAdapter,
  registerFilter: filter.registerFilter,
  getFilter: filter.getFilter
};