require('dotenv').config();
require('./lib/user_loader').loadUsers();
const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('./lib/logger');
const { tokenRequestValidation } = require('./lib/token_validation');
const { ghWebhookHandler } = require('./ghWebhookHandler.js');
const { slackInteractions } = require('./slackInteractions');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(tokenRequestValidation);
app.use('/message_action', slackInteractions.expressMiddleware());

app.post('/gh_webhook', ghWebhookHandler);

app.get('/health', function(req, res) {
  res.status(200).send("I'm alive !");
});

app.listen(PORT, function() {
  logger.info(`PRDog listening on port ${PORT}`);
});
