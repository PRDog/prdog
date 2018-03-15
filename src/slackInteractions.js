const {createMessageAdapter} = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const { updateMessage, sendSlackMessage } = require('./lib/slack_api_utils');
const Mustache = require('mustache');
const templates = require('./lib/templates.js').loadTemplates();

const actions = {
    requestReviewNotify: 'REQUEST_REVIEW_NOTIFY',
};

slackInteractions.action(actions.requestReviewNotify, async (payload) => {
    const replacement = payload.original_message.attachments[0];
    //delete all actions
    delete replacement.actions;
    replacement.actions = [{
        name: "review action",
        text: "Notified :white_check_mark:",
        type: "button",
        value: "notified",
    }];
    updateMessage(payload, [replacement]);
    const requester = payload.original_message.attachments[0].fields[1].value.replace(/[<,>,@]/g, '');
    const action = payload.actions[0].value;
    const slackMsg = Mustache.render(templates.get(['pr', 'interactions', action, 'review'].join('_')), {
        userName: payload.user.name,
        project: payload.original_message.attachments[0].fields[0].value,
        prContext: payload.original_message.attachments[0].text,
    });
    sendSlackMessage(requester,slackMsg);
});

module.exports = { slackInteractions, actions };