var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('Tower.Store', function() {

  test('.queryOperators', function() {
    var key, queryOperators, value, _results;
    queryOperators = {
      '>=': '$gte',
      '$gte': '$gte',
      '>': '$gt',
      '$gt': '$gt',
      '<=': '$lte',
      '$lte': '$lte',
      '<': '$lt',
      '$lt': '$lt',
      '$in': '$in',
      '$any': '$in',
      '$nin': '$nin',
      '$all': '$all',
      '=~': '$regex',
      '$m': '$regex',
      '$regex': '$regex',
      '$match': '$regex',
      '$notMatch': '$notMatch',
      '!~': '$nm',
      '$nm': '$nm',
      '=': '$eq',
      '$eq': '$eq',
      '!=': '$neq',
      '$neq': '$neq',
      '$null': '$null',
      '$notNull': '$notNull'
    };
    _results = [];
    for (key in queryOperators) {
      value = queryOperators[key];
      _results.push(assert.equal(Tower.Store.queryOperators[key], value));
    }
    return _results;
  });

  test('.atomicModifiers', function() {
    var atomicModifiers, key, value, _results;
    atomicModifiers = {
      '$set': '$set',
      '$unset': '$unset',
      '$push': '$push',
      '$pushAll': '$pushAll',
      '$pull': '$pull',
      '$pullAll': '$pullAll',
      '$inc': '$inc',
      '$pop': '$pop'
    };
    _results = [];
    for (key in atomicModifiers) {
      value = atomicModifiers[key];
      _results.push(assert.equal(Tower.Store.atomicModifiers[key], value));
    }
    return _results;
  });

  test('.defaultLimit', function() {
    assert.equal(Tower.Store.defaultLimit, 100);
  });

  describe('configuration', function() {
    var withReconfiguredDatabase;
    withReconfiguredDatabase = function(configuration, block) {
      Tower.Application.configNames = _.without(Tower.Application.configNames, 'databases');
      Tower.Application.instance().initialize;
      Tower.config.databases = configuration;
      block.call;
      Tower.Application.configNames.push('databases');
    };

    test('should set the default model store to Tower.StoreMemory if no databases are in the config', function() {
      var configuration,
        _this = this;
      configuration = {};
      return withReconfiguredDatabase(configuration, function() {
        assert.equal(Tower.StoreMemory, Tower.Model["default"]('store'));
      });
    });

    test('should set the default model store to the first database seen in the database config for the current environment if none are marked as default', function() {
      var configuration,
        _this = this;
      configuration = {
        mongodb: {
          production: {
            name: 'client-production',
            port: 27017,
            host: '127.0.0.1'
          }
        },
        redis: {
          production: {
            name: 'client-production',
            host: '127.0.0.1',
            port: 6837
          }
        }
      };
      return withReconfiguredDatabase(configuration, function() {
        assert.equal(Tower.StoreMongodb, Tower.Model["default"]('store'));
      });
    });

    test('should set the default model store to the database marked as default in the database config for the current environment', function() {
      var configuration,
        _this = this;
      configuration = {
        redis: {
          production: {
            name: 'client-production',
            host: '127.0.0.1',
            port: 6837
          }
        },
        mongodb: {
          production: {
            name: 'client-production',
            port: 27017,
            host: '127.0.0.1',
            "default": true
          }
        }
      };
      return withReconfiguredDatabase(configuration, function() {
        assert.equal(Tower.StoreMongodb, Tower.Model["default"]('store'));
      });
    });
  });

  describe('#update', function() {

    test('{ $push : { field : value }');

    test('{ $inc : { field : value } }');

    test('{ $set : { field : value } }');

    test('{ $unset : { field : 1} }');

    test('{ $push : { field : value } }');

    test('{ $pushAll : { field : valueArray } }');

    test('{ $addToSet : { field : value } }');

    test('{ $pop : { field : 1  } }');

    test('{ $pop : { field : -1  } }');

    test('{ $pull : { field : _value } }');

    test('{ $pullAll : { field : value_array } }');
  });

  test('stores are unique per subclass', function() {
    var A, B, X, Y;
    A = (function(_super) {

      __extends(A, _super);

      function A() {
        return A.__super__.constructor.apply(this, arguments);
      }

      return A;

    })(Tower.Model);
    B = (function(_super) {

      __extends(B, _super);

      function B() {
        return B.__super__.constructor.apply(this, arguments);
      }

      return B;

    })(A);
    X = (function(_super) {

      __extends(X, _super);

      function X() {
        return X.__super__.constructor.apply(this, arguments);
      }

      X.store();

      return X;

    })(Tower.Model);
    Y = (function(_super) {

      __extends(Y, _super);

      function Y() {
        return Y.__super__.constructor.apply(this, arguments);
      }

      return Y;

    })(X);
    assert.equal(A.store().className, 'App.A');
    assert.equal(B.store().className, 'App.B');
    assert.equal(X.store().className, 'App.X');
    assert.equal(Y.store().className, 'App.Y');
  });
});
