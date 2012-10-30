describe('Tower.NetParam', function() {
  var param, cursor;

  describe('String', function() {
    beforeEach(function() {
      param = Tower.NetParam.create("title", {
        type: "String"
      });
    });

    test('match string', function() {
      cursor = param.toCursor("Hello+World");
      
      assert.deepEqual(cursor.conditions(), {
        "title": {
          "$match": ["Hello", "World"]
        }
      });
    });

    test('NOT match string', function() {
      cursor = param.toCursor("-Hello+-World");
      assert.deepEqual(cursor.conditions(), {
        "title": {
          "$notMatch": ["Hello", "World"]
        }
      });
    });

    test('NOT match and match string', function() {
      cursor = param.toCursor("-Hello+World");
      assert.deepEqual(cursor.conditions(), {
        "title": {
          "$notMatch": ["Hello"],
          "$match": ["World"]
        }
      });
    });

    test('exact', function() {
      var id = '5004bac274a9d10000000002';
      param.exact = true;
      param.key = param.attribute = 'id';
      cursor = param.toCursor('5004bac274a9d10000000002');
      assert.deepEqual(cursor.conditions(), {
        "id": id
      });
    });
  });

  describe('Array', function() {
    beforeEach(function() {
      param = Tower.NetParam.create("tags", {
        type: "Array"
      });
    });

    test('$allIn', function() {
      cursor = param.toCursor("[ruby,javascript]");
      assert.deepEqual(cursor.conditions(), {
        "tags": {
          "$allIn": ["ruby", "javascript"]
        }
      });
    });

    test('$anyIn', function() {
      cursor = param.toCursor("ruby,javascript");
      assert.deepEqual(cursor.conditions(), {
        "tags": {
          "$anyIn": ["ruby", "javascript"]
        }
      });
    });

    test('$notInAny with one value', function() {
      cursor = param.toCursor("-java");
      assert.deepEqual(cursor.conditions(), {
        "tags": {
          "$notInAny": ["java"]
        }
      });
    });

    test('$notInAny with multiple values', function() {
      cursor = param.toCursor("-java,-asp");
      assert.deepEqual(cursor.conditions(), {
        "tags": {
          "$notInAny": ["java", "asp"]
        }
      });
    });

    test('$notInAny and $anyIn together', function() {
      cursor = param.toCursor("-java,javascript");
      assert.deepEqual(cursor.conditions(), {
        "tags": {
          "$notInAny": ["java"],
          "$anyIn": ["javascript"]
        }
      });
    });
    
    test('$notInAll', function() {
      cursor = param.toCursor("-[java,.net]");
      assert.deepEqual(cursor.conditions(), {
        "tags": {
          "$notInAll": ["java", '.net']
        }
      });
    });
  });
  describe('Date', function() {
    beforeEach(function() {
      param = Tower.NetParam.create("createdAt", {
        type: "Date"
      });
    });

    test('exact date', function() {
      cursor = param.toCursor("12-25-2012");
      assert.deepEqual(cursor.conditions(), {
        "createdAt": _.toDate("12-25-2012")
      });
    });

    test('date range with start and end', function() {
      cursor = param.toCursor("12-25-2012..12-31-2012");
      assert.deepEqual(cursor.conditions(), {
        "createdAt": {
          "$gte": _.toDate("12-25-2012"),
          "$lte": _.toDate("12-31-2012")
        }
      });
    });

    test('date range with start and NO end', function() {
      cursor = param.toCursor("12-25-2012..t");
      assert.deepEqual(cursor.conditions(), {
        "createdAt": {
          "$gte": _.toDate("12-25-2012")
        }
      });
    });

    test('date range with NO start but WITH an end', function() {
      cursor = param.toCursor("t..12-31-2012");
      assert.deepEqual(cursor.conditions(), {
        "createdAt": {
          "$lte": _.toDate("12-31-2012")
        }
      });
    });

    test('exact datetime', function() {
      var datetime = "01-12-2012@3:25:50";
      cursor = param.toCursor(datetime);
      assert.deepEqual(cursor.conditions(), {
        "createdAt": _.toDate(datetime)
      });
    });
  });

  describe('Number', function() {
    beforeEach(function() {
      param = Tower.NetParam.create("likeCount", {
        type: "Number"
      });
    });

    test('exact number `12`', function() {
      cursor = param.toCursor("12");
      assert.deepEqual(cursor.conditions(), {
        "likeCount": 12.0
      });
    });

    test('number range with start and end `12..80`', function() {
      cursor = param.toCursor("12..80");
      assert.deepEqual(cursor.conditions(), {
        "likeCount": {
          "$gte": 12,
          "$lte": 80
        }
      });
    });

    test('number range with start and NO end `12..n`', function() {
      cursor = param.toCursor("12..n");
      assert.deepEqual(cursor.conditions(), {
        "likeCount": {
          "$gte": 12
        }
      });
    });

    test('number range with NO start but WITH an end `n..80`', function() {
      cursor = param.toCursor("n..80");
      assert.deepEqual(cursor.conditions(), {
        "likeCount": {
          "$lte": 80
        }
      });
    });
  });

  describe('Boolean', function() {
    beforeEach(function() {
      param = Tower.NetParam.create("published", {
        type: "Boolean"
      });
    });

    test('true == true', function() {
      cursor = param.toCursor('true');
      assert.deepEqual(cursor.conditions(), {
        published: true
      });
    });

    test('1 == true', function() {
      cursor = param.toCursor('1');
      assert.deepEqual(cursor.conditions(), {
        published: true
      });
    });

    test('anything else is "false"', function() {
      cursor = param.toCursor('false');
      assert.deepEqual(cursor.conditions(), {
        published: false
      });

      cursor = param.toCursor('asdf');
      assert.deepEqual(cursor.conditions(), {
        published: false
      });
    });

    test('blank is nothing', function() {
      cursor = param.toCursor('');
      assert.deepEqual(cursor.conditions(), {});
    });
  });

  describe('Order', function() {
    var values;

    beforeEach(function() {
      param = Tower.NetParam.create("sort", {
        type: "Order"
      });
    });

    test('ascending (default)', function() {
      values = param.parse('createdAt');
      assert.deepEqual(['createdAt', 'ASC'], values);
    });

    test('ascending (+)', function() {
      values = param.parse('createdAt+');
      assert.deepEqual(['createdAt', 'ASC'], values);
    });

    test('ascending (-)', function() {
      values = param.parse('createdAt-');
      assert.deepEqual(['createdAt', 'DESC'], values);
    });

    test('ascending/descending (default/-)', function() {
      values = param.parse('createdAt,likeCount-');
      assert.deepEqual(['createdAt', 'ASC', 'likeCount', 'DESC'], values);
    });

    test('ascending/descending (+/-)', function() {
      values = param.parse('createdAt+,likeCount-');
      assert.deepEqual(['createdAt', 'ASC', 'likeCount', 'DESC'], values);
    });

    test('descending/descending (-/-)', function() {
      values = param.parse('createdAt-,likeCount-');
      assert.deepEqual(['createdAt', 'DESC', 'likeCount', 'DESC'], values);
    });
  });

  describe('controller', function() {
    var Controller;

    function buildCursor(params) {
      cursor = Tower.ModelCursor.create();
      cursor.make();
      return Controller._buildCursorFromGet(params, cursor);
    };

    beforeEach(function() {
      Controller = App.PostsController;
    });

    describe('String', function() {
      test('exact (userId)', function() {
        var id = '5004bac274a9d10000000002';
        cursor = buildCursor({
          userId: id
        });

        assert.deepEqual(cursor.conditions(), {
          userId: id
        });
      });
    });

    describe('Boolean', function() {
      test('true', function() {
        cursor = buildCursor({
          published: true
        });
        assert.deepEqual(cursor.conditions(), {
          published: true
        });
      });

      test('false', function() {
        cursor = buildCursor({
          published: false
        });
        assert.deepEqual(cursor.conditions(), {
          published: false
        });
      });

      test('isBlank', function() {
        cursor = buildCursor({
          published: ''
        });
        assert.deepEqual(cursor.conditions(), {});
      });
    });

    describe('Order', function() {
      test('ascending (default)', function() {
        cursor = buildCursor({
          sort: 'createdAt'
        });
        assert.deepEqual(cursor.toParams().sort, [['createdAt', 'ASC']]);
      });

      test('ascending (+)', function() {
        cursor = buildCursor({
          sort: 'createdAt+'
        });
        assert.deepEqual(cursor.toParams().sort, [['createdAt', 'ASC']]);
      });
      test('ascending (-)', function() {
        cursor = buildCursor({
          sort: 'createdAt-'
        });
        assert.deepEqual(cursor.toParams().sort, [['createdAt', 'DESC']]);
      });

      test('ascending/descending (default/-)', function() {
        cursor = buildCursor({
          sort: 'createdAt,likeCount-'
        });
        assert.deepEqual(cursor.toParams().sort, [['createdAt', 'ASC', 'likeCount', 'DESC']]);
      });
    });

    describe('Limit', function() {
      test('10', function() {
        cursor = buildCursor({
          limit: '10'
        });
        assert.equal(cursor.toParams().limit, 10);
      });

      test('-10 should not do anything', function() {
        cursor = buildCursor({
          limit: '-10'
        });
        assert.equal(cursor.toParams().limit, undefined);
      });
    });

    describe('Page', function() {
      test('10', function() {
        cursor = buildCursor({
          page: '10'
        });
        assert.equal(cursor.toParams().page, 10);
      });

      test('-10 should not do anything', function() {
        cursor = buildCursor({
          page: '-10'
        });
        assert.equal(cursor.toParams().page, undefined);
      });
    });
  });
});