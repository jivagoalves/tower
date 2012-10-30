var describeWith, group, membership, user,
  _this = this;

membership = null;

group = null;

user = null;

describeWith = function() {
  describe("Tower.ModelRelationBelongsTo", function() {
    beforeEach(function(done) {
      var _this = this;
      return async.series([
        function(callback) {
          App.User.insert({
            firstName: "Lance"
          }, function(error, record) {
            user = record;
            return callback();
          });
        }, function(callback) {
          App.Group.insert(function(error, record) {
            group = record;
            return callback();
          });
        }
      ], done);
    });
    afterEach(function() {
      try {
        App.Parent.insert.restore();
      } catch (_error) {}
      try {
        App.Group.insert.restore();
      } catch (_error) {}
      try {
        App.Membership.insert.restore();
      } catch (_error) {}
    });

    test('create from hasMany', function(done) {
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        var _this = this;
        return user.get('articles').create({
          rating: 8
        }, function(error, createdPost) {
          App.Post.first(function(error, foundPost) {
            assert.deepEqual(createdPost.get('id').toString(), foundPost.get('id').toString());
            App.User.count(function(error, count) {
              assert.equal(2, count);
              return foundPost.fetch('user', function(error, foundUser) {
                assert.deepEqual(foundUser.get('articleIds')[0].toString(), foundPost.get('id').toString());
                assert.deepEqual(foundUser.get('id').toString(), user.get('id').toString());
                assert.deepEqual(foundPost.get('user').get('id').toString(), user.get('id').toString());
                done();
              });
            });
          });
        });
      });
    });

    test('create from hasOne', function(done) {
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        var _this = this;
        return user.createAssocation('address', {
          city: 'San Francisco'
        }, function(error, createdAddress) {
          App.Address.first(function(error, foundAddress) {
            assert.deepEqual(createdAddress.get('id').toString(), foundAddress.get('id').toString());
            App.Address.count(function(error, count) {
              assert.equal(1, count);
              App.User.find(user.get('id'), function(error, user) {
                return user.fetch('address', function(error, foundAddress) {
                  assert.deepEqual(foundAddress.get('id').toString(), createdAddress.get('id').toString());
                  assert.deepEqual(user.get('address').get('id').toString(), createdAddress.get('id').toString());
                  done();
                });
              });
            });
          });
        });
      });
    });

    test('belongsTo accepts model, not just modelId', function(done) {
      var _this = this;
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        App.Group.create({
          title: 'A Group'
        }, function(error, group) {
          App.Membership.create({
            user: user,
            group: group
          }, function(error, membership) {
            assert.equal(membership.get('userId').toString(), user.get('id').toString());
            assert.equal(membership.get('groupId').toString(), group.get('id').toString());
            assert.equal(membership.get('user').get('id').toString(), user.get('id').toString());
            assert.equal(membership.get('group').get('id').toString(), group.get('id').toString());
            done();
          });
        });
      });
    });

    test('belongsTo with eager loading', function(done) {
      var _this = this;
      assert.deepEqual(App.Membership.includes('user', 'group').compile().toParams().includes, ['user', 'group']);
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        App.Group.create({
          title: 'A Group'
        }, function(error, group) {
          App.Membership.create({
            user: user,
            group: group
          }, function(error, membership) {
            App.Membership.includes('user', 'group').find(membership.get('id'), function(error, membership) {
              assert.equal(membership.get('user').get('id').toString(), user.get('id').toString());
              assert.equal(membership.get('group').get('id').toString(), group.get('id').toString());
              done();
            });
          });
        });
      });
    });

    test('hasMany with eager loading', function(done) {
      var _this = this;
      assert.deepEqual(App.User.includes('memberships').compile().toParams().includes, ['memberships']);
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        App.Group.create({
          title: 'A Group'
        }, function(error, group) {
          App.Membership.create({
            user: user,
            group: group
          }, function(error, membership) {
            App.User.includes('memberships').find(user.get('id'), function(error, user) {
              assert.ok(user.get('memberships').all()._hasContent());
              assert.deepEqual(user.get('memberships').all().toArray().getEach('id'), [membership.get('id')]);
              user.get('memberships').reset();
              return user.get('memberships').all(function() {
                assert.ok(user.get('memberships').all()._hasContent());
                assert.deepEqual(user.get('memberships').all().toArray().getEach('id'), [membership.get('id')]);
                done();
              });
            });
          });
        });
      });
    });

    test('hasMany + nested belongsTo with eager loading', function(done) {
      var _this = this;
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        App.Group.create({
          title: 'A Group'
        }, function(error, group) {
          App.Membership.create({
            user: user,
            group: group
          }, function(error, membership) {
            App.User.includes({
              memberships: 'group'
            }).find(user.get('id'), function(error, user) {
              assert.equal(user.get('memberships').all().toArray().length, 1);
              membership = user.get('memberships').all().toArray()[0];
              assert.ok(membership.get('group').equals(group), 'membership.group == group');
              assert.ok(membership.get('user').equals(user), 'membership.user == user');
              done();
            });
          });
        });
      });
    });

    test('hasOne with eager loading', function(done) {
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        var _this = this;
        return user.createAssocation('address', {
          city: 'San Francisco'
        }, function(error, createdAddress) {
          assert.equal(user.get('id').toString(), createdAddress.get('userId').toString());
          App.User.includes('address').find(user.get('id'), function(error, user) {
            assert.equal(user.get('address').get('id').toString(), createdAddress.get('id').toString());
            done();
          });
        });
      });
    });
    afterEach(function() {
      App.Membership["default"]('scope', undefined);
    });

    test('eager loading in default scope', function(done) {
      var _this = this;
      App.Membership["default"]('scope', App.Membership.includes('user', 'group'));
      App.User.create({
        firstName: 'Lance'
      }, function(error, user) {
        App.Group.create({
          title: 'A Group'
        }, function(error, group) {
          App.Membership.create({
            user: user,
            group: group
          }, function(error, membership) {
            App.Membership.find(membership.get('id'), function(error, membership) {
              assert.ok(membership.get('user').equals(user), 'membership.user == user');
              assert.ok(membership.get('group').equals(group), 'membership.group == group');
              done();
            });
          });
        });
      });
    });
    /*
        describe 'belongsTo', ->
          user = null
          post = null
    
          beforeEach (done) ->
            App.User.create firstName: 'Lance', (error, record) =>
              user = record
              user.get('posts').create rating: 8, (error, record) =>
                post = record
                done()
    
          test 'fetch', (done) ->
            done()
    */

  });
};
