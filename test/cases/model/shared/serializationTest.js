describe('Tower.ModelSerialization', function() {
  var criteria, scope, user;

  test("instance.toJSON", function() {
    var expected, json, key, value;

    json = App.User["new"]({firstName: "Lance"}).toJSON();
    
    expected = {
      id: undefined,
      createdAt: undefined,
      likes: 0,
      tags: [],
      postIds: [],
      updatedAt: undefined,
      firstName: 'Lance',
      rating: 2.5,
      admin: false,
      cachedMembershipIds: []
    };

    for (key in expected) {
      value = expected[key];
      assert.deepEqual(value, json[key]);
    }
  });
});
