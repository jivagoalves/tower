describe('Tower.ModelMetadata', function() {
  var user;

  test('.name', function() {
    assert.equal(App.User.metadata().name, "user");
  });

  test('.namePlural', function() {
    assert.equal(App.User.metadata().namePlural, "users");
  });

  test('.baseClass', function() {
    assert.equal(App.User.baseClass(), App.User);
  });

  test('.toParam', function() {
    assert.equal(App.User.toParam(), "users");
    assert.equal(Tower.Model.toParam(), undefined);
  });

  test('.toKey', function() {
    assert.equal(App.User.toKey(), "user");
  });

  test('.metadata', function() {
    var metadata = _.extend({}, App.User.metadata());
    delete metadata.store;
    assert.equal(metadata.name, 'user');
    assert.equal(metadata.namePlural, 'users');
    assert.equal(metadata.className, 'User');
    assert.equal(metadata.classNamePlural, 'Users');
    assert.equal(metadata.paramName, 'user');
    assert.equal(metadata.paramNamePlural, 'users');
    assert.equal(metadata.modelName, 'App.User');
    assert.equal(metadata.controllerName, 'App.UsersController');
  });

  describe('instance', function() {
    beforeEach(function() {
      user = new App.User;
    });

    test('#toLabel', function() {
      assert.equal(user.toLabel(), "User");
    });

    test('#metadata', function() {
      var metadata = _.extend({}, user.metadata());
      delete metadata.store;
      assert.equal(metadata.name, 'user');
      assert.equal(metadata.namePlural, 'users');
      assert.equal(metadata.className, 'User');
      assert.equal(metadata.classNamePlural, 'Users');
      assert.equal(metadata.paramName, 'user');
      assert.equal(metadata.paramNamePlural, 'users');
      assert.equal(metadata.modelName, 'App.User');
      assert.equal(metadata.controllerName, 'App.UsersController');
    });
  });
});
