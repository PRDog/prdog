const { pullRequestHandler } = require('./prHandler.js');

const ghWebhookHandler = (req, res) => {
  switch (req.get('X-GitHub-Event')) {
    case 'pull_request':
      pullRequestHandler(req, res);
      break;
  }
};

module.exports = { ghWebhookHandler };
