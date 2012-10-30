var controller, user, view;

controller = null;

view = null;

user = null;

describe('Tower.View', function() {
  beforeEach(function() {
    view = new Tower.View;
    Tower.View.cache = {};
  });
  afterEach(function() {
    Tower.View.cache = {};
  });

  test('partial', function() {
    var template;
    Tower.View.cache["app/templates/shared/shared/_meta.coffee"] = "meta charset: \"utf-8\"\ntitle \"Tower.js - Full Stack JavaScript Framework for Node.js and the Browser\"";
    template = function() {
      doctype(5);
      return html(function() {
        head(function() {
          return partial("shared/meta");
        });
        return body({
          role: "application"
        }, function() {});
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Tower.js - Full Stack JavaScript Framework for Node.js and the Browser</title>\n  </head>\n  <body role=\"application\">\n  </body>\n</html>\n");
    });
  });

  test("partial with collection", function() {
    var posts, template;
    Tower.View.cache["app/templates/shared/posts/_item.coffee"] = "li class: \"post\", -> post.get(\"title\")";
    posts = [];
    posts.push(App.Post.build({
      title: "First Post"
    }));
    posts.push(App.Post.build({
      title: "Second Post"
    }));
    template = function() {
      return ul({
        "class": "posts"
      }, function() {
        return partial("posts/item", {
          collection: this.posts,
          as: "post"
        });
      });
    };
    return view.render({
      template: template,
      locals: {
        posts: posts
      }
    }, function(error, result) {
      assert.equal(result, "<ul class=\"posts\">\n  <li class=\"post\">\n    First Post\n  </li>\n  <li class=\"post\">\n    Second Post\n  </li>\n</ul>\n");
    });
  });

  test("partial with locals", function() {
    var post, template;
    Tower.View.cache["app/templates/shared/posts/_item.coffee"] = "li class: \"post\", -> post.get(\"title\")";
    post = App.Post.build({
      title: "First Post"
    });
    template = function() {
      return ul({
        "class": "posts"
      }, function() {
        return partial("posts/item", {
          locals: {
            post: this.post
          }
        });
      });
    };
    return view.render({
      template: template,
      locals: {
        post: post
      }
    }, function(error, result) {
      assert.equal(result, "<ul class=\"posts\">\n  <li class=\"post\">\n    First Post\n  </li>\n</ul>\n");
    });
  });

  test("partials within partials with locals", function() {
    var post, template;
    Tower.View.cache["app/templates/shared/posts/_item.coffee"] = "li class: \"post\", ->\n  partial \"posts/header\", locals: post: post";
    Tower.View.cache["app/templates/shared/posts/_header.coffee"] = "header ->\n  h1 post.get(\"title\")";
    post = App.Post.build({
      title: "First Post"
    });
    template = function() {
      return ul({
        "class": "posts"
      }, function() {
        return partial("posts/item", {
          locals: {
            post: this.post
          }
        });
      });
    };
    return view.render({
      template: template,
      locals: {
        post: post
      }
    }, function(error, result) {
      assert.equal(result, "<ul class=\"posts\">\n  <li class=\"post\">\n    <header>\n      <h1>First Post</h1>\n    </header>\n  </li>\n</ul>\n");
    });
  });
});
