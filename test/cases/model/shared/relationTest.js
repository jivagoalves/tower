describe('Tower.ModelRelation', function() {
  var group, membership, user, cursor;

  beforeEach(function(done) {
    async.series([
      function(callback) {
        App.User.create({
          firstName: 'Lance'
        }, function(error, record) {
          user = record;
          callback();
        });
      },
      function(callback) {
        App.Group.create(function(error, record) {
          group = record;
          callback();
        });
      }
    ], done);
  });

  afterEach(function() {
    try {
      App.Parent.create.restore();
    } catch (_error) {}
    try {
      App.Group.create.restore();
    } catch (_error) {}
    try {
      App.Membership.create.restore();
    } catch (_error) {}
  });

  describe('inverseOf', function() {
    test('noInverse_noInverse', function() {
      assert.notEqual('noInverse_noInverse', (function() {
        try {
          App.Parent.relation('noInverse_noInverse').inverse().name;
        } catch (_error) {}
      })());
    });

    test('parent: noInverse_withInverse, child: withInverse_noInverse', function() {
      assert.equal('withInverse_noInverse', App.Parent.relation('noInverse_withInverse').inverse().name);
    });

    test('withInverse_withInverse', function() {
      assert.equal('withInverse_withInverse', App.Parent.relation('withInverse_withInverse').inverse().name);
    });

    test('parent: withInverse_noInverse, child: noInverse_withInverse', function() {
      assert.equal('noInverse_withInverse', App.Parent.relation('withInverse_noInverse').inverse().name);
    });
  });

  describe('HasMany', function() {
    describe('.create', function() {
      test('compileForInsert', function() {
        cursor = user.get('memberships').cursor;
        cursor.compileForInsert();
        assert.deepEqual(cursor.conditions(), {
          userId: user.get('id')
        });
      });

      test('compileForInsert with cache: true', function() {
        cursor = user.get('cachedMemberships').cursor;
        cursor.compileForInsert();
        assert.deepEqual(cursor.conditions(), {
          userId: user.get('id')
        });
      });

      test('compileForInsert on polymorphic record', function() {
        cursor = user.get('polymorphicMemberships').cursor;
        cursor.compileForInsert();
        assert.deepEqual(cursor.conditions(), {
          joinableId: user.get('id'),
          joinableType: 'User'
        });
      });

      test('insert relationship model', function(done) {
        user.get('memberships').create({groupId: group.get('id')}, function(error, membership) {
          assert.equal(membership.get('userId').toString(), user.get('id').toString());
          assert.equal(membership.get('groupId').toString(), group.get('id').toString());
          done();
        });
      });
    });

    describe('.update', function() {
      beforeEach(function(done) {
        App.Membership.create({groupId: group.get('id')}, function() {
          user.get('memberships').create({groupId: group.get('id')}, done);
        });
      });

      test('compileForUpdate', function() {
        cursor = user.get('memberships').cursor;
        cursor.compileForUpdate();
        assert.deepEqual(cursor.conditions(), {
          userId: user.get('id')
        });
      });

      test('update relationship model', function(done) {
        user.get('memberships').update({kind: 'guest'}, function(error, memberships) {
          assert.equal(memberships.length, 1);
          assert.equal(memberships[0].get('kind'), 'guest');

          App.Membership.count(function(error, count) {
            assert.equal(count, 2);
            done();
          });
        });
      });
    });

    describe('.destroy', function() {
      beforeEach(function(done) {
        App.Membership.create({groupId: group.get('id')}, function() {
          user.get('memberships').create({groupId: group.get('id')}, done);
        });
      });

      test('compileForDestroy', function() {
        cursor = user.get('memberships').cursor;
        cursor.compileForDestroy();
        assert.deepEqual(cursor.conditions(), {
          userId: user.get('id')
        });
      });

      test('destroy relationship model', function(done) {
        user.get('memberships').destroy(function(error, memberships) {
          assert.equal(memberships.length, 1);

          App.Membership.count(function(error, count) {
            assert.equal(count, 1);
            done();
          });
        });
      });
    });
  });

  describe('HasMany(through: true)', function() {
    describe('.create', function() {
      test('compileForInsert', function() {
        cursor = user.get('groups').cursor;
        cursor.compileForInsert();
        assert.deepEqual(cursor.conditions(), {});
      });

      test('throughRelation', function() {
        var inverseRelation, relation, throughRelation;
        cursor = user.get('groups').cursor;
        relation = cursor.relation;
        throughRelation = cursor.throughRelation;
        assert.equal(throughRelation.type, 'App.Membership');
        assert.equal(throughRelation.targetType, 'App.Membership');
        assert.equal(throughRelation.name, 'memberships');
        assert.equal(throughRelation.ownerType, 'App.User');
        assert.equal(throughRelation.foreignKey, 'userId');
        inverseRelation = relation.inverseThrough(throughRelation);
        assert.equal(inverseRelation.name, 'group');
        assert.equal(inverseRelation.type, 'App.Group');
        assert.equal(inverseRelation.foreignKey, 'groupId');
      });

      test('insertThroughRelation', function(done) {
        cursor = user.get('groups').cursor;
        
        cursor.insertThroughRelation(group, function(error, record) {
          assert.equal(record.constructor.className(), 'Membership');
          assert.equal(record.get('groupId').toString(), group.get('id').toString());
          assert.equal(record.get('userId').toString(), user.get('id').toString());
          done();
        });
      });

      test('all together now, insert through model', function(done) {
        user.get('groups').create(function(error, group) {
          assert.ok(user.get('memberships').all().isCursor, 'user.memberships.all.isCursor');
          assert.ok(user.get('memberships').all().isHasMany, 'user.memberships.all.isHasManyThrough');
          
          user.get('memberships').all(function(error, memberships) {
            assert.equal(memberships.length, 1);
            var record = memberships[0];
            assert.equal(record.get('groupId').toString(), group.get('id').toString());
            assert.equal(record.get('userId').toString(), user.get('id').toString());
            
            user.get('groups').all(function(error, groups) {
              assert.equal(groups.length, 1);
              done();
            });
          });
        });
      });

      test('insert 2 models and 2 through models as Arguments', function(done) {
        var _this = this;
        assert.isTrue(user.get('groups').all().isHasManyThrough, 'user.groups.isHasManyThrough');
        user.get('groups').create({}, {}, function(error, groups) {
          assert.equal(groups.length, 2);
          App.Group.count(function(error, count) {
            assert.equal(count, 3);
            user.get('memberships').count(function(error, count) {
              assert.equal(count, 2);
              user.get('groups').count(function(error, count) {
                assert.equal(count, 2);
                done();
              });
            });
          });
        });
      });
    });

    describe('.update', function() {
      beforeEach(function(done) {
        user.get('groups').create({name: 'Starbucks'}, {}, done);
      });

      test('update all groups', function(done) {
        var _this = this;
        user.get('groups').update({
          name: "Peet's"
        }, function() {
          user.get('groups').all(function(error, groups) {
            var _i, _len;
            assert.equal(groups.length, 2);
            for (_i = 0, _len = groups.length; _i < _len; _i++) {
              group = groups[_i];
              assert.equal(group.get('name'), "Peet's");
            }
            done();
          });
        });
      });

      test('update matching groups', function(done) {
        var _this = this;
        user.get('groups').where({
          name: "Starbucks"
        }).update({
          name: "Peet's"
        }, function() {
          user.get('groups').where({
            name: "Peet's"
          }).count(function(error, count) {
            assert.equal(count, 1);
            user.get('memberships').count(function(error, count) {
              assert.equal(count, 2);
              done();
            });
          });
        });
      });
    });

    describe('.destroy', function() {
      beforeEach(function(done) {
        user.get('groups').create({
          name: "Starbucks"
        }, {}, done);
      });

      test('destroy all groups', function(done) {
        var _this = this;
        user.get('groups').destroy(function() {
          user.get('groups').count(function(error, count) {
            assert.equal(count, 0);
            done();
          });
        });
      });
    });

    describe('.find', function() {
      beforeEach(function(done) {
        App.Group.create(function() {
          App.Membership.create(function() {
            user.get('memberships').create({groupId: group.get('id')}, function(error, record) {
              membership = record;
              done();
            });
          });
        });
      });

      test('appendThroughConditions', function(done) {
        var cursor = user.get('groups').cursor;
        assert.deepEqual(cursor.conditions(), {});
        cursor.appendThroughConditions(function() {
          assert.deepEqual(cursor.conditions(), {
            id: {
              $in: [group.get('id')]
            }
          });
          done();
        });
      });
    });

    describe('finders', function() {
      beforeEach(function(done) {
        App.Group.create(function() {
          App.Membership.create(function() {
            user.get('groups').create({
              name: "A"
            }, {
              name: "B"
            }, {
              name: "C"
            }, done);
          });
        });
      });

      describe('relation (groups)', function() {

        test('all', function(done) {
          user.get('groups').all(function(error, records) {
            assert.equal(records.length, 3);
            done();
          });
        });

        test('first', function(done) {
          user.get('groups').desc("name").first(function(error, record) {
            assert.equal(record.get('name'), "C");
            done();
          });
        });

        test('last', function(done) {
          user.get('groups').desc("name").last(function(error, record) {
            assert.equal(record.get('name'), "A");
            done();
          });
        });

        test('count', function(done) {
          user.get('groups').count(function(error, count) {
            assert.equal(count, 3);
            done();
          });
        });

        test('exists', function(done) {
          user.get('groups').exists(function(error, value) {
            assert.equal(value, true);
            done();
          });
        });
      });

      describe('through relation (memberships)', function() {

        test('all', function(done) {
          user.get('memberships').all(function(error, records) {
            assert.equal(records.length, 3);
            done();
          });
        });

        test('first', function(done) {
          user.get('memberships').first(function(error, record) {
            assert.ok(record);
            done();
          });
        });

        test('last', function(done) {
          user.get('memberships').last(function(error, record) {
            assert.ok(record);
            done();
          });
        });

        test('count', function(done) {
          user.get('memberships').count(function(error, count) {
            assert.equal(count, 3);
            done();
          });
        });

        test('exists', function(done) {
          var _this = this;
          user.get('memberships').exists(function(error, value) {
            assert.equal(value, true);
            done();
          });
        });
      });
    });
  });

  describe('hasMany with idCache', function() {
    var parent;

    beforeEach(function(done) {
      async.series([
        function(next) {
          App.Parent.create(function(error, record) {
            parent = record;
            next();
          });
        }
      ], done);
    });

    describe('Parent.idCacheTrue_idCacheFalse', function() {
      var cursor, relation;

      beforeEach(function() {
        relation = App.Parent.relations().idCacheTrue_idCacheFalse;
        cursor = parent.get('idCacheTrue_idCacheFalse').cursor;
      });

      test('relation', function() {
        assert.equal(relation.idCache, true);
        assert.equal(relation.idCacheKey, "idCacheTrue_idCacheFalse" + "Ids");
      });

      test('default for idCacheKey should be array', function() {
        assert.ok(_.isArray(App.Parent.fields()[relation.idCacheKey]._default));
      });

      test('compileForInsert', function(done) {
        cursor.compileForInsert();
        assert.deepEqual(cursor.conditions(), {
          parentId: parent.get('id')
        });
        done();
      });

      test('updateOwnerRecord', function() {
        assert.equal(cursor.updateOwnerRecord(), true);
      });

      test('ownerAttributes', function(done) {
        var child = new App.Child({
          id: 20
        });
        assert.deepEqual(cursor.ownerAttributes(child), {
          '$add': {
            idCacheTrue_idCacheFalseIds: child.get('id')
          }
        });
        done();
      });

      describe('persistence', function() {
        var child, child2, child3;
        child = null;
        child2 = null;
        child3 = null;
        beforeEach(function(done) {
          async.series([
            function(next) {
              parent.get('idCacheTrue_idCacheFalse').create(function(error, record) {
                child = record;
                next();
              });
            }, function(next) {
              parent.get('idCacheTrue_idCacheFalse').create(function(error, record) {
                child2 = record;
                next();
              });
            }, function(next) {
              App.Child.create(function(error, record) {
                child3 = record;
                next();
              });
            }, function(next) {
              App.Parent.find(parent.get('id'), function(error, record) {
                parent = record;
                next();
              });
            }
          ], done);
        });

        test('insert', function(done) {
          assert.equal(child.get('parentId').toString(), parent.get('id').toString());
          assert.deepEqual(parent.get(relation.idCacheKey), [child.get('id'), child2.get('id')]);
          done();
        });

        test('update(1)', function(done) {
          var _this = this;
          parent.get('idCacheTrue_idCacheFalse').update(child.get('id'), {
            value: "something"
          }, function() {
            App.Child.find(child.get('id'), function(error, child) {
              assert.equal(child.get('value'), 'something');
              App.Child.find(child2.get('id'), function(error, child) {
                assert.equal(child.get('value'), null);
                done();
              });
            });
          });
        });

        test('update()', function(done) {
          var _this = this;
          parent.get('idCacheTrue_idCacheFalse').update({
            value: "something"
          }, function() {
            App.Child.find(child.get('id'), function(error, child) {
              assert.equal(child.get('value'), 'something');
              App.Child.find(child3.get('id'), function(error, child) {
                assert.equal(child.get('value'), null);
                done();
              });
            });
          });
        });

        test('destroy(1)', function(done) {
          var _this = this;
          parent.get('idCacheTrue_idCacheFalse').destroy(child.get('id'), function() {
            App.Parent.find(parent.get('id'), function(error, parent) {
              assert.deepEqual(parent.get(relation.idCacheKey), [child2.get('id')]);
              App.Child.all(function(error, records) {
                assert.equal(records.length, 2);
                done();
              });
            });
          });
        });

        test('destroy()', function(done) {
          var _this = this;
          parent.get('idCacheTrue_idCacheFalse').destroy(function() {
            App.Parent.find(parent.get('id'), function(error, parent) {
              assert.deepEqual(parent.get(relation.idCacheKey), []);
              App.Child.all(function(error, records) {
                assert.equal(records.length, 1);
                done();
              });
            });
          });
        });

        test('all', function(done) {
          var _this = this;
          parent.get('idCacheTrue_idCacheFalse').all(function(error, records) {
            assert.equal(records.length, 2);
            done();
          });
        });

        test('add to set', function(done) {
          var _this = this;
          App.Child.create(function(error, newChild) {
            parent.get('idCacheTrue_idCacheFalse').add(newChild, function() {
              App.Parent.find(parent.get('id'), function(error, parent) {
                assert.deepEqual(_.toS(parent.get(relation.idCacheKey)), _.toS([child.get('id'), child2.get('id'), newChild.get('id')]));
                App.Child.all(function(error, records) {
                  assert.equal(records.length, 4);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});
