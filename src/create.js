var factory = require('./view/factory');

var create = function(config, refs, hook) {
  if (!config) return null;
  var dom, childElement, i, j, content;

  if (typeof config === 'string') return document.createTextNode(config);
  if (!config.$tag && config.hasOwnProperty('$text')) {
    var textNode = document.createTextNode(config.$text || '');
    if (config.$ref && refs) {
      refs[config.$ref] = textNode;
    }
    return textNode;
  }

  if (config.$tag) {
    dom = document.createElement(config.$tag);
    for (var prop in config) {
      if (config.hasOwnProperty(prop)) {
        if (prop === '$content' || prop === '$tag') continue;
        if (prop === '$ref' && refs) {
          var ref = config[prop];
          if (ref) {
            refs[ref] = dom;
          }
          continue;
        }
        dom[prop] = config[prop];
      }
    }
    content = config.$content;
    if (content) {
      if (typeof content === 'string') {
        childElement = document.createTextNode(content);
        dom.appendChild(childElement);
      } else {
        if (!(content instanceof Array)) {
          content = [ content ];
        }
        for (i = 0, j = content.length; i < j; i++) {
          var child = content[i];
          childElement = create(child, refs, hook);
          if (childElement) {
            dom.appendChild(childElement);
          }
        }
      }
    }
  } else if (config.$view) {
    if (config.$content) {
      config.content = config.$content;
      delete config.$content;
    }

    var component = factory.create(config.$view, config);

    if (typeof hook === 'function') {
      hook(component);
    }

    if (config.$ref && refs) {
      refs[config.$ref] = component;
    }

    var result = component.render();

    var contentBinder = component.template.contentBinder;

    if (contentBinder) {
      content = component.state.content || [];
      var parentNode = component.refs[contentBinder.node];

      var subViewHook = function (view) {
        component.subViews.push(view);
      };

      for (i = 0, j = content.length; i < j; i++) {
        var childConfig = content[i];
        childElement = create(childConfig, refs, subViewHook);

        if (childElement) {
          parentNode.appendChild(childElement);
        }
      }
    }

    return result;
  }

  return dom;
};

module.exports = create;