const ellipsize = require('ellipsize')
const { getPRAuthor } = require('../../lib/pr-utils.js')

const buildPRAssignedMessage = (pullRequest, userMap) => {
  return [
    {
      'fallback': 'PR assigned to you',
      'color': 'warning',
      'title': 'PR Assignment',
      'text': `${pullRequest.title}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Project',
          'value': `<${pullRequest.html_url}|${pullRequest.head.repo.full_name}/#${pullRequest.number}>`,
          'short': true
        },
        {
          'title': 'Assigned from',
          'value': `${getPRAuthor(pullRequest, userMap)}`,
          'short': true
        },
        {
          'title': 'Description',
          'value': `${ellipsize(pullRequest.body, 200)}`,
          'short': false
        }
      ],
      'actions': [
        {
          'name': 'review action',
          'text': 'Notify check :eyes:',
          'type': 'button'
        },
      ]
    }
  ]
}

module.exports = { buildPRAssignedMessage }
