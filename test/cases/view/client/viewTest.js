describe('Tower.ViewEmberHelper', function() {
  var view;

  beforeEach(function() {
    view = new Tower.View;
  });

  test('#findEmberView', function() {
    var emberView = view.findEmberView('posts/index');
    emberView.append();
  });

  test('#renderEmberView', function() {
    view.renderEmberView('posts/index');
    assert.ok(Tower.stateManager.get('_currentView'));
  });

  describe('ember', function() {
    test('index', function() {
      return;
      App.Post.destroy();
      Ember.TEMPLATES['posts/index'] = Ember.Handlebars.compile("<ul id=\"posts-list\">\n  {{#each App.postsController.all}}\n    <li>\n      <a href=\"#\" {{action \"show\"}}>{{title}}</a>\n    </li>\n  {{/each}}\n</ul>");
      App.Post.create({
        rating: 8,
        title: "First Post!"
      });
      App.subscribe('posts', App.Post.all());
      App.setPath('postsController.all', App.posts);
      view.renderEmberView('posts/index');
      assert.equal($('#posts-list').html(), "<li>\n  <a href=\"#\">First Post!</a>\n</li>");
    });
  });
});
