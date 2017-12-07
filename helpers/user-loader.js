const YAML = require('yamljs')

const loadUsers = path => {
  return YAML.load(path).reduce((userMappings, user) => {
    userMappings.set(user.git_user, user.slack_user)
    return userMappings
  }, new Map())
}

module.exports = { loadUsers }
