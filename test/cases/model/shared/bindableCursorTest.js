App.BindableCursorTest = Tower.Model.extend({
  string: Tower.Model.field('String'),
  integer: Tower.Model.field('Integer'),
  float: Tower.Model.field('Float'),
  date: Tower.Model.field('Date'),
  object: Tower.Model.field('Object', {default: {}}),
  arrayString: Tower.Model.field(['String'], {default: []}),
  arrayObject: Tower.Model.field(['Object'], {default: []})
});

describe('Tower.ModelCursor (bindable)', function() {
  var cursor;

  beforeEach(function(done) {
    App.BindableCursorTest.store(Tower.StoreMemory).constructor.clean(function() {
      cursor = Tower.ModelCursor.make();
      cursor.make({
        model: App.BindableCursorTest
      });
      done();
    });
  });
  
  afterEach(function() {
    return Tower.cursors = {};
  });
  test('addObserver', function(done) {
    var record;
    record = App.BindableCursorTest.build();
    cursor.addObserver('length', function() {
      assert.equal(1, cursor.get('length'), 'addObserver length called');
      return done();
    });
    Ember.run(function() {
      return cursor.addObjects([record]);
    });
    return assert.equal(cursor.indexOf(record), 0);
  });
  test('pushMatching (blank records)', function(done) {
    var records;
    records = [App.BindableCursorTest.build(), App.BindableCursorTest.build()];
    cursor.addObserver('length', function() {
      assert.equal(cursor.get('length'), 2, 'addObserver length called');
      return done();
    });
    return cursor.pushMatching(records);
  });
  test('pushMatching (select 1 of 2)', function(done) {
    var records;
    records = [
      App.BindableCursorTest.build(), App.BindableCursorTest.build({
        string: 'a string'
      })
    ];
    cursor.where({
      string: /string/
    });
    cursor.addObserver('length', function() {
      assert.equal(cursor.get('length'), 1, 'addObserver length called');
      return done();
    });
    return cursor.pushMatching(records);
  });
  test('list model fields it\'s watching', function() {
    cursor.where({
      string: /string/
    });
    assert.deepEqual(cursor.get('observableFields').sort(), ['string']);
    cursor.desc('createdAt').propertyDidChange('observableFields');
    assert.deepEqual(cursor.get('observableFields').sort(), ['createdAt', 'string']);
    cursor.where({
      string: {
        '!=': 'strings',
        '=~': /string/
      }
    }).propertyDidChange('observableFields');
    return assert.deepEqual(cursor.get('observableFields').sort(), ['createdAt', 'string']);
  });
  test('Tower.cursors updates when cursor.observable() is called', function() {
    assert.equal(_.keys(Tower.cursors).length, 0);
    cursor.where({
      string: /string/
    });
    cursor.observable();
    assert.equal(_.keys(Tower.cursors).length, 2, '_.keys(Tower.cursors).length');
    assert.equal(_.keys(Tower.cursors['BindableCursorTest']).length, 1, "Tower.cursors['BindableCursorTest'].length");
    return assert.equal(Tower.getCursor('BindableCursorTest.string'), cursor, "Tower.getCursor('BindableCursorTest.string')");
  });
  test('cursor observers when just record attributes are set', function(done) {
    var _this = this;
    cursor.where({
      string: /a s/ig
    }).observable();
    return cursor.refresh(function(error, records) {
      assert.equal(records.length, 0, '1');
      return App.BindableCursorTest.create({
        string: 'a string'
      }, function(error, record) {
        return cursor.refresh(function() {
          assert.equal(cursor.get('content').length, 1, '2');
          return done();
        });
      });
    });
  });
  return test('Tower.autoNotifyCursors = false', function(done) {
    var _this = this;
    Tower.autoNotifyCursors = false;
    cursor.where({
      string: /a s/ig
    }).observable();
    return App.BindableCursorTest.create({
      string: 'a string'
    }, function(error, record) {
      return cursor.refresh(function() {
        assert.equal(cursor.get('content').length, 1);
        record.set('string', 'new string');
        assert.equal(cursor.get('content').length, 1);
        Tower.notifyCursorFromPath(record.constructor.className() + '.' + 'string');
        assert.equal(cursor.get('content').length, 0);
        Tower.autoNotifyCursors = true;
        return done();
      });
    });
  });
  /*
    test 'sort', (done) ->
      records = [
        App.BindableCursorTest.build(string: 'ZZZ')
        App.BindableCursorTest.build(string: 'BBB')
        App.BindableCursorTest.build(string: 'AAA')
      ]
  
      cursor.addObserver "content", (_, key, value) ->
        assert.deepEqual cursor.getEach('string'), ['AAA', 'BBB', 'ZZZ']
        done()
  
      cursor.pushMatching(records)
      cursor.commit()
  */

});
