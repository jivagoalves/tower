
describe('Tower.File', function() {
  var path;

  beforeEach(function() {
    path = 'test/example/server.js';
  });

  test('stat', function(done) {
    assert.ok(!!Tower.statSync(path));

    Tower.stat(path, function(error, stat) {
      assert.ok(!!stat);
      done();
    });
  });

  test('fingerprint', function() {
    var expected, string;
    expected = '67574c7b406bb0064c686db97d00943e';
    string = Tower.readFileSync(path);
    assert.equal(expected, Tower.fingerprint(string));
  });

  test('pathFingerprint', function() {
    var expected = '67574c7b406bb0064c686db97d00943e';
    assert.equal(Tower.pathFingerprint("some/file-" + expected + ".js"), expected);
  });

  test('pathWithFingerprint', function() {
    var expected, fingerprint;
    fingerprint = '67574c7b406bb0064c686db97d00943e';
    expected = "some/file-" + fingerprint + ".js";
    assert.equal(Tower.pathWithFingerprint('some/file.js', fingerprint), expected);
  });

  test('contentType', function() {
    var expected;
    expected = 'application/javascript';
    assert.equal(Tower.contentType(path), expected);
  });

  test('mtime', function(done) {
    var _this = this;
    assert.isTrue(Tower.mtimeSync(path) instanceof Date);
    Tower.mtime(path, function(error, mtime) {
      assert.isTrue(mtime instanceof Date);
      done();
    });
  });

  test('size', function(done) {
    var expected = 343;
    assert.equal(Tower.sizeSync(path), expected);
    Tower.size(path, function(error, size) {
      assert.equal(size, expected);
      done();
    });
  });

  test('should find entries in a directory', function(done) {
    var dir, expected,
      _this = this;
    dir = 'test/example/app/controllers/server';
    expected = ['applicationController.coffee', 'attachmentsController.coffee', 'controllerScopesMetadataController.coffee', 'customController.coffee', 'headersController.coffee', 'postsController.coffee', 'sessionsController.coffee', 'testJsonController.coffee', 'testRoutesController.coffee', 'usersController.coffee'].sort();
    assert.deepEqual(Tower.entriesSync(dir).sort(), expected);
    Tower.entries(dir, function(error, entries) {
      assert.deepEqual(entries.sort(), expected);
      done();
    });
  });

  test('absolutePath', function() {
    var expected;
    expected = Tower.join(process.cwd(), path);
    assert.equal(Tower.absolutePath(path), expected);
  });

  test('relativePath', function() {
    var expected;
    expected = path;
    assert.equal(Tower.relativePath(path), expected);
  });

  test('extensions', function() {
    var expected;
    expected = ['.js', '.coffee'];
    assert.deepEqual(Tower.extensions('something.js.coffee'), expected);
  });

  test('glob files', function() {
    var dir, expected;
    dir = 'test/example/app/controllers/server';
    expected = _.map(['applicationController.coffee', 'attachmentsController.coffee', 'controllerScopesMetadataController.coffee', 'customController.coffee', 'headersController.coffee', 'postsController.coffee', 'sessionsController.coffee', 'testJsonController.coffee', 'testRoutesController.coffee', 'usersController.coffee'].sort(), function(i) {
      Tower.join(dir, i);
    });
    assert.deepEqual(Tower.files(dir).sort(), expected);
    assert.deepEqual(Tower.files([dir]).sort(), expected);
  });
});
