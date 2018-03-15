const assert = require('chai').assert;
const mockery = require('mockery');
const sinon = require('sinon');

describe('slack api', function() {
    let slackClient, spy;
    before(function() {
        mockery.enable({
            useCleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        spy = sinon.spy();
        slackClient = { chat: {postMessage: spy}};
        const mockedFactory = { getSlackApiClient: () => {return slackClient;}};
        mockery.registerMock('./slack_client_factory.js', mockedFactory);
    });
    after(function() {
        mockery.disable();
    });
    it('sends slack message adding @ on the recipient', function() {
        const slack = require('../../src/lib/slack_api_utils');
        slack.sendSlackMessage('lorenzo.fundaro', 'Hello !');
        assert.isTrue(spy.calledWithMatch('@lorenzo.fundaro' ));
    });
});