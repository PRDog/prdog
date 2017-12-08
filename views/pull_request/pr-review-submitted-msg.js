const ellipsize = require('ellipsize')

const buildReviewSubmittedMessage = (eventBody, userMap) => {
  let sender = eventBody.review.user.login
  let reviewer = "<@" + (userMap.get(sender) ? userMap.get(sender) : sender) + ">"
  let title, color, content
  switch (eventBody.review.state) {
    case 'changes_requested':
      title = "A change has been requested on your PR by " + reviewer
      color = '#FFE033'
      content = eventBody.review.body && eventBody.review.body !== '' ? eventBody.review.body : 'No Content'
      break
    case 'approved':
      title = "Your PR has been approved by " + reviewer
      color = '#99FF2D'
      content = eventBody.review.body && eventBody.review.body !== '' ? eventBody.review.body : 'No Content'
      break
    case 'commented':
      title = "A comment has been left on your PR by " + reviewer
      color = '#33D1FF'
      content = eventBody.review.body && eventBody.review.body !== '' ? eventBody.review.body : `<${eventBody.review.html_url}|Click here to see the comment>`
      break
  }
  return [
    {
      'fallback': title,
      'pretext': title,
      'color': `${color}`,
      'title': 'Review Comment:',
      'text': `${content}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Pull Request',
          'value': `<${eventBody.review.html_url}|${eventBody.pull_request.title} #${eventBody.pull_request.number}>`,
          'short': true
        }
      ],
      'attachment_type': 'default'
    }
  ]
}

module.exports = { buildReviewSubmittedMessage }
