const config = require('config')
const request = require('request').defaults({
    headers: {
        'User-Agent': 'pr-dog',
        'Authorization': `token ${config.get('github.apiToken')}`
    }
})

const getPRComments = (pullRequestUrl, callback) => {

    request(`${pullRequestUrl}/comments`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            return callback(eval(body));
        } else {
            console.log('Call failed: ' + response.statusCode)
            return callback([])
        }
    })
}

module.exports = { getPRComments }
