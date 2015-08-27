var config = require('./config');
var filter = require('./filter');

module.exports = {
  Reactive: require('./reactive'),
  View: require('./view/view'),
  ViewFactory: require('./view/factory'),
  Adapter: require('./adapter'),
  getDefaultAdapter: config.getDefaultAdapter,
  setDefaultAdapter: config.setDefaultAdapter,
  registerFilter: filter.registerFilter,
  getFilter: filter.getFilter
};