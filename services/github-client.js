const getPRComments = (pullRequestNumber) => {
  // mock, to be replaced by api call
  return [
    {
      "id": 10,
      "pull_request_review_id": 42,
      "body": "Great stuff. man!"
    }
  ]
}

module.exports = { getPRComments }
