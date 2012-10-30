var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App.OperatorsTest = (function(_super) {

  __extends(OperatorsTest, _super);

  function OperatorsTest() {
    return OperatorsTest.__super__.constructor.apply(this, arguments);
  }

  OperatorsTest.field('string', {
    type: 'String'
  });

  OperatorsTest.field('integer', {
    type: 'Integer'
  });

  OperatorsTest.field('float', {
    type: 'Float'
  });

  OperatorsTest.field('date', {
    type: 'Date'
  });

  OperatorsTest.field('object', {
    type: 'Object',
    "default": {}
  });

  OperatorsTest.field('arrayString', {
    type: ['String'],
    "default": []
  });

  OperatorsTest.field('arrayObject', {
    type: ['Object'],
    "default": []
  });

  return OperatorsTest;

})(Tower.Model);

describe('Tower.StoreOperators', function() {
  var o, r, t;
  o = Tower.StoreOperators;
  r = null;
  t = null;

  test('eq', function() {
    assert.isTrue(o.eq(1, 1), '1 === 1');
    assert.isTrue(o.eq(1, 1.0), '1 === 1.0');
    assert.isTrue(o.eq(new Date, new Date), 'now === now');
    assert.isTrue(o.eq(/asdf/, "/asdf/"), '/asdf/ === "/asdf/"');
    assert.isTrue(o.eq("/asdf/", /asdf/), '"/asdf/" === /asdf/');
    assert.isTrue(o.eq(null, null), 'null === null');
    assert.isTrue(o.eq(undefined, undefined), 'undefined === undefined');
    assert.isTrue(o.eq(0, 0), '0 === 0');
    assert.isFalse(o.eq(null, undefined), 'null === undefined');
    assert.isFalse(o.eq(undefined, null), 'undefined === null');
    assert.isFalse(o.eq(0, null), '0 === null');
    assert.isFalse(o.eq(0, undefined), '0 === undefined');
    assert.isFalse(o.eq(1, '1'), '1 === "1"');
    assert.isFalse(o.eq(1, 1.1), '1 === 1.1');
    assert.isFalse(o.eq(new Date, _(3).days().ago().toDate()), 'now === ago');
    assert.isFalse(o.eq(/asdf/, "asdf"), '/asdf/ === "asdf"');
  });

  test('ne', function() {
    assert.isTrue(o.ne(null, undefined), 'null === undefined');
    assert.isTrue(o.ne(undefined, null), 'undefined === null');
    assert.isTrue(o.ne(0, null), '0 === null');
    assert.isTrue(o.ne(0, undefined), '0 === undefined');
    assert.isTrue(o.ne(1, '1'), '1 === "1"');
    assert.isTrue(o.ne(1, 1.1), '1 === 1.1');
    assert.isTrue(o.ne(new Date, _(3).days().ago().toDate()), 'now === ago');
    assert.isTrue(o.ne(/asdf/, "asdf"), '/asdf/ === "asdf"');
    assert.isFalse(o.ne(1, 1), '1 === 1');
    assert.isFalse(o.ne(1, 1.0), '1 === 1.0');
    assert.isFalse(o.ne(new Date, new Date), 'now === now');
    assert.isFalse(o.ne(/asdf/, "/asdf/"), '/asdf/ === "/asdf/"');
    assert.isFalse(o.ne("/asdf/", /asdf/), '"/asdf/" === /asdf/');
    assert.isFalse(o.ne(null, null), 'null === null');
    assert.isFalse(o.ne(undefined, undefined), 'undefined === undefined');
    assert.isFalse(o.ne(0, 0), '0 === 0');
  });

  describe('gte', function() {
    test('integer', function() {
      assert.isTrue(o.gte(2, 1), '2 >= 1');
      assert.isTrue(o.gte(2, 2), '2 >= 2');
      assert.isTrue(o.gte(2, 0), '2 >= 0');
      assert.isTrue(o.gte(-1, -2), '-1 >= -2');
      assert.isFalse(o.gte(-1, 0), '-1 !>= 0');
      assert.isFalse(o.gte(2, undefined), '2 !>= undefined');
      assert.isFalse(o.gte(2, null), '2 !>= null');
    });

    test('date', function() {
      var ago, now;
      now = new Date;
      ago = _(3).days().ago().toDate();
      assert.isTrue(o.gte(now, ago), 'now >= 3.days.ago');
      assert.isTrue(o.gte(now, now), 'now >= now');
      assert.isFalse(o.gte(ago, now), 'ago !>= now');
    });
  });

  test('gt', function() {
    assert.isTrue(o.gt(2, 1), '2 > 1');
    assert.isTrue(o.gt(2, 0), '2 > 0');
    assert.isTrue(o.gt(-1, -2), '-1 > -2');
    assert.isFalse(o.gt(2, 2), '2 !> 2');
    assert.isFalse(o.gt(-1, 0), '-1 !> 0');
    assert.isFalse(o.gt(2, undefined), '2 !> undefined');
    assert.isFalse(o.gt(2, null), '2 !>= null');
  });

  test('lte', function() {
    assert.isTrue(o.lte(2, 2), '2 <= 2');
    assert.isTrue(o.lte(-1, 0), '-1 <= 0');
    assert.isFalse(o.lte(2, 1), '2 !<= 1');
    assert.isFalse(o.lte(2, 0), '2 !<= 0');
    assert.isFalse(o.lte(-1, -2), '-1 !<= -2');
    assert.isFalse(o.lte(2, undefined), '2 !<= undefined');
    assert.isFalse(o.lte(2, null), '2 !<= null');
  });

  test('lt', function() {
    assert.isTrue(o.lt(-1, 0), '-1 < 0');
    assert.isTrue(o.lt(0, 1), '0 < 1');
    assert.isTrue(o.lt(1, 2), '1 < 2');
    assert.isFalse(o.lt(2, 1), '2 !< 1');
    assert.isFalse(o.lt(2, 0), '2 !< 0');
    assert.isFalse(o.lt(-1, -2), '-1 !< -2');
    assert.isFalse(o.lt(2, undefined), '2 !< undefined');
    assert.isFalse(o.lt(2, null), '2 !< null');
    assert.isFalse(o.lt(2, 2), '2 !< 2');
  });

  test('match', function() {
    assert.isTrue(o.match("asdf", "a"));
    assert.isTrue(o.match("asdf", /a/));
    assert.isFalse(o.match("a", "asdf"));
    assert.isFalse(o.match("asdf", /A/));
  });

  test('notMatch', function() {
    assert.isTrue(o.notMatch("a", "asdf"));
    assert.isTrue(o.notMatch("asdf", /A/));
    assert.isFalse(o.notMatch("asdf", "a"));
    assert.isFalse(o.notMatch("asdf", /a/));
  });

  test('anyIn', function() {
    assert.isTrue(o.anyIn(['ruby', 'javascript'], ["javascript"]));
    assert.isTrue(o.anyIn(['ruby', 'javascript'], ["javascript", "node"]));
    assert.isTrue(o.anyIn(['ruby', 'javascript'], ["node", "javascript"]));
    assert.isTrue(o.anyIn(['ruby', 'javascript'], 'javascript'));
    assert.isFalse(o.anyIn(['ruby', 'javascript'], [".net"]));
  });

  test('matchIn', function() {
    assert.isTrue(o.matchIn([
      {
        a: 1,
        b: 3
      }
    ], {
      a: 1
    }));
    assert.isTrue(o.matchIn([
      {
        a: 1,
        b: 3
      }, 7, {
        b: 99
      }, {
        a: 11
      }
    ], {
      a: 1,
      b: {
        $gt: 1
      }
    }));
    assert.isFalse(o.matchIn([1], {
      a: 1
    }));
    assert.isFalse(o.matchIn([
      {
        a: 2,
        b: 3
      }
    ], {
      a: 1
    }));
    assert.isTrue(o.matchIn([
      {
        a: 2,
        b: 3
      }
    ], {
      $or: [
        {
          a: 1
        }, {
          b: 3
        }
      ]
    }));
  });

  test('exists', function() {
    assert.isTrue(o.exists(true));
    assert.isTrue(o.exists(false));
    assert.isTrue(o.exists(null));
    assert.isTrue(o.exists(0));
    assert.isTrue(o.exists(1));
    assert.isTrue(o.exists(-1));
    assert.isTrue(o.exists(""));
    assert.isTrue(o.exists("asdf"));
    assert.isFalse(o.exists(undefined));
  });

  test('size', function() {
    assert.isTrue(o.size(['a', 'b', 'c'], 3));
    assert.isFalse(o.size([], 3));
    assert.isFalse(o.size('asdf', 4), 'not array');
  });

  test('operators.test(recordValue, operators)', function() {
    assert.isTrue(o.testValue(1, {
      $eq: 1
    }));
    assert.isTrue(o.testValue(1, {
      $neq: 0
    }));
    assert.isTrue(o.testValue(1, {
      $gt: 0,
      $lt: 2
    }));
    assert.isTrue(o.testValue(1, {
      $gt: 0,
      $lt: 1.1
    }));
    assert.isTrue(o.testValue(1, {
      $gt: 0,
      $lte: 1
    }));
    assert.isFalse(o.testValue(1, {
      $gt: 0,
      $lt: 1
    }));
    assert.isTrue(o.testValue('acmeblahcorp', {
      $regex: /acme.*corp/i
    }));
    assert.isTrue(o.testValue('acme-corp', {
      $regex: /acme.*corp/i,
      $nin: ['acmeblahcorp']
    }));
    assert.isFalse(o.testValue('acmeblahcorp', {
      $regex: /acme.*corp/i,
      $nin: ['acmeblahcorp']
    }));
  });

  describe('test record', function() {
    beforeEach(function() {
      t = new Date;
      return r = App.OperatorsTest.build({
        string: "a string",
        integer: 10,
        float: 12.2,
        date: t,
        object: {
          one: "-one-",
          two: "-two-"
        },
        arrayString: ['a', 'b', 'c'],
        arrayObject: [
          {
            a: 1,
            b: 7
          }
        ]
      });
    });

    test('eq', function() {
      assert.isTrue(o.test(r, {
        string: 'a string'
      }));
      assert.isTrue(o.test(r, {
        integer: 10
      }));
      assert.isTrue(o.test(r, {
        integer: 10.0
      }));
      assert.isFalse(o.test(r, {
        integer: 20
      }));
      assert.isTrue(o.test(r, {
        string: {
          $eq: 'a string'
        }
      }));
      assert.isTrue(o.test(r, {
        string: {
          '==': 'a string'
        }
      }));
    });

    test('neq', function() {
      assert.isTrue(o.test(r, {
        string: {
          $neq: 'string'
        }
      }));
      assert.isTrue(o.test(r, {
        string: {
          '!=': 'string'
        }
      }));
    });

    test('match', function() {
      assert.isTrue(o.test(r, {
        string: {
          $match: 'string'
        }
      }));
      assert.isTrue(o.test(r, {
        string: /string/
      }));
      assert.isTrue(o.test(r, {
        string: /strin/
      }));
      assert.isFalse(o.test(r, {
        string: /asdf/
      }));
    });

    test('gte', function() {
      assert.isTrue(o.test(r, {
        integer: {
          $gte: 5
        }
      }));
      assert.isTrue(o.test(r, {
        integer: {
          '>=': 10
        }
      }));
      assert.isFalse(o.test(r, {
        integer: {
          '>=': 20
        }
      }));
    });

    test('gt', function() {
      assert.isTrue(o.test(r, {
        integer: {
          $gt: 5
        }
      }));
      assert.isTrue(o.test(r, {
        integer: {
          '>': 7
        }
      }));
      assert.isFalse(o.test(r, {
        integer: {
          '>': 10
        }
      }));
      assert.isFalse(o.test(r, {
        integer: {
          '>': 20
        }
      }));
    });

    test('anyIn', function() {
      assert.isTrue(o.test(r, {
        arrayString: {
          $anyIn: ['b']
        }
      }));
      assert.isTrue(o.test(r, {
        arrayString: {
          $any: ['b']
        }
      }));
      assert.isTrue(o.test(r, {
        arrayString: {
          $anyIn: ['b', 'x']
        }
      }));
      assert.isFalse(o.test(r, {
        arrayString: {
          $anyIn: ['x']
        }
      }));
    });

    test('or', function() {
      assert.isTrue(o.test(r, {
        $or: [
          {
            string: 'a string'
          }, {
            integer: 10
          }
        ]
      }), 'both match');
      assert.isTrue(o.test(r, {
        $or: [
          {
            string: 'a string'
          }, {
            integer: 20
          }
        ]
      }), 'first matches');
      assert.isTrue(o.test(r, {
        $or: [
          {
            string: 'asdf'
          }, {
            integer: 10
          }
        ]
      }), 'last matches');
      assert.isFalse(o.test(r, {
        $or: [
          {
            string: 'asdf'
          }, {
            integer: 20
          }
        ]
      }), 'none match');
    });

    test('nor', function() {
      assert.isTrue(o.test(r, {
        $nor: [
          {
            string: 'asdf'
          }, {
            integer: 20
          }
        ]
      }), 'none match');
      assert.isFalse(o.test(r, {
        $nor: [
          {
            string: 'a string'
          }, {
            integer: 10
          }
        ]
      }), 'both match');
      assert.isFalse(o.test(r, {
        $nor: [
          {
            string: 'a string'
          }, {
            integer: 20
          }
        ]
      }), 'first matches');
      assert.isFalse(o.test(r, {
        $nor: [
          {
            string: 'asdf'
          }, {
            integer: 10
          }
        ]
      }), 'last matches');
    });

    test('array', function() {
      assert.isTrue(o.test(r, {
        arrayString: {
          $anyIn: ['b']
        }
      }));
      assert.isFalse(o.test(r, {
        arrayString: {
          $anyIn: ['x']
        }
      }));
    });

    test('elemMatch', function() {
      assert.isTrue(o.test(r, {
        arrayObject: {
          $matchIn: {
            a: 1
          }
        }
      }));
      assert.isTrue(o.test(r, {
        arrayObject: {
          $elemMatch: {
            a: 1
          }
        }
      }));
      assert.isTrue(o.test(r, {
        arrayObject: {
          $matchIn: {
            a: {
              $lte: 2
            }
          }
        }
      }));
      assert.isFalse(o.test(r, {
        arrayObject: {
          $matchIn: {
            a: 2
          }
        }
      }));
    });

    describe('select', function() {
      var records;
      records = null;
      beforeEach(function() {
        var i, _results;
        i = 1;
        records = [];
        _results = [];
        while (i <= 20) {
          records.push(App.OperatorsTest.build({
            string: "string " + i,
            integer: i
          }));
          _results.push(i++);
        }
        return _results;
      });

      test('select', function() {
        assert.equal(10, o.select(records, {
          integer: {
            '>': 10
          }
        }).length);
        assert.equal(11, o.select(records, {
          integer: {
            '>=': 10
          }
        }).length);
        assert.equal(9, o.select(records, {
          integer: {
            '<': 10
          }
        }).length);
        assert.equal(10, o.select(records, {
          integer: {
            '<=': 10
          }
        }).length);
        assert.equal(2, o.select(records, {
          integer: {
            '>=': 10,
            '<=': 11
          }
        }).length);
      });
    });
  });
});
