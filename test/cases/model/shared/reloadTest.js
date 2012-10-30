describe('Tower.Model#reload', function() {
  var referenceUser, user;

  beforeEach(function(done) {
    App.User.create({firstName: 'John'}, function(error, record) {
      user = record;

      App.User.find(user.get('id'), function(error, record) {
        referenceUser = record;

        done();
      });
    });
  });

  test('reload', function(done) {
    referenceUser.updateAttributes({firstName: 'Pete'}, function() {
      user.reload(function() {
        assert.equal(user.get('firstName'), 'Pete');
        done();
      });
    });
  });

  test('refresh', function(done) {
    referenceUser.updateAttributes({firstName: 'Pete'}, function() {
      user.refresh(function() {
        assert.equal(user.get('firstName'), 'Pete');
        done();
      });
    });
  });
});
