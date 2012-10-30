describe('Tower.NetConnection', function() {
  var connection;

  beforeEach(function() {
    connection = Tower.createConnection();
  });

  test('constructor', function() {
    assert.isTrue(!!(connection instanceof Tower.NetConnection));
  });

  if (Tower.isServer) {
    test('lazily instantiates controllers', function() {
      assert.isTrue(!(connection.postsController instanceof App.PostsController));
      assert.isTrue(!!(connection.get('postsController') instanceof App.PostsController));
    });
  }

  test('scopes', function() {
    var scope = connection.get('postsController.all');
    assert.isTrue(scope.isCursor, 'scope instanceof Tower.ModelCursor');
  });

  test('resolve', function() {
    var post = App.Post.build({
      id: 5,
      rating: 8
    });

    assert.deepEqual(connection.resolve('create', [post])[0], post);
  });
});
