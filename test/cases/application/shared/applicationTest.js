describe('Tower.Application', function() {
  test('load models', function() {
    assert.isPresent(!!App.Post);
  });

  test('load controllers', function() {
    assert.isPresent(App.ApplicationController);
    assert.isPresent(App.PostsController);
  });
});
