describe('Tower.ModelPersistence', function() {
  var user;

  describe('new', function() {
    test('#isNew', function() {
      user = new App.User;
      assert.ok(user.get('isNew'));
    });
  });

  describe('create', function() {
    test('with no attributes (missing required attributes)', function(done) {
      App.User.insert(function(error, record) {
        assert.deepEqual(record.errors, {
          "firstName": ["firstName can't be blank"]
        });
        App.User.count(function(error, count) {
          assert.equal(count, 0);
          done();
        });
      });
    });

    test('with valid attributes', function(done) {
      App.User.insert({firstName: "Lance"}, function(error, record) {
        assert.deepEqual(record.errors, {});
        assert.equal(record.get('firstName'), "Lance");

        App.User.count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });
    });

    test('with multiple with valid attributes as array', function(done) {
      var _this = this;
      App.User.insert([{
          firstName: "Lance"
        }, {
          firstName: "Dane"
        }
      ], function(error, records) {
        assert.equal(records.length, 2);
        assert.equal(records[0].get('firstName'), "Lance");
        assert.equal(records[1].get('firstName'), "Dane");
        App.User.count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });
    });

    test('with multiple with valid attributes as arguments', function(done) {
      var _this = this;
      App.User.insert({
        firstName: "Lance"
      }, {
        firstName: "Dane"
      }, function(error, records) {
        assert.equal(records.length, 2);
        App.User.count(function(error, count) {
          assert.equal(count, 2);
          done();
        });
      });
    });
  });

  describe('#save', function() {

    test('throw error if readOnly', function(done) {
      user = new App.User({}, {
        readOnly: true
      });
      assert.throws(function() {
        return user.save();
      }, "Record is read only");
      done();
    });
  });

  describe('update', function() {
    beforeEach(function(done) {
      var attributes;
      attributes = [];
      attributes.push({
        firstName: "Lance"
      });
      attributes.push({
        firstName: "Dane"
      });
      App.User.insert(attributes, done);
    });

    test('update string property', function(done) {
      var _this = this;
      App.User.update({
        firstName: "John"
      }, function(error) {
        App.User.all(function(error, users) {
          var _i, _len;
          assert.equal(users.length, 2);
          for (_i = 0, _len = users.length; _i < _len; _i++) {
            user = users[_i];
            assert.equal(user.get("firstName"), "John");
          }
          done();
        });
      });
    });

    test('update matching string property', function(done) {
      var _this = this;
      App.User.where({
        firstName: "Lance"
      }).update({
        firstName: "John"
      }, function(error, records) {
        App.User.where({
          firstName: "John"
        }).count(function(error, count) {
          assert.equal(count, 1);
          done();
        });
      });
    });
  });

  describe('#update', function() {
    beforeEach(function(done) {
      var _this = this;
      App.User.insert({
        firstName: "Lance"
      }, function(error, record) {
        user = record;
        App.User.insert({
          firstName: "Dane"
        }, done);
      });
    });

    test('update string property with updateAttributes', function(done) {
      var _this = this;
      return user.updateAttributes({
        firstName: "John"
      }, function(error) {
        assert.equal(user.get("firstName"), "John");
        App.User.find(user.get('id'), function(error, user) {
          assert.equal(user.get('firstName'), 'John');
          done();
        });
      });
    });

    test('update string property with save', function(done) {
      var _this = this;
      assert.equal(user.get('isDirty'), false);
      user.set("firstName", "John");
      assert.equal(user.get('isDirty'), true);
      assert.deepEqual(user.get('changes'), {
        firstName: ['Lance', 'John']
      });
      return user.save(function(error) {
        assert.equal(user.get("firstName"), "John", 'Assert name');
        assert.equal(user.get('isDirty'), false);
        assert.deepEqual(user.get('changes'), {});
        done();
      });
    });
  });

  describe('destroy', function() {
    beforeEach(function(done) {
      var _this = this;
      App.User.insert({
        firstName: "Lance!!!"
      }, function(error, result) {
        user = result;
        App.User.insert({
          firstName: "Dane"
        }, done);
      });
    });

    test('destroy all', function(done) {
      var _this = this;
      App.User.count(function(error, count) {
        assert.equal(count, 2);
        App.User.destroy(function(error) {
          App.User.count(function(error, count) {
            assert.equal(count, 0);
            done();
          });
        });
      });
    });

    test('destroy matching', function(done) {
      var _this = this;
      App.User.count(function(error, count) {
        assert.equal(count, 2);
        App.User.where({
          firstName: "Dane"
        }).destroy(function(error) {
          App.User.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });
    });
  });

  describe('reload', function() {

    test('reload');
  });
});
