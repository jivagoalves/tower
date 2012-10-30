describe('Issue105', function() {
  var post;

  beforeEach(function(done) {
    Tower.start(function() {
      post = App.Post.build({rating: 4});
      post.save(done);
    });
  });

  afterEach(function() {
    Tower.stop();
  });

  test('user created', function(done) {
    App.Post.find(post.get('id'), function(err, resource) {
      assert.ok(resource.get('id'));
      assert.equal(post.get('id').toString(), resource.get('id').toString());
      done();
    });
  });

  test('handle request with unknown format', function(done) {
    var options = {format: 'form'};

    _.destroy("/posts/" + (post.get('id')), options, function(response) {
      App.Post.find(post.get('id'), function(err, resource) {
        assert.equal(resource, undefined);
        done();
      });
    });
  });
});
