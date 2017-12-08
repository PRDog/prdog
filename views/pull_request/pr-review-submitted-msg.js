const ellipsize = require('ellipsize')
const { hasReviewMessageContent } = require('../../helpers/pr-utils.js')

const buildReviewSubmittedMessage = (eventBody, userMap) => {
  let sender = eventBody.review.user.login
  let reviewer = "<@" + (userMap.get(sender) ? userMap.get(sender) : sender) + ">"
  let title, color, content
  switch (eventBody.review.state) {
    case 'changes_requested':
      title = "A change has been requested on your PR by " + reviewer
      color = '#FFE033'
      content = eventBody.review.body
      break
    case 'approved':
      title = "Your PR has been approved by " + reviewer
      color = '#99FF2D'
      content = eventBody.review.body
      break
    case 'commented':
      title = "A comment has been left on your PR by " + reviewer
      color = '#33D1FF'
      content = eventBody.review.body && eventBody.review.body !== '' ? eventBody.review.body : `<${eventBody.review.html_url}|Click here to see the comment>`
      break
  }

  var msg = {
    'fallback': title,
    'pretext': title,
    'color': `${color}`,
    'mrkdwn': true,
    'fields': [
      {
        'title': 'Repository',
        'value': `<${eventBody.repository.html_url}|${eventBody.repository.full_name}>`,
        'short': true
      },
      {
        'title': 'Pull Request',
        'value': `<${eventBody.review.html_url}|${eventBody.pull_request.title} #${eventBody.pull_request.number}>`,
        'short': true
      }
    ],
    'attachment_type': 'default'
  }

  if (hasReviewMessageContent(content)) {
    msg.title = 'Review Comment:'
    msg.text = content
  }
  return [ msg ]
}

module.exports = { buildReviewSubmittedMessage }
