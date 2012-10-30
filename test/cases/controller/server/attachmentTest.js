describe('controller/server/attachmentTest', function() {
  var faviconPath, uploadsDir;

  before(function() {
    uploadsDir = Tower.joinPath(Tower.srcRoot, 'tmp/uploads');
    faviconPath = Tower.joinPath(Tower.root, 'public/favicon.png');
  });

  beforeEach(function(done) {
    Tower.removeDirectorySync(uploadsDir);
    Tower.createDirectorySync(uploadsDir);
    Tower.start(done);
  });

  afterEach(function() {
    Tower.removeDirectorySync(uploadsDir);
    Tower.stop();
  });

  test('upload image', function(done) {
    var attachments = {
      'attachment': faviconPath
    };
    
    _.post('/attachments', {attachments: attachments}, function(response) {
      App.Attachment.first(function(error, attachment) {
        assert.equal(attachment.get('size'), Tower.sizeSync(faviconPath));
        done();
      });
    });
  });
});
