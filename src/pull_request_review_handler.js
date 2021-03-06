const userMap = require('./lib/user-loader.js').loadUsers();
const { sendSlackMessage } = require('./lib/slack_api_utils.js');
const { formatUser } = require('./lib/pr_utils.js');
const Mustache = require('mustache');
const templates = require('./lib/templates.js').loadTemplates();

const notifySubmitted = (event) => {
    const slackMsg = Mustache.render(templates.get(['pr', event.action, event.review.state].join('_')), {
        sender: formatUser(event.sender.login, userMap),
        review: event.review,
        pullRequest: event.pull_request,
        repo: event.repository,
    });
    sendSlackMessage(`${userMap.get(event.pull_request.user.login)}`, slackMsg);
};

const pullRequestReviewHandler = (req, res) => {
    res.status(200).end();
    const event = req.body;
    const action = event.action;
    const state = event.review.state;
    switch (action) {
        case 'submitted':
            // We don't support for now other states like commented
            if (state === 'approved' || state === 'changes_requested') {
                notifySubmitted(event);
            }
            break;
        default:
            break;

    }
};

module.exports = { pullRequestReviewHandler };

