if (Tower.isClient || Tower.store.className() === 'Memory') {
  describe("Tower.Geo", function() {
    var address, coordinates, placeCoordinates, places;

    places = {
      "Brandenburg Gate, Berlin": {
        lat: 52.516272,
        lng: 13.377722
      },
      "Dortmund U-Tower": {
        lat: 51.515,
        lng: 7.453619
      },
      "London Eye": {
        lat: 51.503333,
        lng: -0.119722
      },
      "Kremlin, Moscow": {
        lat: 55.751667,
        lng: 37.617778
      },
      "Eiffel Tower, Paris": {
        lat: 48.8583,
        lng: 2.2945
      },
      "Riksdag building, Stockholm": {
        lat: 59.3275,
        lng: 18.0675
      },
      "Royal Palace, Oslo": {
        lat: 59.916911,
        lng: 10.727567
      }
    };

    coordinates = {
      paris: places["Eiffel Tower, Paris"],
      moscow: places["Kremlin, Moscow"],
      london: places["London Eye"]
    };

    placeCoordinates = coordinates.paris;

    describe('units', function() {
      test('miles', function() {});
    });

    describe('Address.coordinates', function() {
      beforeEach(function() {
        address = App.Address.build();
      });

      test('field.type', function() {
        var field = App.Address.fields().coordinates;
        assert.equal(field.type, "Geo");
      });

      test('serialize from object', function() {
        address.set('coordinates', coordinates.paris);
        assert.deepEqual(address.get('coordinates'), {
          lat: 48.8583,
          lng: 2.2945
        });
      });

      test('serialize from array', function() {
        address.set('coordinates', [48.8583, 2.2945]);
        assert.deepEqual(address.get('coordinates'), {
          lat: 48.8583,
          lng: 2.2945
        });
      });

      test('serialize from string', function() {
        address.set('coordinates', "48.8583,2.2945");
        assert.deepEqual(address.get('coordinates'), {
          lat: 48.8583,
          lng: 2.2945
        });
      });
    });

    describe('persistence', function() {
      beforeEach(function(done) {
        var data, iterator, name, _placeCoordinates;
        data = [];
        for (name in places) {
          _placeCoordinates = places[name];
          data.push(_placeCoordinates);
        }
        iterator = function(coordinates, next) {
          App.Address.insert({coordinates: coordinates}, next);
        };
        async.forEachSeries(data, iterator, done);
      });

      test('near', function(done) {
        App.Address.near({lat: placeCoordinates.lat, lng: placeCoordinates.lng}).all(function(error, records) {
          assert.equal(records.length, 7);
          done();
        });
      });

      describe('within', function() {
        test('within(5)', function(done) {
          App.Address.near({lat: placeCoordinates.lat, lng: placeCoordinates.lng}).within(5).all(function(error, records) {
            assert.equal(records.length, 1);
            assert.deepEqual(records[0].get('coordinates'), placeCoordinates);
            done();
          });
        });

        test('within(5, "miles")');

        test('within(distance: 5, unit: "miles")');
      });
    });
  });
}
