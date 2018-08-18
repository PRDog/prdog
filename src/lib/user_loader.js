require('dotenv').config();
const YAML = require('yamljs');
const logger = require('./logger.js');
const { getSlackApiClient } = require('./slack_client_factory');

let users;
const client = getSlackApiClient();

const toSlackInfo = async slack_email => {
  try {
    const res = await client.users.lookupByEmail({ email: slack_email });
    return { id: res.user.id, display_name: res.user.display_name };
  } catch (err) {
    logger.error(`Could not fetch slack ID for ${slack_email}`, err);
  }
};

const loadUsers = async () => {
  try {
    if (!users) {
      users = YAML.load(process.env.USERS).reduce(async (userMappings, user) => {
        const slackInfo = await toSlackInfo(user.slack_email);
        if (slackInfo) {
          userMappings[user.git_user] = slackInfo;
        }
        return userMappings;
      }, {});
    }
    return users;
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

module.exports = { loadUsers };
