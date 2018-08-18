const { formatUser } = require('../../src/lib/pr_utils');
const expect = require('chai').expect;

describe('pr utilities', function() {
  var userMap;
  afterEach(function() {
    userMap = {};
  });
  it('it returns user in slack format when present in users map', function() {
    userMap = { foo: { id: 'ABC1234', display_name: 'foo.bar' } };
    const formatted = formatUser('foo', userMap);
    expect(formatted).to.be.equal('<@foo.bar>');
  });
  it('it returns unformatted user when not present in users map', function() {
    const formatted = formatUser('snoopy', userMap);
    expect(formatted).to.be.equal('snoopy');
  });
});
