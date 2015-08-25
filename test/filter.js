var getFilter = require('../src/filter');

describe('Filter UnitTest', function () {
  var friends;
  friends = [
    {
      id: '1',
      name: 'John',
      phone: '555-1276'
    }, {
      id: '2',
      name: 'Mary',
      phone: '800-BIG-MARY'
    }, {
      id: '3',
      name: 'Mary',
      phone: '555-BIG-MARY'
    }, {
      id: '4',
      name: 'Mike',
      phone: '555-4321'
    }, {
      id: '5',
      name: 'Adam',
      phone: '888-5678'
    }, {
      id: '6',
      name: 'Julie',
      phone: '555-8765'
    }, {
      id: '7',
      name: 'Juliette',
      phone: '555-5678'
    }, {
      id: '8',
      name: 'Adam',
      phone: '555-5678'
    }
  ];

  it('should convert string to uppercase when use uppercase ', function () {
    var filter = getFilter('uppercase');
    filter('Abcd').should.equal('ABCD');
  });

  it('should convert string to lowercase when use lowercase ', function () {
    var filter = getFilter('lowercase');
    filter('Abcd').should.equal('abcd');
  });

  it('should make number fixed when use number ', function () {
    var filter = getFilter('number');
    filter('11.11111').should.equal('11.11');
    filter('11.11111', 1).should.equal('11.1');
  });

  it('should convert json to string when use json ', function () {
    var filter = getFilter('json');
    filter({ a: 3 }).should.equal('{"a":3}');
  });

  it('should filter array when use filter with string parameter', function () {
    var filter = getFilter('filter');
    var result = filter(friends, 'J').map(function (item) {
      return item.id;
    });
    result.length.should.equal(3);
    result.should.eql(['1', '6', '7']);

    result = filter(friends, '800').map(function (item) {
      return item.id;
    });
    result.should.eql(['2']);

    result = filter(friends, 'j').map(function (item) {
      return item.id;
    });
    result.length.should.equal(3);
    result.should.eql(['1', '6', '7']);
  });
  it('should filter array when use filter with object parameter', function () {
    var filter = getFilter('filter');
    var result = filter(friends, {
      'name': 'J'
    }).map(function (item) {
      return item.id;
    });
    result.length.should.equal(3);
    result.should.eql(['1', '6', '7']);

    result = filter(friends, {
      'phone': '800'
    }).map(function (item) {
      return item.id;
    });
    result.should.eql(['2']);

    result = filter(friends, {
      name: 'M',
      phone: '555'
    }).map(function (item) {
      return item.id;
    });
    result.should.eql(['3', '4', '8']);

    result = filter(friends, {
      $: 'J'
    }).map(function (item) {
      return item.id;
    });
    result.should.eql(['1', '6', '7']);

    result = filter(friends, {}).map(function (item) {
      return item.id;
    });
    result.length.should.equal(friends.length);
  });

  it('should filter array when use filter with function parameter', function () {
    var filter = getFilter('filter');
    var result = filter(friends, function (item) {
      return item.name.indexOf('J') !== -1;
    }).map(function (item) {
      return item.id;
    });
    result.length.should.equal(3);
    result.should.eql(['1', '6', '7']);

    result = filter(friends, function (item) {
      return true;
    }).map(function (item) {
      return item.id;
    });
    result.length.should.equal(friends.length);
  });

  it('should filter array when use filter with custom comparator', function () {
    var filter = getFilter('filter');
    var result = filter(friends, {
      name: 'M',
      phone: '555'
    }, function (actual, expected) {
      return actual.indexOf(expected) !== -1;
    }).map(function (item) {
      return item.id;
    });
    result.should.eql(['3', '4']);
  });

  it('should sort array when use orderBy with string parameter', function () {
    var filter = getFilter('orderBy');
    var result = filter(friends, 'name').map(function (item) {
      return item.id;
    });
    result.should.eql(['5', '8', '1', '6', '7', '2', '3', '4']);
  });

  it('should sort array when use orderBy with array parameter', function () {
    var filter = getFilter('orderBy');
    var result = filter(friends, ['name']).map(function (item) {
      return item.id;
    });
    result.should.eql(['5', '8', '1', '6', '7', '2', '3', '4']);

    result = filter(friends, ['name', 'phone']).map(function (item) {
      return item.id;
    });
    result.should.eql(['8', '5', '1', '6', '7', '3', '2', '4']);
  });

  it('should sort array when use orderBy with function parameter', function () {
    var filter = getFilter('orderBy');

    var result = filter(friends, function (item) {
      return item.name;
    }).map(function (item) {
      return item.id;
    });

    result.should.eql(['5', '8', '1', '6', '7', '2', '3', '4']);
  });

  it('should sort reverse when set reverse to true', function () {
    var filter = getFilter('orderBy');
    var result = filter(friends, ['name'], true).map(function (item) {
      return item.id;
    });
    result.should.eql(['4', '2', '3', '7', '6', '1', '5', '8']);

    result = filter(friends, ['name', 'phone'], true).map(function (item) {
      return item.id;
    });
    result.should.eql(['4', '2', '3', '7', '6', '1', '5', '8']);
  });
});