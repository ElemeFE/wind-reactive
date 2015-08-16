var binder = require('../src/binder');
var getBinder = binder.get;

describe('binder unit test', function() {
  var element = document.createElement('div');

  beforeEach(function() {
    element.innerHTML = '';
    element.className = '';
  });

  it('should update element text', function() {
    var textBinder = getBinder('text');
    element.textContent.should.equal('');

    var content = 'test';
    textBinder(element, content);
    element.textContent.should.equal(content);
  });

  it('should update element html', function() {
    var htmlBinder = getBinder('html');
    element.innerHTML.should.equal('');

    var html = '<b>test</b>';
    htmlBinder(element, html);
    element.innerHTML.should.equal(html);
  });

  it('should update element attr', function() {
    var attrBinder = getBinder('attr');
    var testAttr = 'testAttr';
    var value = 'test';

    attrBinder(element, value, testAttr);
    element[testAttr].should.equal(value);

    attrBinder(element, null, testAttr);
    element[testAttr].should.equal('');
  });

  it('should update element class', function() {
    var classBinder = getBinder('class');
    var testClass = 'test-class';

    element.className.should.equal('');
    classBinder(element, true, testClass);
    element.className.should.equal(testClass);

    classBinder(element, false, testClass);
    element.className.should.equal('');
  });

  it('should update element display(show)', function() {
    var showBinder = getBinder('show');

    element.style.display.should.equal('');

    showBinder(element, false);
    element.style.display.should.equal('none');

    showBinder(element, true);
    element.style.display.should.equal('');
  });

  it('should update element display(hide)', function() {
    var hideBinder = getBinder('hide');

    element.style.display.should.equal('');

    hideBinder(element, true);
    element.style.display.should.equal('none');

    hideBinder(element, false);
    element.style.display.should.equal('');
  });

});