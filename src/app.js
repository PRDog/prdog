require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('./lib/logger');
const { tokenRequestValidation } = require('./lib/token-validation');
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended' : false }));
app.use(tokenRequestValidation);

const { ghWebhookHandler } = require('./ghWebhookHandler.js');

app.post('/gh_webhook', ghWebhookHandler);

app.get('/health', function(req, res) {
  res.status(200).send("I'm alive !");
});

app.listen(PORT, function () {
  logger.info(`PRDog listening on port ${PORT}`);
});
