describe("Tower.View", function() {
  var store, user, view, path, engine;

  store = Tower.View.store();

  var engine, _i, _len, _ref, _results;

  beforeEach(function() {
    Tower.View.engine = "coffee";
    view = new Tower.View;
  });

  afterEach(function() {
    Tower.View.engine = "coffee";
  });

  describe('path to files', function() {
    test('loadPaths', function() {
      assert.deepEqual(store.loadPaths, ["app/templates/shared", "app/templates/server"]);
    });

    test("findPath(path: 'custom/engine', ext: 'coffee')", function() {
      path = store.findPath({
        path: 'custom/engine',
        ext: 'coffee'
      });
      assert.equal(path, "app/templates/shared/custom/engine.coffee");
      path = store.findPath({
        path: 'custom2/engine',
        ext: 'coffee'
      });
      assert.equal(path, "app/templates/shared/custom2/engine.coffee");
    });

    test("findPath(path: 'engine', ext: 'coffee', prefixes: ['custom'])", function() {
      var path;
      path = store.findPath({
        path: 'engine',
        ext: 'coffee',
        prefixes: ['custom']
      });
      assert.equal(path, "app/templates/shared/custom/engine.coffee");
      path = store.findPath({
        path: 'engine',
        ext: 'coffee',
        prefixes: ['custom2']
      });
      assert.equal(path, "app/templates/shared/custom2/engine.coffee");
    });
  });

  describe('config', function() {
    test('setting default engine', function(done) {
      Tower.View.engine = 'jade';
      engine = 'jade';
      
      view.render({template: 'custom/engine', locals: {ENGINE: engine}}, function(error, body) {
        assert.equal(body.trim(), "<h1>I'm jade!</h1>");
        done();
      });
    });

    test('specifying custom type different from default engine', function(done) {
      Tower.View.engine = 'jade';
      engine = 'coffee';

      view.render({
        template: 'custom/engine',
        type: engine,
        locals: {
          ENGINE: engine
        }
      }, function(error, body) {
        assert.equal(body.trim(), "<h1>I'm coffee!</h1>");
        done();
      });
    });
  });
  
  _ref = ['coffee', 'jade', 'ejs', 'eco', 'mustache'];
  _results = [];

  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    engine = _ref[_i];
    _results.push((function(engine) {

      describe("render view with " + engine, function() {
        test("findPath(path: 'engine', ext: '" + engine + "', prefixes: ['custom'])", function() {
          path = store.findPath({
            path: 'engine',
            ext: engine,
            prefixes: ['custom']
          });
          assert.equal(path, "app/templates/shared/custom/engine." + engine);
        });

        test("render(template: 'custom/engine." + engine + "')", function(done) {
          return view.render({
            template: "custom/engine." + engine,
            locals: {
              ENGINE: engine
            }
          }, function(error, body) {
            assert.equal(body.trim(), "<h1>I'm " + engine + "!</h1>");
            done();
          });
        });

        test("render(template: 'custom/engine', type: '" + engine + "')", function(done) {
          return view.render({
            template: 'custom/engine',
            type: engine,
            locals: {
              ENGINE: engine
            }
          }, function(error, body) {
            assert.equal(body.trim(), "<h1>I'm " + engine + "!</h1>");
            done();
          });
        });

        test("render(template: 'engine', type: '" + engine + "', prefixes: ['custom'])", function(done) {
          return view.render({
            template: 'engine',
            type: engine,
            prefixes: ['custom'],
            locals: {
              ENGINE: engine
            }
          }, function(error, body) {
            assert.equal(body.trim(), "<h1>I'm " + engine + "!</h1>");
            done();
          });
        });

        test("render(template: 'custom/engine', type: '" + engine + "', layout: 'test')", function(done) {
          return view.render({
            template: 'custom/engine',
            type: engine,
            layout: 'test',
            locals: {
              ENGINE: engine
            }
          }, function(error, body) {
            assert.equal(body.trim(), "<h1>I'm " + engine + "!</h1>");
            done();
          });
        });
      });

      describe("Tower.View.engine = '" + engine + "' (default engine)", function() {
        beforeEach(function() {
          Tower.View.engine = engine;
        });
        afterEach(function() {
          Tower.View.engine = "coffee";
        });

        test("render(template: 'custom/engine')", function(done) {
          return view.render({
            template: 'custom/engine',
            locals: {
              ENGINE: engine
            }
          }, function(error, body) {
            assert.equal(body.trim(), "<h1>I'm " + engine + "!</h1>");
            done();
          });
        });
      });
    })(engine));
  }
});
