describe('Tower.ControllerRendering', function() {
  var controller, router, user;

  beforeEach(function(done) {
    Tower.start(done);
  });
  
  afterEach(function() {
    Tower.stop();
  });

  test('renderCoffeeKupFromTemplate', function(done) {
    _.get('/custom/renderCoffeeKupFromTemplate', function() {
      assert.equal(this.body, "<h1>Hello World</h1>\n");
      assert.equal(this.headers["Content-Type"], "text/html");
      done();
    });
  });

  test('renderHelloWorldFromVariable', function(done) {
    _.get('/custom/renderHelloWorldFromVariable', function() {
      assert.equal(this.person, "david");
      assert.equal(this.body, "hello david");
      done();
    });
  });

  test('renderWithExplicitStringTemplateAsAction', function(done) {
    _.get('/custom/renderWithExplicitStringTemplateAsAction', function() {
      assert.equal(this.body, "<h1>Hello World!!!</h1>\n");
      done();
    });
  });

  test('renderActionUpcasedHelloWorld', function(done) {
    _.get('/custom/renderActionUpcasedHelloWorld', function() {
      assert.equal(this.body, "<h1>renderActionUpcasedHelloWorld</h1>\n");
      done();
    });
  });

  test('renderActionUpcasedHelloWorldAsString', function(done) {
    _.get('/custom/renderActionUpcasedHelloWorldAsString', function() {
      assert.equal(this.body, "<h1>renderActionUpcasedHelloWorld</h1>\n");
      done();
    });
  });

  test('renderJsonHelloWorld', function(done) {
    _.get('/custom/renderJsonHelloWorld', function() {
      assert.equal(this.body, JSON.stringify({
        hello: "world"
      }));
      assert.equal(this.headers["Content-Type"], 'application/json; charset=utf-8');
      done();
    });
  });

  test('renderJsonHelloWorldWithParams', function(done) {
    _.get('/custom/renderJsonHelloWorldWithParams', {
      params: {
        hello: "world"
      }
    }, function() {
      assert.equal(this.body, JSON.stringify({
        hello: "world"
      }));
      assert.equal(this.headers["Content-Type"], 'application/json; charset=utf-8');
      assert.equal(this.status, 200);
      done();
    });
  });

  test('renderJsonHelloWorldWithStatus', function(done) {
    _.get('/custom/renderJsonHelloWorldWithStatus', function() {
      assert.equal(this.body, JSON.stringify({
        hello: "world"
      }));
      assert.equal(this.headers["Content-Type"], 'application/json; charset=utf-8');
      assert.equal(this.status, 401);
      done();
    });
  });
});
