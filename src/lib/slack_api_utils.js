require('dotenv').config();
const client = require('./slack_client_factory.js').getSlackApiClient();
const logger = require('./logger');
const NodeCache = require('node-cache');
const recentlySentMessages = new NodeCache({ checkperiod: 120 });

const sendSlackMessage = async (to, slackMsg) => {
  const cacheKey = to + slackMsg;
  if (recentlySentMessages.get(cacheKey) === undefined) {
    recentlySentMessages.set(cacheKey, '', 300); // Up to 5 minutes of duplicate cache
    logger.info('Sending slack message to ' + to);
    try {
      await client.chat.postMessage(`@${to}`, null, { attachments: slackMsg });
    } catch (err) {
      logger.error(`Could not send slack message to ${to}: ${err}`);
    }
  } else {
    logger.info(`Skipping sending duplicate slack message to ${to}`);
  }
};

const updateMessage = async (payload, slackMsg) => {
  try {
    await client.chat.update(payload.original_message.ts, payload.channel.id, null, {
      attachments: slackMsg
    });
  } catch (e) {
    logger.error(`Could not update slack message: ${e}`);
  }
};

module.exports = { sendSlackMessage, updateMessage };
