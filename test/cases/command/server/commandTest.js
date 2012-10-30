describe('Tower.Command', function() {
  test('aliases', function() {
    assert.deepEqual(Tower.Command.aliases, {
      c: 'console',
      g: 'generate',
      s: 'server'
    });
  });
});
