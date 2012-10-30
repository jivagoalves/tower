describe('file paths', function() {
  test('Tower.pathSeparator', function() {
    var expected;
    if (process.platform === 'win32') {
      expected = '\\';
    } else {
      expected = '/';
    }
    
    assert.equal(Tower.pathSeparator, expected);
  });

  test('Tower.pathSeparatorEscaped', function() {
    var expected;
    if (process.platform === 'win32') {
      expected = '\\\\';
    } else {
      expected = '\/';
    }

    assert.equal(Tower.pathSeparatorEscaped, expected);
  });
  
  test('App.selectPaths', function() {
    var expected, root;
    var root = Tower.joinPath(Tower.root, 'app/controllers/server');
    var expected = _.map([
      'applicationController.coffee', 
      'attachmentsController.coffee', 
      'controllerScopesMetadataController.coffee', 
      'customController.coffee', 
      'headersController.coffee', 
      'postsController.coffee', 
      'sessionsController.coffee', 
      'testJsonController.coffee', 
      'testRoutesController.coffee', 
      'usersController.coffee'
    ].sort(), function(i) {
      return Tower.joinPath(root, i);
    });
    
    assert.deepEqual(App.selectPaths('app/controllers').sort(), expected);
  });
});
