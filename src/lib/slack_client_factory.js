require('dotenv').config();
const WebClient = require('@slack/client').WebClient;
const logger = require('./logger');

let client;

const getSlackApiClient = () => {
  try {
    if (!client) {
      client = new WebClient(process.env.SLACK_API_TOKEN);
    }
    return client;
  } catch (e) {
    logger.error(`Could not initialize slack client: ${e}`);
    process.exit(1);
  }
};

module.exports = { getSlackApiClient };
