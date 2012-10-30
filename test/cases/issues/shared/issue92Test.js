describe('Testing Issue #92.', function() {
  var attr = Tower.ModelAttribute;
  var issue;

  beforeEach(function() {
    issue = App.Issue92.build();
  });

  test('test for changing boolean values', function(done) {
    assert.equal(issue.get('enabled'), true, 'should be true 1');
    issue.set('enabled', false);
    assert.equal(issue.get('enabled'), false, 'should be false 2');
    issue.save(function() {
      App.Issue92.find(issue.get('id'), function(error, issue) {
        assert.equal(issue.get('enabled'), false, 'should be false 3');
        issue.set('enabled', true);
        assert.equal(issue.get('enabled'), true, 'should be true 4');
        issue.save(function() {
          App.Issue92.find(issue.get('id'), function(error, issue) {
            assert.equal(issue.get('enabled'), true, 'should be true 5');
            done();
          });
        });
      });
    });
  });
});
