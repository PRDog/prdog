const {getPRSender} = require('../../helpers/pr-utils.js')

const  buildPRConfirmMessage = (payload) => {
  return [
    {
      'fallback': 'PR confrmed for review',
      'color': 'good',
      'title': 'Confirmation',
      'text': `${payload.original_message.attachments[0].text}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Project',
          'value': `${payload.original_message.attachments[0].fields[0].value}`,
          'short': true
        },
        {
          'title': 'review confirmed by',
          'value': `${payload.original_message.attachments[0].fields[1].value}`,
          'short': true
        }
      ]
    }
  ]
}
const  buildPRRejectMessage = (payload) => {
  return [
    {
      'fallback': 'PR rejected for review',
      'color': 'error',
      'title': 'Rejection',
      'text': `${pr_title}`,
      'mrkdwn': true,
      'fields': [
        {
          'title': 'Project',
          'value': `${pr_project}`,
          'short': true
        },
        {
          'title': 'review rejected by:',
          'value': `<@${userid}>`,
          'short': true
        }
      ]
    }
  ]
}

module.exports = { buildPRRejectMessage, buildPRConfirmMessage  }