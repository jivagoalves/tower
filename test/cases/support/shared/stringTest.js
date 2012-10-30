describe('Tower.SupportString', function() {
  describe('#paramterize', function() {
    test('should replace special characters with dashes', function() {
      assert.equal("tower-s-great", _.parameterize("Tower's great"));
      assert.equal("holy", _.parameterize('Holy $#!@'));
    });

    test('should not leave leading dashes', function() {
      assert.equal("tower", _.parameterize("@tower"));
      assert.equal("tower", _.parameterize("-tower"));
      assert.equal("tower", _.parameterize("--tower"));
    });

    test('should not leave trailing dashes', function() {
      assert.equal("tower", _.parameterize("Tower!!!"));
      assert.equal("tower", _.parameterize("tower-"));
      assert.equal("tower", _.parameterize("tower--"));
    });

    test('should reduce multiple dashes to one', function() {
      assert.equal("testing-dashes", _.parameterize("testing-------dashes"));
    });

    test('should underscore then dasherize camel-cased words', function() {
      assert.equal("my-thing", _.parameterize("MyThing"));
      assert.equal("my-thing", _.parameterize("myThing"));
      assert.equal("my-thing1", _.parameterize("myThing1"));
    });
  });

  describe('inflection', function() {
    test('pluralize', function() {
      assert.equal(_.pluralize("entry"), "entries");
      assert.equal(_.pluralize("business"), "businesses");
      assert.equal(_.pluralize("people"), "people");
      assert.equal(_.pluralize("person"), "people");
      assert.equal(_.pluralize(2, "thing"), "things");
      assert.equal(_.pluralize(1, "thing"), "thing");
      assert.equal(_.pluralize(0, "thing"), "things");
    });

    test('singularize', function() {
      assert.equal(_.singularize("businesses"), "business");
      assert.equal(_.singularize("people"), "person");
      assert.equal(_.singularize("person"), "person");
    });
  });
});
