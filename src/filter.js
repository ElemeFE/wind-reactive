var filters = {};

filters.uppercase = function (value) {
  return (value || value === 0) ? value.toString().toUpperCase() : '';
};

filters.lowercase = function (value) {
  return (value || value === 0) ? value.toString().toLowerCase() : '';
};

filters.number = function(value, fractionSize) {
  return (value || value === 0) ? Number(value).toFixed(fractionSize ? fractionSize : 2) : value;
};

filters.json = function(value) {
  return (value || value === 0) ? JSON.stringify(value) : '';
};

var defaultComparator = function(actual, expected) {
  return ('' + actual).toLocaleLowerCase().indexOf(('' + expected).toLocaleLowerCase()) != -1;
};

var defaultCompare = function(item, expected, comparator) {
  if (!item || !expected) return false;
  if (typeof item == 'string') {
    return comparator(item, expected);
  } else {
    for (var prop in item) {
      if (item.hasOwnProperty(prop)) {
        var actual = item[prop];
        if (typeof actual == 'string' && actual) {
          if (comparator(actual, expected)) {
            return true;
          }
        } else if (actual !== undefined) {
          if (comparator('' + actual, expected)) {
            return true;
          }
        }
      }
    }
    return false;
  }
};

var filterWithCriterion = function(item, criterion, comparator) {
  if (!item || !criterion) return false;
  if (typeof item == 'string') {
    return false;
  } else {
    var result = true;
    for (var prop in criterion) {
      if (criterion.hasOwnProperty(prop)) {
        var value = item[prop], expected = criterion[prop] ;
        if (!comparator(value, expected)) {
          result = false;
          break;
        }
      }
    }
    return result;
  }
};

filters.filter = function(value, expression, comparator) {
  if (value && expression) {
    var result = value;
    comparator = comparator ? comparator : defaultComparator;
    if (typeof expression == 'string') {
      result = value.filter(function(item) {
        return defaultCompare(item, expression, comparator);
      });
    } else if (typeof expression == 'object') {
      var criterion = {}, count = 0;
      for (var prop in expression) {
        if (expression.hasOwnProperty(prop)) {
          if (expression[prop] !== null && expression[prop] !== undefined) {
            criterion[prop] = expression[prop];
            count++;
          }
        }
      }
      if (criterion.$ && count === 1) {
        result = value.filter(function(item) {
          return defaultCompare(item, criterion.$, comparator);
        });
      } else {
        if (count === 0) {
          return value;
        }
        result = value.filter(function(item) {
          return filterWithCriterion(item, criterion, comparator);
        });
      }
    } else if (typeof expression == 'function') {
      result = value.filter(expression);
    }

    return result;
  }
  return value;
};

var compareBy = function (x, y, key) {
  if (typeof key === 'function') {
    var xVal = key.call(x, x);
    var yVal = key.call(y, y);
    if (xVal === yVal) {
      return 0;
    }
    return xVal > yVal ? 1 : -1;
  }
  if (x[key] === y[key]) {
    return 0;
  }
  return x[key] > y[key] ? 1 : -1;
};

var reverseCompareBy = function (x, y, key) {
  if (typeof key === 'function') {
    var xVal = key.call(x, x);
    var yVal = key.call(y, y);
    if (xVal === yVal) {
      return 0;
    }
    return xVal < yVal ? 1 : -1;
  }
  if (x[key] === y[key]) {
    return 0;
  }
  return x[key] < y[key] ? 1 : -1;
};

var sortByKey = function (array, key, reverse) {
  var copy = array.concat();
  copy.sort(function(x, y) {
    return reverse ? reverseCompareBy(x, y, key) : compareBy(x, y, key);
  });
  return copy;
};

var sortByMultiple = function (array, keys, reverse) {
  var copy = array.concat();
  copy.sort(function(x, y) {
    var comparison = 0;
    for (var i = 0; i < keys.length; ++i) {
      comparison = reverse ? reverseCompareBy(x, y, keys[i]) : compareBy(x, y, keys[i]);
      if (comparison !== 0) {
        return comparison;
      }
    }
    return comparison;
  });
  return copy;
};

filters.orderBy = function(value, expression, reverse) {
  if (value && expression) {
    var result = value;

    if (typeof expression == 'string' || typeof expression == 'function') {
      result = sortByKey(value, expression, reverse);
    } else if (expression instanceof Array) {
      result = sortByMultiple(value, expression, reverse);
    }

    return result;
  }
  return value;
};

module.exports = getFilter = function(filterName) {
  return filters[filterName];
};