var defaultAdapter = require('./adapter');
module.exports = {
  setDefaultAdapter: function(adapter) {
    defaultAdapter = adapter;
  },
  getDefaultAdapter: function() {
    return defaultAdapter;
  }
};