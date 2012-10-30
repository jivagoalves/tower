describe('Tower.GeneratorAppGenerator', function() {
  var destinationRoot, generator, sourceRoot;

  before(function() {
    sourceRoot = "" + (process.cwd()) + "/lib/tower/server/generator/generators/tower/app";
    destinationRoot = "" + (process.cwd()) + "/test/tmp/myapp";
  });

  test('create an app', function(done) {
    assert.file("" + Tower.root + "/app/controllers/server/testJsonController.coffee");
    done();
  });
});
