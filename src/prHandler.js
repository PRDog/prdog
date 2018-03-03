require('dotenv').config();
const _ = require('lodash');
const logger = require('./lib/logger.js');
const { userMap } = require('./lib/user-loader.js');
const slackApi = require('./lib/slack_api.js');
const { getPRAuthor } = require('./lib/pr_utils.js');
const ellipsize = require('ellipsize');
const Mustache = require('mustache');
const { templates } = require('./lib/templates.js');

const canNotifyOnSlack = user => {
    return userMap.has(user);
};

const sendSlackMessage = async (to, slackMsg) => {
  logger.info("Sending slack message to " + userMap.get(to));
  try {
    await slackApi.chat.postMessage(`@${userMap.get(to)}`, null, {'attachments': slackMsg});
  } catch (err) {
    logger.error(err);
  }
};

const notifyReview = (pullRequest, action) => {
    pullRequest.requested_reviewers
      .map(rev => rev.login)
      .filter(canNotifyOnSlack)
      .forEach(rev => {
        const slackMsg = Mustache.render(templates.get('pr_' + action), { pullRequest: pullRequest,
          prAuthor: getPRAuthor(pullRequest, userMap),
          prDescription: ellipsize(pullRequest.body, 200)});
        logger.info("Sending slack message to " + userMap.get(rev));
        sendSlackMessage(rev, slackMsg);
      });
    };

const notifyClosed = (pullRequest, sender, action) => {
  var reviewers = pullRequest.requested_reviewers.map(r => r.login);
  if (sender !== pullRequest.user.login) {
    reviewers = reviewers.concat([sender]);
  }
  let extra;
  if (pullRequest.merged) {
    extra = '_merged';
  } else {
    extra = '_not_merged';
  }
  reviewers
    .filter(canNotifyOnSlack)
    .forEach(rev => {
      const slackMsg = Mustache.render(templates.get('pr_' + action + extra), { pullRequest: pullRequest,
        closedBy: sender });
        sendSlackMessage(rev, slackMsg);
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
  case 'review_request_removed':
    break;
  default:
    break;
  }
};

module.exports = {
  pullRequestHandler,
};
