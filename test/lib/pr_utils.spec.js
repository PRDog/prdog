const {formatUser} = require('../../src/lib/pr_utils');
const expect = require('chai').expect;

describe('pr utilities', function() {
    let userMap = new Map();
    afterEach(function() {
        userMap.clear();
    });
    it('it returns user in slack format when present in users map', function() {
        userMap.set('lfundaro', 'lorenzo.fundaro');
        const formatted = formatUser('lfundaro', userMap);
        expect(formatted).to.be.equal('<@lorenzo.fundaro>');
    });
    it('it returns unformatted user when not present in users map', function() {
        const formatted = formatUser('snoopy', userMap);
        expect(formatted).to.be.equal('snoopy');
    });
});