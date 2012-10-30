describe('Tower.ViewTable', function() {
  var template, user, view;

  beforeEach(function() {
    view = new Tower.View;
    user = new App.User({
      id: 1,
      firstName: "Lance"
    });
  });

  test('#tableFor("users")', function() {
    template = function() {
      return tableFor("users");
    };
    
    view.render({template: template}, function(error, result) {
      if (error) {
        throw error;
      }
      assert.equal(result, '<table summary="Table for Users" role="grid" class="table">\n</table>\n');
    });
  });

  test('#tableFor("users") with thead', function() {
    var template;
    template = function() {
      return tableFor("users", function(t) {
        return t.head(function() {});
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      if (error) {
        throw error;
      }
      assert.equal(result, '<table summary="Table for Users" role="grid" class="table">\n  <thead>\n  </thead>\n</table>\n');
    });
  });

  test('#tableFor("users") with thead and header rows', function() {
    var template;
    template = function() {
      return tableFor("users", function(t) {
        return t.head(function() {
          return t.row(function() {
            t.header("Header A");
            return t.header("Header B", {
              abbr: "HB"
            });
          });
        });
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      if (error) {
        throw error;
      }
      assert.equal(result, '<table summary="Table for Users" role="grid" class="table">\n  <thead>\n    <tr scope="row">\n      <th abbr="Header A" role="columnheader" scope="col" aria-sort="none">\n        <span>Header A</span>\n      </th>\n      <th abbr="HB" role="columnheader" scope="col" aria-sort="none">\n        <span>Header B</span>\n      </th>\n    </tr>\n  </thead>\n</table>\n');
    });
  });

  test('#tableFor("users") with sorting', function() {
    var template;
    template = function() {
      return tableFor("users", function(t) {
        return t.head(function() {
          return t.row(function() {
            t.header("Header A", {
              sort: true
            });
            return t.header("Header B");
          });
        });
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      if (error) {
        throw error;
      }
      assert.equal(result, '<table summary="Table for Users" role="grid" class="table">\n  <thead>\n    <tr scope="row">\n      <th abbr="Header A" role="columnheader" scope="col" class="sortable asc" aria-sort="asc" aria-selected="aria-selected">\n        <a href="?sort=+">\n          <span>Header A</span>\n        </a>\n      </th>\n      <th abbr="Header B" role="columnheader" scope="col" aria-sort="none">\n        <span>Header B</span>\n      </th>\n    </tr>\n  </thead>\n</table>\n');
    });
  });

  test('#tableFor("users") with body', function() {
    var template;
    template = function() {
      return tableFor("users", function(t) {
        return t.body(function() {
          return t.row(function() {
            t.cell("Cell A");
            return t.cell("Cell B");
          });
        });
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      if (error) {
        throw error;
      }
      assert.equal(result, '<table summary="Table for Users" role="grid" class="table">\n  <tbody>\n    <tr scope="row" role="row">\n      <td role="gridcell">Cell A</td>\n      <td role="gridcell">Cell B</td>\n    </tr>\n  </tbody>\n</table>\n');
    });
  });

  test('#tableFor("users") with footer', function() {
    var template;
    template = function() {
      return tableFor("users", function(t) {
        return t.foot(function() {
          return t.row(function() {
            t.cell("Cell A");
            return t.cell("Cell B");
          });
        });
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      if (error) {
        throw error;
      }
      assert.equal(result, '<table summary="Table for Users" role="grid" class="table">\n  <tfoot>\n    <tr scope="row">\n      <td role="gridcell">Cell A</td>\n      <td role="gridcell">Cell B</td>\n    </tr>\n  </tfoot>\n</table>\n');
    });
  });

  test('#tableFor("users") with head, body, and foot', function() {
    var template;
    template = function() {
      return tableFor("users", function(t) {
        t.head(function() {
          return t.row(function() {
            t.header("Header A");
            return t.header("Header B");
          });
        });
        t.body(function() {
          return t.row(function() {
            t.cell("Cell A");
            return t.cell("Cell B");
          });
        });
        return t.foot(function() {
          return t.row(function() {
            t.cell("Cell A");
            return t.cell("Cell B");
          });
        });
      });
    };
    return view.render({
      template: template
    }, function(error, result) {
      if (error) {
        throw error;
      }
      assert.equal(result, '<table summary="Table for Users" role="grid" class="table">\n  <thead>\n    <tr scope="row">\n      <th abbr="Header A" role="columnheader" scope="col" aria-sort="none">\n        <span>Header A</span>\n      </th>\n      <th abbr="Header B" role="columnheader" scope="col" aria-sort="none">\n        <span>Header B</span>\n      </th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr scope="row" role="row">\n      <td role="gridcell">Cell A</td>\n      <td role="gridcell">Cell B</td>\n    </tr>\n  </tbody>\n  <tfoot>\n    <tr scope="row">\n      <td role="gridcell">Cell A</td>\n      <td role="gridcell">Cell B</td>\n    </tr>\n  </tfoot>\n</table>\n');
    });
  });
});
