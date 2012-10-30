var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('Tower.SupportCallbacksCallbackChain', function() {
  var CallbackTest, record;
  CallbackTest = (function(_super) {

    __extends(CallbackTest, _super);

    function CallbackTest() {
      return CallbackTest.__super__.constructor.apply(this, arguments);
    }

    CallbackTest.include(Tower.SupportCallbacks);

    CallbackTest.before('method', 'beforeMethod');

    CallbackTest.after('method', 'afterMethod');

    CallbackTest.after('method', 'afterMethod2');

    CallbackTest.before('methodWithAsyncCallback', 'beforeMethodWithAsyncCallback');

    CallbackTest.after('methodWithAsyncCallback', 'afterMethodWithAsyncCallback');

    CallbackTest.before('asyncMethod', 'beforeAsyncMethod');

    CallbackTest.after('asyncMethod', 'afterAsyncMethod');

    CallbackTest.before('asyncMethodWithAsyncCallback', 'beforeAsyncMethodWithAsyncCallback');

    CallbackTest.after('asyncMethodWithAsyncCallback', 'afterAsyncMethodWithAsyncCallback');

    CallbackTest.after('asyncMethodWithAsyncCallback', 'afterAsyncMethodWithAsyncCallback2');

    CallbackTest.prototype.method = function() {
      return this.runCallbacks('method', function() {
        return this._method = true;
      });
    };

    CallbackTest.prototype.beforeMethod = function() {
      return this._beforeMethod = this._expectedBeforeMethod;
    };

    CallbackTest.prototype.afterMethod = function() {
      return this._afterMethod = this._expectedAfterMethod;
    };

    CallbackTest.prototype.afterMethod2 = function() {
      return this._afterMethod2 = this._expectedAfter2Method;
    };

    CallbackTest.prototype.methodWithAsyncCallback = function() {
      return this.runCallbacks('methodWithAsyncCallback', function() {
        return this._methodWithAsyncCallback = true;
      });
    };

    CallbackTest.prototype.beforeMethodWithAsyncCallback = function(done) {
      done(this._beforeMethodWithAsyncCallback = this._expectedBeforeMethodWithAsyncCallback);
    };

    CallbackTest.prototype.afterMethodWithAsyncCallback = function(done) {
      done(this._afterMethodWithAsyncCallback = this._expectedAfterMethodWithAsyncCallback);
    };

    CallbackTest.prototype.asyncMethodWithAsyncCallback = function(methodDone) {
      var block;
      block = function(blockDone) {
        var _this = this;
        return process.nextTick(function() {
          return blockDone(_this._asyncMethodWithAsyncCallback = _this._expectedAsyncMethodWithAsyncCallback);
        });
      };
      return this.runCallbacks('asyncMethodWithAsyncCallback', block, methodDone);
    };

    CallbackTest.prototype.beforeAsyncMethodWithAsyncCallback = function(done) {
      var _this = this;
      return process.nextTick(function() {
        done(_this._beforeAsyncMethodWithAsyncCallback = _this._expectedBeforeAsyncMethodWithAsyncCallback);
      });
    };

    CallbackTest.prototype.afterAsyncMethodWithAsyncCallback = function(done) {
      var _this = this;
      return process.nextTick(function() {
        done(_this._afterAsyncMethodWithAsyncCallback = _this._expectedAfterAsyncMethodWithAsyncCallback);
      });
    };

    CallbackTest.prototype.afterAsyncMethodWithAsyncCallback2 = function(done) {
      var _this = this;
      return process.nextTick(function() {
        done(_this._afterAsyncMethodWithAsyncCallback2 = _this._expectedAfterAsyncMethodWithAsyncCallback2);
      });
    };

    return CallbackTest;

  })(Tower.Class);
  record = null;
  beforeEach(function() {
    Tower.SupportCallbacks.silent = true;
    return record = CallbackTest.build();
  });

  describe('sync method, sync callback', function() {

    test('if callbacks dont return false everything should be fine', function() {
      record._expectedBeforeMethod = true;
      record._expectedAfterMethod = true;
      record._expectedAfter2Method = true;
      record.method();
      assert.isTrue(record._beforeMethod);
      assert.isTrue(record._method);
      assert.isTrue(record._afterMethod);
      assert.isTrue(record._afterMethod2);
    });

    test('if beforeCallback returns false then it shouldnt execute method or after callback', function() {
      record._expectedBeforeMethod = false;
      record._expectedAfterMethod = undefined;
      record.method();
      assert.equal(record._beforeMethod, false);
      assert.equal(record._method, undefined);
      assert.equal(record._afterMethod, undefined);
      assert.equal(record._afterMethod2, undefined);
    });

    test('if afterCallback returns false then it shouldnt execute subsequent after callbacks', function() {
      record._expectedBeforeMethod = true;
      record._expectedAfterMethod = false;
      record.method();
      assert.equal(record._beforeMethod, true);
      assert.equal(record._method, true);
      assert.equal(record._afterMethod, false);
      assert.equal(record._afterMethod2, undefined);
    });

    test('should only halt if return false, not undefined or anything', function() {
      record._expectedBeforeMethod = undefined;
      record._expectedAfterMethod = false;
      record.method();
      assert.equal(record._beforeMethod, undefined);
      assert.equal(record._method, true);
      assert.equal(record._afterMethod, false);
      assert.equal(record._afterMethod2, undefined);
    });
  });

  describe('sync method, async callback', function() {

    test('if async beforeCallback calls back with an error (or anything except null, false, or undefined), it should halt', function() {
      record._expectedBeforeMethodWithAsyncCallback = 'error!';
      record._expectedAfterMethodWithAsyncCallback = undefined;
      record.methodWithAsyncCallback();
      assert.equal(record._beforeMethodWithAsyncCallback, 'error!');
      assert.equal(record._methodWithAsyncCallback, undefined);
      assert.equal(record._afterMethodWithAsyncCallback, undefined);
    });
  });

  describe('async method, async callback', function() {

    test('if async beforeCallback calls back with an error (or anything except null, false, or undefined), it should halt', function(done) {
      var _this = this;
      record._expectedBeforeAsyncMethodWithAsyncCallback = 'error!';
      record._expectedAfterAsyncMethodWithAsyncCallback = undefined;
      record._expectedAsyncMethodWithAsyncCallback = false;
      return record.asyncMethodWithAsyncCallback(function(error) {
        assert.equal(error.message, 'error!');
        assert.equal(record._beforeAsyncMethodWithAsyncCallback, 'error!');
        assert.equal(record._asyncMethodWithAsyncCallback, undefined);
        assert.equal(record._afterAsyncMethodWithAsyncCallback, undefined);
        done();
      });
    });

    test('everything should execute if no errors', function(done) {
      var _this = this;
      record._expectedBeforeAsyncMethodWithAsyncCallback = undefined;
      record._expectedAfterAsyncMethodWithAsyncCallback = false;
      record._expectedAsyncMethodWithAsyncCallback = false;
      return record.asyncMethodWithAsyncCallback(function(error) {
        assert.equal(error, undefined);
        assert.equal(record._beforeAsyncMethodWithAsyncCallback, undefined);
        assert.equal(record._asyncMethodWithAsyncCallback, false);
        assert.equal(record._afterAsyncMethodWithAsyncCallback, false);
        done();
      });
    });

    test('if after callback fails subsequent ones should not be executed', function(done) {
      var _this = this;
      record._expectedBeforeAsyncMethodWithAsyncCallback = undefined;
      record._expectedAfterAsyncMethodWithAsyncCallback = true;
      record._expectedAfterAsyncMethodWithAsyncCallback2 = true;
      record._expectedAsyncMethodWithAsyncCallback = false;
      return record.asyncMethodWithAsyncCallback(function(error) {
        assert.equal(error.message, 'true');
        assert.equal(record._beforeAsyncMethodWithAsyncCallback, undefined);
        assert.equal(record._asyncMethodWithAsyncCallback, false);
        assert.equal(record._afterAsyncMethodWithAsyncCallback, true);
        assert.equal(record._afterAsyncMethodWithAsyncCallback2, undefined);
        done();
      });
    });

    test('* if async block calls callback with anything but false/undefined/null it will halt', function(done) {
      var _this = this;
      record._expectedBeforeAsyncMethodWithAsyncCallback = false;
      record._expectedAfterAsyncMethodWithAsyncCallback = false;
      record._expectedAsyncMethodWithAsyncCallback = 'error!';
      return record.asyncMethodWithAsyncCallback(function(error) {
        assert.equal(error.message, 'error!');
        assert.equal(record._beforeAsyncMethodWithAsyncCallback, false);
        assert.equal(record._asyncMethodWithAsyncCallback, 'error!');
        assert.equal(record._afterAsyncMethodWithAsyncCallback, undefined);
        done();
      });
    });
  });

  describe('uniqueness', function() {
    var post;
    App.UniquenessModel = (function(_super) {

      __extends(UniquenessModel, _super);

      function UniquenessModel() {
        return UniquenessModel.__super__.constructor.apply(this, arguments);
      }

      UniquenessModel.field('title');

      UniquenessModel.field('slug');

      UniquenessModel.belongsTo('post');

      UniquenessModel.validates('title', {
        presence: true
      });

      UniquenessModel.validates('postId', {
        uniqueness: true
      });

      UniquenessModel.before('validate', 'slugify');

      UniquenessModel.prototype.slugify = function() {
        if (this.get('title') && !(this.get('slug') != null)) {
          this.set('slug', _.parameterize(this.get('title')));
        }
        return true;
      };

      return UniquenessModel;

    })(Tower.Model);
    record = null;
    post = null;
    beforeEach(function(done) {
      var _this = this;
      App.Post.create({
        rating: 8
      }, function(error, r) {
        post = r;
        App.UniquenessModel.create({
          title: 'a title',
          postId: post.get('id')
        }, function(error, r) {
          record = r;
          done();
        });
      });
    });

    test('save', function(done) {
      var _this = this;
      assert.isTrue(record.get('isValid'));
      return record.save(function() {
        assert.isFalse(record.get('isValid'));
        done();
      });
    });
  });
});
