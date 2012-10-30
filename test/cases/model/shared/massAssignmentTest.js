App.ModelWithProtectedAttributes = Tower.Model.extend({
  a: Tower.Model.field('Integer'),
  b: Tower.Model.field('Integer', {protected: true}),
  c: Tower.Model.field('Integer')
});

describe('Tower.ModelMassAssignment', function() {
  var record;

  describe('Tower.Model.protected', function() {
    test('class-level protected attributes hash', function() {
      assert.isTrue(_.include(App.ModelWithProtectedAttributes.activeAuthorizer()['default'], 'b'));
    });

    test('#_sanitizeForMassAssignment', function() {
      record = App.ModelWithProtectedAttributes.build();
      record.assignAttributes({
        a: 1,
        b: 2,
        c: 3
      });
      assert.deepEqual(record.get('attributes'), {
        a: 1,
        c: 3,
        id: undefined,
        b: undefined
      });
      assert.equal(record.get('a'), 1);
      assert.notEqual(record.get('b'), 2);
      assert.equal(record.get('c'), 3);
      record = App.ModelWithProtectedAttributes.build();
      record.assignAttributes({
        a: 1,
        id: '10'
      });
      assert.deepEqual(record.get('attributes'), {
        a: 1,
        c: undefined,
        id: undefined,
        b: undefined
      });
      assert.deepEqual(record.attributesForCreate(), {
        a: 1
      });
    });

    test('#assignAttributes', function() {
      record = App.ModelWithProtectedAttributes.build();
      record.assignAttributes({
        id: '10',
        a: 1,
        $set: {
          b: 2,
          c: 3
        }
      });
      assert.deepEqual(record.attributesForCreate(), {
        a: 1,
        c: 3
      });
    });

    test('.build', function() {
      record = App.ModelWithProtectedAttributes.build({
        id: '10',
        a: 1,
        $set: {
          b: 2,
          c: 3
        }
      });
      assert.deepEqual(record.attributesForCreate(), {
        a: 1,
        c: 3
      });
      record.set('b', 2);
      assert.deepEqual(record.attributesForCreate(), {
        a: 1,
        b: 2,
        c: 3
      });
    });
  });
});
