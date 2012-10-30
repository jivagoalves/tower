App.NestedModelTest = Tower.Model.extend({
  posts: Tower.Model.hasMany({acceptsNestedAttributes: true}),
  address: Tower.Model.hasOne(),
  user: Tower.Model.belongsTo()
});

App.NestedModelTest.acceptsNestedAttributesFor('posts');

describe('Tower.ModelNestedAttributes', function() {
  var record;

  beforeEach(function() {
    record = App.NestedModelTest.build();
  });

  test('should set autosave == true', function() {
    assert.isTrue(App.NestedModelTest.relation('posts').autosave);
  });

  test('method definition', function() {
    assert.equal(typeof record.postsAttributes, 'function');
  });

  test('_assignToOrMarkForDestruction', function() {});

  test('_hasDestroyFlag', function() {
    assert.isFalse(record._hasDestroyFlag({}));
    assert.isTrue(record._hasDestroyFlag({
      _destroy: 'true'
    }));
  });

  test('_unassignableKeys', function() {
    assert.deepEqual(record._unassignableKeys({
      withoutProtection: true
    }), ['_destroy']);
    assert.deepEqual(record._unassignableKeys({}), ['id', '_destroy']);
  });

  test('record.hasManyAttributes', function() {
    assert.isArray(record.postsAttributes({
      title: 'Nested Post!'
    }));
  });
});
