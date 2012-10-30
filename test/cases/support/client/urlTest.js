describe('Tower.SupportUrl', function() {
  describe('Tower.StoreTransportAjax', function() {
    var post, transport, urlFor;
    
    urlFor = Tower.urlFor;
    
    beforeEach(function() {
      transport = Tower.StoreTransportAjax;
      post = App.Post.build();
      post.set('id', 1);
    });

    afterEach(function() {
      Tower.defaultURLOptions = undefined;
    });

    test('urlForCreate', function() {
      assert.equal(transport.urlForCreate(post), '/posts');
      Tower.defaultURLOptions = {
        host: 'example.com'
      };
      assert.equal(transport.urlForCreate(post), 'http://example.com/posts');
    });

    test('urlForUpdate', function() {
      post.set('isNew', false);
      assert.equal(transport.urlForUpdate(post), '/posts/1');
      Tower.defaultURLOptions = {
        host: 'example.com'
      };
      assert.equal(transport.urlForUpdate(post), 'http://example.com/posts/1');
    });

    test('urlForDestroy', function() {
      post.set('isNew', false);
      assert.equal(transport.urlForDestroy(post), '/posts/1');
      Tower.defaultURLOptions = {
        host: 'example.com'
      };
      assert.equal(transport.urlForDestroy(post), 'http://example.com/posts/1');
    });

    test('urlForIndex', function() {
      assert.equal(transport.urlForIndex(App.Post), '/posts');
      Tower.defaultURLOptions = {
        host: 'example.com'
      };
      assert.equal(transport.urlForIndex(App.Post), 'http://example.com/posts');
    });

    test('urlForShow', function() {
      assert.equal(transport.urlForShow(App.Post, 1), '/posts/1');
      Tower.defaultURLOptions = {
        host: 'example.com'
      };
      assert.equal(transport.urlForShow(App.Post, 1), 'http://example.com/posts/1');
    });
  });
});
