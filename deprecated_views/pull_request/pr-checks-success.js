const buildSuccessfullChecksMessage = eventBody => {
  const title = 'All the PR checks passed.';
  const color = '#99FF2D';

  return [
    {
      fallback: title,
      pretext: title,
      color: `${color}`,
      mrkdwn: true,
      fields: [
        {
          title: 'Last commit:',
          value: `<${eventBody.commit.html_url}|${eventBody.commit.sha}>`,
          short: true
        },
        {
          title: 'Last commit message:',
          value: `${eventBody.commit.commit.message}`,
          short: true
        }
      ],
      attachment_type: 'default'
    }
  ];
};

module.exports = { buildSuccessfullChecksMessage };
