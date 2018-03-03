const getPRAuthor = (pullRequest, userMap) => {
  return userMap.has(pullRequest.user.login) ?
    `<@${userMap.get(pullRequest.user.login)}>` : `${pullRequest.user.login}`;
};

const getPRSender = (sender, userMap) => {
  return userMap.has(sender) ?
    `<@${userMap.get(sender)}>` : `${sender}`;
};

const findPRComment = (data, reviewId) => {
  for (var index in data) {
    if (data[index].pull_request_review_id == reviewId) {
      return data[index].body;
    }
  }
  return null;
};

const hasReviewMessageContent = (content) => {
  return content && content !== '';
};

module.exports = {
  getPRSender,
  getPRAuthor,
  findPRComment,
  hasReviewMessageContent
};
