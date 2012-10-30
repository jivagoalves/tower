App.AssociationCursorTest = Tower.Model.extend({
  associationCursorPosts: Tower.Model.hasMany(),
  associationCursorAddress: Tower.Model.hasOne(),
  associationCursorUser: Tower.Model.belongsTo()
});

App.AssociationCursorPost = Tower.Model.extend({
  title: Tower.Model.field().validates('presence'),
  associationCursorTest: Tower.Model.belongsTo()
});

App.AssociationCursorUser = Tower.Model.extend({
  username: Tower.Model.field().validates('presence'),
  associationCursorTests: Tower.Model.hasMany()
});

App.AssociationCursorAddress = Tower.Model.extend({
  city: Tower.Model.field().validates('presence'),
  state: Tower.Model.field().validates('presence'),
  associationCursorTest: Tower.Model.belongsTo()
});

describe("Tower.ModelRelation (association cursor)", function() {
  var association, cursor, key, record;

  describe('new owner', function() {
    describe('hasMany', function() {
      beforeEach(function() {
        record = App.AssociationCursorTest.build();
        cursor = record.getAssociationCursor('associationCursorPosts');
        association = record.constructor.relations()['associationCursorPosts'];
      });

      test('getAssociation', function() {
        assert.isTrue(record.getAssociationScope('associationCursorPosts') instanceof Tower.ModelScope, "record.getAssociationScope('associationCursorPosts') instanceof Tower.ModelScope");
        assert.isTrue(record.getAssociationScope('associationCursorPosts').cursor.isHasMany, 'cursor.isHasMany');
        assert.isTrue(record.getAssociationCursor('associationCursorPosts').isHasMany, 'getAssociationCursor("associationCursorPosts").isHasMany');
      });

      test('setHasManyAssociation', function() {
        assert.equal(cursor.get('content').length, 0);
        record._setHasManyAssociation('associationCursorPosts', App.AssociationCursorPost.build(), association);
        assert.equal(cursor.get('content').length, 1);
        record._setHasManyAssociation('associationCursorPosts', [App.AssociationCursorPost.build()], association);
        assert.equal(cursor.get('content').length, 1);
        record._setHasManyAssociation('associationCursorPosts', [App.AssociationCursorPost.build(), App.AssociationCursorPost.build()], association);
        assert.equal(cursor.get('content').length, 2);
      });

      test('_associatedRecordsToValidateOrSave(cursor, isNew: true, autosave: false)', function() {
        assert.equal(record._associatedRecordsToValidateOrSave(cursor, true).length, 0);
        record._setHasManyAssociation('associationCursorPosts', App.AssociationCursorPost.build(), association);
        assert.equal(record._associatedRecordsToValidateOrSave(cursor, true).length, 1);
      });

      test('_associatedRecordsToValidateOrSave(cursor, isNew: false, autosave: true) should records where record._changedForAutosave() is true', function() {
        var existingRecord, newRecord;
        newRecord = App.AssociationCursorPost.build();
        existingRecord = App.AssociationCursorPost.build();
        
        existingRecord.setProperties({
          isNew: false,
          isDirty: false,
          id: 10
        });

        record._setHasManyAssociation('associationCursorPosts', [newRecord, existingRecord], association);
        assert.equal(record._associatedRecordsToValidateOrSave(cursor, false, true).length, 1);
      });

      test('_associatedRecordsToValidateOrSave(cursor, isNew: false, autosave: false) should return new records', function() {
        var existingRecord, newRecord;
        newRecord = App.AssociationCursorPost.build();
        existingRecord = App.AssociationCursorPost.build();
        existingRecord.setProperties({
          isNew: false
        });
        record._setHasManyAssociation('associationCursorPosts', [newRecord, existingRecord], association);
        assert.equal(record._associatedRecordsToValidateOrSave(cursor, false, false).length, 1);
      });

      test('_validateCollectionAssociation', function() {
        record._setHasManyAssociation('associationCursorPosts', [App.AssociationCursorPost.build()], association);
        assert.isFalse(record._validateCollectionAssociation(association), 'record._validateCollectionAssociation(association)');
        assert.deepEqual(record.get('errors'), {
          associationCursorPosts: ['Invalid']
        });
        record.set('errors', {});
        record._setHasManyAssociation('associationCursorPosts', App.AssociationCursorPost.build({
          title: 'A Title!'
        }), association);
        assert.isTrue(record._validateCollectionAssociation(association), 'record._validateCollectionAssociation(association)');
      });

      test('set', function() {
        record.set('associationCursorPosts', App.AssociationCursorPost.build({
          title: 'A Title!'
        }));
        assert.isTrue(record._validateCollectionAssociation(association), 'record._validateCollectionAssociation(association)');
      });

      test('_saveCollectionAssociation', function(done) {
        record.save(function() {
          var child = App.AssociationCursorPost.build({title: 'A Title!'});
          record.set('associationCursorPosts', child);
          
          record._saveCollectionAssociation(association, function() {
            assert.equal(child.get('associationCursorTest').get('id').toString(), record.get('id').toString());
            done();
          });
        });
      });

      test('save', function(done) {
        var child = App.AssociationCursorPost.build({title: 'A Title!'});
        record.set('associationCursorPosts', child);
        
        record.save(function() {
          assert.ok(record.get('id'));
          assert.equal(child.get('associationCursorTestId').toString(), record.get('id').toString());
          done();
        });
      });

      test('replace', function(done) {
        var child1 = App.AssociationCursorPost.build({title: 'First Title!'});
        
        record.updateAttributes({associationCursorPosts: [child1]}, function() {
          var child2, firstId;
          firstId = child1.get('associationCursorTestId').toString();
          assert.ok(firstId, '1');
          
          child2 = App.AssociationCursorPost.build({title: 'Second Title!'});
          
          record.updateAttributes({associationCursorPosts: [child2]}, function() {
            var secondId = child2.get('associationCursorTestId');
            assert.ok(secondId, '2');
            assert.equal(firstId.toString(), secondId.toString(), '3');
            assert.isUndefined(child1.get('associationCursorTestId'), '4');
            assert.equal(child2.get('associationCursorTestId').toString(), record.get('id').toString(), '5');
            
            record.get('associationCursorPosts').all(function(error, count) {
              assert.equal(count.length, 1, '6');
              done();
            });
          });
        });
      });

      test('nullify', function(done) {
        var child1 = App.AssociationCursorPost.build({title: 'First Title!'});

        record.updateAttributes({associationCursorPosts: [child1]}, function() {
          record.updateAttributes({associationCursorPosts: []}, function() {
            assert.isUndefined(child1.get('associationCursorTestId'));

            record.get('associationCursorPosts').all(function(error, count) {
              assert.equal(count.length, 0);
              done();
            });
          });
        });
      });
    });
  });

  describe('belongsTo', function() {
    beforeEach(function() {
      record = App.AssociationCursorTest.build();
      cursor = record.getAssociationCursor('associationCursorUser');
      association = record.constructor.relations()['associationCursorUser'];
    });
    
    afterEach(function() {});

    test('getAssociation', function() {
      assert.isTrue(record.getAssociationScope('associationCursorUser') instanceof Tower.ModelScope, "record.getAssociationScope('associationCursorUser') instanceof Tower.ModelScope");
      assert.isTrue(record.getAssociationScope('associationCursorUser').cursor.isBelongsTo, 'cursor.isBelongsTo');
      assert.isTrue(record.getAssociationCursor('associationCursorUser').isBelongsTo, 'getAssociationCursor("associationCursorUser").isBelongsTo');
    });

    test('setBelongsToAssociation', function() {
      assert.equal(cursor.get('content').length, 0);
      record._setBelongsToAssociation('associationCursorUser', App.AssociationCursorUser.build(), association);
      assert.equal(cursor.get('content').length, 1);
    });

    test('_validateSingleAssociation', function() {
      record._setBelongsToAssociation('associationCursorUser', App.AssociationCursorUser.build(), association);
      assert.isFalse(record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)');
      assert.deepEqual(record.get('errors'), {
        associationCursorUser: ['Invalid']
      });
      record.set('errors', {});
      record._setBelongsToAssociation('associationCursorUser', App.AssociationCursorUser.build({
        username: 'fred'
      }), association);
      assert.isTrue(record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)');
    });

    test('set', function() {
      record.set('associationCursorUser', App.AssociationCursorUser.build({
        username: 'fred'
      }));
      assert.isTrue(record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)');
    });

    test('_saveBelongsToAssociation', function(done) {
      record.set('associationCursorUser', App.AssociationCursorUser.build({username: 'fred'}));
      
      record._saveBelongsToAssociation(association, function() {
        assert.ok(record.get('associationCursorUser').get('id'));
        done();
      });
    });

    test('save', function(done) {
      record.set('associationCursorUser', App.AssociationCursorUser.build({username: 'john'}));
      
      record.save(function() {
        assert.ok(record.get('id'));
        assert.equal(record.get('associationCursorUser').get('id').toString(), record.get('associationCursorUserId').toString());
        done();
      });
    });

    test('replace', function(done) {
      record.updateAttributes({associationCursorUser: App.AssociationCursorUser.build({username: 'john'})}, function() {
        var firstId = record.get('associationCursorUserId');
        assert.ok(firstId);
        
        record.updateAttributes({associationCursorUser: App.AssociationCursorUser.build({username: 'john'})}, function() {
          var secondId = record.get('associationCursorUserId');

          assert.ok(secondId);
          assert.notEqual(firstId.toString(), secondId.toString());
          done();
        });
      });
    });

    test('nullify', function(done) {
      record.updateAttributes({associationCursorUser: App.AssociationCursorUser.build({username: 'john'})}, function() {
        record.updateAttributes({associationCursorUser: null}, function() {
          assert.isUndefined(record.get('associationCursorUserId'));
          done();
        });
      });
    });
  });

  describe('hasOne', function() {
    beforeEach(function() {
      record = App.AssociationCursorTest.build();
      key = 'associationCursorAddress';
      cursor = record.getAssociationCursor(key);
      association = record.constructor.relations()[key];
    });

    test('getAssociation', function() {
      assert.isTrue(record.getAssociationScope(key) instanceof Tower.ModelScope, "record.getAssociationScope(key) instanceof Tower.ModelScope");
      assert.isTrue(record.getAssociationScope(key).cursor.isHasOne, 'cursor.isHasOne');
      assert.isTrue(record.getAssociationCursor(key).isHasOne, 'getAssociationCursor("associationCursorUser").isHasOne');
    });

    test('setHasOneAssociation', function() {
      assert.equal(cursor.get('content').length, 0);
      record._setHasOneAssociation(key, App.AssociationCursorAddress.build(), association);
      assert.equal(cursor.get('content').length, 1);
    });

    test('_validateSingleAssociation', function() {
      record._setHasOneAssociation(key, App.AssociationCursorAddress.build(), association);
      assert.isFalse(record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)');
      assert.deepEqual(record.get('errors'), {
        associationCursorAddress: ['Invalid']
      });
      record.set('errors', {});
      record._setHasOneAssociation(key, App.AssociationCursorAddress.build({
        city: 'San Francisco',
        state: 'CA'
      }), association);
      assert.isTrue(record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)');
    });

    test('set', function() {
      record.set(key, App.AssociationCursorAddress.build({
        city: 'San Francisco',
        state: 'CA'
      }));
      assert.isTrue(record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)');
    });

    test('_saveHasOneAssociation', function(done) {
      record.save(function() {
        var child = App.AssociationCursorAddress.build({
          city: 'San Francisco',
          state: 'CA'
        });
        record.set(key, child);
        record._saveHasOneAssociation(association, function() {
          assert.equal(child.get('associationCursorTestId').toString(), record.get('id').toString());
          done();
        });
      });
    });

    test('save', function(done) {
      var child = App.AssociationCursorAddress.build({
        city: 'San Francisco',
        state: 'CA'
      });
      record.set(key, child);
      record.save(function() {
        assert.ok(record.get('id'));
        assert.equal(child.get('associationCursorTestId').toString(), record.get('id').toString());
        done();
      });
    });

    test('setting multiple times when parent is persistent', function(done) {
      record.save(function() {
        App.AssociationCursorAddress.create({
          city: 'San Francisco',
          state: 'CA'
        }, function(error, child1) {
          var child2 = App.AssociationCursorAddress.build({
            city: 'San Francisco',
            state: 'CA'
          });
          record.set(key, child1);
          record.set(key, child2);
          assert.isUndefined(record.getAssociationCursor(key)._markedForDestruction);
          done();
        });
      });
    });

    test('setting multiple times when parent is persistent and relationship already existed', function(done) {
      var child1 = App.AssociationCursorAddress.build({
        city: 'San Francisco',
        state: 'CA'
      });

      record.updateAttributes({associationCursorAddress: child1}, function() {
        var child2 = App.AssociationCursorAddress.build({
          city: 'San Francisco',
          state: 'CA'
        });
        record.set(key, child1);
        record.set(key, child2);
        assert.equal(record.getAssociationCursor(key)._markedForDestruction, child1);
        done();
      });
    });
  });
});
