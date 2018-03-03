const YAML = require('yamljs');
require('dotenv').config();
const logger = require('./logger.js');

const loadUsers = () => {
  try {
    return YAML.load(process.env.USERS).reduce((userMappings, user) => {
      userMappings.set(user.git_user, user.slack_user);
      return userMappings;
    }, new Map());
  } catch (err) {
    logger.error("Could not load user mappings");
    logger.error(err);
    process.exit();
  }
};

module.exports = { userMap: loadUsers() };
