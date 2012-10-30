describe('controller/server/headersTest', function() {
  beforeEach(function(done) {
    Tower.start(done);
  });

  afterEach(function() {
    Tower.stop();
  });

  describe('request', function() {
    describe('standard', function() {
      describe('Accept', function() {
        test('undefined', function(done) {
          var headers = {};
          
          _.get('/headers/acceptUndefined', {headers: headers}, function(response) {
            assert.equal(response.headers['connection'], 'keep-alive');
            assert.equal(response.headers['transfer-encoding'], 'chunked');
            assert.equal(response.headers['content-type'], 'text/plain');
            done();
          });
        });

        test('json', function(done) {
          var headers = {
            accept: 'application/json'
          };

          _.get('/headers/acceptJSON', {headers: headers}, function(response) {
            assert.equal(response.headers['connection'], 'keep-alive');
            assert.equal(response.headers['transfer-encoding'], 'chunked');
            assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
            done();
          });
        });

        test('Accept: application/vnd.scalarium-v1+json');

        test('Accept: text/html; q=1.0, text/*; q=0.8, image/gif; q=0.6, image/jpeg; q=0.6, image/*; q=0.5, */*; q=0.1');
      });

      describe('Accept-Charset', function() {
        test('utf-8', function(done) {
          var headers = {
            'accept-charset': 'utf-8',
            'accept': 'application/json'
          };

          _.get('/headers/acceptCharsetUTF8', {headers: headers}, function(response) {
            assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
            done();
          });
        });
      });

      test('Accept-Encoding');

      test('Accept-Language');

      test('Accept-Datetime');

      test('Authorization');

      test('Cache-Control');

      test('Connection');

      test('Cookie');

      test('Content-Length');

      test('Content-MD5');

      describe('Content-Type', function() {
        test('GET should fail');

        test('PUT');

        test('POST');

        test('DELETE should fail');
      });

      test('Date');

      test('Expect');

      test('From');

      test('Host');

      test('If-Match');

      test('If-Modified-Since');

      test('If-None-Match');

      test('If-Range');

      test('If-Unmodified-Since');

      test('Max-Forwards');

      test('Pragma');

      test('Proxy-Authorization');

      test('Range');

      test('Referer');

      test('TE');

      test('Upgrade');

      test('User-Agent');

      test('Via');

      test('Warning');
    });

    describe('non-standard', function() {
      test('X-Requested-With');

      test('X-CSRF-Token');

      test('X-HTTP-Method-Override');
    });
  });

  describe('response', function() {
    describe('standard', function() {
      test('Access-Control-Allow-Origin');

      test('Accept-Ranges');

      test('Age');

      test('Allow');

      test('Cache-Control');

      test('Connection');

      test('Content-Encoding');

      test('Content-Language');

      test('Content-Length');

      test('Content-Location');

      test('Content-MD5');

      test('Content-Disposition');

      test('Content-Range');

      test('Content-Type');

      test('Date');

      test('ETag');

      test('Expires');

      test('Last-Modified');

      test('Link');

      test('Location');

      test('Pragma');

      test('Refresh');

      test('Retry-After');

      test('Server');

      test('Set-Cookie');

      test('Trailer');

      test('Transfer-Encoding');

      test('Vary');

      test('Via');

      test('Warning');

      test('WWW-Authenticate');
    });

    describe('non-standard', function() {
      test('X-Frame-Options');

      test('X-XSS-Protection');

      test('X-UA-Compatible');

      test('X-Response-time');
    });
  });
});
