describe("Tower.ViewEmberHelper", function() {
  var template, user, view;

  beforeEach(function() {
    return view = Tower.View.create();
  });

  describe('each', function() {
    beforeEach(function(done) {
      var _this = this;
      App.User.insert({
        firstName: "Lance"
      }, function(error, record) {
        user = record;
        App.User.insert({
          firstName: "Dane"
        }, done);
      });
    });

    test('hEach("App.User")', function() {
      var template;
      template = function() {
        return hEach('App.User');
      };
      return view.render({
        template: template
      }, function(error, result) {
        assert.equal(result, "{{#each App.User}}");
      });
    });

    test('hEach("App.User", ->)', function() {
      var template;
      template = function() {
        return hEach('App.User', function() {});
      };
      return view.render({
        template: template
      }, function(error, result) {
        assert.equal(result, "{{#each App.User}}\n{{/each}}");
      });
    });

    test('hEach("App.User", key: "value")', function() {
      var template;
      template = function() {
        return hEach('App.User', {
          key: "value"
        });
      };
      return view.render({
        template: template
      }, function(error, result) {
        assert.equal(result, "{{#each App.User key=\"value\"}}");
      });
    });

    test('hEach("App.User", -> li "{{firstName}}")', function() {
      var template;
      template = function() {
        return hEach('App.User', function() {
          return li('{{firstName}}');
        });
      };
      return view.render({
        template: template
      }, function(error, result) {
        assert.equal(result, "{{#each App.User}}\n<li>{{firstName}}</li>\n{{/each}}");
      });
    });
  });

  test('hWith("App.User", ->)', function() {
    var template;
    template = function() {
      return hWith('App.User', function() {});
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "{{#with App.User}}\n{{/with}}");
    });
  });

  test('hBindAttr(src: "src")', function() {
    var template;
    template = function() {
      return hBindAttr({
        src: "src"
      }, function() {});
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "{{bindAttr src=\"src\"}}");
    });
  });

  test('hAction("anAction", target: "App.viewStates")', function() {
    var template;
    template = function() {
      return hAction("anAction", {
        target: "App.viewStates"
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "{{action \"anAction\" target=\"App.viewStates\"}}");
    });
  });

  test('a "{{action "select" target="App"}}", href: "#"', function(done) {
    var template;
    template = function() {
      return a('{{action "select" target="App"}}', {
        href: '#'
      }, 'Select');
    };
    return view.render({
      template: template
    }, function(error, result) {
      assert.equal(result, "<a href=\"#\" {{action \"select\" target=\"App\"}}>Select</a>\n");
      done();
    });
  });
});
