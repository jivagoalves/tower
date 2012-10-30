describe("Tower.ControllerResourceful", function() {
  var controller, router, user;

  beforeEach(function(done) {
    App.User.destroy(function() {
      App.User.insert({firstName: "Lance"}, function(error, record) {
        user = record;
        done();
      });
    });
  });

  beforeEach(function(done) {
    Tower.start(done);
  });

  afterEach(function() {
    Tower.stop();
  });

  describe('format: "json"', function() {
    describe("success", function() {
      test('#index', function(done) {
        _.get('/custom', {
          format: 'json'
        }, function(response) {
          var resources,
            _this = this;
          resources = response.body;
          assert.isArray(resources);
          assert.isArray(this.collection);
          assert.equal(typeof this.resource, 'undefined');
          assert.equal(resources.length, 1);
          assert.equal(resources[0].firstName, 'Lance');
          assert.equal(this.headers['Content-Type'], 'application/json; charset=utf-8');
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#new', function(done) {
        _.get('/custom/new', {
          format: 'json'
        }, function() {
          var resource,
            _this = this;
          resource = JSON.parse(this.body);
          assert.equal(typeof this.collection, 'undefined');
          assert.equal(typeof this.resource, 'object');
          assert.equal(resource.firstName, undefined);
          assert.equal(this.headers['Content-Type'], 'application/json; charset=utf-8');
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#create', function(done) {
        _.post('/custom', {
          format: 'json',
          params: {
            user: {
              firstName: 'Lance'
            }
          }
        }, function(response) {
          var resource,
            _this = this;
          resource = response.body;
          assert.equal(resource.firstName, 'Lance');
          assert.equal(this.headers['Content-Type'], 'application/json; charset=utf-8');
          App.User.count(function(error, count) {
            assert.equal(count, 2);
            done();
          });
        });
      });

      test('#show', function(done) {
        _.get("/custom/" + (user.get('id')), {
          format: "json"
        }, function(response) {
          var resource,
            _this = this;
          resource = JSON.parse(this.body);
          assert.equal(resource.firstName, "Lance");
          assert.ok(resource.id);
          assert.equal(this.headers["Content-Type"], 'application/json; charset=utf-8');
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#edit', function(done) {
        _.get("/custom/" + (user.get('id')) + "/edit", {
          format: "json"
        }, function(response) {
          var resource,
            _this = this;
          resource = JSON.parse(this.body);
          assert.equal(resource.firstName, "Lance");
          assert.ok(resource.id);
          assert.equal(this.headers["Content-Type"], 'application/json; charset=utf-8');
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#update', function(done) {
        _.put("/custom/" + (user.get('id')), {
          format: "json",
          params: {
            user: {
              firstName: "Dane"
            }
          }
        }, function(response) {
          var resource,
            _this = this;
          resource = JSON.parse(this.body);
          assert.equal(resource.firstName, "Dane");
          assert.ok(resource.id);
          assert.equal(this.headers["Content-Type"], 'application/json; charset=utf-8');
          App.User.find(user.get('id'), function(error, user) {
            assert.equal(user.get("firstName"), "Dane");
            App.User.count(function(error, count) {
              assert.equal(count, 1);
              done();
            });
          });
        });
      });

      test('#destroy', function(done) {
        _.destroy("/custom/" + (user.get('id')), {
          format: "json"
        }, function(response) {
          var resource,
            _this = this;
          resource = response.body;
          assert.equal(resource.firstName, "Lance");
          assert.notEqual(resource.id, undefined);
          assert.equal(this.headers["Content-Type"], 'application/json; charset=utf-8');
          App.User.count(function(error, count) {
            assert.equal(count, 0);
            done();
          });
        });
      });
    });

    describe("failure", function() {

      test('#create');

      test('#update');

      test('#destroy');
    });
  });

  describe('format: "html"', function() {

    describe('success', function() {

      test('#index', function(done) {
        _.get('/custom', function(response) {
          var _this = this;
          assert.equal(this.body, '<h1>Hello World</h1>\n');
          assert.equal(this.headers["Content-Type"], "text/html");
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#new', function(done) {
        _.get('/custom/new', function() {
          var _this = this;
          assert.equal(this.action, "new");
          assert.equal(this.body, '<h1>New User</h1>\n');
          assert.equal(this.headers["Content-Type"], "text/html");
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#create', function(done) {
        var params;
        params = {
          user: {
            firstName: "Lance"
          }
        };
        _.post('/custom.html', {
          params: params
        }, function(response) {
          var _this = this;
          assert.equal(this.action, "show");
          assert.equal(response.text, "<h1>Hello Lance</h1>\n");
          assert.equal(this.headers["Content-Type"], "text/html");
          App.User.count(function(error, count) {
            assert.equal(count, 2);
            done();
          });
        });
      });

      test('#show', function(done) {
        _.get("/custom/" + (user.get('id')), function(response) {
          var _this = this;
          assert.equal(response.text, "<h1>Hello Lance</h1>\n");
          assert.equal(this.headers["Content-Type"], "text/html");
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#edit', function(done) {
        _.get("/custom/" + (user.get('id')) + "/edit", function(response) {
          var _this = this;
          assert.equal(response.text, '<h1>Editing User</h1>\n');
          assert.equal(this.headers["Content-Type"], "text/html");
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });

      test('#update', function(done) {
        _.put("/custom/" + (user.get('id')) + ".html", {
          params: {
            user: {
              firstName: "Dane"
            }
          }
        }, function(response) {
          var _this = this;
          assert.equal(this.action, "show");
          assert.equal(response.text, '<h1>Hello Dane</h1>\n');
          assert.equal(this.headers["Content-Type"], "text/html");
          App.User.find(user.get('id'), function(error, user) {
            assert.equal(user.get("firstName"), "Dane");
            App.User.count(function(error, count) {
              assert.equal(count, 1);
              done();
            });
          });
        });
      });

      test('#destroy', function(done) {
        _.destroy("/custom/" + (user.get('id')) + ".html", function(response) {
          var _this = this;
          assert.equal(this.action, "index");
          assert.equal(response.text, '<h1>Hello World</h1>\n');
          assert.equal(this.headers["Content-Type"], "text/html");
          App.User.count(function(error, count) {
            assert.equal(count, 0);
            done();
          });
        });
      });
    });
  });
});
