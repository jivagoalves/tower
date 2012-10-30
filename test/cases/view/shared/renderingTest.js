describe('Tower.ViewRendering', function() {
  var view;

  beforeEach(function() {
    view = Tower.View.create();
  });

  describe('#_renderString', function() {
    test('coffee', function(done) {
      view._renderString('h1 "Hello World"', {type: 'coffee'}, function(error, result) {
        assert.equal('<h1>Hello World</h1>\n', result);
        done();
      });
    });
  });

  describe('#_readTemplate', function() {
    test('coffee', function(done) {
      done();
    });
  });

  describe('#_renderingContext', function() {
    test('default', function() {
      assert.deepEqual(view._renderingContext({}), {
        _context: {}
      });
    });
  });
});
