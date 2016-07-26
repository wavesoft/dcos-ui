jest.dontMock('../ValidatorUtil');

describe('ValidatorUtil', function () {
  var ValidatorUtil = require('../ValidatorUtil');

  describe('#isEmail', function () {

    // RFC822 email address validator
    // http://sphinx.mythic-beasts.com/~pdw/cgi-bin/emailvalidate?address=

    it('should have at least an username, an @ and one peroid', function () {
      expect(ValidatorUtil.isEmail('user@foo.bar')).toBe(true);
      expect(ValidatorUtil.isEmail('Abc.123@example.com')).toBe(true);
      expect(
        ValidatorUtil.isEmail('!#$%&\'*+-/=?^_`.{|}~@example.com')
      ).toBe(true);
      expect(ValidatorUtil.isEmail('"Abc@def"@example.com')).toBe(true);
      expect(
        ValidatorUtil.isEmail('user+mailbox/department=shipping@example.com')
      ).toBe(true);
      expect(ValidatorUtil.isEmail('"Joe.\\Blow"@example.com')).toBe(true);
    });

    it('should have an @', function () {
      expect(ValidatorUtil.isEmail('foobar')).toBe(false);
      expect(ValidatorUtil.isEmail('userfoo.bar')).toBe(false);
    });

    it('should have an username', function () {
      expect(ValidatorUtil.isEmail('@foo.bar')).toBe(false);
      expect(ValidatorUtil.isEmail('user@foo.bar')).toBe(true);
    });

    it('should have at least one peroid after @', function () {
      expect(ValidatorUtil.isEmail('user@foobar')).toBe(false);
      expect(ValidatorUtil.isEmail('Abc.123@examplecom')).toBe(false);
      expect(ValidatorUtil.isEmail('user@foo.bar')).toBe(true);
      expect(ValidatorUtil.isEmail('user@baz.foo.bar')).toBe(true);
    });

    it('should treat IDN emails as valid', function () {
      expect(ValidatorUtil.isEmail('伊昭傑@郵件.商務')).toBe(true);
      expect(ValidatorUtil.isEmail('θσερ@εχαμπλε.ψομ')).toBe(true);
      expect(ValidatorUtil.isEmail('test@könig.de')).toBe(true);
      expect(ValidatorUtil.isEmail('伊昭傑郵件.商務')).toBe(false);
      expect(ValidatorUtil.isEmail('θσερ@εχαμπλεψομ')).toBe(false);
      expect(ValidatorUtil.isEmail('@könig.de')).toBe(false);
    });

    it('should treat long unknown TLDs as valid', function () {
      expect(ValidatorUtil.isEmail('user@foobar.hamburg')).toBe(true);
      expect(ValidatorUtil.isEmail('user@foobar.københavn')).toBe(true);
      expect(
        ValidatorUtil.isEmail(
          'test@asdf.com.asd.fasd.f.asdf.asd.fa.xn--sdf-x68do18h'
        )
      ).toBe(true);
    });

    it('shouldn\'t have whitespaces', function () {
      expect(ValidatorUtil.isEmail('"Fred Bloggs"@example.com')).toBe(false);
      expect(ValidatorUtil.isEmail('user@f o o.om')).toBe(false);
      expect(ValidatorUtil.isEmail('  user  @foo.com')).toBe(false);
    });

  });

  describe('#isEmpty', function () {

    it('should return false if it receives a number', function () {
      expect(ValidatorUtil.isEmpty(0)).toBe(false);
      expect(ValidatorUtil.isEmpty(-100)).toBe(false);
      expect(ValidatorUtil.isEmpty(20)).toBe(false);
    });

    it('should return false if it receives a boolean', function () {
      expect(ValidatorUtil.isEmpty(false)).toBe(false);
      expect(ValidatorUtil.isEmpty(true)).toBe(false);
    });

    it('should return true if it receives undefined or null', function () {
      expect(ValidatorUtil.isEmpty()).toBe(true);
      expect(ValidatorUtil.isEmpty(undefined)).toBe(true);
      expect(ValidatorUtil.isEmpty(null)).toBe(true);
    });

    it('should return true if it receives an empty array', function () {
      expect(ValidatorUtil.isEmpty([])).toBe(true);
    });

    it('should return false if it receives array with items', function () {
      expect(ValidatorUtil.isEmpty([0])).toBe(false);
      expect(ValidatorUtil.isEmpty([{}])).toBe(false);
    });

    it('should return true if it receives an empty object', function () {
      expect(ValidatorUtil.isEmpty({})).toBe(true);
    });

    it('should return false if it receives an object with keys', function () {
      expect(ValidatorUtil.isEmpty({foo: 'bar', baz: 'qux'})).toBe(false);
    });

    it('should return false if it receives a string', function () {
      expect(ValidatorUtil.isEmpty('foo')).toBe(false);
    });

  });

  describe('#isNumberInRange', function () {
    it('should properly handle empty strings', function () {
      expect(ValidatorUtil.isNumberInRange('')).toBe(false);
    });

    it('should properly handle  undefined values', function () {
      expect(ValidatorUtil.isNumberInRange()).toBe(false);
    });

    it('should properly handle wrong value types', function () {
      expect(ValidatorUtil.isNumberInRange('not a number 666'))
        .toBe(false);
    });

    it('should handle number like inputs', function () {
      expect(ValidatorUtil.isNumberInRange(0.001)).toBe(true);
      expect(ValidatorUtil.isNumberInRange('0.0001')).toBe(true);
      expect(ValidatorUtil.isNumberInRange(-.1)).toBe(false);
      expect(ValidatorUtil.isNumberInRange('-.1')).toBe(false);
      expect(ValidatorUtil.isNumberInRange(2)).toBe(true);
      expect(ValidatorUtil.isNumberInRange('2')).toBe(true);
    });

    it('should verify that the value is in the default range (0 - infinity)',
      function () {
        expect(ValidatorUtil.isNumberInRange(-1)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(1)).toBe(true);
      }
    );

    it('should verify that the value is in the range (0 - `max`)',
      function () {
        const range = {max: 4};

        expect(ValidatorUtil.isNumberInRange(-1, range)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(5, range)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(4, range)).toBe(true);
      }
    );

    it('should verify that the value is in the range (`min` - infinity)',
      function () {
        const range = {min: 2};

        expect(ValidatorUtil.isNumberInRange(0, range)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(1, range)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(2, range)).toBe(true);
      }
    );

    it('should verify that the value is in the range (`min` - `max`)',
      function () {
        const range = {min: 3, max: 5};

        expect(ValidatorUtil.isNumberInRange(0, range)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(2, range)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(6, range)).toBe(false);
        expect(ValidatorUtil.isNumberInRange(3, range)).toBe(true);
        expect(ValidatorUtil.isNumberInRange(4, range)).toBe(true);
        expect(ValidatorUtil.isNumberInRange(5, range)).toBe(true);
      }
    );

  });

});
