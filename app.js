const express = require('express')
const bodyParser = require('body-parser')
const { loadUsers } = require('./helpers/user-loader.js')
const app = express()
const WebClient = require('@slack/client').WebClient
const { parseSlackEvent } = require('./helpers/slack-event-parser.js')
const { tokenRequestValidation } = require('./middlewares/token-validation.js')
const config = require('config')
const { buildPRConfirmMessage, buildPRRejectMessage } = require('./views/pull_request/pr-action.js')
const { buildListCommandOutput } = require('./views/commands/list.js')
const { buildSnoozeOutput } = require('./views/commands/snooze.js')
const { buildStatsForMe } = require('./views/commands/stats.js')

const SLACK_API_TOKEN = config.get('slack.apiToken')
const PORT = config.get('port')
const slackApi = new WebClient(SLACK_API_TOKEN)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 'extended' : true }))
//app.use(tokenRequestValidation) //FIXME

const userMap = loadUsers(config.users || './config/users.yml')
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
      payload.original_message.attachments[0].actions[0].value = "notified"
      // we make sure we remove all other buttons no matter how many have them them
      if ( payload.original_message.attachments[0].actions.length > 1 ) {
        for (var i = 1, len = payload.original_message.attachments[0].actions.length; i < len; i++) {
          payload.original_message.attachments[0].actions[i].text = ''
        }
      }
      return slackApi.chat.update(payload.original_message.ts, payload.channel.id, null, {'attachments': payload.original_message.attachments})
    }
    const notifyRequester = (payload) => {
      var requester = payload.original_message.attachments[0].fields[1].value.replace(/[<,>]/g, '')
      if (payload.actions[0].value == "confirm") {
        return slackApi.chat.postMessage(requester, null , {'attachments': buildPRConfirmMessage(payload)} )
      } else if (payload.actions[0].value == "reject") {
        return slackApi.chat.postMessage(requester,null , {'attachments': buildPRRejectMessage(payload)})
      }
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

app.post('/command', function(req, res) {
  var commandText = req.body.text
  if (commandText.match(/list\s*$/)) {
    slackApi.chat.postMessage(req.body.user_id, null , {'attachments': buildListCommandOutput()})
    res.status(200).end()
  } else if (commandText.match(/list\s*\|\s*snooze\s*$/)) {
    slackApi.chat.postMessage(req.body.user_id, null , {'attachments': buildSnoozeOutput()})
    res.status(200).end()
  } else if (commandText.match(/focus\s*\d[h,m,s]\s*$/)) {
    const regex = /focus\s*(\d[h,m,s])\s*$/
    const captured = regex.exec(commandText)
    slackApi.chat.postMessage(req.body.user_id, `Will not bother you for ${captured[1]}` , null)
    res.status(200).end()
  } else if (commandText.match(/stats\s*$/)) {
    slackApi.chat.postMessage(req.body.user_id, null , {'attachments': buildStatsForMe()})
    res.status(200).end()
  } else {
    res.status(200).send("I'm sorry, I don't understand that\n¯\_(ツ)_/¯")
  }
})

app.get('/health', function(req, res) {
  res.status(200).send("I'm alive !")
})

app.listen(PORT, function () {
  console.log(`PRDog listening on port ${PORT}`)
})
