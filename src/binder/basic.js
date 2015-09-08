var domUtil = require('wind-dom');

var binders = {};

binders.text = function(el, value) {
  if (value === null || value === undefined) {
    value = '';
  } else {
    value = '' + value;
  }
  if (el.nodeType === 3) {
    el.nodeValue = value;
  } else {
    el.innerText = el.textContent = value;
  }
};

binders.html = function(el, value) {
  if (value === null || value === undefined) {
    value = '';
  } else {
    value = '' + value;
  }
  el.innerHTML = value;
};

binders.show = function(el, value) {
  value = !!value;
  el.style.display = value ? '' : 'none';
};

binders.hide = function(el, value) {
  value = !!value;
  el.style.display = value ? 'none' : '';
};

binders['class'] = function(el, value, className) {
  value = !!value;
  if (value) {
    domUtil.addClass(el, className);
  } else {
    domUtil.removeClass(el, className);
  }
};

binders.attr = function(el, value, attr) {
  if (value === undefined || value === null) {
    value = '';
  }

  if (el && attr) {
    if (el.nodeType) {
      if (attr === 'disabled') {
        if (!!value) {
          el.setAttribute('disabled', '');
        } else {
          el.removeAttribute('disabled');
        }
      } else {
        el[attr] = value;
      }
    } else if (el.set) {
      el.set(attr, value);
    }
  }
};

binders.style = function(el, value, styleName) {
  if (value === undefined || value === null) {
    value = '';
  } else {
    value = '' + value;
  }

  if (el && styleName) {
    domUtil.setStyle(el, styleName, value);
  }
};

binders.event = function(el, value, eventName) {
  if (el && eventName && value) {
    el.addEventListener(eventName, value, false);
  }
};

module.exports = binders;