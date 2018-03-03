const { getPRSender } = require('../../lib/pr-utils.js')

const buildPRReopenedMessage = (pullRequest, userMap, sender) => {
  return [
    {
      'fallback': 'PR reopened',
      'color': 'warning',
      'title': 'Reopened',
      'text': `${pullRequest.title}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Project',
          'value': `<${pullRequest.html_url}|${pullRequest.head.repo.full_name}/#${pullRequest.number}>`,
          'short': true
        },
        {
          'title': 'Reopened by',
          'value': `${getPRSender(sender, userMap)}`,
          'short': true
        }
      ]
    }
  ]
}

module.exports = { buildPRReopenedMessage }
