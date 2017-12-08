const buildStatsForMe = () => {
  return [
    {
      'color': 'warning',
      'title': 'Hurrah !',
      'mrkdwn': true,
      'fields': [
        {
          'value': `<https://github.com/goeuro/goeuro/pull/9219|goeuro/goeuro> 25 Reviews, 50 PRs :trophy:`,
          'short': false
        },
        {
          'value': `<https://github.com/goeuro/devops-tools/pull/1034|goeuro/devops-tools> 10 Reviews, 5 PRs :medal:`,
          'short': false
        },
        {
          'value': `<https://github.com/goeuro/k8s/pull/689|goeuro/k8s> 1 Review, 10 PRs :clap:`,
          'short': false
        }
      ],
      'attachment_type': 'default'
    }
  ]
}

module.exports = { buildStatsForMe }
