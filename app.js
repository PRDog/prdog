const express = require('express')
const bodyParser = require('body-parser')
const { loadUsers } = require('./helpers/user-loader.js')
const app = express()
const WebClient = require('@slack/client').WebClient
const { parseSlackEvent } = require('./helpers/slack-event-parser.js')
const { tokenRequestValidation } = require('./middlewares/token-validation.js')
const config = require('config')

const SLACK_API_TOKEN = config.get('slack.apiToken')
const PORT = config.get('port')
const slackApi = new WebClient(SLACK_API_TOKEN)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 'extended' : true }))
// app.use(tokenRequestValidation) //FIXME

const userMap = loadUsers('./config/users.yml')
const { pullRequestHandler, notifier } = require('./controllers/prHandler.js')
const prHandler = pullRequestHandler(userMap, slackApi, notifier)

app.post('/pull_request', prHandler)

const REQUEST_REVIEW_NOTIFY = 'request_review_notify' //FIXME consolidate this constant with prHandler.js

const msgActionHandler = function(req, res) {
  const payload = parseSlackEvent(req)
  const callback_id = payload.callback_id
  switch (callback_id) {
  case REQUEST_REVIEW_NOTIFY:
    const updateMsg = (payload) => {
      payload.original_message.attachments[0].actions[0].text = 'Notified :white_check_mark:'
      return slackApi.chat.update(payload.original_message.ts, payload.channel.id, null, {'attachments': payload.original_message.attachments})
    }
    const notifyRequester = (payload) => {
      var requester = payload.original_message.attachments[0].fields[1].value.replace(/[<,>]/g, '')
      return slackApi.chat.postMessage(requester, 'Your PR has been reviewed', null)
    }
    res.status(200).end() //Ack Slack fast and log if any error.
    //We could "write" back to the user if something went wrong. TBD
    return updateMsg(payload)
      .then(() => notifyRequester(payload))
      .catch(error => {
        console.log(`there was an error => ${error}`)
      })
    //TODO validate token received from slack
  default:
    res.status(404).send(`Callback not recognized ${callback_id}`)
  }
  res.status(200).end()
}

app.post('/message_action', msgActionHandler)

app.listen(PORT, function () {
  console.log(`PRDog listening on port ${PORT}`)
})