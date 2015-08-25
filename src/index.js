var config = require('./config');

module.exports = {
  Reactive: require('./reactive'),
  View: require('./view/view'),
  ViewFactory: require('./view/factory'),
  Adapter: require('./adapter'),
  getDefaultAdapter: config.getDefaultAdapter,
  setDefaultAdapter: config.setDefaultAdapter
};