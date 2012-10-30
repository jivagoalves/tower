describe('Tower.StoreMongodb', function() {
  var config, __config;

  beforeEach(function() {
    __config = Tower.StoreMongodb.config;
    config = Tower.StoreMongodb.config = {};
  });

  afterEach(function() {
    Tower.StoreMongodb.config = __config;
  });

  test('url', function() {
    var expected, key, result, value;

    config.url = 'mongodb://heroku_user:asdfasdfasdf@data123.mongolab.com:29197/heroku_app';

    expected = {
      name: 'heroku_app',
      port: 29197,
      host: 'data123.mongolab.com',
      username: 'heroku_user',
      password: 'asdfasdfasdf'
    };

    result = Tower.StoreMongodb.parseEnv();

    for (key in expected) {
      value = expected[key];
      assert.equal(result[key], value);
    }
  });
});
