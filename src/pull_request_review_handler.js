const _ = require('lodash');
const { sendSlackMessage } = require('./lib/slack_api_utils.js');
const { formatUser } = require('./lib/pr_utils.js');
const Mustache = require('mustache');
const logger = require('./lib/logger');
const templates = require('./lib/templates.js').loadTemplates();
const userUtils = require('./lib/user_loader');

const notifySubmitted = async (event, userMap) => {
  try {
    const slackMsg = Mustache.render(
      templates.get(['pr', event.action, event.review.state].join('_')),
      {
        sender: formatUser(event.sender.login, userMap),
        review: event.review,
        pullRequest: event.pull_request,
        repo: event.repository
      }
    );
    const userSlackInfo = _.get(userMap, event.pull_request.user.login);
    if (userSlackInfo) {
      await sendSlackMessage(userSlackInfo, slackMsg);
    } else {
      logger.error(`No slack info for github user ${event.sender.login}`);
    }
  } catch (err) {
    logger.error('Could not send slack message', err);
  }
};

const pullRequestReviewHandler = async (req, res) => {
  res.status(200).end();
  const userMap = await userUtils.loadUsers();
  const event = req.body;
  const action = event.action;
  const state = event.review.state;
  switch (action) {
    case 'submitted':
      // We don't support for now other states like commented
      if (state === 'approved' || state === 'changes_requested') {
        notifySubmitted(event, userMap);
      }
      break;
    default:
      break;
  }
};

module.exports = { pullRequestReviewHandler };
