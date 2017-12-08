const getPRAuthor = (pullRequest, userMap) => {
  return userMap.has(pullRequest.user.login) ?
    `<@${userMap.get(pullRequest.user.login)}>` : `${pullRequest.user.login}`
}

const getPRAuthorWithoutSpecialCharacter = (pullRequest, userMap) => {
  return userMap.has(pullRequest.user.login) ?
      userMap.get(pullRequest.user.login) : pullRequest.user.login
}

//FIXME need to refactor this getPRSender and getPRAuthor
const getPRSender = (sender, userMap) => {
  return userMap.has(sender) ?
    `<@${userMap.get(sender)}>` : `${sender}`
}

module.exports = { getPRSender, getPRAuthor, getPRAuthorWithoutSpecialCharacter }
