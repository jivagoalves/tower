describe('urlFor', function() {
  var defaultUrlOptions, post, path;

  beforeEach(function() {
    Tower.Route.reload();
    post = App.Post.build();
    post.set('id', 10);
    
    defaultUrlOptions = {
      onlyPath: true,
      params: {},
      trailingSlash: false,
      host: "example.com"
    };
  });


  test('urlFor(App.Post, onlyPath: false)', function() {
    path = Tower.urlFor(App.Post, _.extend(defaultUrlOptions, {
      onlyPath: false
    }));
    assert.equal(path, "http://example.com/posts");
  });

  test('urlFor(App.Post, onlyPath: false, user: "lance", password: "pollard")', function() {
    path = Tower.urlFor(App.Post, _.extend(defaultUrlOptions, {
      onlyPath: false,
      user: "lance",
      password: "pollard"
    }));
    assert.equal(path, "http://lance:pollard@example.com/posts");
  });

  test('urlFor(App.Post)', function() {
    path = Tower.urlFor(App.Post, defaultUrlOptions);
    assert.equal(path, "/posts");
  });

  test('urlFor(post)', function() {
    path = Tower.urlFor(post, defaultUrlOptions);
    assert.equal(path, "/posts/10");
  });

  test('urlFor("admin", post)', function() {
    path = Tower.urlFor("admin", post, defaultUrlOptions);
    assert.equal(path, "/admin/posts/10");
  });

  test('urlFor(post, likeCount: 10)', function() {
    path = Tower.urlFor(post, _.extend(defaultUrlOptions, {
      params: {
        likeCount: 10
      }
    }));
    assert.equal(path, "/posts/10?likeCount=10");
  });

  test('urlFor(post, likeCount: ">=": 10)', function() {
    path = Tower.urlFor(post, _.extend(defaultUrlOptions, {
      params: {
        likeCount: {
          ">=": 10
        }
      }
    }));
    assert.equal(path, "/posts/10?likeCount=10..n");
  });

  test('urlFor(post, likeCount: ">=": 10, "<=": 100)', function() {
    path = Tower.urlFor(post, _.extend(defaultUrlOptions, {
      params: {
        likeCount: {
          ">=": 10,
          "<=": 100
        }
      }
    }));
    assert.equal(path, "/posts/10?likeCount=10..100");
  });

  test('urlFor(post, likeCount: ">=": 10, "<=": 100)', function() {
    path = Tower.urlFor(post, _.extend(defaultUrlOptions, {
      params: {
        likeCount: {
          ">=": 10,
          "<=": 100
        }
      }
    }));
    assert.equal(path, "/posts/10?likeCount=10..100");
  });

  test('urlFor(post, title: "Hello World", likeCount: ">=": 10, "<=": 100)', function() {
    path = Tower.urlFor(post, _.extend(defaultUrlOptions, {
      params: {
        title: "Hello World",
        likeCount: {
          ">=": 10,
          "<=": 100
        }
      }
    }));
    assert.equal(path, "/posts/10?likeCount=10..100&title=Hello+World");
  });
  
  test('urlFor(post, [{title: /Rails/}, {likeCount: ">=": 10}])', function() {});
});