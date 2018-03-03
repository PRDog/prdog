const WebClient = require('@slack/client').WebClient;
require('dotenv').config();

const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN;
const slackApi = new WebClient(SLACK_API_TOKEN);

module.exports = { slackApi };
