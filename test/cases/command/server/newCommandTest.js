describe('Tower.CommandNew', function() {
  function command() {
    var defaultArgs = ['node', 'tower', 'new', 'blog'];
    Tower.Command.load('new');
    return (new Tower.CommandNew(defaultArgs.concat(_.args(arguments)))).program;
  };

  describe('tower new blog', function() {
    test('default', function() {
      assert.equal(command().namespace, 'App');
    });

    test('-n, --namespace', function() {
      assert.equal(command('-n', 'Blog').namespace, 'Blog');
      assert.equal(command('--namespace', 'Blog').namespace, 'Blog');
    });

    test('--template', function() {
      var template = 'http://raw.github.com/viatropos/tower-generators/tree/master/lib/default.js';
      assert.equal(command('--template', template).template, template);
    });

    test('--skip-procfile', function() {
      assert.isFalse(command().skipProcfile);
      assert.isTrue(command('--skip-procfile').skipProcfile);
    });

    test('--skip-git', function() {
      assert.isFalse(command().skipGit);
      assert.isTrue(command('--skip-git').skipGit);
    });

    test('--skip-assets', function() {
      assert.isFalse(command().skipAssets);
      assert.isTrue(command('--skip-assets').skipAssets);
    });

    test('-T, --title', function() {
      assert.equal(command().title, void 0);
      assert.equal(command('-T', 'My Blog').title, 'My Blog');
    });

    test('-D, --description', function() {
      assert.equal(command().description, '');
      assert.equal(command('-D', 'A description').description, 'A description');
    });

    test('-K, --keywords', function() {
      assert.equal(command().keywords, '');
      assert.equal(command('-K', 'ruby, javascript').keywords, 'ruby, javascript');
    });

    test('-p, --persistence', function() {
      assert.deepEqual(command().persistence, ['mongodb']);
      assert.deepEqual(command('--persistence', 'mongodb redis').persistence, ['mongodb', 'redis']);
      assert.deepEqual(command('--persistence', 'mongodb, redis').persistence, ['mongodb', 'redis']);
    });

    test('-e, --engine', function() {
      assert.equal(command().engine, 'coffee');
      assert.equal(command().templateEngine, 'coffee');
      assert.equal(command('--engine', 'ejs').engine, 'ejs');
    });

    test('-s, --stylesheet-engine', function() {
      assert.deepEqual(command().stylesheetEngine, 'styl');
      assert.deepEqual(command('--stylesheet-engine', 'css').stylesheetEngine, 'css');
    });

    test('--include-stylesheets', function() {
      assert.deepEqual(command().includeStylesheets, ['twitter-bootstrap']);
      assert.deepEqual(command('--include-stylesheets', 'twitter-bootstrap compass').includeStylesheets, ['twitter-bootstrap', 'compass']);
    });

    test('-t, --test', function() {
      assert.equal(command().test, 'mocha');
      assert.equal(command('--test', 'jasmine').test, 'jasmine');
    });

    test('-d, --deployment', function() {
      assert.deepEqual(command().deployment, ['heroku']);
      assert.deepEqual(command('--deployment', 'nodejitsu heroku').deployment, ['nodejitsu', 'heroku']);
    });

    test('-w, --worker', function() {
      assert.deepEqual(command().worker, 'kue');
      assert.deepEqual(command('--worker', 'coffee-resque').worker, 'coffee-resque');
    });

    test('-j, --use-javascript', function() {
      assert.isFalse(command().useJavascript);
      assert.equal(command().scriptType, 'coffee');
      assert.isTrue(command('--use-javascript').useJavascript);
      assert.equal(command('--use-javascript').scriptType, 'js');
    });
  });
});
