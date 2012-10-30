describe('Tower.StoreTransportAjax', function() {
  var criteria, expected, params;

  describe('params', function() {
    test('conditions', function() {
      criteria = App.User.where({
        firstName: {
          '=~': 'L'
        }
      }).compile();
      params = criteria.toParams();
      expected = {
        conditions: {
          firstName: {
            '=~': 'L'
          }
        }
      };
      assert.deepEqual(expected, params);
    });

    test('conditions, pagination and sort', function() {
      criteria = App.User.where({
        firstName: {
          '=~': 'L'
        },
        lastName: {
          '=~': 'l'
        }
      }).page(2).limit(2).asc('lastName').compile();
      
      params = criteria.toParams();
      
      expected = {
        conditions: {
          firstName: {
            '=~': 'L'
          },
          lastName: {
            '=~': 'l'
          }
        },
        limit: 2,
        page: 2,
        sort: [['lastName', 'asc']]
      };

      assert.deepEqual(expected, params);
    });
  });

  describe('create', function() {
    test('success', function(done) {
      var user = App.User.build({firstName: 'Lance'});
      
      Tower.StoreTransportAjax.create([user], function(error, updatedUser) {
        assert.isTrue(!!updatedUser);
        done();
      });
    });
  });

  describe('update', function() {
    var user;

    beforeEach(function(done) {
      user = App.User.build({firstName: 'Lance'});

      Tower.StoreTransportAjax.create([user], function(error, updatedUser) {
        user = updatedUser;
        done();
      });
    });

    test('success', function(done) {
      user.set('firstName', 'John');
      Tower.StoreTransportAjax.update([user], function(error, updatedUser) {
        assert.isTrue(!!updatedUser);
        done();
      });
    });

    test('failure');

    test('error');
  });

  describe('destroy', function() {
    var user;

    beforeEach(function(done) {
      user = App.User.build({firstName: 'Lance'});

      Tower.StoreTransportAjax.create([user], function(error, updatedUser) {
        user = updatedUser;
        done();
      });
    });

    test('success', function(done) {
      Tower.StoreTransportAjax.destroy([user], function(error, destroyedUser) {
        assert.isTrue(!!destroyedUser);
        done();
      });
    });

    test('failure');

    test('error');
  });

  describe('find', function() {
    test('conditions', function(done) {
      var criteria = App.User.where({firstName: 'L'}).compile();

      Tower.StoreTransportAjax.find(criteria, function(error, data) {
        assert.isTrue(!!data);
        done();
      });
    });
  });
});
