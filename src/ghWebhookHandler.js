const { pullRequestHandler } = require('./pull_request_handler.js');
const { pullRequestReviewHandler } = require('./pull_request_review_handler');

const ghWebhookHandler = (req, res, next) => {
  switch (req.get('X-GitHub-Event')) {
    case 'pull_request':
      pullRequestHandler(req, res);
      break;
    case 'pull_request_review':
      pullRequestReviewHandler(req, res);
      break;
  }
  next();
};

module.exports = { ghWebhookHandler };
