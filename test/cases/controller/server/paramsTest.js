describe('Tower.ControllerParams', function() {
  var params, posts;

  beforeEach(function(done) {
    App.Post.destroy(function() {
      App.Post.create({
        title: 'First Post',
        rating: 8
      }, function() {
        App.Post.create({
          title: 'Second Post',
          rating: 7
        }, done);
      });
    });
  });

  beforeEach(function(done) {
    Tower.start(done);
  });

  afterEach(function() {
    Tower.stop();
  });

  describe('#index', function() {
    test('GET', function(done) {
      var params = {};
      
      _.get('/posts', {params: params}, function(response) {
        var posts = response.controller.get('posts');
        assert.equal(2, posts.length);
        assert.deepEqual(['First Post', 'Second Post'], _.map(posts, function(i) {
          return i.get('title');
        }));

        done();
      });
    });

    test('rating: 8', function(done) {
      params = {
        conditions: {
          rating: 8
        }
      };
      
      _.get('/posts.json', {params: params}, function(response) {
        posts = response.controller.get('posts');
        assert.equal(1, posts.length);
        done();
      });
    });

    test('rating: >=: 7', function(done) {
      params = {
        conditions: JSON.stringify({
          rating: {
            '>=': 7
          }
        })
      };

      _.get('/posts', {params: params}, function(response) {
        posts = response.controller.get('posts');
        assert.equal(2, posts.length);
        done();
      });
    });

    test('sort: ["title", "DESC"]', function(done) {
      params = {
        sort: ["title", "DESC"]
      };
      
      _.get('/posts', {params: params}, function(response) {
        posts = response.controller.get('posts');
        assert.equal(2, posts.length);
        assert.deepEqual(['Second Post', 'First Post'], _.map(posts, function(i) {
          return i.get('title');
        }));
        done();
      });
    });

    test('limit: 1', function(done) {
      params = {
        limit: 1
      };
      
      _.get('/posts', {params: params}, function(response) {
        posts = response.controller.get('posts');
        assert.equal(1, posts.length);
        done();
      });
    });

    test('userId: x', function(done) {
      App.User.create({firstName: 'asdf'}, function(error, user) {
        App.Post.first(function(error, post) {
          post.set('userId', user.get('id'));
          post.save(function() {
            params = {
              userId: user.get('id').toString()
            };
            
            _.get('/posts', {params: params}, function(response) {
              posts = response.controller.get('posts');
              assert.equal(1, posts.length);
              done();
            });
          });
        });
      });
    });

    describe('JSON API', function() {
      var firstPostId, lastPostId, post;

      beforeEach(function(done) {
        App.Post.all(function(error, records) {
          post = records[0];
          firstPostId = post.get('id').toString();
          lastPostId = records[1].get('id').toString();
          done();
        });
      });

      describe('id', function() {
        test('=', function(done) {
          params = {
            conditions: {
              id: firstPostId
            }
          };

          _.get('/posts', {params: params}, function(response) {
            posts = response.controller.get('posts');
            assert.equal(1, posts.length);
            assert.equal(firstPostId, posts[0].get('id').toString());
            done();
          });
        });

        test('$eq', function(done) {
          params = {
            conditions: {
              id: {
                $eq: firstPostId
              }
            }
          };
          
          _.get('/posts', {params: params}, function(response) {
            posts = response.controller.get('posts');
            assert.equal(1, posts.length);
            assert.equal(firstPostId, posts[0].get('id').toString());
            done();
          });
        });

        test('$in', function(done) {
          params = {
            conditions: {
              id: {
                $in: [firstPostId]
              }
            }
          };

          _.get('/posts', {params: params}, function(response) {
            posts = response.controller.get('posts');
            assert.equal(1, posts.length);
            assert.equal(firstPostId, posts[0].get('id').toString());
            done();
          });
        });

        test('$nin', function(done) {
          params = {
            conditions: {
              id: {
                $nin: [firstPostId]
              }
            }
          };
          
          _.get('/posts', {params: params}, function(response) {
            posts = response.controller.get('posts');
            assert.equal(1, posts.length);
            assert.equal(lastPostId, posts[0].get('id').toString());
            done();
          });
        });
      });
    });
  });

  test('date string is serialized to database');
});
