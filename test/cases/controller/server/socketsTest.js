describe('Tower.ControllerSockets', function() {
  var ioClient, ioServer;

  beforeEach(function(done) {
    Tower.startWithSocket(function() {
      ioServer = Tower.Application.instance().io;
      ioClient = require('socket.io-client').connect("http://localhost:" + Tower.port);
      done();
    });
  });

  afterEach(function() {
    Tower.stop();
  });

  test('connection', function(done) {
    ioServer.on("connection", function(socket) {
      assert.ok(socket);
    });

    ioClient.on("connect", function() {
      done();
    });
  });
});
