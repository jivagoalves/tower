App.BindableTest = Tower.Model.extend({
  string: Tower.Model.field(),
  integer: Tower.Model.field({type: 'Integer'}),
  date: Tower.Model.field({type: 'Date'})
});

describe('Tower.Model (bindable)', function() {  
  var record;

  beforeEach(function() {
    record = App.BindableTest.build();
  });

  test('string', function(done) {
    record.addObserver('string', function(sender, key, value, rev) {
      assert.equal('abc', record.get('string'));
      done();
    });

    Ember.run(function() {
      record.set('string', 'abc');
    });
  });

  test('integer', function(done) {
    record.addObserver('integer', function(sender, key) {
      assert.equal(10, record.get('integer'));
      done();
    });

    record.set('integer', 10);
  });
  
  test('date', function(done) {
    var now = new Date;

    record.addObserver('date', function(sender, key) {
      assert.equal(now.getTime(), record.get('date').getTime());
      done();
    });

    record.set('date', now);
  });
});
