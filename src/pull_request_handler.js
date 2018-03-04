const _ = require('lodash');
const logger = require('./lib/logger.js');
const userMap = require('./lib/user-loader.js').loadUsers();
const {sendSlackMessage} = require('./lib/slack_api.js');
const {formatUser} = require('./lib/pr_utils.js');
const ellipsize = require('ellipsize');
const Mustache = require('mustache');
const templates = require('./lib/templates.js').loadTemplates();
const {actions} = require('./slackInteractions');

const notifyReview = (pullRequest, action) => {
    pullRequest.requested_reviewers
        .map(rev => rev.login)
        .filter(user => userMap.has(user))
        .forEach(rev => {
            const slackMsg = Mustache.render(templates.get(['pr', action].join('_')), {
                pullRequest: pullRequest,
                prAuthor: formatUser(pullRequest.user.login, userMap),
                prDescription: ellipsize(pullRequest.body, 200),
                callbackId: actions.requestReviewNotify,
            });
            logger.info("Sending slack message to " + userMap.get(rev));
            sendSlackMessage(userMap.get(rev), slackMsg);
        });
};

const notifyClosed = (pullRequest, sender, action) => {
    var reviewers = pullRequest.requested_reviewers.map(r => r.login);
    if (sender !== pullRequest.user.login) {
        reviewers.push(sender);
    }
    let extra;
    if (pullRequest.merged) {
        extra = 'merged';
    } else {
        extra = 'not_merged';
    }
    reviewers
        .filter(user => userMap.has(user))
        .forEach(rev => {
            const slackMsg = Mustache.render(templates.get(['pr', action, extra].join('_')), {
                pullRequest: pullRequest,
                closedBy: sender
            });
            sendSlackMessage(userMap.get(rev), slackMsg);
        });
};

const pullRequestHandler = (req, res) => {
    res.status(200).end(); //acknowledge github right away
    const pullRequest = _.get(req.body, 'pull_request');
    const action = _.get(req.body, 'action');
    const sender = _.get(req.body, 'sender.login');
    logger.info(`Handling pull request hook event: action=${action} sender=${sender}`);
    switch (action) {
        case 'review_requested':
            notifyReview(pullRequest, action);
            break;
        case 'closed':
            notifyClosed(pullRequest, sender, action);
            break;
        default:
            break;
    }
};

module.exports = {
    pullRequestHandler,
};
