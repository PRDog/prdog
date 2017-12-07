const {getPRSender} = require('../../helpers/pr-utils.js')

const  buildPRClosedMessage = (pullRequest, userMap, sender) => {
  return [
    {
      'fallback': 'PR closed and merged',
      'color': 'warning',
      'title': 'Closed & Merged',
      'text': `${pullRequest.title}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Project',
          'value': `<${pullRequest.html_url}|${pullRequest.head.repo.full_name}/#${pullRequest.number}>`,
          'short': true
        },
        {
          'title': 'Closed by',
          'value': `${getPRSender(sender, userMap)}`,
          'short': true
        }
      ]
    }
  ]
}

module.exports = { buildPRClosedMessage }
