const assert = require('chai').assert;
const mockery = require('mockery');
const sinon = require('sinon');

describe('slack api', function() {
    let slackClient, spy;
    beforeEach(function() {
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
    afterEach(function() {
        mockery.disable();
    });
    it('sends slack message adding @ on the recipient', function() {
        const slack = require('../../src/lib/slack_api_utils');
        slack.sendSlackMessage('lorenzo.fundaro', 'Hello !');
        assert.isTrue(spy.calledWithMatch('@lorenzo.fundaro' ));
    });
    it('skips duplicated slack messages to the same user', function() {
        const slack = require('../../src/lib/slack_api_utils');
        slack.sendSlackMessage('lorenzo.fundaro', 'This will be sent once');
        slack.sendSlackMessage('lorenzo.fundaro', 'This will be sent once');
        assert.isTrue(spy.calledOnce);
    });
    it('does not skip duplicated slack messages to different users', function() {
        const slack = require('../../src/lib/slack_api_utils');
        slack.sendSlackMessage('lorenzo.fundaro', 'This will be sent twice');
        slack.sendSlackMessage('tbillet', 'This will be sent twice');
        assert.isTrue(spy.calledTwice);
    });
});