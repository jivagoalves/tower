describe('Tower.ControllerCallbacks', function() {
  beforeEach(function(done) {
    Tower.start(done);
  });

  afterEach(function() {
    Tower.stop();
  });

  describe('.beforeAction', function() {
    test("beforeAction('testOnlyCallback', only: ['testCreateCallback', 'testUpdateCallback'])", function(done) {
      _.get('/custom/testCreateCallback', function() {
        assert.equal(this.testOnlyCallbackCalled, true);
        assert.equal(this.testCreateCallbackCalled, true);
        
        _.get('/custom/testNoCallback', function() {
          assert.equal(this.testOnlyCallbackCalled, void 0);
          assert.equal(this.testNoCallbackCalled, true);
          done();
        });
      });
    });

    test("beforeAction('testExceptCallback', except: 'testNoCallback')", function(done) {
      _.get('/custom/testCreateCallback', function() {
        assert.equal(this.testExceptCallbackCalled, true);
        assert.equal(this.testCreateCallbackCalled, true);
        
        _.get('/custom/testNoCallback', function() {
          assert.equal(this.testExceptCallbackCalled, void 0);
          assert.equal(this.testNoCallbackCalled, true);
          done();
        });
      });
    });
  });
});
