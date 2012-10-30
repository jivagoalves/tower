describe('Tower.Criteria', function() {
  var cursor, criteria;

  beforeEach(function() {
    cursor = Tower.Cursor.create()
    criteria = cursor.get('criteria');
  });

  test('cursor has default criteria', function() {
    assert.ok(!!(criteria instanceof Tower.Criteria))
  });
});
