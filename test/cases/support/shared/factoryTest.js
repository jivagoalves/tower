describe('Tower.Factory', function() {
  var userFactory;

  beforeEach(function() {
    Tower.Factory.clear();
  });

  describe('.define', function() {
    test('metadata', function() {
      var expected, key, userFactory, value;
      Tower.Factory.define("user", function() {});
      expected = {
        name: 'user',
        className: 'App.User',
        parentClassName: undefined
      };
      userFactory = Tower.Factory.definitions["user"];
      for (key in expected) {
        value = expected[key];
        assert.equal(value, userFactory[key]);
      }
      assert.ok(userFactory.hasOwnProperty("callback"));
    });

    test('#toClass', function() {
      var userFactory;
      userFactory = Tower.Factory.define("user", function() {});
      assert.equal(userFactory.toClass().className(), "User");
    });

    test('throw error if cant figure out class', function() {
      userFactory = Tower.Factory.define("guest", function() {});
      assert.throws(function() {
        return userFactory.toClass().className();
      });
    });

    test('with className', function() {
      userFactory = Tower.Factory.define("guest", {
        className: "User"
      }, function() {});
      assert.doesNotThrow(function() {
        return userFactory.toClass().className();
      });
      assert.equal(userFactory.toClass().className(), "User");
    });
  });

  describe('.create', function() {
    test('create (factory has no attributes)', function() {
      var user;
      Tower.Factory.define("user", function() {});
      user = Tower.Factory.create("user");
      assert.equal(user.constructor.className(), "User");
    });

    test('create (factory has attributes)', function() {
      var user;
      Tower.Factory.define("user", function() {
        return {
          firstName: "Isaac"
        };
      });
      user = Tower.Factory.create("user");
      assert.equal(user.get('firstName'), "Isaac");
    });

    test('create (factory has async attributes)', function(done) {
      var _this = this;
      Tower.Factory.define("user", function(callback) {
        var respond;
        respond = function() {
          return callback(null, {
            firstName: "Isaac"
          });
        };
        return setTimeout(respond, 10);
      });
      Tower.Factory.create("user", function(error, user) {
        assert.equal(user.get('firstName'), "Isaac");
        done();
      });
    });
  });
});
