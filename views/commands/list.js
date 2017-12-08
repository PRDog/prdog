const buildListCommandOutput = () => {
  return [
    {
      'color': 'warning',
      'title': 'PRs you follow',
      'mrkdwn': true,
      'fields': [
        {
          'value': `<https://github.com/goeuro/goeuro/pull/9219|goeuro/goeuro/#9219>`,
          'short': false
        },
        {
          'value': `<https://github.com/goeuro/devops-tools/pull/1034|goeuro/devops-tools/#1034>`,
          'short': false
        },
        {
          'value': `<https://github.com/goeuro/k8s/pull/689|goeuro/k8s/#689>`,
          'short': false
        }
      ],
      'attachment_type': 'default'
    }
  ]
}

module.exports = { buildListCommandOutput }
