require('dotenv').config();
const secureCompare = require('secure-compare');
const { parseSlackEvent } = require('./slack-event-parser.js');
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;
const { createHmac } = require('crypto');
const logger = require('./logger.js');

const tokenRequestValidation = (req, res, next) => {
  // whitelist health
  if (req.url.match(/health$/)) {
    next();
    return;
  }

  const hmac = createHmac('sha1', GITHUB_SECRET);
  if (req.get('User-Agent').match(/^GitHub-Hookshot/)) {
    const digest = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');
    logger.info(digest);
    if (!secureCompare(req.get('X-Hub-Signature'), digest)) {
      logger.error('Unauthorized access from Github');
      res.status(401).end();
    } else {
      next();
    }
  } else if (req.get('user-agent').match(/^Slackbot/)) {
    var token = parseSlackEvent(req).token;
    if (token == SLACK_VERIFICATION_TOKEN) {
      next();
    } else {
      logger.error('Unauthorized access from Slackbot');
      res.status(401).end();
    }
  } else {
    logger.error(`Unauthorized access from remote host ${req.get('host')}`);
    res.status(401).end();
  }
};

module.exports = { tokenRequestValidation };
