describe('Tower.View', function() {
  var template, controller, user, view;

  beforeEach(function() {
    view = new Tower.View;
  });

  test('layout', function() {
    template = function() {
      doctype(5);
      return html(function() {
        head(function() {
          meta({
            charset: "utf-8"
          });
          return title("Tower.js - Full Stack JavaScript Framework for Node.js and the Browser");
        });
        return body({
          role: "application"
        }, function() {});
      });
    };

    view.render({template: template}, function(error, result) {
      assert.equal(result, "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Tower.js - Full Stack JavaScript Framework for Node.js and the Browser</title>\n  </head>\n  <body role=\"application\">\n  </body>\n</html>\n");
    });
  });

  test('yields', function() {});
});

describe('Tower.View eco template', function() {
  beforeEach(function() {
    view = new Tower.View;
  });

  test('eco layout', function() {
    template = function() {
      return "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Tower.js - Full Stack JavaScript Framework for Node.js and the Browser</title>\n  </head>\n  <body role=\"application\">\n    <div>2</div>\n  </body>\n</html>";
    };
    
    view.render({
      type: "eco",
      template: template
    }, function(error, result) {
      assert.equal(result, "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Tower.js - Full Stack JavaScript Framework for Node.js and the Browser</title>\n  </head>\n  <body role=\"application\">\n    <div>2</div>\n  </body>\n</html>");
    });
  });
});
