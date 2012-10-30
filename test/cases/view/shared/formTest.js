describe("Tower.ViewForm", function() {
  var template, user, view;

  beforeEach(function() {
    view = Tower.View.create();
  });

  describe('form', function() {
    beforeEach(function(done) {
      App.User.insert({firstName: "Lance"}, function(error, record) {
        user = record;
        done();
      });
    });

    test('#formFor()', function() {
      var template = function() {
        return formFor();
      };
      
      view.render({template: template}, function(error, result) {
        assert.equal(result, "<form action=\"/\" id=\"model-form\" role=\"form\" novalidate=\"true\" data-method=\"post\" method=\"post\">\n  <input type=\"hidden\" name=\"_method\" value=\"post\" />\n</form>\n");
      });
    });

    test('#formFor(user)', function() {
      var template = function() {
        return formFor(this.user, function(form) {
          return form.fieldset(function(fields) {
            return fields.field("firstName");
          });
        });
      };

      view.render({
        template: template,
        locals: {
          user: user
        }
      }, function(error, result) {
        if (error) {
          throw error;
        }
        assert.equal(result, "<form action=\"/users/" + (user.get('id')) + "\" id=\"user-form\" role=\"form\" novalidate=\"true\" data-method=\"put\" method=\"post\">\n  <input type=\"hidden\" name=\"_method\" value=\"put\" />\n  <fieldset>\n    <ol class=\"fields\">\n      <li class=\"field control-group string optional\" id=\"user-first-name-field\">\n        <label for=\"user-first-name-input\" class=\"control-label\">\n          <span>First name</span>\n          <abbr title=\"Optional\" class=\"optional\">\n            \n          </abbr>\n        </label>\n        <div class=\"controls\">\n          <input type=\"text\" id=\"user-first-name-input\" name=\"user[firstName]\" value=\"Lance\" class=\"string first-name optional input\" aria-required=\"false\" />\n        </div>\n      </li>\n    </ol>\n  </fieldset>\n</form>\n");
      });
    });

    test('#formFor(user) with errors', function() {
      var template;
      user.set("firstName", null);
      user.validate();
      assert.deepEqual(user.errors, {
        firstName: ['firstName can\'t be blank']
      });
      template = function() {
        return formFor(this.user, function(form) {
          return form.fieldset(function(fields) {
            return fields.field("firstName");
          });
        });
      };
      return view.render({
        template: template,
        locals: {
          user: user
        }
      }, function(error, result) {
        if (error) {
          throw error;
        }
        assert.equal(result, "<form action=\"/users/" + (user.get('id')) + "\" id=\"user-form\" role=\"form\" novalidate=\"true\" data-method=\"put\" method=\"post\">\n  <input type=\"hidden\" name=\"_method\" value=\"put\" />\n  <fieldset>\n    <ol class=\"fields\">\n      <li class=\"field control-group string optional\" id=\"user-first-name-field\">\n        <label for=\"user-first-name-input\" class=\"control-label\">\n          <span>First name</span>\n          <abbr title=\"Optional\" class=\"optional\">\n            \n          </abbr>\n        </label>\n        <div class=\"controls\">\n          <input type=\"text\" id=\"user-first-name-input\" name=\"user[firstName]\" class=\"string first-name optional input\" aria-required=\"false\" />\n        </div>\n      </li>\n    </ol>\n  </fieldset>\n</form>\n");
      });
    });

    test('#formFor(camelCasedModel)', function() {
      var model, template;
      model = App.CamelCasedModel.build({
        name: "something"
      });
      template = function() {
        return formFor(this.model, function(form) {
          return form.fieldset(function(fields) {
            return fields.field("name");
          });
        });
      };
      return view.render({
        template: template,
        locals: {
          model: model
        }
      }, function(error, result) {
        assert.equal(result, "<form action=\"/camel-cased-models\" id=\"camel-cased-model-form\" role=\"form\" novalidate=\"true\" data-method=\"post\" method=\"post\">\n  <input type=\"hidden\" name=\"_method\" value=\"post\" />\n  <fieldset>\n    <ol class=\"fields\">\n      <li class=\"field control-group string optional\" id=\"camel-cased-model-name-field\">\n        <label for=\"camel-cased-model-name-input\" class=\"control-label\">\n          <span>Name</span>\n          <abbr title=\"Optional\" class=\"optional\">\n            \n          </abbr>\n        </label>\n        <div class=\"controls\">\n          <input type=\"text\" id=\"camel-cased-model-name-input\" name=\"camelCasedModel[name]\" value=\"something\" class=\"string name optional input\" aria-required=\"false\" />\n        </div>\n      </li>\n    </ol>\n  </fieldset>\n</form>\n");
      });
    });
    /*
        describe 'ember', ->
          test 'string input', ->
            post = App.Post.build(title: 'A Post!', tags: ["ruby", "javascript"])
          
            template = ->
              formFor 'post', live: true, (form) ->
                form.fieldset (fields) ->
                  fields.field 'title', as: 'string'
          
            view.render template: template, locals: post: post, (error, result) ->
              console.log result
              throw error if error
              assert.equal result, """
    <form action="/posts" id="post-form" role="form" novalidate="true" data-method="post" method="post">
      <input type="hidden" name="_method" value="post" />
      <fieldset>
        <ol class="fields">
          <li class="field control-group string optional" id="post-title-field">
            <label for="post-title-input" class="control-label">
              <span>Title</span>
              <abbr title="Optional" class="optional">
                
              </abbr>
            </label>
            <div class="controls">
              <input type="text" id="post-title-input" name="post[title]" class="string title optional input" aria-required="false" />
            </div>
          </li>
        </ol>
      </fieldset>
    </form>
    
    """
    */

    describe('fields', function() {

      test('string', function() {
        var template;
        user = App.User.build({
          firstName: "Lance"
        });
        template = function() {
          return formFor(this.user, function(form) {
            return form.fieldset(function(fields) {
              return fields.field("firstName", {
                as: "string"
              });
            });
          });
        };
        return view.render({
          template: template,
          locals: {
            user: user
          }
        }, function(error, result) {
          if (error) {
            throw error;
          }
          assert.equal(result, "<form action=\"/users\" id=\"user-form\" role=\"form\" novalidate=\"true\" data-method=\"post\" method=\"post\">\n  <input type=\"hidden\" name=\"_method\" value=\"post\" />\n  <fieldset>\n    <ol class=\"fields\">\n      <li class=\"field control-group string optional\" id=\"user-first-name-field\">\n        <label for=\"user-first-name-input\" class=\"control-label\">\n          <span>First name</span>\n          <abbr title=\"Optional\" class=\"optional\">\n            \n          </abbr>\n        </label>\n        <div class=\"controls\">\n          <input type=\"text\" id=\"user-first-name-input\" name=\"user[firstName]\" value=\"Lance\" class=\"string first-name optional input\" aria-required=\"false\" />\n        </div>\n      </li>\n    </ol>\n  </fieldset>\n</form>\n");
        });
      });

      test('text', function() {
        var template;
        user = App.User.build({
          firstName: "Lance"
        });
        template = function() {
          return formFor(this.user, function(form) {
            return form.fieldset(function(fields) {
              return fields.field("firstName", {
                as: "text"
              });
            });
          });
        };
        return view.render({
          template: template,
          locals: {
            user: user
          }
        }, function(error, result) {
          if (error) {
            throw error;
          }
          assert.equal(result, "<form action=\"/users\" id=\"user-form\" role=\"form\" novalidate=\"true\" data-method=\"post\" method=\"post\">\n  <input type=\"hidden\" name=\"_method\" value=\"post\" />\n  <fieldset>\n    <ol class=\"fields\">\n      <li class=\"field control-group text optional\" id=\"user-first-name-field\">\n        <label for=\"user-first-name-input\" class=\"control-label\">\n          <span>First name</span>\n          <abbr title=\"Optional\" class=\"optional\">\n            \n          </abbr>\n        </label>\n        <div class=\"controls\">\n          <textarea id=\"user-first-name-input\" name=\"user[firstName]\" class=\"text first-name optional input\" aria-required=\"false\">Lance</textarea>\n        </div>\n      </li>\n    </ol>\n  </fieldset>\n</form>\n");
        });
      });

      test('array', function() {
        var post, template;
        post = App.Post.build({
          tags: ["ruby", "javascript"]
        });
        template = function() {
          return formFor(this.post, function(form) {
            return form.fieldset(function(fields) {
              return fields.field("tags", {
                as: "array"
              });
            });
          });
        };
        return view.render({
          template: template,
          locals: {
            post: post
          }
        }, function(error, result) {
          if (error) {
            throw error;
          }
          assert.equal(result, "<form action=\"/posts\" id=\"post-form\" role=\"form\" novalidate=\"true\" data-method=\"post\" method=\"post\">\n  <input type=\"hidden\" name=\"_method\" value=\"post\" />\n  <fieldset>\n    <ol class=\"fields\">\n      <li class=\"field control-group array optional\" id=\"post-tags-field\">\n        <label for=\"post-tags-input\" class=\"control-label\">\n          <span>Tags</span>\n          <abbr title=\"Optional\" class=\"optional\">\n            \n          </abbr>\n        </label>\n        <div class=\"controls\">\n          <input data-type=\"array\" id=\"post-tags-input\" name=\"post[tags]\" value=\"ruby, javascript\" class=\"array tags optional input\" aria-required=\"false\" />\n        </div>\n      </li>\n    </ol>\n  </fieldset>\n</form>\n");
        });
      });
    });
  });
  /*
          test 'date', ->
            post = new App.Post(createdAt: new Date())
          
            template = ->
              formFor @post, (form) ->
                form.fieldset (fields) ->
                  fields.field "createdAt", as: "date"
          
            view.render template: template, locals: post: post, (error, result) ->
              console.log result
              throw error if error
              assert.equal result, """
  
    """
  
          test 'time', ->
            post = new App.Post(createdAt: new Date())
          
            template = ->
              formFor @post, (form) ->
                form.fieldset (fields) ->
                  fields.field "createdAt", as: "time"
          
            view.render template: template, locals: post: post, (error, result) ->
              console.log result
              throw error if error
              assert.equal result, """
  
    """
  
          test 'datetime', ->
            post = new App.Post(createdAt: new Date())
          
            template = ->
              formFor @post, (form) ->
                form.fieldset (fields) ->
                  fields.field "createdAt", as: "datetime"
          
            view.render template: template, locals: post: post, (error, result) ->
              console.log result
              throw error if error
              assert.equal result, """
  
    """
  */

});
