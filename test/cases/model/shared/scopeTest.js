describe('Tower.ModelScope', function() {
  var criteria, scope, user;

  beforeEach(function(done) {
    async.series([
      function(callback) {
        App.User.insert({id: 1, firstName: 'Lance'}, callback);
      },
      function(callback) {
        App.User.insert({id: 2, firstName: 'Dane'}, callback);
      }
    ], done);
  });

  test('where(firstName: "Lance")', function(done) {
    App.User.where({firstName: "Lance"}).first(function(error, user) {
      assert.equal(user.get("firstName"), "Lance");
      done();
    });
  });

  test('where(firstName: "=~": "c")', function(done) {
    App.User.where({firstName: {"=~": "c"}}).all(function(error, users) {
      assert.equal(users.length, 1);
      assert.equal(users[0].get("firstName"), "Lance");
      done();
    });
  });

  test('where(firstName: "=~": "a").order("firstName")', function(done) {
    App.User.where({firstName: {"=~": "a"}}).order("firstName").all(function(error, users) {
      assert.equal(users.length, 2);
      assert.equal(users[0].get("firstName"), "Dane");
      done();
    });
  });

  test('where(firstName: "=~": "a").order("firstName", "desc")', function(done) {
    App.User.where({firstName: {"=~": "a"}}).order("firstName", "desc").all(function(error, users) {
      assert.equal(users.length, 2);
      assert.equal(users[0].get("firstName"), "Lance");
      done();
    });
  });

  describe('named scopes', function() {
    beforeEach(function(done) {
      async.series([
        function(next) {
          App.User.insert({firstName: "Baldwin", likes: 10}, next);
        }, 
        function(next) {
          App.Admin.insert({firstName: "An Admin", likes: 20}, next);
        }, 
        function(next) {
          App.Admin.insert({firstName: "An Admin without likes", likes: 0}, next);
        }
      ], done);
    });

    test('named scopes', function(done) {
      App.User.byBaldwin().all(function(error, users) {
        assert.equal(users.length, 1);
        assert.equal(users[0].get("firstName"), "Baldwin");
        done();
      });
    });

    test('subclasses and named scopes', function(done) {
      App.Admin.subclassNamedScope().all(function(error, users) {
        assert.equal(users.length, 1);
        assert.equal(users[0].get("type"), "Admin");
        done();
      });
    });
  });

  describe('global callback', function() {
    beforeEach(function() {
      Tower.cb = function() {
        assert.ok(arguments.length > 0);
      };
    });
    afterEach(function() {
      Tower.cb = function() {};
    });

    test('.insert', function(done) {
      App.User.insert({firstName: "Baldwin", likes: 10}, function() {
        done();
      });
    });
  });
});
