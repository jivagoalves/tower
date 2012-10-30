var attr = Tower.ModelAttribute;

describe('attributes', function() {
  describe('class', function() {
    test('type: "Id"', function() {
      var field = App.BaseModel.fields().id;
      assert.equal(field.type, "Id");
    });

    test('type: "Integer" without default', function() {
      var field = App.BaseModel.fields().likeCountWithoutDefault;
      assert.equal(field.type, "Integer");
      assert.equal(field["default"], void 0);
    });

    test('type: "Integer", default: 0', function() {
      var field = App.BaseModel.fields().likeCountWithDefault;
      assert.equal(field.type, "Integer");
      assert.equal(field._default, 0);
    });

    test('type: "Array", default: []', function() {
      var field = App.BaseModel.fields().tags;
      assert.equal(field.type, "Array");
      assert.isArray(field._default);
    });

    test('default type == "String"', function() {
      var field = App.BaseModel.fields().title;
      assert.equal(field.type, "String");
      assert.equal(field._default, void 0);
    });

    test('type: ["NestedModel"]', function() {
      var field = App.BaseModel.fields().nestedModels;
      assert.equal(field.type, "Array");
      assert.equal(field.encodingType, "Array");
      assert.equal(field.itemType, "NestedModel");
    });

    test('array of field names without options', function() {
      var a1, a2, a3, _ref;
      _ref = App.BaseModel.fields(), a1 = _ref.a1, a2 = _ref.a2, a3 = _ref.a3;
      assert.equal(a1.type, "String");
      assert.equal(a3.type, "String");
    });

    test('array of field names with options', function() {
      var a4, a5, a6, _ref;
      _ref = App.BaseModel.fields(), a4 = _ref.a4, a5 = _ref.a5, a6 = _ref.a6;
      assert.equal(a4.type, "Integer");
      assert.equal(a6.type, "Integer");
    });
    
    test('object of field names', function() {
      var o1, o2, _ref;
      _ref = App.BaseModel.fields(), o1 = _ref.o1, o2 = _ref.o2;
      assert.equal(o1.type, "String");
      assert.equal(o2.type, "Integer");
    });
  });

  describe('serialization', function() {
    test('string "A string" == "A string"', function() {
      assert.equal(Tower.StoreSerializerString.to("A string"), "A string");
      assert.equal(Tower.StoreSerializerString.from("A string"), "A string");
    });

    test('string null, undefined == null', function() {
      assert.equal(Tower.StoreSerializerString.to(void 0), null);
      assert.equal(Tower.StoreSerializerString.from(void 0), null);
      assert.equal(Tower.StoreSerializerString.to(null), null);
      assert.equal(Tower.StoreSerializerString.from(null), null);
    });

    test('boolean == true', function() {
      assert.equal(Tower.StoreSerializerBoolean.to(true), true);
      assert.equal(Tower.StoreSerializerBoolean.from(true), true);
      assert.equal(Tower.StoreSerializerBoolean.to(1), true);
      assert.equal(Tower.StoreSerializerBoolean.from(1), true);
      assert.equal(Tower.StoreSerializerBoolean.to("true"), true);
      assert.equal(Tower.StoreSerializerBoolean.from("true"), true);
    });

    test('boolean == false', function() {
      assert.equal(Tower.StoreSerializerBoolean.to(false), false);
      assert.equal(Tower.StoreSerializerBoolean.from(false), false);
      assert.equal(Tower.StoreSerializerBoolean.to(null), false);
      assert.equal(Tower.StoreSerializerBoolean.from(null), false);
      assert.equal(Tower.StoreSerializerBoolean.to(void 0), false);
      assert.equal(Tower.StoreSerializerBoolean.from(void 0), false);
      assert.equal(Tower.StoreSerializerBoolean.to(0), false);
      assert.equal(Tower.StoreSerializerBoolean.from(0), false);
      assert.equal(Tower.StoreSerializerBoolean.to("false"), false);
      assert.equal(Tower.StoreSerializerBoolean.from("false"), false);
    });

    test('number', function() {
      assert.equal(Tower.StoreSerializerNumber.to(1), 1);
      assert.equal(Tower.StoreSerializerNumber.to(1.1), 1.1);
      assert.equal(Tower.StoreSerializerNumber.from(1), 1);
      assert.equal(Tower.StoreSerializerNumber.from(1.1), 1.1);
    });

    test('integer', function() {
      assert.equal(Tower.StoreSerializerInteger.to(1), 1);
      assert.equal(Tower.StoreSerializerInteger.to(1.1), 1);
      assert.equal(Tower.StoreSerializerInteger.from(1), 1);
      assert.equal(Tower.StoreSerializerInteger.from(1.1), 1);
    });

    test('float', function() {
      assert.equal(Tower.StoreSerializerFloat.to(1), 1.0);
      assert.equal(Tower.StoreSerializerFloat.to(1.1), 1.1);
      assert.equal(Tower.StoreSerializerFloat.from(1), 1.0);
      assert.equal(Tower.StoreSerializerFloat.from(1.1), 1.1);
    });
    
    test('array', function() {
      assert.equal(Tower.StoreSerializerArray.to(void 0), null);
      assert.equal(Tower.StoreSerializerArray.to(null), null);
      assert.deepEqual(Tower.StoreSerializerArray.from(1), [1]);
      assert.deepEqual(Tower.StoreSerializerArray.from([1]), [1]);
      assert.deepEqual(Tower.StoreSerializerArray.from("hey"), ["hey"]);
      assert.deepEqual(Tower.StoreSerializerArray.from(["hey"]), ["hey"]);
    });
  });

  describe('instance', function() {
    var model;

    beforeEach(function() {
      model = App.BaseModel.build();
    });

    test('#get', function() {
      assert.equal(model.get('likeCountWithDefault'), 0);
    });

    test('#set', function() {
      assert.equal(model.get('likeCountWithDefault'), 0);
      model.set('likeCountWithDefault', 10);
      assert.equal(model.get('likeCountWithDefault'), 10);
    });

    test('encode boolean', function() {
      assert.equal(model.get("favorite"), false);
      model.set("favorite", "true");
      assert.equal(model.get("favorite"), true);
      model.set("favorite", "false");
      assert.equal(model.get("favorite"), false);
    });
  });
});

/*                       
    describe 'operations', ->
      test '$push', ->
        model.set("tags", ["ruby"])
        assert.deepEqual model.get("tags"), ["ruby"]
        model.push tags: "javascript"
        assert.deepEqual model.get("tags"), ["ruby", "javascript"]
        model.push tags: ["mongodb"]
        assert.deepEqual model.get("tags"), ["ruby", "javascript", ["mongodb"]]

      test '$pushAll', ->
        assert.deepEqual model.get("tags"), []
        model.pushAll tags: ["ruby"]
        assert.deepEqual model.get("tags"), ["ruby"]
        model.pushAll tags: ["javascript", "mongodb", "ruby"]
        assert.deepEqual model.get("tags"), ["ruby", "javascript", "mongodb", "ruby"]
      
      test '$pullAll', ->  
        model.set tags: ["ruby", "javascript", "mongodb"]
        model.pullAll tags: ["ruby", "javascript"]
        assert.deepEqual model.get("tags"), ["mongodb"]
      
      test '$inc', ->
        assert.equal model.get("likeCount"), 0
        model.inc likeCount: 1
        assert.equal model.get("likeCount"), 1
        model.inc likeCount: 1
        assert.equal model.get("likeCount"), 2
        model.inc likeCount: -1
        assert.equal model.get("likeCount"), 1
        
  describe 'persistence', ->
    user = null
    
    beforeEach ->
      user = new App.User(firstName: "Lance")
      
    test 'boolean', (done) ->
      assert.equal user.get('admin'), false
      
      user.save =>
        App.User.find user.get('id'), (error, user) =>
          assert.equal user.get('admin'), false
          user.set "admin", true
          assert.equal user.get('admin'), true
          
          user.save =>
            App.User.find user.get('id'), (error, user) =>
              assert.equal user.get('admin'), true
              
              done()
    
    test 'integer', (done) ->
      assert.equal user.get('likes'), 0
      
      user.save =>
        App.User.find user.get('id'), (error, user) =>
          assert.equal user.get('likes'), 0
          user.set "likes", 5.12
          assert.equal user.get('likes'), 5

          user.save =>
            App.User.find user.get('id'), (error, user) =>
              assert.equal user.get('likes'), 5

              done()
              
    test 'float', (done) ->
      assert.equal user.get('rating'), 2.5

      user.save =>
        App.User.find user.get('id'), (error, user) =>
          assert.equal user.get('rating'), 2.5
          user.set "rating", 3.4
          assert.equal user.get('rating'), 3.4

          user.save =>
            App.User.find user.get('id'), (error, user) =>
              assert.equal user.get('rating'), 3.4

              done()
*/


describe('other', function() {
  var user;
  
  beforeEach(function() {
    user = App.User.build({
      firstName: 'Lance'
    });
  });

  test('unsavedData is gone after saving and finding', function(done) {
    var _this = this;
    assert.deepEqual(user.get('changed'), ['firstName']);
    assert.deepEqual(user.attributesForCreate(), {
      firstName: 'Lance',
      likes: 0,
      tags: [],
      admin: false,
      rating: 2.5,
      postIds: [],
      articleIds: [],
      cachedMembershipIds: []
    });

    user.save(function() {
      assert.deepEqual(user.get('changedAttributes'), {}, '3');
      
      App.User.find(user.get('id'), function(error, user) {
        assert.deepEqual(user.get('changedAttributes'), {}, '4');
        user.set('firstName', 'Dane');
        user.set('lastName', 'Pollard');
        assert.deepEqual(user.get('changed'), ['firstName', 'lastName'], '5');
        assert.deepEqual(user.attributesForUpdate(), {
          firstName: 'Dane',
          lastName: 'Pollard'
        }, '6');

        user.save(function() {
          assert.equal(user.get('firstName'), 'Dane', '7');
          assert.equal(user.get('lastName'), 'Pollard', '8');
          assert.deepEqual(user.get('changedAttributes'), {}, '9');
          done();
        });
      });
    });
  });
  /*
    test 'Object attribute type', (done) ->
      meta = {a: 'b', nesting: {one: 'two'}}
  
      user.set('meta', meta)
  
      assert.deepEqual user.get('data').changedAttributes.meta, meta
  
      user.save =>
        assert.deepEqual user.get('data').changedAttributes, {}
  
        App.User.find user.get('id'), (error, user) =>
          assert.deepEqual user.get('data').changedAttributes, {}
  
          assert.deepEqual user.get('meta'), meta
  
          done()
  */

  /*
    test 'nested properties', (done) ->
      meta = {a: 'b', nesting: {one: 'two'}}
      user.set('meta', meta)
    
      user.save =>
        App.User.find user.get('id'), (error, user) =>
          # should it be like this?
          # user.set('meta.nesting.one', 'ten')
          # or this:
          # user.set('meta', {'nesting.one': 'ten'})
          # or just plain:
          user.set('meta', {'nesting': 'one': 'ten'})
    
          assert.deepEqual user.get('data').unsavedData.meta, {nesting: one: 'ten'}
  
          user.save =>
            assert.deepEqual user.get('data').savedData.meta, {a: 'b', nesting: {one: 'ten'}}
  
            App.User.find user.get('id'), (error, user) =>
              assert.deepEqual user.get('data').savedData.meta, {a: 'b', nesting: {one: 'ten'}}
              done()
  */

  test('cliend id', function(done) {
    var id,
      _this = this;
    id = 'a client id';
    
    user.set('_cid', id);
    
    assert.equal(user.get('_cid'), id, '1');
    assert.equal(user.get('id'), id, '2');
    
    user.save(function() {
      assert.equal(user.get('_cid').toString(), id.toString(), '3');
      
      if (Tower.isServer) {
        assert.notEqual(user.get('id').toString(), id, '4');
        assert.equal(user.toJSON()._cid, id, '5');
        assert.equal(user.toJSON().id.toString(), user.get('id').toString(), '6');
      }

      done();
    });
  });

  if (Tower.isServer && Tower.store.className() === 'Memory') {
    test('that client id is replaced', function(done) {
      var db, id,
        _this = this;
      id = 'random client id';
      user.set('_cid', id);
      db = App.User.store();
      Tower.isClient = true;
      
      user.save(function() {
        var newId;
        assert.ok(db.records.get(id));
        assert.equal(db.records.keys.list.length, 1);
        newId = _.uuid();
        user.set('id', newId);
        App.User.load(user);
        assert.equal(db.records.keys.list.length, 1);
        assert.isUndefined(db.records.get(id));
        assert.ok(db.records.get(newId));
        Tower.isClient = false;
        done();
      });
    });
  }
  
  describe('short keys', function() {
    afterEach(function() {
      delete Tower.USE_SHORT_KEYS;
    });

    test('longKeysToShortKeys', function() {
      var expected, key, result, value, _results;
      
      expected = {
        id: 'i',
        title: 't',
        rating: 'r',
        type: 'T',
        tags: 'A',
        meta: 'm',
        userIds: 'u',
        userId: 'U',
        createdAt: 'c',
        updatedAt: 'B',
        likeCount: 'l',
        slug: 's'
      };

      result = App.Post.longKeysToShortKeys();

      for (key in expected) {
        value = expected[key];
        assert.deepEqual(value, result[key]);
      }
    });

    test('shortKeysToLongKeys', function() {
      var expected, key, result, value, _results;
      
      expected = {
        i: 'id',
        t: 'title',
        r: 'rating',
        T: 'type',
        A: 'tags',
        m: 'meta',
        u: 'userIds',
        U: 'userId',
        c: 'createdAt',
        B: 'updatedAt',
        l: 'likeCount',
        s: 'slug'
      };

      result = App.Post.shortKeysToLongKeys();

      for (key in expected) {
        value = expected[key];
        assert.deepEqual(value, result[key]);
      }
    });

    test('Tower.USE_SHORT_KEYS = true', function() {
      var expected, key, result, value, _results;
      
      Tower.USE_SHORT_KEYS = true;
      
      expected = {
        t: 'string',
        r: 8,
        T: 'Post',
        A: [],
        m: null,
        u: [],
        U: void 0,
        c: void 0,
        B: void 0,
        l: 0,
        s: null
      };

      result = App.Post.build({
        title: 'string',
        rating: 8
      }).toJSON();

      for (key in expected) {
        value = expected[key];
        assert.deepEqual(value, result[key]);
      }
    });
  });
});
