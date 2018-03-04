require('dotenv').config();
const WebClient = require('@slack/client').WebClient;
const logger = require('./logger')

let client;

try {
    client = new WebClient(process.env.SLACK_API_TOKEN);
} catch (e) {
    logger.error(`Could not initialize slack client: ${e}`);
    process.exit(1);
}

const sendSlackMessage = (to, slackMsg) => {
    logger.info("Sending slack message to " + to);
    try {
        client.chat.postMessage(`@${to}`, null, {'attachments': slackMsg});
    } catch (err) {
        logger.error(`Could not send slack message to ${to}: ${err}`);
    }
};

module.exports = { sendSlackMessage };
