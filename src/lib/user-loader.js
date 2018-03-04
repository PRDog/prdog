require('dotenv').config();
const YAML = require('yamljs');
const logger = require('./logger.js');

let users;

const loadUsers = () => {
  try {
    if (!users) {
      users = YAML.load(process.env.USERS).reduce((userMappings, user) => {
        userMappings.set(user.git_user, user.slack_user);
        return userMappings;
      }, new Map()); 
    }
    return users;
  } catch (err) {
    logger.error("Could not load user mappings");
    logger.error(err);
    process.exit(1);
  }
};

module.exports = { loadUsers };
