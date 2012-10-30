describe('Tower.ModelAutosaveAssociation', function() {
  var record;
  
  App.AutosaveAssociationTest = Tower.Model.extend({
    posts: Tower.Model.hasMany({autosave: true}),
    address: Tower.Model.hasOne({autosave: true}),
    user: Tower.Model.belongsTo({autosave: true})
  });

  test('callbacks', function() {
    var callbacks = App.AutosaveAssociationTest.callbacks();
    
    function methods(array) {
      return _.map(array, function(i) {
        return i.method;
      });
    };

    assert.deepEqual(methods(callbacks.save.before), ['_beforeSaveCollectionAssociation', '_autosaveAssociatedRecordsForUser']);
    assert.deepEqual(methods(callbacks.save.after), []);
    assert.deepEqual(methods(callbacks.create.before), []);
    assert.deepEqual(methods(callbacks.create.after), ['_autosaveAssociatedRecordsForPosts', '_autosaveAssociatedRecordsForAddress']);
    assert.deepEqual(methods(callbacks.update.before), []);
    assert.deepEqual(methods(callbacks.update.after), ['_autosaveAssociatedRecordsForPosts', '_autosaveAssociatedRecordsForAddress']);
  });

  describe('new record', function() {
    var association, post;

    beforeEach(function() {
      record = App.AutosaveAssociationTest.build();
    });

    test('_beforeSaveCollectionAssociation, which sets `newRecordBeforeSave`', function() {
      assert.ok(!record.get('newRecordBeforeSave'));
      record._beforeSaveCollectionAssociation();
      assert.isTrue(record.get('newRecordBeforeSave'));
    });

    test('_associationIsValid', function() {
      association = record.constructor.relations()['posts'];
      post = App.Post.build({
        title: 'A Title!',
        rating: 8
      });

      assert.isTrue(record._associationIsValid(association, post));
      post.set('rating', undefined);
      assert.isFalse(record._associationIsValid(association, post));
      assert.deepEqual(post.get('errors').rating, ['rating must be a minimum of 0', 'rating must be a maximum of 10']);
      assert.deepEqual(record.get('errors')['posts.rating'], ['rating must be a minimum of 0', 'rating must be a maximum of 10']);
    });

    test('_associationIsValid if record isDeleted or isMarkedForDestruction', function() {
      association = record.constructor.relations()['posts'];
      post = App.Post.build({
        title: 'A Title!',
        rating: 8
      });

      post.set('isDeleted', true);
      assert.isTrue(record._associationIsValid(association, post));
      post.set('isDeleted', false);
      post.set('isMarkedForDestruction', true);
      assert.isTrue(record._associationIsValid(association, post));
    });

    test('_changedForAutosave', function() {
      function reset() {
        record.setProperties({
          isNew: false,
          isDirty: false,
          isMarkedForDestruction: false
        });
      };
      
      reset();
      assert.isFalse(record._changedForAutosave());
      record.set('isNew', true);
      assert.isTrue(record._changedForAutosave(), 'record._changedForAutosave if isNew');
      reset();
      record.set('isDirty', true);
      assert.isTrue(record._changedForAutosave(), 'record._changedForAutosave if isDirty');
      reset();
      record.set('isMarkedForDestruction', true);
      assert.isTrue(record._changedForAutosave(), 'record._changedForAutosave if isMarkedForDestruction');
      reset();
    });

    test('_saveBelongsToAssociation', function(done) {
      var user = App.User.build({
        firstName: 'Lance'
      });
      record.set('user', user);
      var association = record.constructor.relations()['user'];
      assert.isUndefined(record.get(association.foreignKey));
      return record._saveBelongsToAssociation(association, function() {
        assert.equal(record.get(association.foreignKey).toString(), user.get('id').toString());
        done();
      });
    });

    test('_saveHasOneAssociation', function(done) {
      var address = App.Address.build({
        city: 'San Francisco',
        state: 'CA'
      });
      record.set('address', address);
      record.set('id', _.uuid());
      record.set('isNew', false);
      
      var association = record.constructor.relations()['address'];
      assert.isUndefined(address.get(association.foreignKey));
      
      record._saveHasOneAssociation(association, function() {
        assert.equal(address.get(association.foreignKey).toString(), record.get('id').toString());
        done();
      });
    });
  });
});
