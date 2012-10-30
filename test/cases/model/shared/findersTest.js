describe("Tower.ModelFinders", function() {
  beforeEach(function(done) {
    if (Tower.isServer) {
      Tower.store.clean(function() {
        done();
      });
    } else {
      App.Post.store().constructor.clean(done);
    }
  });

  describe('basics', function() {
    beforeEach(function(done) {
      App.Post.insert([{rating: 8}, {rating: 10}], done);
    });

    test('all', function(done) {
      App.Post.all(function(error, records) {
        assert.equal(records.length, 2);
        done();
      });
    });

    test('first', function(done) {
      App.Post.asc("rating").first(function(error, record) {
        assert.equal(record.get('rating'), 8);
        done();
      });
    });

    test('last', function(done) {
      App.Post.asc("rating").last(function(error, record) {
        assert.equal(record.get('rating'), 10);
        done();
      });
    });

    test('count', function(done) {
      App.Post.count(function(error, count) {
        assert.equal(count, 2);
        done();
      });
    });

    test('exists', function(done) {
      App.Post.exists(function(error, value) {
        assert.equal(value, true);
        done();
      });
    });
  });

  describe('$gt', function() {
    describe('integer > value (8, 10)', function() {
      beforeEach(function(done) {
        App.Post.insert([
          {
            rating: 8
          }, {
            rating: 10
          }
        ], function() {
          done();
        });
      });

      test('where(rating: ">": 10)', function(done) {
        App.Post.where({rating: {'>': 10}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });

      test('where(rating: ">": 8)', function(done) {
        App.Post.where({rating: {'>': 8}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(rating: ">": 7)', function(done) {
        App.Post.where({rating: {'>': 7}}).count(function(error, count) {
          assert.equal(count, 2);

          App.Post.where('rating').gt(7).count(function(error, count) {
            assert.equal(count, 2);

            done();
          });
        });
      });
    });

    describe('date > value', function() {
      beforeEach(function(done) {
        App.Post.insert({rating: 1, someDate: new Date}, done);
      });

      test('where(someDate: ">": Dec 25, 1995)', function(done) {
        App.Post.where({someDate: {'>': _.toDate("Dec 25, 1995")}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(createdAt: ">": Dec 25, 1995)', function(done) {
        App.Post.where({createdAt: {'>': _.toDate("Dec 25, 1995")}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(createdAt: ">": Dec 25, 2050)', function(done) {
        App.Post.where({createdAt: {'>': _.toDate("Dec 25, 2050")}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });
    });
  });

  describe('$gte', function() {
    describe('integer >= value (8, 10)', function() {
      beforeEach(function(done) {
        App.Post.insert([
          {
            rating: 8
          }, {
            rating: 10
          }
        ], done);
      });

      test('where(rating: ">=": 11)', function(done) {
        App.Post.where({rating: {">=": 11}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });

      test('where(rating: ">=": 10)', function(done) {
        App.Post.where({rating: {">=": 10}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(rating: ">=": 8)', function(done) {
        App.Post.where({rating: {">=": 8}}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });

      test('where(rating: ">=": 7)', function(done) {
        App.Post.where({rating: {">=": 7}}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });
    });
  });

  describe('$lt', function() {
    describe("integer < value", function() {
      beforeEach(function(done) {
        App.Post.insert([
          {
            rating: 8
          }, {
            rating: 10
          }
        ], function() {
          done();
        });
      });

      test('where(rating: "<": 11)', function(done) {
        App.Post.where({rating: {"<": 11}}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });

      test('where(rating: "<": 10)', function(done) {
        App.Post.where({rating: {"<": 10}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(rating: "<": 8)', function(done) {
        App.Post.where({rating: {"<": 8}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });
    });

    describe('date < value', function() {
      beforeEach(function(done) {
        App.Post.insert({rating: 1, someDate: new Date}, done);
      });

      test('where(someDate: "<": Dec 25, 2050)', function(done) {
        App.Post.where({someDate: {"<": _.toDate("Dec 25, 2050")}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(createdAt: "<": Dec 25, 2050)', function(done) {
        App.Post.where({createdAt: {"<": _.toDate("Dec 25, 2050")}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(createdAt: "<": Dec 25, 1995)', function(done) {
        App.Post.where({createdAt: {"<": _.toDate("Dec 25, 1995")}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });
    });
  });

  describe('$lte', function() {
    describe('integer <= value', function() {
      beforeEach(function(done) {
        var attributes = [
          {rating: 8},
          {rating: 10}
        ];

        App.Post.insert(attributes, done);
      });

      test('where(rating: "<=": 11)', function(done) {
        App.Post.where({rating: {"<=": 11}}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });

      test('where(rating: "<=": 10)', function(done) {
        App.Post.where({rating: {"<=": 10}}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });

      test('where(rating: "<=": 8)', function(done) {
        App.Post.where({rating: {"<=": 8}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(rating: "<=": 7)', function(done) {
        App.Post.where({rating: {"<=": 7}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });
    });

    test('date <= value', function() {
      beforeEach(function(done) {
        App.Post.insert({rating: 1, someDate: new Date}, done);
      });

      test('where(someDate: "<=": Dec 25, 2050)', function(done) {
        App.Post.where({someDate: {"<=": _.toDate("Dec 25, 2050")}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(createdAt: "<=": Dec 25, 2050)', function(done) {
        App.Post.where({createdAt: {"<=": _.toDate("Dec 25, 2050")}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(createdAt: "<=": Dec 25, 1995)', function(done) {
        App.Post.where({createdAt: {"<=": _.toDate("Dec 25, 1995")}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });
    });
  });
  
  describe('$match', function() {});
  
  describe('$notMatch', function() {});
  
  describe('$in', function() {
    describe('string in array', function() {
      beforeEach(function(done) {
        var attributes = [
          {rating: 8, tags: ["ruby", "javascript"]},
          {rating: 9, tags: ["nodejs", "javascript"]}
        ];

        App.Post.insert(attributes, done);
      });

      test('where(tags: "$in": ["javascript"])', function(done) {
        App.Post.where({tags: {"$in": ["javascript"]}}).count(function(error, count) {
          assert.equal(count, 2);
          
          App.Post.where('tags').in(["javascript"]).count(function(error, count) {
            assert.equal(count, 2);
            
            done();
          });
        });
      });

      test('where(tags: "$in": ["asp"])', function(done) {
        App.Post.where({tags: {"$in": ["asp"]}}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });

      test('where(tags: "$in": ["nodejs"])', function(done) {
        App.Post.where({tags: {"$in": ["nodejs"]}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });
    });
  });

  describe('$any', function() {
    describe('string in array', function() {
      beforeEach(function(done) {
        var attributes;
        attributes = [];
        attributes.push({
          rating: 8,
          tags: ["ruby", "javascript"],
          slug: 'ruby-javascript'
        });
        attributes.push({
          rating: 9,
          tags: ["nodejs", "javascript"],
          slug: 'nodejs-javascript'
        });
        App.Post.insert(attributes, done);
      });

      test('anyIn(tags: ["ruby-javascript", "c++"]', function(done) {
        App.Post.anyIn({slug: ["ruby-javascript", "c++"]}).count(function(err, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('anyIn(tags: ["javascript"])', function(done) {
        App.Post.anyIn({tags: ["javascript"]}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });

      test('anyIn(tags: ["asp"])', function(done) {
        App.Post.anyIn({tags: ["asp"]}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });

      test('anyIn(tags: ["nodejs"])', function(done) {
        App.Post.anyIn({tags: ["nodejs"]}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('anyIn(tags: ["nodejs", "ruby"])', function(done) {
        App.Post.anyIn({tags: ["nodejs", "ruby"]}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });

      test('anyIn(tags: ["nodejs", "asp"])', function(done) {
        App.Post.anyIn({tags: ["nodejs", "asp"]}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });
    });
  });

  describe('$nin', function() {
    beforeEach(function(done) {
      var attributes;
      attributes = [];
      attributes.push({
        rating: 8,
        tags: ["ruby", "javascript"]
      });
      attributes.push({
        rating: 9,
        tags: ["nodejs", "javascript"]
      });
      App.Post.insert(attributes, done);
    });

    test('notIn(tags: ["javascript"])', function(done) {
      App.Post.notIn({tags: ["javascript"]}).count(function(error, count) {
        assert.equal(count, 0);
        done();
      });
    });

    test('notIn(tags: ["asp"])', function(done) {
      App.Post.notIn({tags: ["asp"]}).count(function(error, count) {
        assert.equal(count, 2);
        done();
      });
    });

    test('notIn(tags: ["nodejs"])', function(done) {
      App.Post.notIn({tags: ["nodejs"]}).count(function(error, count) {
        assert.equal(count, 1);
        done();
      });
    });
  });

  describe('$all', function() {
    beforeEach(function(done) {
      var attributes = [
        {rating: 8, tags: ["ruby", "javascript"]},
        {rating: 9, tags: ["nodejs", "javascript"]}
      ];

      App.Post.insert(attributes, done);
    });

    describe('string in array', function() {
      test('allIn(tags: ["javascript"])', function(done) {
        App.Post.allIn({tags: ["javascript"]}).count(function(error, count) {
          assert.equal(count, 2);
          
          App.Post.where('tags').allIn(["javascript"]).count(function(error, count) {
            assert.equal(count, 2);

            done();
          });
        });
      });

      test('allIn(tags: ["asp"])', function(done) {
        App.Post.allIn({tags: ["asp"]}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });

      test('allIn(tags: ["nodejs"])', function(done) {
        App.Post.allIn({tags: ["nodejs"]}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('allIn(tags: ["nodejs", "javascript"])', function(done) {
        App.Post.allIn({tags: ["nodejs", "javascript"]}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('allIn(tags: ["nodejs", "ruby"])', function(done) {
        App.Post.allIn({tags: ["nodejs", "ruby"]}).count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });
    });
  });
  
  describe('$null', function() {});
  
  describe('$notNull', function() {});
  
  describe('$eq', function() {
    describe('string', function() {
      beforeEach(function(done) {
        var attributes = [
          {title: "Ruby", rating: 8},
          {title: "JavaScript", rating: 10}
        ];

        App.Post.insert(attributes, done);
      });

      test('where(title: $eq: "Ruby")', function(done) {
        App.Post.where({title: {$eq: "Ruby"}}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(title: /R/)', function(done) {
        App.Post.where({title: /R/}).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });

      test('where(title: /[Rr]/)', function(done) {
        App.Post.where({title: /[Rr]/}).count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });
    });
  });
  
  describe('$neq', function() {});

  describe('pagination', function() {
    beforeEach(function(done) {
      var callbacks, i;
      Tower.ModelCursor.prototype.defaultLimit = 5;
      callbacks = [];
      i = 0;
      while (i < 18) {
        i++;
        (function(i) {
          var _this = this;
          callbacks.push(function(next) {
            var title;
            title = (new Array(i + 1)).join("a");
            App.Post.insert({
              title: title,
              rating: 8
            }, function(error, post) {
              next();
            });
          });
        })(i);
      }
      _.series(callbacks, done);
    });

    afterEach(function() {
      Tower.ModelCursor.prototype.defaultLimit = 20;
    });

    test('limit(1)', function(done) {
      App.Post.limit(1).all(function(error, posts) {
        assert.equal(posts.length, 1);
        done();
      });
    });

    test('limit(0) should not do anything', function(done) {
      App.Post.limit(0).all(function(error, posts) {
        assert.equal(posts.length, 18);
        done();
      });
    });

    test('page(2) middle of set', function(done) {
      App.Post.page(2).asc("title").all(function(error, posts) {
        assert.equal(posts.length, 5);
        assert.equal(posts[0].get('title').length, 6);
        assert.equal(posts[4].get('title').length, 10);
        done();
      });
    });

    test('page(4) end of set', function(done) {
      App.Post.page(4).asc("title").all(function(error, posts) {
        assert.equal(posts.length, 3);
        done();
      });
    });

    test('page(20) if page is greater than count, should 0', function(done) {
      App.Post.page(20).all(function(error, posts) {
        assert.equal(posts.length, 0);
        done();
      });
    });

    test('desc', function(done) {
      App.Post.page(2).desc('title').all(function(error, posts) {
        assert.equal(posts[0].get('title').length, 13);
        done();
      });
    });

    test('asc', function(done) {
      App.Post.page(2).asc('title').all(function(error, posts) {
        assert.equal(posts[0].get('title').length, 6);

        App.Post.page(2).order('title+').all(function(error, posts) {
          assert.equal(posts[0].get('title').length, 6);

          App.Post.page(2).order('title').all(function(error, posts) {
            assert.equal(posts[0].get('title').length, 6);
            done();
          });
        });
      });
    });

    if (Tower.isServer && Tower.store.className() === 'Memory') {
      test('returns array/cursor', function() {
        var index, post, posts, _i, _len;
        posts = App.Post.all();
        assert.equal(posts.length, 18);
        assert.isTrue(posts.isCursor, 'posts.isCursor');
        for (index = _i = 0, _len = posts.length; _i < _len; index = ++_i) {
          post = posts[index];
          assert.ok(post instanceof Tower.Model);
        }
        assert.equal(index, 18);
      });
    }
  });
});
