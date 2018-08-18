require('dotenv').config();
const secureCompare = require('secure-compare');
const { parseSlackEvent } = require('./slack_event_parser.js');
const { createHmac } = require('crypto');
const logger = require('./logger.js');

const tokenRequestValidation = (req, res, next) => {
  // whitelist health
  if (req.url.match(/health$/)) {
    next();
    return;
  }

  const user_agent = req.get('User-Agent');
  if (user_agent.match(/^GitHub-Hookshot/)) {
    const hmac = createHmac('sha1', process.env.GITHUB_SECRET);
    const digest = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');
    if (!secureCompare(req.get('X-Hub-Signature'), digest)) {
      logger.error('Unauthorized access from Github');
      res.status(401).end();
    }
  } else if (user_agent.match(/^Slackbot/)) {
    const token = parseSlackEvent(req).token;
    if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
      logger.error('Unauthorized access from Slackbot');
      res.status(401).end();
    }
  } else {
    logger.error(`Unauthorized access from remote host ${req.get('host')}`);
    res.status(401).end();
  }
  next();
};

module.exports = { tokenRequestValidation };
