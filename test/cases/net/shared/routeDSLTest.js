
describe("Tower.RouteDSL", function() {

  describe("route", function() {
    it("should match routes with keys", function() {
      var match, route;
      route = new Tower.Route({
        path: "/users/:id/:tag"
      });
      match = route.match("/users/10/symbols");
      assert.equal(match[1], "10");
      assert.equal(match[2], "symbols");
    });
    it("should match routes with splats", function() {
      var match, route;
      route = new Tower.Route({
        path: "/users/:id/*categories"
      });
      match = route.match("/users/10/one/two/three");
      assert.equal(match[1], "10");
      assert.equal(match[2], "one/two/three");
      assert.deepEqual(route.keys[0], {
        name: 'id',
        optional: false,
        splat: false
      });
      assert.deepEqual(route.keys[1], {
        name: 'categories',
        optional: false,
        splat: true
      });
    });
    it("should match routes with optional splats", function() {
      var match, route;
      route = new Tower.Route({
        path: "/users/:id(/*categories)"
      });
      match = route.match("/users/10/one/two/three");
      assert.equal(match[1], "10");
      assert.equal(match[2], "one/two/three");
      assert.deepEqual(route.keys[0], {
        name: 'id',
        optional: false,
        splat: false
      });
      assert.deepEqual(route.keys[1], {
        name: 'categories',
        optional: true,
        splat: true
      });
    });
    return it("should match routes with optional formats", function() {
      var match, route;
      route = new Tower.Route({
        path: "/users/:id.:format?"
      });
      match = route.match("/users/10.json");
      assert.equal(match[1], "10");
      assert.equal(match[2], "json");
      assert.deepEqual(route.keys[0], {
        name: 'id',
        optional: false,
        splat: false
      });
      assert.deepEqual(route.keys[1], {
        name: 'format',
        optional: true,
        splat: false
      });
    });
  });

  describe("mapper", function() {
    beforeEach(function() {
      Tower.Route.clear();
      Tower.Route.draw(function() {
        this.match("/login", {
          to: "sessions#new",
          via: "get",
          as: "login",
          defaults: {
            flow: "signup"
          },
          constraints: {
            subdomain: /www/
          }
        });
        this.match("/users", {
          to: "users#index",
          via: "get"
        });
        this.match("/users/:id/edit", {
          to: "users#edit",
          via: "get"
        });
        this.match("/users/:id", {
          to: "users#show",
          via: "get"
        });
        this.match("/users", {
          to: "users#create",
          via: "post"
        });
        this.match("/users/:id", {
          to: "users#update",
          via: "put"
        });
        return this.match("/users/:id", {
          to: "users#destroy",
          via: "delete"
        });
      });
    });
    it("should map", function() {
      var route, routes;
      routes = Tower.Route.all();
      assert.equal(routes.length, 7.);
      route = routes[0];
      assert.equal(route.path, "/login.:format?");
      assert.equal(route.controller.name, "SessionsController");
      assert.equal(route.controller.className, "SessionsController");
      assert.equal(route.controller.action, "new");
      assert.equal(route.methods[0], "GET");
      assert.equal(route.name, "login");
      assert.deepEqual(route.defaults, {
        flow: "signup"
      });
    });
    return it("should be found in the router", function() {
      var controller, request, router;
      router = Tower.MiddlewareRouter;
      request = {
        method: "get",
        url: "http://www.local.host:3000/login",
        header: function() {}
      };
      return controller = router.find(request, {}, function(controller) {
        assert.deepEqual(request.params, {
          flow: 'signup',
          format: "html",
          action: 'new'
        });
        assert.deepEqual(controller.params, {
          flow: 'signup',
          format: "html",
          action: 'new'
        });
      });
    });
  });

  describe('resources', function() {
    beforeEach(function() {
      Tower.Route.clear();
      Tower.Route.draw(function() {
        this.resource("user");
        this.resources("posts", function() {
          return this.resources("comments");
        });
        return this.namespace("admin", function() {
          return this.resources("posts", function() {
            this.resources("comments");
            this.member(function() {
              return this.get("dashboard");
            });
            this.collection(function() {
              return this.get("dashboard");
            });
            return this.resource("description");
          });
        });
      });
    });
    it('should have single resource routes', function() {
      var routes;
      routes = Tower.Route.all().slice(0, 6);
      assert.equal(routes[0].path, "/user/new.:format?");
      assert.equal(routes[1].path, "/user.:format?");
      assert.equal(routes[2].path, "/user.:format?");
      assert.equal(routes[3].path, "/user/edit.:format?");
      assert.equal(routes[4].path, "/user.:format?");
      assert.equal(routes[5].path, "/user.:format?");
    });
    it('should have multiple resource routes', function() {
      var routes;
      routes = Tower.Route.all().slice(6, 14);
      assert.equal(routes[0].path, "/posts.:format?");
      assert.equal(routes[0].methods[0], "GET");
      assert.equal(routes[0].name, "posts");
      assert.equal(routes[1].path, "/posts/new.:format?");
      assert.equal(routes[1].methods[0], "GET");
      assert.equal(routes[2].path, "/posts.:format?");
      assert.equal(routes[2].methods[0], "POST");
      assert.equal(routes[3].path, "/posts/:id.:format?");
      assert.equal(routes[3].methods[0], "GET");
      assert.equal(routes[4].path, "/posts/:id/edit.:format?");
      assert.equal(routes[4].methods[0], "GET");
      assert.equal(routes[5].path, "/posts/:id.:format?");
      assert.equal(routes[5].methods[0], "PUT");
      assert.equal(routes[6].path, "/posts/:id.:format?");
      assert.equal(routes[6].methods[0], "DELETE");
    });
    it('should have nested routes', function() {
      var route, routes;
      routes = Tower.Route.all().slice(13, 21);
      route = routes[0];
      assert.equal(route.name, "postComments");
      assert.equal(route.path, "/posts/:postId/comments.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[1];
      assert.equal(route.name, "newPostComment");
      assert.equal(route.path, "/posts/:postId/comments/new.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[2];
      assert.equal(route.name, null);
      assert.equal(route.path, "/posts/:postId/comments.:format?");
      assert.equal(route.methods[0], "POST");
      route = routes[3];
      assert.equal(route.name, "postComment");
      assert.equal(route.path, "/posts/:postId/comments/:id.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[4];
      assert.equal(route.name, "editPostComment");
      assert.equal(route.path, "/posts/:postId/comments/:id/edit.:format?");
      assert.equal(route.methods[0], "GET");
    });
    it('should have namespaces', function() {
      var route, routes;
      routes = Tower.Route.all().slice(20, 27);
      route = routes[0];
      assert.equal(route.name, "adminPosts");
      assert.equal(route.path, "/admin/posts.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[1];
      assert.equal(route.name, "newAdminPost");
      assert.equal(route.path, "/admin/posts/new.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[3];
      assert.equal(route.name, "adminPost");
      assert.equal(route.path, "/admin/posts/:id.:format?");
      assert.equal(route.methods[0], "GET");
    });
    it('should have namespaces with nesting', function() {
      var route, routes;
      routes = Tower.Route.all().slice(27, 33);
      route = routes[0];
      assert.equal(route.name, "adminPostComments");
      assert.equal(route.path, "/admin/posts/:postId/comments.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[1];
      assert.equal(route.name, "newAdminPostComment");
      assert.equal(route.path, "/admin/posts/:postId/comments/new.:format?");
      assert.equal(route.methods[0], "GET");
      assert.equal(route.urlFor({
        postId: 8
      }), "/admin/posts/8/comments/new");
    });
    return it("should allow singleton resources to be nested", function() {
      var editRoute, newRoute, routes, showRoute;
      routes = Tower.Route.all();
      newRoute = routes[routes.length - 6];
      assert.equal(newRoute.name, "newAdminPostDescription");
      assert.equal(newRoute.path, "/admin/posts/:postId/description/new.:format?");
      assert.equal(newRoute.methods[0], "GET");
      showRoute = routes[routes.length - 4];
      assert.equal(showRoute.name, "adminPostDescription");
      assert.equal(showRoute.path, "/admin/posts/:postId/description.:format?");
      assert.equal(showRoute.methods[0], "GET");
      editRoute = routes[routes.length - 3];
      assert.equal(editRoute.name, "editAdminPostDescription");
      assert.equal(editRoute.path, "/admin/posts/:postId/description/edit.:format?");
      assert.equal(editRoute.methods[0], "GET");
    });
  });

  describe("dsl", function() {
    beforeEach(function() {
      Tower.Route.clear();
      Tower.Route.draw(function() {
        this.match("/login", {
          to: "sessions#new",
          via: "get",
          as: "login",
          defaults: {
            flow: "signup"
          },
          constraints: {
            subdomain: /www/
          }
        });
        this.match("/users", {
          to: "users#index",
          via: "get"
        });
        this.match("/users/:id/edit", {
          to: "users#edit",
          via: "get"
        });
        this.match("/users/:id", {
          to: "users#show",
          via: "get"
        });
        this.match("/users", {
          to: "users#create",
          via: "post"
        });
        this.match("/users/:id", {
          to: "users#update",
          via: "put"
        });
        return this.match("/users/:id", {
          to: "users#destroy",
          via: "delete"
        });
      });
    });
    it("should map", function() {
      var route, routes;
      routes = Tower.Route.all();
      assert.equal(routes.length, 7);
      route = routes[0];
      assert.equal(route.path, "/login.:format?");
      assert.equal(route.controller.name, "SessionsController");
      assert.equal(route.controller.className, "SessionsController");
      assert.equal(route.controller.action, "new");
      assert.equal(route.methods[0], "GET");
      assert.equal(route.name, "login");
      assert.deepEqual(route.defaults, {
        flow: "signup"
      });
    });
    return it("should be found in the router", function() {
      var controller, request, router;
      router = Tower.MiddlewareRouter;
      request = {
        method: "get",
        url: "http://www.local.host:3000/login",
        header: function() {}
      };
      return controller = router.find(request, {}, function(controller) {
        assert.deepEqual(request.params, {
          flow: 'signup',
          format: "html",
          action: 'new'
        });
        assert.deepEqual(controller.params, {
          flow: 'signup',
          format: "html",
          action: 'new'
        });
      });
    });
  });

  describe('resources', function() {
    beforeEach(function() {
      Tower.Route.clear();
      Tower.Route.draw(function() {
        this.resource("user");
        this.resources("posts", function() {
          return this.resources("comments");
        });
        return this.namespace("admin", function() {
          return this.resources("posts", function() {
            this.resources("comments");
            this.member(function() {
              return this.get("dashboard");
            });
            return this.collection(function() {
              return this.get("dashboard");
            });
          });
        });
      });
    });
    it('should have single resource routes', function() {
      var routes;
      routes = Tower.Route.all().slice(0, 6);
      assert.equal(routes[0].path, "/user/new.:format?");
      assert.equal(routes[1].path, "/user.:format?");
      assert.equal(routes[2].path, "/user.:format?");
      assert.equal(routes[3].path, "/user/edit.:format?");
      assert.equal(routes[4].path, "/user.:format?");
      assert.equal(routes[5].path, "/user.:format?");
    });
    it('should have multiple resource routes', function() {
      var routes;
      routes = Tower.Route.all().slice(6, 14);
      assert.equal(routes[0].path, "/posts.:format?");
      assert.equal(routes[0].methods[0], "GET");
      assert.equal(routes[0].name, "posts");
      assert.equal(routes[1].path, "/posts/new.:format?");
      assert.equal(routes[1].methods[0], "GET");
      assert.equal(routes[2].path, "/posts.:format?");
      assert.equal(routes[2].methods[0], "POST");
      assert.equal(routes[3].path, "/posts/:id.:format?");
      assert.equal(routes[3].methods[0], "GET");
      assert.equal(routes[4].path, "/posts/:id/edit.:format?");
      assert.equal(routes[4].methods[0], "GET");
      assert.equal(routes[5].path, "/posts/:id.:format?");
      assert.equal(routes[5].methods[0], "PUT");
      assert.equal(routes[6].path, "/posts/:id.:format?");
      assert.equal(routes[6].methods[0], "DELETE");
    });
    it('should have nested routes', function() {
      var route, routes;
      routes = Tower.Route.all().slice(13, 21);
      route = routes[0];
      assert.equal(route.name, "postComments");
      assert.equal(route.path, "/posts/:postId/comments.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[1];
      assert.equal(route.name, "newPostComment");
      assert.equal(route.path, "/posts/:postId/comments/new.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[2];
      assert.equal(route.name, null);
      assert.equal(route.path, "/posts/:postId/comments.:format?");
      assert.equal(route.methods[0], "POST");
      route = routes[3];
      assert.equal(route.name, "postComment");
      assert.equal(route.path, "/posts/:postId/comments/:id.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[4];
      assert.equal(route.name, "editPostComment");
      assert.equal(route.path, "/posts/:postId/comments/:id/edit.:format?");
      assert.equal(route.methods[0], "GET");
    });
    it('should have namespaces', function() {
      var route, routes;
      routes = Tower.Route.all().slice(20, 27);
      route = routes[0];
      assert.equal(route.name, "adminPosts");
      assert.equal(route.path, "/admin/posts.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[1];
      assert.equal(route.name, "newAdminPost");
      assert.equal(route.path, "/admin/posts/new.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[3];
      assert.equal(route.name, "adminPost");
      assert.equal(route.path, "/admin/posts/:id.:format?");
      assert.equal(route.methods[0], "GET");
    });
    return it('should have namespaces with nesting', function() {
      var route, routes;
      routes = Tower.Route.all().slice(27, 33);
      route = routes[0];
      assert.equal(route.name, "adminPostComments");
      assert.equal(route.path, "/admin/posts/:postId/comments.:format?");
      assert.equal(route.methods[0], "GET");
      route = routes[1];
      assert.equal(route.name, "newAdminPostComment");
      assert.equal(route.path, "/admin/posts/:postId/comments/new.:format?");
      assert.equal(route.methods[0], "GET");
      assert.equal(route.urlFor({
        postId: 8
      }), "/admin/posts/8/comments/new");
    });
  });

  describe('url builder', function() {
    return it('should build a url from a model class', function() {
      var url;
      return url = Tower.urlFor;
    });
  });

  describe('namespace', function() {});

  test('root');
});

/*  
  describe 'states', ->
    beforeEach ->
      Tower.Route.clear()
      
    test 'explicit paths like /login and /some/path', ->
      Tower.Route.draw ->
        @match '/login', to: 'sessions#create', as: 'login'
        @match '/logout', to: 'sessions#destroy', as: 'logout'
        
        @match '/some/path', to: 'sessions#update'

      assert.equal Tower.stateManager.get('currentState.name'), 'root'
      
      Tower.stateManager.goToState('login')
      
      assert.equal Tower.stateManager.get('currentState.name'), 'login'
      
      Tower.stateManager.goToState('some.path')
      
      assert.equal Tower.stateManager.get('currentState.name'), 'path'
      assert.equal Tower.stateManager.get('currentState.path'), 'some.path'
      
    test 'resourceful routes', ->
      Tower.Route.draw ->
        @resources 'posts'

      Tower.stateManager.goToState('posts.index')
      assert.equal Tower.stateManager.get('currentState.path'), 'posts.index'

      Tower.stateManager.goToState('posts.new')
      assert.equal Tower.stateManager.get('currentState.path'), 'posts.new'

      Tower.stateManager.goToState('posts.create')
      assert.equal Tower.stateManager.get('currentState.path'), 'posts.create'
*/

