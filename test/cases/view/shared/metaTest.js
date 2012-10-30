var user, view;

view = null;

user = null;

describe('Tower.View meta', function() {
  beforeEach(function() {
    return view = new Tower.View;
  });

  test('#metaTag', function() {
    var template;
    template = function() {
      return metaTag("description", "A meta tag");
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "<meta name=\"description\" content=\"A meta tag\" />\n");
    });
  });

  test('appleViewportMetaTag', function() {
    var template;
    template = function() {
      return appleViewportMetaTag({
        width: "device-width",
        max: 1,
        scalable: false
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\" />\n");
    });
  });

  test('openGraphMetaTags', function() {
    var template;
    template = function() {
      return openGraphMetaTags({
        title: "Tower.js",
        type: "site"
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "<meta property=\"og:title\" content=\"Tower.js\" />\n<meta property=\"og:type\" content=\"site\" />\n");
    });
  });
});
