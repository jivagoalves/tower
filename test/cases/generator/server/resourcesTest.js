describe('Tower.GeneratorResources', function() {
  var cakefileDestination, destinationRoot, generator, sourceRoot;

  beforeEach(function() {
    Tower.removeDirectorySync("" + (process.cwd()) + "/test/tmp");
    
    generator = new Tower.Generator({silent: true});
  });

  test('#generateRandom("hex")', function() {
    assert.match(generator.generateRandom('hex'), /^\b[0-9a-fA-F]+\b$/);
  });

  test('#buildRelation', function() {
    var expected = {
      name: 'user',
      type: 'belongsTo',
      humanName: 'User'
    };

    assert.deepEqual(expected, generator.buildRelation('belongsTo', 'User'));
  });

  test('#buildModel("user")', function() {
    var expected, key, model, value;

    expected = {
      name: 'user',
      namespace: 'App',
      className: 'User',
      classNamePlural: 'Users',
      namespacedClassName: 'App.User',
      namePlural: 'users',
      paramName: 'user',
      paramNamePlural: 'users',
      humanName: 'User',
      attributes: [],
      relations: {
        belongsTo: [],
        hasOne: [],
        hasMany: []
      },
      namespacedDirectory: '',
      viewDirectory: '/users',
      namespaced: ''
    };

    model = generator.buildModel('user', 'App');

    for (key in expected) {
      value = expected[key];
      assert.deepEqual(value, model[key]);
    }
  });

  test('#buildModel("camelCase")', function() {
    var expected, key, model, value, _results;
    expected = {
      name: 'camelCase',
      namespace: 'App',
      className: 'CamelCase',
      classNamePlural: 'CamelCases',
      namespacedClassName: 'App.CamelCase',
      namePlural: 'camelCases',
      paramName: 'camel-case',
      paramNamePlural: 'camel-cases',
      humanName: 'Camel case',
      attributes: [],
      relations: {
        belongsTo: [],
        hasOne: [],
        hasMany: []
      },
      namespacedDirectory: '',
      viewDirectory: '/camelCases',
      namespaced: ''
    };
    model = generator.buildModel('camelCase', 'App');
    _results = [];
    for (key in expected) {
      value = expected[key];
      _results.push(assert.deepEqual(value, model[key]));
    }
    return _results;
  });

  test('#buildController("user")', function() {
    var controller, expected, key, value, _results;
    expected = {
      namespace: 'App',
      className: 'UsersController',
      directory: '',
      name: 'usersController',
      namespaced: false
    };
    controller = generator.buildController('user');
    _results = [];
    for (key in expected) {
      value = expected[key];
      _results.push(assert.deepEqual(value, controller[key]));
    }
    return _results;
  });

  test('#buildView', function() {
    var expected, key, value, view, _results;
    expected = {
      namespace: 'user',
      directory: 'users'
    };
    view = generator.buildView('user');
    _results = [];
    for (key in expected) {
      value = expected[key];
      _results.push(assert.deepEqual(value, view[key]));
    }
    return _results;
  });

  describe('#buildAttribute', function() {

    test('name: "title"', function() {
      var attribute, expected, key, value, _results;
      expected = {
        name: 'title',
        type: 'string',
        humanName: 'Title',
        fieldType: 'string',
        value: 'A title'
      };
      attribute = generator.buildAttribute('title');
      _results = [];
      for (key in expected) {
        value = expected[key];
        _results.push(assert.deepEqual(value, attribute[key]));
      }
      return _results;
    });

    test('name: "tags", type: "Array"', function() {
      var attribute, expected, key, value, _results;
      expected = {
        name: 'tags',
        type: 'Array',
        humanName: 'Tags',
        fieldType: 'string',
        value: "A tags"
      };
      attribute = generator.buildAttribute('tags', 'Array');
      _results = [];
      for (key in expected) {
        value = expected[key];
        _results.push(assert.deepEqual(value, attribute[key]));
      }
      return _results;
    });
  });

  test('#buildApp');

  test('#buildUser');
});
