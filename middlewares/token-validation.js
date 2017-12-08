const secureCompare = require('secure-compare')
const { parseSlackEvent } = require('../helpers/slack-event-parser.js')
const config = require('config')
const GITHUB_SECRET = config.get('github.secret')
const SLACK_VERIFICATION_TOKEN = config.get('slack.reqValidationToken')
const { createHmac } = require('crypto')

const tokenRequestValidation = (req, res, next) => {
  const hmac = createHmac('sha1', GITHUB_SECRET)
  if (req.get('User-Agent').match(/^GitHub-Hookshot/)) {
    const digest = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex')
    if (!secureCompare(req.get('X-Hub-Signature'), digest)) {
      console.log('Unauthorized access from Github')
      res.status(401).end()
    } else {
      next()
    }
  } else if (req.get('user-agent').match(/^Slackbot/)) {
    var token = parseSlackEvent(req).token
    if (token == SLACK_VERIFICATION_TOKEN) {
      next()
    } else {
      console.log('Unauthorized access from Slackbot')
      res.status(401).end()
    }
  } else {
    console.log(`Unauthorized access from remote host ${req.get('host')}`)
    res.status(401).end()
  }
}

module.exports = { tokenRequestValidation }
