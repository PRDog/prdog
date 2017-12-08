const { buildPRClosedMessage } = require('../views/pull_request/pr-closed.js')
const { buildPRReviewRequestedMessage } = require('../views/pull_request/pr-review-requested.js')
const { buildEditedPRMessage } = require('../views/pull_request/pr-edited-msg.js')
const { buildPRReopenedMessage } = require('../views/pull_request/pr-reopened-msg.js')
const { buildReviewSubmittedMessage } = require('../views/pull_request/pr-review-submitted-msg.js')
const { buildPRAssignedMessage } = require('../views/pull_request/pr-assigned-msg.js')
const { getPRAuthorWithoutSpecialCharacter } = require('../helpers/pr-utils.js')
const { findPRComment } = require('../helpers/pr-utils.js')
const { getPRComments } = require('../services/github-client.js')

const prHandlerUtils = {
  canNotifyOnSlack: userMap => user => {
    return userMap.has(user)
  },
  slackErrorHandler: (err,res) => {
    if (err) {
      throw new Error(`Failed slack sdk operation: ${err}`)
    } else {
      return res
    }
  },
  unionRevAssig: pullRequest => {
    var intersectedUsers = new Set()
    pullRequest.assignees.map(assignee => assignee.login)
                         .forEach(user => intersectedUsers.add(user))
    pullRequest.requested_reviewers.map(rev => rev.login)
                                   .forEach(user => intersectedUsers.add(user))
    return intersectedUsers
  }
}

const notifier = {
  notifyOnNewEvent: (receivers, userMap, slackApi, pullRequest, messageBuilder) => {
    console.log(pullRequest)
    console.log(receivers)
    receivers
      .map(rec => rec.login)
      .filter(prHandlerUtils.canNotifyOnSlack(userMap))
      .forEach(rec => {
        console.log("ddd" + pullRequest)
        const slackMsg = messageBuilder(pullRequest, userMap)
        slackApi.chat.postMessage(`@${userMap.get(rec)}`, null, {'attachments': slackMsg}, prHandlerUtils.lackErrorHandler)
      })
  },
  notifyOnModEvent: (pullRequest, userMap, slackApi, sender, messageBuilder) => {
    Array.from(prHandlerUtils.unionRevAssig(pullRequest))
      .filter(prHandlerUtils.canNotifyOnSlack(userMap))
      .filter(user => user != sender)
      .forEach(user => {
        const slackMsg = messageBuilder(pullRequest, userMap, sender)
        slackApi.chat.postMessage(`@${userMap.get(user)}`, null, {'attachments': slackMsg}, prHandlerUtils.lackErrorHandler)
      })
  }
}

const pullRequestHandler = (userMap, slackApi, notifier) => (req, res) => {
  const prBody = req.body
  const pullRequest = prBody.pull_request
  const action = prBody.action
  const sender = prBody.sender.login
  switch (action) {
  case 'review_requested':
      //FIXME this will notify all the requested reviewers again
      //if a new review_requested event is triggered
    notifier.notifyOnNewEvent(pullRequest.requested_reviewers, userMap, slackApi,
      pullRequest, buildPRReviewRequestedMessage)
    break
  case 'opened':
    break
      //TODO if subscribing to repos this could be and event we could send
      //to someone interested.
  case 'assigned':
      //FIXME until we add state, people will receive notifications even if they have been notified
    notifier.notifyOnNewEvent(pullRequest.assignees, userMap, slackApi,
      pullRequest, buildPRAssignedMessage)
    break
  case 'unassigned':
    break
      //TODO it seems that implementing unassigned requires keeping historical
      //of people assigned to this PR. This would require introducing state (redis?)
      //which it's too early
  case 'edited':
    notifier.notifyOnModEvent(pullRequest, userMap, slackApi, sender, buildEditedPRMessage)
    break
  case 'closed':
    if (pullRequest.merged) {
      notifier.notifyOnModEvent(pullRequest, userMap, slackApi, sender, buildPRClosedMessage)
    }
    break
  case 'reopened':
    notifier.notifyOnModEvent(pullRequest, userMap, slackApi, sender, buildPRReopenedMessage);
    break
  case 'submitted':
    let prAuthor = getPRAuthorWithoutSpecialCharacter(pullRequest, userMap);
    if (prBody.review.body == null) {
      prBody.review.body = findPRComment(getPRComments(pullRequest.number), prBody.review.id);
      console.log("passing here =>>> " + prBody.review.body)
    }
    notifier.notifyOnNewEvent([{login: prAuthor}], userMap, slackApi, prBody, buildReviewSubmittedMessage)
    break
  default:
    break
  }
  res.status(200).end()
}

module.exports = {
  pullRequestHandler,
  notifier,
  prHandlerUtils
}
