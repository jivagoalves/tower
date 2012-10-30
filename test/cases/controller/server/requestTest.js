describe("Tower.Controller (Integration)", function() {
  beforeEach(function(done) {
    Tower.start(done);
  });

  afterEach(function() {
    Tower.stop();
  });

  test("App.CamelCasedControllerName and routes");

  test('ip address', function(done) {
    _.get('/custom/testIP', function(response) {
      assert.equal(response.text, '127.0.0.1');
      done();
    });
  });

  describe("/test-routes", function() {
    test("/get", function(done) {
      _.get("/test-routes/get", function(response) {
        assert.equal("getMethod called", response.text);
        assert.equal(200, response.status);
        _.post("/test-routes/get", function(response) {
          assert.equal(404, response.status);
          done();
        });
      });
    });

    test("/post", function(done) {
      _.get("/test-routes/post", function(response) {
        assert.equal(404, response.status);
        _.post("/test-routes/post", function(response) {
          assert.equal("postMethod called", response.text);
          assert.equal(200, response.status);
          done();
        });
      });
    });

    test("/put", function(done) {
      _.get("/test-routes/put", function(response) {
        assert.equal(404, response.status);
        _.post("/test-routes/put", function(response) {
          assert.equal(404, response.status);
          _.put("/test-routes/put", function(response) {
            assert.equal("putMethod called", response.text);
            assert.equal(200, response.status);
            done();
          });
        });
      });
    });

    test("/delete", function(done) {
      _.get("/test-routes/delete", function(response) {
        assert.equal(404, response.status);
        _.post("/test-routes/delete", function(response) {
          assert.equal(404, response.status);
          _.put("/test-routes/delete", function(response) {
            assert.equal(404, response.status);
            _.destroy("/test-routes/delete", function(response) {
              assert.equal("deleteMethod called", response.text);
              assert.equal(200, response.status);
              done();
            });
          });
        });
      });
    });

    test("/get-post", function(done) {
      _.get("/test-routes/get-post", function(response) {
        assert.equal("getPostMethod called", response.text);
        assert.equal(200, response.status);
        _.post("/test-routes/get-post", function(response) {
          assert.equal("getPostMethod called", response.text);
          done();
        });
      });
    });
  });

  describe("json", function() {
    test("/test-json/default should return HTML", function(done) {
      _.get("/test-json/default", function(response) {
        assert.equal('defaultMethod in HTML', response.text);
        assert.equal(200, response.status);
        done();
      });
    });

    test("/test-json/default.json", function(done) {
      _.get("/test-json/default.json", function(response) {
        assert.deepEqual({
          value: 'defaultMethod in JSON'
        }, response.body);
        assert.equal(200, response.status);
        done();
      });
    });

    test("/test-json/default headers: accept: application/json", function(done) {
      _.get("/test-json/default", {
        headers: {
          'accept': 'application/json'
        }
      }, function(response) {
        assert.deepEqual({
          value: 'defaultMethod in JSON'
        }, response.body);
        assert.equal(200, response.status);
        done();
      });
    });

    test("POST /test-json/post headers: accept: application/json", function(done) {
      var data = {
        headers: {
          'accept': 'application/json'
        },
        params: {
          data: {
            postData: "JSON!"
          }
        }
      };
      _.post("/test-json/post", data, function(response) {
        assert.deepEqual({
          postData: 'JSON!'
        }, response.body);
        assert.equal(200, response.status);
        done();
      });
    });
  });
});
