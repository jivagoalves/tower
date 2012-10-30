describe("Tower.ModelCursor states", function() {
  var cursor;

  describe("exists", function() {
    test('default', function() {
      cursor = App.User.scoped().cursor;
      assert.equal(true, cursor.isEmpty);
    });

    test('if no records are present', function(done) {
      App.User.exists(function(error, exists) {
        assert.equal(false, exists);
        assert.equal(true, this.isEmpty);
        assert.isTrue(this.isCursor, 'isCursor');
        done();
      });
    });

    test('if records are present', function(done) {
      var _this = this;
      return App.User.create({
        firstName: 'Lance'
      }, function() {
        return App.User.exists(function(error, exists) {
          assert.equal(true, exists);
          assert.equal(false, this.isEmpty);
          return done();
        });
      });
    });
  });

  describe("count", function() {
    test('default', function() {
      cursor = App.User.scoped().cursor;
      assert.equal(0, cursor.totalCount);
    });

    test('if no records are present', function(done) {
      App.User.count(function(error, count) {
        assert.equal(0, count);
        assert.equal(0, this.totalCount);
        done();
      });
    });

    test('if records are present', function(done) {
      App.User.create({firstName: 'Lance'}, function() {
        App.User.count(function(error, count) {
          assert.equal(1, count);
          assert.equal(1, this.totalCount);
          done();
        });
      });
    });
  });
  
  describe("pagination", function() {
    test('default', function() {
      cursor = App.User.scoped().cursor;
      assert.equal(0, cursor.totalPageCount);
      assert.equal(0, cursor.currentPage);
      assert.equal(false, cursor.hasFirstPage);
      assert.equal(false, cursor.hasPreviousPage);
      assert.equal(false, cursor.hasNextPage);
      assert.equal(false, cursor.hasLastPage);
    });

    test('hasFirstPage', function(done) {
      App.User.create({firstName: 'Lance'}, function() {
        App.User.page(1).all(function(error, users) {
          done();
        });
      });
    });

    test('hasPreviousPage');
    
    test('hasNextPage');
    
    test('hasLastPage');
    
    test('currentPage');
  });
});
