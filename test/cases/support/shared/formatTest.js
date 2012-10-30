describe('Tower.SupportFormat', function() {
  describe('validation', function() {
    test('isPresent', function() {
      assert.isFalse(_.isPresent(null));
      assert.isFalse(_.isPresent(undefined));
      assert.isFalse(_.isPresent([]));
      assert.isFalse(_.isPresent({}));
      assert.isFalse(_.isPresent(""));
      assert.isTrue(_.isPresent("string"));
      assert.isTrue(_.isPresent(0));
      assert.isTrue(_.isPresent(new Date));
      assert.isTrue(_.isPresent(/asdf/));
      assert.isTrue(_.isPresent({
        key: "value"
      }));
      assert.isTrue(_.isPresent([1]));
    });
  });

  describe('casting', function() {
    test('toInt', function() {
      assert.equal(_.toInt('123'), 123);
    });

    test('toBoolean', function() {
      assert.equal(_.toBoolean('true'), true);
    });

    test('toFixed', function() {
      assert.equal(_.toFixed(0.615, 2), "0.62");
      assert.equal(0.615.toFixed(2), "0.61");
    });

    test('formatCurrency', function() {
      assert.equal(_.formatCurrency(12345678), '$12,345,678.00');
      assert.equal(_.formatCurrency(-500000, "£ ", 0), '£ -500,000');
    });

    test('formatNumber', function() {
      assert.equal(_.formatNumber(5318008), '5,318,008');
      assert.equal(_.formatNumber(9876543.21, 3, " "), '9 876 543.210');
    });

    test('unformatCurrency', function() {
      assert.equal(_.unformatCurrency("£ 12,345,678.90 GBP"), '12345678.9');
    });

    test('unformatCreditCard', function() {
      assert.equal(_.unformatCreditCard('4111 1111 1111 1111'), '4111111111111111');
    });

    test('formatBytes');
  });

  describe('dates', function() {
    test('now', function() {
      assert.deepEqual(_.now().toDate().getSeconds(), (new Date).getSeconds());
    });

    test('strftime', function() {
      assert.equal(_.strftime(_.now(), 'YYYY'), '2012');
      assert.equal(_.now().strftime('YYYY'), '2012');
    });

    test('toDate', function() {
      assert.equal(_.toDate("Dec 25, 1995").getFullYear(), 1995);
    });

    test('_(2).days().value()', function() {
      assert.equal(_(2).days().value(), 172800000);
    });

    test('_(3).days().ago().toHuman()', function() {
      assert.equal(_(3).days().ago().toHuman(), '3 days ago');
    });

    test('_(3).days().fromNow().toHuman()', function() {
      assert.equal(_(3).days().fromNow().toHuman(), 'in 3 days');
    });
  });

  describe('sanitizing', function() {
    test('ltrim', function() {
      assert.equal(_.ltrim('aaaaaaaaab', 'a'), 'b');
    });

    test('rtrim', function() {});

    test('entityDecode', function() {
      assert.equal(_.entityDecode('&lt;a&gt;'), '<a>');
    });
  });

  describe('validating', function() {
    test('isEmail', function() {
      assert.equal(_.isEmail('example@gmail.com'), true);
      assert.equal(_.isEmail('example.com'), false);
    });

    test('isWeakPassword', function() {
      assert.equal(_.isWeakPassword('sixchr'), true);
      assert.equal(_.isWeakPassword('foo'), false);
    });

    test('isMediumPassword', function() {
      assert.equal(_.isMediumPassword('chrs123'), true);
      assert.equal(_.isMediumPassword('sixchr'), false);
    });

    test('isStrongPassword', function() {
      assert.equal(_.isStrongPassword('HQSij2323#$%'), true);
      assert.equal(_.isStrongPassword('chrs123'), false);
    });

    test('isUrl', function() {});

    test('isIP', function() {});

    test('isAlphanumeric');

    test('isNumeric');

    test('isLowerCase');

    test('isUpperCase');

    test('isDecimal');

    test('isFloat');

    test('notNull');

    test('isNull');

    test('isCreditCard');

    test('isLuhn');

    test('isVisa', function() {
      assert.equal(_.isVisa('4012888888881881'), true);
      assert.equal(_.isVisa('4111111111111111'), true);
      assert.equal(_.isVisa('4222222222222'), false);
    });

    test('isMasterCard', function() {
      assert.equal(_.isMasterCard('5105105105105100'), true);
    });

    test('isDiscover', function() {
      assert.equal(_.isDiscover('6011000990139424'), true);
    });

    test('isAmex', function() {
      assert.equal(_.isAmex('371449635398431'), true);
    });

    test('isSwitch, isSolo', function() {
      assert.equal(_.isSwitch('6331101999990016'), true);
      assert.equal(_.isSwitch('isSolo'), true);
    });

    test('isDinersClub', function() {
      assert.equal(_.isDinersClub('30569309025904'), true);
    });

    test('isUUID');

    test('isPostalCode', function() {
      assert.equal(_.isPostalCode('91941'), true);
      assert.equal(_.isPostalCode('9194'), false);
      assert.equal(_.isPostalCode('91941-0912'), true);
    });

    test('isPhone', function() {
      assert.equal(_.isPhone('1234567890'), true);
      assert.equal(_.isPhone('(123) 456-7890'), true);
      assert.equal(_.isPhone('123.456.7890'), true);
      assert.equal(_.isPhone('123-456-7890'), true);
      assert.equal(_.isPhone('123456789'), false);
    });

    test('isPhone(format: "us")', function() {
      assert.equal(_.isPhone('1234567890', {
        format: 'us'
      }), true);
      assert.equal(_.isPhone('(123) 456-7890', {
        format: 'us'
      }), true);
      assert.equal(_.isPhone('12 34 56 78 90', {
        format: 'us'
      }), false);
    });

    test('isSlug', function() {
      assert.equal(_.isSlug('a-slug'), true);
      assert.equal(_.isSlug('a slug'), false);
    });

    test('isDate', function() {
      assert.equal(_.isDate(new Date), true);
    });

    test('isDateISO');

    test('isDigits');

    test('isAccept', function() {
      assert.equal(_.isAccept('.xls', 'xls|csv'), true);
      assert.equal(_.isAccept('xls', 'xls|csv'), false);
    });
  });

  describe('inflection', function() {
    test('pluralize', function() {
      assert.equal(_.pluralize("entry"), "entries");
      assert.equal(_.pluralize("address"), "addresses");
      assert.equal(_.pluralize("business"), "businesses");
      assert.equal(_.pluralize("people"), "people");
      assert.equal(_.pluralize("person"), "people");
    });

    test('singularize', function() {
      assert.equal(_.singularize("businesses"), "business");
      assert.equal(_.singularize("people"), "person");
      assert.equal(_.singularize("person"), "person");
      assert.equal(_.singularize("address"), "address");
    });
  });
});
