const { getPRSender } = require('../../lib/pr-utils.js')
const ellipsize = require('ellipsize')

const buildEditedPRMessage = (pullRequest, userMap, sender) => {
  //TODO highlight the change that happened.
  return [
    {
      'fallback': 'PR comment edited',
      'color': 'warning',
      'title': 'PR comment edited',
      'text': `${pullRequest.title}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Project',
          'value': `<${pullRequest.html_url}|${pullRequest.head.repo.full_name}/#${pullRequest.number}>`,
          'short': true
        },
        {
          'title': 'Edited by',
          'value': `${getPRSender(sender, userMap)}`,
          'short': true
        },
        {
          'title': 'Changes',
          'value': `${ellipsize(pullRequest.body, 200)}`,
          'short': false
        }
      ],
    }
  ]
}

module.exports = { buildEditedPRMessage }
