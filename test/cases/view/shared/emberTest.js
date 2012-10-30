describe('Tower Ember View rendering', function() {
  var view;

  before(function() {
    require(process.cwd() + '/packages/tower-view/client/emberHelper');
    
    Ember.TEMPLATES['some'] = function() {
      return 'some!';
    };

    Ember.TEMPLATES['another/path'] = function() {
      return 'another/path!';
    };

    Ember.TEMPLATES['computed/template'] = Ember.computed(function() {
      return 'computed/template!';
    });
  });

  beforeEach(function() {
    view = new Tower.View;
  });

  test('#_connectOutletOptions', function() {
    assert.deepEqual(view._connectOutletOptions({}), {
      outletName: 'view',
      viewClass: undefined,
      controller: {}
    });
  });

  test('#_getEmberTemplate', function() {
    assert.equal(view._getEmberTemplate('computed/template'), 'computed/template!');
  });

  test('#renderEmberView', function() {});
});
