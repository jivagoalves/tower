describe('Tower.GeneratorActions', function() {
  var cakefileDestination, destinationRoot, generator, sourceRoot;

  beforeEach(function() {
    try {
      Tower.removeDirectorySync("" + (process.cwd()) + "/test/tmp");
    } catch (_error) {}
    sourceRoot = process.cwd() + "/packages/tower-generator/server/generators/tower/app";
    destinationRoot = process.cwd() + "/test/tmp";
    cakefileDestination = Tower.join(destinationRoot, "Cakefile");
    if (Tower.existsSync(cakefileDestination)) {
      Tower.removeFileSync(cakefileDestination);
    }
    return generator = new Tower.Generator({
      silent: true,
      sourceRoot: sourceRoot,
      destinationRoot: destinationRoot
    });
  });

  test('#findInSourcePaths', function() {
    assert.equal(generator.findInSourcePaths("cake"), Tower.join(sourceRoot, "templates", "cake"));
  });

  test('#destinationPath(relativePath)', function() {
    assert.equal(generator.destinationPath("Cakefile"), cakefileDestination);
  });

  test('#destinationPath(absolutePath)', function() {
    assert.equal(generator.destinationPath(cakefileDestination), cakefileDestination);
  });

  test('#copyFile', function(done) {
    var _this = this;
    assert.isFalse(Tower.existsSync(cakefileDestination));
    return generator.copyFile("cake", "Cakefile", function() {
      assert.isTrue(Tower.existsSync(cakefileDestination), "File " + cakefileDestination + " doesn't exist");
      done();
    });
  });

  test('#readFile', function(done) {
    var _this = this;
    return generator.readFile(generator.findInSourcePaths("cake"), function(error, content) {
      assert.match(content, /tower/);
      done();
    });
  });

  test('#createFile(relativePath)', function(done) {
    var _this = this;
    return generator.createFile(cakefileDestination, "Some content", function() {
      return generator.readFile(cakefileDestination, function(error, content) {
        assert.match(content, /Some content/);
        done();
      });
    });
  });

  test('#file', function() {
    assert.equal(generator.createFile.toString(), generator.file.toString());
  });

  test('#createDirectory(recursiveDirectory)', function(done) {
    var directory,
      _this = this;
    directory = "./a/b/c/d";
    return generator.createDirectory(directory, function(error, result) {
      assert.isTrue(Tower.existsSync("./test/tmp/" + directory), "Directory " + directory + " doesn't exist");
      done();
    });
  });

  test('#directory', function() {
    assert.equal(generator.createDirectory.toString(), generator.directory.toString());
  });

  test('#injectIntoFile', function(done) {
    var _this = this;
    return generator.createFile(cakefileDestination, "Some content", function() {
      generator.injectIntoFile(cakefileDestination, " and some more");
      return generator.readFile(cakefileDestination, function(error, content) {
        assert.equal("Some content and some more", content);
        done();
      });
    });
  });

  test('#get');

  test('#removeFile');

  test('#removeDir');

  test('#linkFile');

  test('#inside');

  test('#chmod');

  test('#render');

  test('#template');

  test('#prependToFile');

  test('#prependFile');

  test('#appendToFile');

  test('#appendFile');

  test('#commentLines');

  test('#uncommentLines');
});
