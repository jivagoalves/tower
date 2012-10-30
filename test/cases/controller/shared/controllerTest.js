describe('Tower.Controller', function() {
  var controller, router, user;

  beforeEach(function() {
    Tower.Route.draw(function() {
      this.match('/custom', {
        to: 'custom#index'
      });
      
      this.match('/custom/:id', {
        to: 'custom#show'
      });
    });

    controller = App.CustomController.create();
  });

  test('resource', function() {
    controller = App.PostsController.create();
    assert.equal(controller.resourceName, 'post');
    assert.equal(controller.collectionName, 'posts');
    assert.equal(controller.resourceType, 'Post');
  });
});
