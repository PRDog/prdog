const ellipsize = require('ellipsize')

const buildSuccessfullChecksMessage = (eventBody, userMap) => {
    console.log("building message");
    const title = 'All the PR checks are green.';
    const color = '#99FF2D';
    const content = eventBody.review.body && eventBody.review.body !== '' ? eventBody.review.body : 'No Content'

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
                    'title': 'Project:',
                    //'value': `<${eventBody.review.html_url}|${eventBody.pull_request.title} #${eventBody.pull_request.number}>`,
                    'value': 'checks succesful',
                    'short': true
                }
            ],
            'attachment_type': 'default'
        }
    ]
};

module.exports = { buildSuccessfullChecksMessage }
