describe("Tower.ModelRelationHasOne", function() {
  var address, user;

  beforeEach(function(done) {
    Tower.Factory.define('user', function() {
      return {
        firstName: 'John'
      };
    });
    
    Tower.Factory.define('address', function() {
      return {
        city: 'San Francisco',
        state: 'CA'
      };
    });

    done();
  });

  afterEach(function() {
    Tower.Factory.clear();
  });

  describe('hasOne on unsaved parent', function() {
    beforeEach(function() {
      user = Tower.Factory.build('user');
    });

    test('build["associationName"]');

    test('create["associationName"]');
  });

  describe('hasOne on saved parent', function() {
    beforeEach(function(done) {
      App.User.create({firstName: 'John'}, function(error, record) {
        user = record;
        done();
      });
    });
  });
});
