describe('Tower.ModelIndexing', function() {
  test('.index()', function(done) {
    var indexes = App.Project.indexes();
    assert.ok(indexes.hasOwnProperty('titleIndexedWithMethod'));
    done();
  });

  test('index: true', function(done) {
    var indexes = App.Project.indexes();
    assert.ok(indexes.hasOwnProperty('titleIndexedWithOption'));
    done();
  });
});
