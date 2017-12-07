const ellipsize = require('ellipsize')
const { getPRAuthor } = require('../../helpers/pr-utils.js')
const { REQUEST_REVIEW_NOTIFY } = require('../../helpers/slack_callback_ids.js')

const buildPRReviewRequestedMessage = (pullRequest, userMap) => {
  return [
    {
      'fallback': 'You were requested for review',
      'color': 'warning',
      'title': 'Review request',
      'text': `${pullRequest.title}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Project',
          'value': `<${pullRequest.html_url}|${pullRequest.head.repo.full_name}/#${pullRequest.number}>`,
          'short': true
        },
        {
          'title': 'Requested from',
          'value': `${getPRAuthor(pullRequest, userMap)}`,
          'short': true
        },
        {
          'title': 'Description',
          'value': `${ellipsize(pullRequest.body, 200)}`,
          'short': false
        }
      ],
      'callback_id': REQUEST_REVIEW_NOTIFY,
      'attachment_type': 'default',
      'actions': [
        {
          'name': 'review action',
          'text': 'Notify check :eyes:',
          'type': 'button',
          'value': 'pressed'
        },
      ]
    }
  ]
}

module.exports = { buildPRReviewRequestedMessage }
